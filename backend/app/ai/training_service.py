"""AI Training Service"""
import os
from typing import Dict, List
from datetime import datetime

# Modal integration disabled for local development
# import modal
# stub = modal.Stub("training-service")

# @stub.function(
#     image=modal.Image.debian_slim().pip_install("openai"),
#     secrets=[modal.Secret.from_dotenv()],
#     timeout=600
# )
def generate_profile(samples_data: List[Dict], business_desc: str) -> Dict:
    """Generate personality profile from training data"""
    import openai, json
    
    try:
        client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        prompt = f"""Based on business: {business_desc[:500]}, create a personality profile.
        Return JSON with: personality_traits, communication_style (tone, formality, verbosity, enthusiasm),
        speaking_patterns, value_statements, knowledge_areas"""
        
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=800
        )
        
        content = response.choices[0].message.content
        try:
            profile = json.loads(content)
        except:
            profile = {
                "personality_traits": "Professional, Helpful, Knowledgeable",
                "communication_style": {"tone": "professional", "formality": "neutral", "verbosity": "moderate", "enthusiasm": "medium"},
                "speaking_patterns": {"sentence_structure": "mixed"},
                "value_statements": ["Quality service", "Customer satisfaction"],
                "knowledge_areas": [business_desc[:100]]
            }
        
        return {"success": True, "profile": profile, "generated_at": datetime.utcnow().isoformat()}
    except Exception as e:
        return {"success": False, "error": str(e)}

class TrainingService:
    def __init__(self):
        pass
        
    async def train_from_voice_samples(self, voice_samples, business_description):
        """Train profile using direct local call for MVP"""
        return generate_profile(samples_data=voice_samples, business_desc=business_description)

training_service = TrainingService()
