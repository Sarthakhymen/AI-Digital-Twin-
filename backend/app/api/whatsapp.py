from fastapi import APIRouter, Request, Form, Depends, HTTPException, Response
from pydantic import BaseModel, Field

from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client
import os
import httpx
from dotenv import load_dotenv
from app.ai.conversation_service import conversation_service

load_dotenv()

router = APIRouter()

# Twilio Client
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")

client = Client(TWILIO_SID, TWILIO_TOKEN)

class WhatsAppRequest(BaseModel):
    from_number: str = Field(alias="from")
    body: str

@router.post("/process")
async def process_whatsapp_direct(request: WhatsAppRequest):
    """
    Direct endpoint for WhatsApp QR Bridge (no Twilio).
    """
    print(f"Received direct message from {request.from_number}: {request.body}")
    
    try:
        result = await conversation_service.process_message(
            message=request.body,
            history=[],
            profile={
                "name": "Sarthak's Digital Twin",
                "role": "AI Business Assistant",
                "traits": "Helpful, Professional, Energetic"
            },
            style={
                "tone": "Casual but respectful",
                "language": "Hindi-English Mix (Hinglish)"
            }
        )
        
        return {"response": result.get("response", "Sorry, something went wrong.")}

    except Exception as e:
        print(f"Error in direct WhatsApp process: {e}")
        return {"response": "I'm having a bit of a glitch. Can you say that again?"}

@router.post("/webhook")

async def whatsapp_webhook(
    Body: str = Form(...),
    From: str = Form(...)
):
    """
    Webhook to receive WhatsApp messages from Twilio.
    """
    print(f"Received message from {From}: {Body}")
    
    try:
        # 1. Get response from our Digital Twin (Modal AI)
        # For MVP, we use default personality traits
        result = await conversation_service.process_message(
            message=Body,
            history=[], # We can add session memory later
            profile={
                "name": "Sarthak's Digital Twin",
                "role": "AI Business Assistant",
                "traits": "Helpful, Professional, Energetic"
            },
            style={
                "tone": "Casual but respectful",
                "language": "Hindi-English Mix (Hinglish)"
            }
        )
        
        ai_response = result.get("response", "Sorry, something went wrong.")
        
        # 2. Prepare Twilio Response
        resp = MessagingResponse()
        resp.message(ai_response)
        
        return Response(content=str(resp), media_type="application/xml")

    except Exception as e:
        print(f"Error in WhatsApp webhook: {e}")
        resp = MessagingResponse()
        resp.message("Sorry, I'm having a little trouble thinking right now. Please try again in a bit!")
        return Response(content=str(resp), media_type="application/xml")

@router.get("/test-send")
async def test_send(to: str, message: str):
    """
    Test endpoint to send a message manually.
    Example: /test-send?to=whatsapp:+919876543210&message=Hello
    """
    try:
        message = client.messages.create(
            body=message,
            from_=TWILIO_NUMBER,
            to=to
        )
        return {"status": "success", "sid": message.sid}
    except Exception as e:
        return {"status": "error", "message": str(e)}
