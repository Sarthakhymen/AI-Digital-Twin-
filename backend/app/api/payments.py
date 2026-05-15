from fastapi import APIRouter, Depends, HTTPException, Request, Header, BackgroundTasks
from sqlalchemy.orm import Session
import os
import httpx
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from ..database import get_db
from ..models import User, ManualPayment
from ..api.auth import get_current_user
from pydantic import BaseModel, EmailStr
from typing import Optional, Any

router = APIRouter(prefix="/payments", tags=["Payments"])

DODO_API_KEY = os.getenv("DODO_PAYMENTS_API_KEY", "")
# Determine base URL based on API key prefix (test_ or live_)
if DODO_API_KEY and DODO_API_KEY.startswith("test_"):
    DODO_BASE_URL = "https://test.dodopayments.com"
else:
    DODO_BASE_URL = "https://live.dodopayments.com"

# Email Notification Config
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "sarthak2005shavarn@gmail.com")
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "sarthak2005shavarn@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_APP_PASSWORD", "")  # Gmail App Password

class ManualPaymentSubmit(BaseModel):
    email: EmailStr
    transaction_id: str

def send_email_notification(user_email: str, tx_id: str):
    """Send instant email notification to admin when a payment is submitted"""
    if not SMTP_PASSWORD:
        print("⚠️ SMTP App Password not configured, skipping email notification")
        return
    
    try:
        # Create the email
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🚀 New Payment Alert — UTR: {tx_id}"
        msg["From"] = SMTP_EMAIL
        msg["To"] = ADMIN_EMAIL

        now = datetime.utcnow().strftime("%d %b %Y, %I:%M %p UTC")

        # Plain text version
        text_body = (
            f"New Pro Payment Submitted!\n\n"
            f"User Email: {user_email}\n"
            f"UTR / Transaction ID: {tx_id}\n"
            f"Submitted At: {now}\n\n"
            f"Please verify this payment in your Admin Dashboard and activate the user's account."
        )

        # HTML version (premium styled)
        html_body = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
            <div style="background: linear-gradient(135deg, #e11d48, #be123c); padding: 24px 32px;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">🚀 New Payment Alert!</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">AI Digital Twin — Admin Notification</p>
            </div>
            
            <div style="padding: 32px;">
                <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; font-weight: 600; width: 140px;">📧 User Email</td>
                            <td style="padding: 10px 0; color: #f1f5f9; font-size: 14px; font-weight: 700;">{user_email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-top: 1px solid #334155; color: #94a3b8; font-size: 13px; font-weight: 600;">🆔 UTR / TX ID</td>
                            <td style="padding: 10px 0; border-top: 1px solid #334155; color: #fb923c; font-size: 14px; font-weight: 700; font-family: monospace;">{tx_id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-top: 1px solid #334155; color: #94a3b8; font-size: 13px; font-weight: 600;">🕐 Submitted At</td>
                            <td style="padding: 10px 0; border-top: 1px solid #334155; color: #f1f5f9; font-size: 13px;">{now}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background: #172554; border: 1px solid #1e3a5f; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
                    <p style="color: #60a5fa; margin: 0; font-size: 13px; line-height: 1.5;">
                        ⚡ <strong>Action Required:</strong> Open the Admin Dashboard → Payment Requests → Verify this transaction to activate the user's Pro account.
                    </p>
                </div>

                <a href="{os.getenv('FRONTEND_URL', 'https://ai-digital-twin-seven.vercel.app').rstrip('/')}/admin" 
                   style="display: block; text-align: center; background: linear-gradient(135deg, #e11d48, #be123c); color: white; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 14px;">
                    Open Admin Dashboard →
                </a>
            </div>
            
            <div style="padding: 16px 32px; background: #0b1120; border-top: 1px solid #1e293b; text-align: center;">
                <p style="color: #475569; margin: 0; font-size: 11px;">Nexora AI Digital Twin — Automated Payment Notification</p>
            </div>
        </div>
        """

        msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        # Send via Gmail SMTP
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, ADMIN_EMAIL, msg.as_string())

        print(f"✅ Email notification sent to {ADMIN_EMAIL}")

    except Exception as e:
        print(f"❌ Failed to send email notification: {e}")

@router.post("/manual-submit")
async def submit_manual_payment(
    payment: ManualPaymentSubmit,
    background_tasks: BackgroundTasks,
    db: Any = Depends(get_db)
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
    
    # Send email notification in background
    background_tasks.add_task(send_email_notification, payment.email, payment.transaction_id)
    
    return {"message": "Payment details submitted successfully. We will verify and activate your account soon."}





class CheckoutRequest(BaseModel):
    plan_type: str
    billing_cycle: str

@router.post("/create-checkout")
async def create_checkout(
    request: CheckoutRequest,
    current_user: Any = Depends(get_current_user),
    db: Any = Depends(get_db)
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
async def dodo_webhook(request: Request, db: Any = Depends(get_db)):
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
    current_user: Any = Depends(get_current_user),
    db: Any = Depends(get_db)
):
    """Start a free trial — one-time only, per email"""
    # Block repeat trials
    if current_user.has_used_trial:
        raise HTTPException(status_code=400, detail="Free trial already used on this account. Please upgrade to a paid plan.")
    
    # Block if already on a paid plan
    if current_user.subscription_plan in ("standard", "business_pro"):
        raise HTTPException(status_code=400, detail="You already have an active paid plan.")
    
    from datetime import datetime, timedelta
    current_user.trial_started_at = datetime.utcnow()
    current_user.subscription_plan = "free"
    current_user.subscription_status = "active"
    current_user.subscription_expires_at = datetime.utcnow() + timedelta(days=7)
    current_user.has_used_trial = True
    current_user.message_count = 0  # Reset message count
    
    db.commit()
    return {"message": "Free trial started successfully! You get 50 AI messages and website embedding for 7 days."}

# ============ Plan Limits Config ============
PLAN_LIMITS = {
    "free": {
        "max_messages": 50,
        "features": ["website_embed"],
        "whatsapp": False,
        "voice_agent": False,
        "analytics": False,
        "knowledge_docs": 1,
        "max_twins": 1
    },
    "standard": {
        "max_messages": 2000,
        "features": ["website_embed", "analytics"],
        "whatsapp": False,
        "voice_agent": False,
        "analytics": True,
        "knowledge_docs": 10,
        "max_twins": 3
    },
    "business_pro": {
        "max_messages": -1,  # Unlimited
        "features": ["website_embed", "whatsapp", "voice_agent", "analytics", "priority_support"],
        "whatsapp": True,
        "voice_agent": True,
        "analytics": True,
        "knowledge_docs": 50,
        "max_twins": 10
    }
}

@router.get("/plan-limits")
async def get_plan_limits(
    current_user: Any = Depends(get_current_user)
):
    """Get current user's plan limits and usage"""
    plan = current_user.subscription_plan or "free"
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])
    
    return {
        "plan": plan,
        "message_count": current_user.message_count or 0,
        "max_messages": limits["max_messages"],
        "features": limits["features"],
        "has_used_trial": current_user.has_used_trial,
        "subscription_status": current_user.subscription_status,
        "expires_at": current_user.subscription_expires_at.isoformat() if current_user.subscription_expires_at else None
    }

