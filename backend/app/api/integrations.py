"""
Public Integration API Routes (Web Widget, Webhooks, etc.)
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.integration_service import integration_service
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/integrations", tags=["Integrations"])

class ChatRequest(BaseModel):
    message: str
    customer_name: Optional[str] = "Visitor"
    session_id: Optional[str] = None

@router.post("/{twin_id}/chat")
async def public_chat(
    twin_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Public endpoint for web widgets to chat with a Digital Twin.
    No auth required for the customer.
    """
    result = await integration_service.process_public_message(
        db=db,
        twin_id=twin_id,
        message=request.message,
        customer_name=request.customer_name,
        session_id=request.session_id
    )
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
        
    return result

@router.post("/whatsapp/webhook")
async def whatsapp_webhook(
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    """
    Placeholder for WhatsApp/Twilio Webhook.
    Logic would parse incoming message, find the twin based on the phone number, 
    and call integration_service.
    """
    # Logic for parsing WhatsApp data goes here
    return {"status": "received"}
