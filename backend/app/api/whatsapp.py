from fastapi import APIRouter, Request, Form, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DigitalTwin
from app.services.integration_service import integration_service
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

@router.post("/process")
async def process_whatsapp_direct(request: dict, db: Session = Depends(get_db)):
    """
    Direct endpoint for WhatsApp QR Bridge (no Twilio).
    Expects {"from": "...", "body": "...", "twin_id": 123}
    """
    from_number = request.get("from")
    body = request.get("body")
    twin_id = request.get("twin_id")
    
    print(f"Received direct message from {from_number}: {body}")
    
    # If twin_id not provided, try to find the first active twin (MVP heuristic)
    if not twin_id:
        active_twin = db.query(DigitalTwin).filter(DigitalTwin.status == "active").order_by(DigitalTwin.id.desc()).first()
        if not active_twin:
            return {"response": "Sorry, no active digital twin found for this number."}
        twin_id = active_twin.id

    result = await integration_service.process_public_message(
        db=db,
        twin_id=twin_id,
        message=body,
        customer_name="WhatsApp User",
        session_id=from_number # Use phone number as session ID
    )
    
    return {"response": result.get("response", "Sorry, something went wrong.")}

@router.post("/webhook")
async def whatsapp_webhook(
    Body: str = Form(...),
    From: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Webhook to receive WhatsApp messages from Twilio.
    """
    print(f"Received message from {From}: {Body}")
    
    # Heuristic: Find first active twin
    active_twin = db.query(DigitalTwin).filter(DigitalTwin.status == "active").order_by(DigitalTwin.id.desc()).first()
    if not active_twin:
        return Response(content="<Response><Message>No active twin found.</Message></Response>", media_type="application/xml")

    result = await integration_service.process_public_message(
        db=db,
        twin_id=active_twin.id,
        message=Body,
        customer_name="WhatsApp User",
        session_id=From
    )
    
    ai_response = result.get("response", "Sorry, I'm having trouble thinking right now.")
    
    from twilio.twiml.messaging_response import MessagingResponse
    resp = MessagingResponse()
    resp.message(ai_response)
    
    return Response(content=str(resp), media_type="application/xml")
