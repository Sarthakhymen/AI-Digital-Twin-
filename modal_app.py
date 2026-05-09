import modal
from typing import Dict, List
from datetime import datetime
import json
import requests

# Setup image
image = (
    modal.Image.debian_slim()
    .pip_install("vllm", "huggingface_hub", "hf-transfer", "requests")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
)

app = modal.App("digital-twin-mistral")
volume = modal.Volume.from_name("model-weights", create_if_missing=True)

@app.cls(
    gpu="A10G", 
    timeout=600,
    scaledown_window=300,
    image=image,
    volumes={"/data": volume}
)
class MistralModel:
    @modal.enter()
    def load_model(self):
        from vllm import LLM
        self.llm = LLM(
            model="HuggingFaceH4/zephyr-7b-beta",
            download_dir="/data",
            gpu_memory_utilization=0.8,
            enforce_eager=True
        )

    def serper_search(self, query: str) -> str:
        """Professional Google Search via Serper.dev (Reliable & Stable)"""
        url = "https://google.serper.dev/search"
        payload = json.dumps({"q": query, "gl": "in"}) # India specific
        headers = {
            'X-API-KEY': '2ab963c2ecc9eab7deda87931bf8672df56e1c31',
            'Content-Type': 'application/json'
        }
        
        try:
            print(f"Performing Professional Google Search for: {query}")
            response = requests.request("POST", url, headers=headers, data=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                results = []
                
                # Extract snippets from organic results
                if "organic" in data:
                    for r in data["organic"][:5]:
                        results.append(f"Title: {r['title']}\nSnippet: {r.get('snippet', '')}")
                
                # Extract answers if available
                if "answerBox" in data:
                    results.append(f"Direct Answer: {data['answerBox'].get('answer') or data['answerBox'].get('snippet')}")
                
                return "\n\n".join(results) if results else "No data found."
            else:
                return f"SEARCH_API_ERROR: {response.status_code}"
        except Exception as e:
            return f"SEARCH_CONNECTION_FAILED: {str(e)}"

    @modal.method()
    def generate(self, payload: Dict):
        from vllm import SamplingParams
        
        message = payload["message"]
        personality = payload.get("personality", {})
        style = payload.get("style", {})
        current_date = datetime.now().strftime("%B %d, 2026")
        
        # Professional Search
        live_data = self.serper_search(message)
        
        system_prompt = f"""You are an AI Digital Twin in 2026. 
TODAY: {current_date}
PROFILE: {personality}
STYLE: {style}

LIVE GOOGLE SEARCH DATA (Use this for accuracy):
{live_data}

INSTRUCTION: 
- Provide a detailed and accurate answer based on the LIVE DATA above.
- If the data contains 2024-2026 info (like match scores, prices, or news), use it.
- Maintain your persona as a Digital Twin.
"""
            
        prompt = f"<|system|>\n{system_prompt}</s>\n<|user|>\n{message}</s>\n<|assistant|>\n"
        
        sampling_params = SamplingParams(temperature=0.4, max_tokens=1000)
        outputs = self.llm.generate([prompt], sampling_params)
        
        return outputs[0].outputs[0].text

@app.function(image=image, timeout=600)
@modal.fastapi_endpoint(method="POST")
def chat(payload: Dict):
    model = MistralModel()
    response = model.generate.remote(payload)
    return {"response": response}
