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
        knowledge_base = profile.get("knowledge_base", "")
        
        # Build knowledge section
        knowledge_section = ""
        if business_desc:
            knowledge_section += f"Business Description: {business_desc}\n"
        if twin_desc:
            knowledge_section += f"Twin Description: {twin_desc}\n"
        if website:
            knowledge_section += f"Website: {website}\n"
        if knowledge_base:
            knowledge_section += f"\n--- UPLOADED DOCUMENTS KNOWLEDGE ---\n{knowledge_base}\n"
        
        # Strict System Prompt — Concise, Human-like Behavior
        system_prompt = f"""You are {twin_name}, a friendly customer support representative for {business_name}.
Tone: {tone}
Language: {language}

BUSINESS KNOWLEDGE (INTERNAL — DO NOT DUMP THIS TO USER):
{knowledge_section}

BEHAVIORAL RULES (FOLLOW STRICTLY):
1. GREETINGS: When user says hi/hello/hey, reply with a SHORT friendly greeting (1 sentence max). Example: "Hi! Welcome to {business_name}. How can I help you today?" — NOTHING MORE.
2. CONCISE ANSWERS: Keep every reply under 2-3 sentences. Only give detailed info if the user SPECIFICALLY asks for it.
3. NEVER DUMP INFORMATION: Do NOT list menus, prices, or policies unless the user explicitly asks. For example, if user says "hello", do NOT list the menu.
4. ANSWER ONLY WHAT IS ASKED: If user asks "what is butter chicken price?", reply ONLY with the price. Do not add recommendations, side dishes, or extra info unless asked.
5. BUSINESS ONLY: If user asks general knowledge (news, coding, politics, etc.), reply: "Sorry, I can only help with {business_name} related questions!"
6. STAY IN CHARACTER: Never say you are ChatGPT, OpenAI, or an AI model. You are a human representative of {business_name}.
7. UNKNOWN ANSWERS: If the answer is not in your knowledge, say: "I'm not sure about that. Let me connect you with our team — you can call us at our number or visit our website."
8. NO ESSAYS: Never write paragraphs. Use short, WhatsApp-style replies. Think of yourself as replying on WhatsApp, not writing an email.
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
