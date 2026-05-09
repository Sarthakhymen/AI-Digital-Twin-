from sqlalchemy.orm import Session
from datetime import datetime
from ..models import DigitalTwin, Conversation, KnowledgeChunk
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
        conversation = None
        if session_id:
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
        
        # 5. KNOWLEDGE BASE RAG — Fetch relevant chunks
        knowledge_text = self._get_relevant_knowledge(db, twin_id, message)
        if knowledge_text:
            profile["knowledge_base"] = knowledge_text
        
        ai_result = await conversation_service.process_message(
            message=message,
            history=history,
            profile=profile,
            style=style
        )
        
        # 6. Update conversation messages
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
    
    def _get_relevant_knowledge(self, db: Session, twin_id: int, query: str, max_chunks: int = 8) -> str:
        """
        Fetch the most relevant knowledge chunks for a query.
        Uses simple keyword matching for MVP.
        """
        # Get ALL chunks for this twin
        all_chunks = db.query(KnowledgeChunk).filter(
            KnowledgeChunk.digital_twin_id == twin_id
        ).all()
        
        if not all_chunks:
            return ""
        
        # Simple keyword relevance scoring
        query_words = set(query.lower().split())
        scored_chunks = []
        
        for chunk in all_chunks:
            chunk_lower = chunk.content.lower()
            score = sum(1 for word in query_words if word in chunk_lower and len(word) > 2)
            scored_chunks.append((score, chunk.content))
        
        # Sort by relevance score (highest first)
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        
        # Take top chunks (mix of relevant + first few for general context)
        relevant = [c[1] for c in scored_chunks[:max_chunks]]
        
        # If no keyword matches, still include some chunks for general knowledge
        if not relevant:
            relevant = [c.content for c in all_chunks[:max_chunks]]
        
        return "\n---\n".join(relevant)

integration_service = IntegrationService()

