import json
import re
from sqlalchemy.orm import Session
from datetime import datetime
from ..models import DigitalTwin, Conversation, KnowledgeChunk
from ..ai.conversation_service import conversation_service

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
        
        # DEBUG LOGS
        print(f"--- AI DEBUG START ---")
        print(f"Business: {profile.get('business_name')}")
        print(f"Twin: {profile.get('name')}")
        print(f"Message: {message}")
        print(f"Knowledge Found: {'Yes' if knowledge_text else 'No'} ({len(knowledge_text)} chars)")
        print(f"--- AI DEBUG END ---")

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
    
    def _get_relevant_knowledge(self, db: Session, twin_id: int, query: str, max_chunks: int = 5) -> str:
        """
        Fetch the most relevant knowledge chunks for a query.
        Improved keyword matching for better RAG.
        """
        # Get ALL chunks for this twin
        all_chunks = db.query(KnowledgeChunk).filter(
            KnowledgeChunk.digital_twin_id == twin_id
        ).all()
        
        if not all_chunks:
            return ""
        
        # Better keyword relevance scoring
        stop_words = {'the', 'and', 'for', 'you', 'are', 'can', 'with', 'this', 'that', 'who', 'what', 'where', 'how', 'about', 'your'}
        query_words = [w.lower() for w in re.findall(r'\w+', query) if len(w) > 2 and w.lower() not in stop_words]
        
        # If query is too short or common (e.g. "hi"), use general business context
        if not query_words:
            # Return first 3 chunks as general context
            general_chunks = [c.content for c in all_chunks[:3]]
            return "\n---\n".join(general_chunks)

        scored_chunks = []
        for chunk in all_chunks:
            chunk_lower = chunk.content.lower()
            score = 0
            for word in query_words:
                if word in chunk_lower:
                    score += 1
                    # Bonus for exact match as separate word
                    if f" {word} " in f" {chunk_lower} ":
                        score += 2
            
            if score > 0:
                scored_chunks.append((score, chunk.content))
        
        # Sort by relevance score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        
        # Take top chunks
        relevant = [c[1] for c in scored_chunks[:max_chunks]]
        
        # Fallback: if no keyword matches, still include some chunks for general context
        if not relevant:
            relevant = [c.content for c in all_chunks[:max_chunks]]
        
        return "\n---\n".join(relevant)

integration_service = IntegrationService()

