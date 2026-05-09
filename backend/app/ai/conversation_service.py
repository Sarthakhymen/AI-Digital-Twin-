"""AI Conversation Service - Ultra-Concise Business Guardrails"""
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
        
        # Knowledge Base Info
        business_desc = profile.get("business_description", "")
        twin_desc = profile.get("description", "")
        website = profile.get("business_website", "")
        knowledge_base = profile.get("knowledge_base", "")
        
        # Build knowledge section
        knowledge_section = ""
        if business_desc:
            knowledge_section += f"{business_desc}\n"
        if twin_desc:
            knowledge_section += f"{twin_desc}\n"
        if website:
            knowledge_section += f"Website: {website}\n"
        if knowledge_base:
            knowledge_section += f"\n{knowledge_base}\n"
        
        system_prompt = f"""You are a friendly human staff member at {business_name}. Your name is {twin_name}.

INTERNAL KNOWLEDGE (NEVER show this raw data to user):
{knowledge_section}

STRICT RESPONSE FORMAT RULES:
- MAXIMUM 2 sentences per reply. NEVER exceed this.
- When user says hi/hello → Reply ONLY: "Hi! Welcome to {business_name} 👋 How can I help you?"
- When listing items (food, prices, services) → Use bullet points, NOT paragraphs
- NEVER say "As an AI" or "As a Digital Twin" or "I am programmed to" — you are a HUMAN staff member
- NEVER repeat business history/background unless specifically asked "tell me about your restaurant"
- If asked "best food" → List 3-4 items with prices in bullet points. Nothing else.
- If asked "address/location" → Give ONLY the address. One line.
- If asked "price of X" → Give ONLY the price. Example: "Butter Chicken is ₹399!"
- For general/off-topic questions → "Sorry, I can only help with {business_name} queries! 😊"
- NEVER start response with long introductions. Get straight to the answer.
- Use emojis sparingly (1-2 max per message) to feel friendly
- Think: you're texting on WhatsApp, not writing an email

EXAMPLES OF GOOD RESPONSES:
User: "hi" → "Hi! Welcome to {business_name} 👋 How can I help?"
User: "butter chicken price?" → "Butter Chicken is ₹399! 🍗"
User: "best dishes?" → "Our top picks:\n• Butter Chicken - ₹399\n• Dal Makhani - ₹299\n• Roomali Roti - ₹89\nWant to know more about any of these?"
User: "address?" → "Shop No. 45, Block C, Connaught Place, New Delhi 📍"
User: "who is PM of India?" → "Sorry, I can only help with {business_name} queries! 😊"
"""
        
        # Use OpenAI if Key is available
        if self.client and self.openai_key and "sk-" in self.openai_key:
            messages = [{"role": "system", "content": system_prompt}]
            for msg in history[-5:]:
                role_map = {"user": "user", "assistant": "assistant", "twin": "assistant"}
                role_val = role_map.get(msg.get("role", "user"), "user")
                messages.append({"role": role_val, "content": msg.get("content", "")})
            messages.append({"role": "user", "content": message})

            try:
                response = await self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    temperature=0.3,
                    max_tokens=150  # Hard limit — forces short replies
                )
                ai_response = response.choices[0].message.content
                return {
                    "success": True,
                    "response": ai_response,
                    "timestamp": datetime.utcnow().isoformat()
                }
            except Exception as e:
                print("OpenAI Error:", e)
                pass

        # Fallback to Modal — also with strict prompt
        strict_message = f"""[STRICT RULES: You are {business_name}'s customer support. 
Reply in MAX 2 sentences. Use bullet points for lists. 
NEVER say "As an AI" or "As a Digital Twin". 
NEVER give long paragraphs. Be short like WhatsApp messages.
If off-topic, say "Sorry, I only help with {business_name} queries!"]

Customer: {message}"""

        payload = {
            "message": strict_message,
            "history": history[-3:],  # Limit history too
            "personality": profile,
            "style": style,
            "enable_web_search": False
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(self.modal_url, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    raw_response = data.get("response", "No response")
                    # Truncate Modal response if too long (fallback safety)
                    if len(raw_response) > 300:
                        sentences = raw_response.split('. ')
                        raw_response = '. '.join(sentences[:2]) + '.'
                    return {
                        "success": True,
                        "response": raw_response,
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
