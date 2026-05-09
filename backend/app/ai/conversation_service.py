"""AI Conversation Service - Modal Integration"""
import os
import httpx
from typing import Dict, List
from datetime import datetime

class ConversationService:
    def __init__(self):
        # Aapka Modal Web URL yahan aayega
        self.modal_url = os.getenv("MODAL_WEB_URL", "https://your-modal-app-name.modal.run")

    async def process_message(self, message: str, history: List[Dict], profile: Dict, style: Dict) -> Dict:
        """Send request to Mistral 7B running on Modal"""
        
        payload = {
            "message": message,
            "history": history,
            "personality": profile,
            "style": style,
            "enable_web_search": True  # RAG trigger
        }

        async with httpx.AsyncClient(timeout=600.0, follow_redirects=True) as client:
            try:
                response = await client.post(f"{self.modal_url}", json=payload)
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "response": data["response"],
                        "timestamp": datetime.utcnow().isoformat()
                    }
                else:
                    return {
                        "success": False,
                        "response": f"Modal API Error ({response.status_code}): {response.text}",
                        "timestamp": datetime.utcnow().isoformat()
                    }
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e),
                    "response": f"Connection Error: {str(e)}. (Model load ho raha ho sakta hai, 1 min baad firse try karein)"
                }

conversation_service = ConversationService()
