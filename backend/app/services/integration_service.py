from sqlalchemy.orm import Session
from datetime import datetime
from ..models import DigitalTwin, Conversation
from ..ai.conversation_service import conversation_service
import json

class IntegrationService:
    async def process_public_message(self, db: Session, twin_id: int, message: str, customer_name: str = "Visitor", session_id: str = None):
        """Process a message from a public integration (web widget, etc.)"""
        
        # 1. Verify twin exists and is active
        twin = db.query(DigitalTwin).filter(DigitalTwin.id == twin_id, DigitalTwin.status == "active").first()
        if not twin:
            return {"error": "Digital twin not found or not active"}
            
        # 2. Get or create conversation
        # For simplicity, we'll create a new conversation if no session_id is provided
        # or find an existing 'active' one for this twin and session
        conversation = None
        if session_id:
            # You could add a session_id column to Conversation model, 
            # for now we'll just use recent active ones
            conversation = db.query(Conversation).filter(
                Conversation.digital_twin_id == twin_id,
                Conversation.customer_name == customer_name,
                Conversation.status == "active"
            ).order_by(Conversation.created_at.desc()).first()
            
        if not conversation:
            conversation = Conversation(
                digital_twin_id=twin_id,
                customer_name=customer_name,
                channel="web_widget",
                messages=[],
                status="active",
                created_at=datetime.utcnow()
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
            
        # 3. Prepare history for AI
        history = conversation.messages if conversation.messages else []
        
        # 4. Generate AI response
        profile = twin.personality_profile if isinstance(twin.personality_profile, dict) else {}
        style = twin.communication_style if isinstance(twin.communication_style, dict) else {}
        
        # Add business info to profile
        profile["name"] = twin.name
        profile["description"] = twin.description or ""
        if twin.business:
            profile["business_name"] = twin.business.name
            profile["business_description"] = twin.business.description or ""
            profile["business_website"] = twin.business.website or ""
        
        ai_result = await conversation_service.process_message(
            message=message,
            history=history,
            profile=profile,
            style=style
        )
        
        # 5. Update conversation messages
        new_messages = list(history)
        new_messages.append({"role": "user", "content": message, "timestamp": datetime.utcnow().isoformat(), "is_user": True})
        
        if ai_result["success"]:
            new_messages.append({"role": "assistant", "content": ai_result["response"], "timestamp": ai_result["timestamp"], "is_user": False})
            
        conversation.messages = new_messages
        db.commit()
        
        return {
            "response": ai_result["response"],
            "conversation_id": conversation.id,
            "success": ai_result["success"]
        }

integration_service = IntegrationService()
