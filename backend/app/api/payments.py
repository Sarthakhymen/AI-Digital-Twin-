from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
import os
import httpx
from ..database import get_db
from ..models import User
from ..api.auth import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/payments", tags=["Payments"])

DODO_API_KEY = os.getenv("DODO_PAYMENTS_API_KEY")
DODO_BASE_URL = "https://api.dodopayments.com/v1"

class CheckoutRequest(BaseModel):
    plan_type: str
    billing_cycle: str

@router.post("/create-checkout")
async def create_checkout(
    request: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Dodo Payments checkout session"""
    if not DODO_API_KEY:
        raise HTTPException(status_code=500, detail="Dodo Payments API key not configured")

    # Map plan_type to Dodo Product IDs from .env
    product_map = {
        "starter": os.getenv("DODO_STARTER_PRODUCT_ID"),
        "pro": os.getenv("DODO_PRO_PRODUCT_ID")
    }

    product_id = product_map.get(request.plan_type)
    if not product_id:
        raise HTTPException(status_code=400, detail="Invalid plan type or Product ID not set")

    payload = {
        "product_id": product_id,
        "quantity": 1,
        "customer": {
            "email": current_user.email,
            "name": current_user.full_name or "Valued Customer"
        },
        "billing_cycle": request.billing_cycle,
        "return_url": os.getenv("FRONTEND_URL", "https://ai-digital-twin-seven.vercel.app") + "/dashboard?payment=success",
        "cancel_url": os.getenv("FRONTEND_URL", "https://ai-digital-twin-seven.vercel.app") + "/pricing?payment=cancelled",
        "metadata": {
            "user_id": str(current_user.id),
            "plan_type": request.plan_type
        }
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{DODO_BASE_URL}/checkouts",
                json=payload,
                headers={"Authorization": f"Bearer {DODO_API_KEY}"}
            )
            
            if response.status_code != 201:
                print(f"Dodo Error: {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Failed to create checkout session")
            
            data = response.json()
            return {"checkout_url": data.get("checkout_url")}
            
        except Exception as e:
            print(f"Payment Exception: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal payment error")

@router.post("/webhook")
async def dodo_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Dodo Payments webhooks"""
    # In production, verify webhook signature here
    payload = await request.json()
    event_type = payload.get("event")
    
    if event_type == "subscription.created" or event_type == "payment.succeeded":
        metadata = payload.get("data", {}).get("metadata", {})
        user_id = metadata.get("user_id")
        plan_type = metadata.get("plan_type")
        
        if user_id:
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user:
                user.subscription_plan = plan_type
                user.subscription_status = "active"
                db.commit()
                print(f"✅ User {user_id} upgraded to {plan_type}")
                
    return {"status": "success"}
