from fastapi import APIRouter, Depends, HTTPException, Request, Header, BackgroundTasks
from sqlalchemy.orm import Session
import os
import httpx
from ..database import get_db
from ..models import User, ManualPayment
from ..api.auth import get_current_user
from pydantic import BaseModel, EmailStr
from typing import Optional
from twilio.rest import Client

router = APIRouter(prefix="/payments", tags=["Payments"])

DODO_API_KEY = os.getenv("DODO_PAYMENTS_API_KEY", "")
# Determine base URL based on API key prefix (test_ or live_)
if DODO_API_KEY and DODO_API_KEY.startswith("test_"):
    DODO_BASE_URL = "https://test.dodopayments.com"
else:
    DODO_BASE_URL = "https://live.dodopayments.com"

TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP = os.getenv("TWILIO_WHATSAPP_NUMBER")
OWNER_WHATSAPP = "whatsapp:+919625410112"

class ManualPaymentSubmit(BaseModel):
    email: EmailStr
    transaction_id: str

def send_whatsapp_notification(email: str, tx_id: str):
    """Send instant WhatsApp notification to the owner"""
    if not all([TWILIO_SID, TWILIO_TOKEN, TWILIO_WHATSAPP]):
        print("⚠️ Twilio not configured, skipping notification")
        return
    
    try:
        client = Client(TWILIO_SID, TWILIO_TOKEN)
        message_body = (
            f"🚀 *New Pro Payment Alert!*\n\n"
            f"📧 *Email:* {email}\n"
            f"🆔 *TX ID:* {tx_id}\n\n"
            f"Please verify and activate within 12-24 hours."
        )
        
        client.messages.create(
            from_=TWILIO_WHATSAPP,
            body=message_body,
            to=OWNER_WHATSAPP
        )
        print(f"✅ WhatsApp notification sent to owner")
    except Exception as e:
        print(f"❌ Failed to send WhatsApp notification: {e}")

@router.post("/manual-submit")
async def submit_manual_payment(
    payment: ManualPaymentSubmit,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Submit manual UPI payment details"""
    # Check if transaction ID already exists
    existing = db.query(ManualPayment).filter(ManualPayment.transaction_id == payment.transaction_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Transaction ID already submitted")
    
    # Try to find user by email to link
    user = db.query(User).filter(User.email == payment.email).first()
    
    # Save to database
    new_payment = ManualPayment(
        email=payment.email,
        user_id=user.id if user else None,
        transaction_id=payment.transaction_id,
        status="pending"
    )
    db.add(new_payment)
    
    # Update user status to pending if they exist
    if user:
        user.subscription_status = "pending_verification"
        
    db.commit()
    db.refresh(new_payment)
    
    # Send notification in background
    background_tasks.add_task(send_whatsapp_notification, payment.email, payment.transaction_id)
    
    return {"message": "Payment details submitted successfully. We will verify and activate your account soon."}

class PaymentVerification(BaseModel):
    transaction_id: str
    action: str  # 'verify' or 'reject'

@router.post("/verify-payment")
async def verify_payment(
    verification: PaymentVerification,
    # In a real app, you'd add admin authentication here
    db: Session = Depends(get_db)
):
    """Admin endpoint to verify or reject manual payments"""
    payment = db.query(ManualPayment).filter(ManualPayment.transaction_id == verification.transaction_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")
    
    if verification.action == "verify":
        payment.status = "verified"
        from datetime import datetime, timedelta
        payment.verified_at = datetime.utcnow()
        
        # Activate user
        user = db.query(User).filter(User.email == payment.email).first()
        if user:
            user.subscription_plan = "pro"
            user.subscription_status = "active"
            # Set expiration to 30 days from now (default monthly)
            user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)
            db.commit()
            return {"message": f"Payment verified. User {user.email} is now PRO."}
        else:
            db.commit()
            return {"message": "Payment verified but no matching user found for this email."}
    
    elif verification.action == "reject":
        payment.status = "rejected"
        db.commit()
        return {"message": "Payment rejected."}
    
    return {"message": "Invalid action."}




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
        "product_cart": [
            {
                "product_id": product_id,
                "quantity": 1
            }
        ],
        "customer": {
            "email": current_user.email,
            "name": current_user.full_name or "Valued Customer"
        },
        "billing_cycle": request.billing_cycle,
        "return_url": os.getenv("FRONTEND_URL", "https://ai-digital-twin-seven.vercel.app").rstrip('/') + "/dashboard?payment=success",
        "cancel_url": os.getenv("FRONTEND_URL", "https://ai-digital-twin-seven.vercel.app").rstrip('/') + "/pricing?payment=cancelled",
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

@router.post("/trial")
async def start_trial(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a 24-hour free trial"""
    if current_user.trial_started_at:
        raise HTTPException(status_code=400, detail="Trial already used or started.")
    
    from datetime import datetime, timedelta
    current_user.trial_started_at = datetime.utcnow()
    current_user.subscription_plan = "trial"
    current_user.subscription_status = "active"
    current_user.subscription_expires_at = datetime.utcnow() + timedelta(hours=24)
    
    db.commit()
    return {"message": "Trial started successfully! You have 24 hours of premium access."}
