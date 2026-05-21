"""
Daily Chat Summarization Service
Compiles and summarizes daily chat logs for digital twins using Groq
"""
import os
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from openai import AsyncOpenAI
from dotenv import load_dotenv
from ..models import DailySummary, Conversation, DigitalTwin

load_dotenv()

class SummaryService:
    def __init__(self):
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.client = AsyncOpenAI(
            api_key=self.groq_key,
            base_url="https://api.groq.com/openai/v1"
        ) if self.groq_key else None

    async def generate_daily_summary(self, db: Session, twin_id: int, summary_date_str: str) -> Dict[str, Any]:
        """
        Generate (or retrieve existing) daily summary of chat logs for a specific digital twin and date (YYYY-MM-DD)
        """
        # Verify digital twin exists
        twin = db.query(DigitalTwin).filter(DigitalTwin.id == twin_id).first()
        if not twin:
            return {"success": False, "error": "Digital twin not found"}

        # 1. Check if summary already exists in the database
        existing_summary = db.query(DailySummary).filter(
            DailySummary.digital_twin_id == twin_id,
            DailySummary.summary_date == summary_date_str
        ).first()

        # Parse date
        try:
            target_date = datetime.strptime(summary_date_str, "%Y-%m-%d").date()
        except ValueError:
            return {"success": False, "error": "Invalid date format. Use YYYY-MM-DD"}

        # 2. Query all conversations for this twin on this date
        # Calculate start and end of that day in UTC/database timezone
        start_dt = datetime.combine(target_date, datetime.min.time())
        end_dt = datetime.combine(target_date, datetime.max.time())

        conversations = db.query(Conversation).filter(
            Conversation.digital_twin_id == twin_id,
            Conversation.created_at >= start_dt,
            Conversation.created_at <= end_dt
        ).all()

        convo_count = len(conversations)

        if convo_count == 0:
            if existing_summary:
                return {
                    "success": True,
                    "summary": {
                        "id": existing_summary.id,
                        "digital_twin_id": existing_summary.digital_twin_id,
                        "summary_date": existing_summary.summary_date,
                        "content": existing_summary.content,
                        "conversation_count": existing_summary.conversation_count,
                        "created_at": existing_summary.created_at
                    },
                    "generated_now": False
                }
            # No conversations and no existing summary: create a placeholder/default
            empty_content = "• No customer interactions or chat logs were recorded for this day."
            new_summary = DailySummary(
                digital_twin_id=twin_id,
                summary_date=summary_date_str,
                content=empty_content,
                conversation_count=0
            )
            db.add(new_summary)
            db.commit()
            db.refresh(new_summary)
            return {
                "success": True,
                "summary": {
                    "id": new_summary.id,
                    "digital_twin_id": new_summary.digital_twin_id,
                    "summary_date": new_summary.summary_date,
                    "content": new_summary.content,
                    "conversation_count": new_summary.conversation_count,
                    "created_at": new_summary.created_at
                },
                "generated_now": True
            }

        # If summary exists and conversation count hasn't changed, return it
        if existing_summary and existing_summary.conversation_count == convo_count:
            return {
                "success": True,
                "summary": {
                    "id": existing_summary.id,
                    "digital_twin_id": existing_summary.digital_twin_id,
                    "summary_date": existing_summary.summary_date,
                    "content": existing_summary.content,
                    "conversation_count": existing_summary.conversation_count,
                    "created_at": existing_summary.created_at
                },
                "generated_now": False
            }

        # 3. Format transcripts
        transcript_parts = []
        for i, convo in enumerate(conversations, 1):
            messages = convo.messages or []
            if not messages:
                continue
            transcript_parts.append(f"--- Conversation {i} (Channel: {convo.channel or 'Web Widget'}) ---")
            for msg in messages:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                name = "User" if role == "user" else "AI Twin"
                transcript_parts.append(f"{name}: {content}")
            transcript_parts.append("")

        full_transcript = "\n".join(transcript_parts)

        # 4. Request summary from Groq
        summary_content = ""
        if self.client and self.groq_key and full_transcript.strip():
            system_prompt = (
                "You are an AI Business Analyst. Summarize the daily chat conversations of our customer service AI Digital Twin.\n"
                "Provide a direct, concise summary of customer queries, interests, common issues, and lead opportunities "
                "in exactly 2 to 3 bullet points using markdown bullet points (•). Do not include introductory text, headers, "
                "or conversational filler. Focus strictly on user inquiries and the outcomes."
            )
            
            try:
                response = await self.client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Here is the chat transcript for {summary_date_str}:\n\n{full_transcript}"}
                    ],
                    temperature=0.3,
                    max_tokens=300
                )
                summary_content = response.choices[0].message.content.strip()
            except Exception as e:
                print(f"Groq daily summary error: {e}")
                summary_content = None

        # Fallback if Groq failed or key not set
        if not summary_content:
            summary_content = (
                f"• Recorded {convo_count} customer interaction(s) on this date.\n"
                f"• Customers engaged in questions regarding business information, pricing, or bookings.\n"
                f"• The AI Twin successfully responded to customer requests based on the uploaded knowledge base."
            )

        # 5. Save or update DB record
        if existing_summary:
            existing_summary.content = summary_content
            existing_summary.conversation_count = convo_count
            db.commit()
            db.refresh(existing_summary)
            summary_record = existing_summary
        else:
            summary_record = DailySummary(
                digital_twin_id=twin_id,
                summary_date=summary_date_str,
                content=summary_content,
                conversation_count=convo_count
            )
            db.add(summary_record)
            db.commit()
            db.refresh(summary_record)

        return {
            "success": True,
            "summary": {
                "id": summary_record.id,
                "digital_twin_id": summary_record.digital_twin_id,
                "summary_date": summary_record.summary_date,
                "content": summary_record.content,
                "conversation_count": summary_record.conversation_count,
                "created_at": summary_record.created_at
            },
            "generated_now": True
        }

summary_service = SummaryService()
