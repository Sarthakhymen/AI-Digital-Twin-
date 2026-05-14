from fastapi import APIRouter, Request, Form, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DigitalTwin, User, Business
from app.services.integration_service import integration_service
from app.services.auth_service import get_current_user
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

    # Find the owner and check subscription
    owner = db.query(User).join(Business).join(DigitalTwin).filter(DigitalTwin.id == twin_id).first()
    if owner:
        from app.services.auth_service import check_user_subscription
        owner = check_user_subscription(db, owner)
        if owner.subscription_status == "expired":
            return {"response": "This service is currently unavailable. Please contact the business owner."}

    result = await integration_service.process_public_message(
        db=db,
        twin_id=twin_id,
        message=body,
        customer_name="WhatsApp User",
        session_id=from_number # Use phone number as session ID
    )
    
    return {"response": result.get("response", "Sorry, something went wrong.")}

@router.post("/bridge")
async def process_whatsapp_bridge(request: dict, db: Session = Depends(get_db)):
    """
    Endpoint for Baileys WhatsApp Bridge.
    Expects {"user_id": "...", "sender": "...", "text": "..."}
    """
    user_id = request.get("user_id")
    sender = request.get("sender")
    message_text = request.get("text")
    
    print(f"Bridge message from {sender} for user {user_id}: {message_text}")
    
    # Find the active twin for this user (DigitalTwin -> Business -> User)
    try:
        u_id = int(user_id)
    except:
        u_id = 0

    active_twin = db.query(DigitalTwin).join(Business).filter(
        Business.owner_id == u_id,
        DigitalTwin.status == "active"
    ).order_by(DigitalTwin.id.desc()).first()

    if not active_twin:
        active_twin = db.query(DigitalTwin).filter(DigitalTwin.status == "active").first()
        if not active_twin:
            return {"reply": "Sorry, no active digital twin found."}

    # Find the owner and check subscription
    owner = db.query(User).join(Business).join(DigitalTwin).filter(DigitalTwin.id == active_twin.id).first()
    if owner:
        from app.services.auth_service import check_user_subscription
        owner = check_user_subscription(db, owner)
        if owner.subscription_status == "expired":
            return {"reply": "This AI assistant's subscription has expired. Please upgrade to continue."}

    result = await integration_service.process_public_message(
        db=db,
        twin_id=active_twin.id,
        message=message_text,
        customer_name="WhatsApp User",
        session_id=sender
    )
    
    return {"reply": result.get("response", "Sorry, I'm having trouble thinking right now.")}

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
    
    # Find first active twin
    active_twin = db.query(DigitalTwin).filter(DigitalTwin.status == "active").order_by(DigitalTwin.id.desc()).first()
    if not active_twin:
        return Response(content="<Response><Message>No active twin found.</Message></Response>", media_type="application/xml")

    # Find the owner and check subscription
    owner = db.query(User).join(Business).join(DigitalTwin).filter(DigitalTwin.id == active_twin.id).first()
    if owner:
        from app.services.auth_service import check_user_subscription
        owner = check_user_subscription(db, owner)
        if owner.subscription_status == "expired":
            from twilio.twiml.messaging_response import MessagingResponse
            resp = MessagingResponse()
            resp.message("This service is currently unavailable due to an expired subscription. Please upgrade to continue.")
            return Response(content=str(resp), media_type="application/xml")

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
