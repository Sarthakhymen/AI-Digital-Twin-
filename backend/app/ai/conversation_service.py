"""AI Conversation Service - Strict Business Guardrails"""
import os
import httpx
from typing import Dict, List
from datetime import datetime
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class ConversationService:
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=self.openai_key) if self.openai_key else None
        self.modal_url = os.getenv("MODAL_WEB_URL", "https://sarthak2005shavarn--digital-twin-mistral-chat.modal.run")

    async def process_message(self, message: str, history: List[Dict], profile: Dict, style: Dict) -> Dict:
        """Process message with strict business constraints"""
        
        business_name = profile.get("business_name", profile.get("name", "our business"))
        twin_name = profile.get("name", "AI Assistant")
        role = profile.get("role", "Customer Support")
        traits = profile.get("traits", "helpful and professional")
        tone = style.get("tone", "polite")
        language = style.get("language", "English")
        
        # Knowledge Base Info
        business_desc = profile.get("business_description", "")
        twin_desc = profile.get("description", "")
        website = profile.get("business_website", "")
        
        # Strict System Prompt to Prevent General Knowledge Queries
        system_prompt = f"""You are {twin_name}, the official Digital Twin and AI Assistant for {business_name}.
Role: {role}
Personality traits: {traits}
Tone: {tone}
Language: {language}

BUSINESS KNOWLEDGE (Use this to answer user queries):
{business_desc}
{twin_desc}
Website: {website}

CRITICAL RULES:
1. YOU ARE STRICTLY A BUSINESS ASSISTANT FOR {business_name}.
2. If the user asks general knowledge questions (e.g. "who is prime minister", "capital of France", "how to code", "news"), YOU MUST REFUSE TO ANSWER.
3. If the user asks something outside the context of your business, reply: "I apologize, but I am specifically trained to help you with {business_name} related queries. I cannot answer general questions."
4. Do not break character. Do not admit you are an AI model like ChatGPT.
5. Base all your factual answers ONLY on the BUSINESS KNOWLEDGE provided above. If the answer is not in the knowledge, say you don't know and offer to connect them to a human agent.
"""
        
        # Use OpenAI if Key is available
        if self.client and "sk-" in self.openai_key:
            messages = [{"role": "system", "content": system_prompt}]
            for msg in history[-5:]: # Only keep last 5 messages for context
                role_map = {"user": "user", "assistant": "assistant", "twin": "assistant"}
                role_val = role_map.get(msg.get("role", "user"), "user")
                messages.append({"role": role_val, "content": msg.get("content", "")})
            messages.append({"role": "user", "content": message})

            try:
                response = await self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    temperature=0.2, # Low temperature makes it strictly adhere to rules
                    max_tokens=250
                )
                ai_response = response.choices[0].message.content
                return {
                    "success": True,
                    "response": ai_response,
                    "timestamp": datetime.utcnow().isoformat()
                }
            except Exception as e:
                print("OpenAI Error:", e)
                # Fallback to Modal if OpenAI fails
                pass

        # Fallback to Modal
        payload = {
            "message": f"[SYSTEM: STRICT RULE - You are {business_name}'s assistant. Deny any general knowledge/news questions.]\nUser: {message}",
            "history": history,
            "personality": profile,
            "style": style,
            "enable_web_search": False
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(self.modal_url, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "response": data.get("response", "No response"),
                        "timestamp": datetime.utcnow().isoformat()
                    }
                else:
                    return {
                        "success": False,
                        "response": f"API Error ({response.status_code})",
                        "timestamp": datetime.utcnow().isoformat()
                    }
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e),
                    "response": "Connection Error. Please try again."
                }

conversation_service = ConversationService()
