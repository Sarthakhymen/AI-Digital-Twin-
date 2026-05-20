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
import razorpay
import hmac
import hashlib

router = APIRouter(prefix="/payments", tags=["Payments"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")

DODO_API_KEY = os.getenv("DODO_PAYMENTS_API_KEY", "")
# Allow explicit override via env, otherwise detect from key prefix
if os.getenv("DODO_BASE_URL"):
    DODO_BASE_URL = os.getenv("DODO_BASE_URL")
elif DODO_API_KEY and DODO_API_KEY.startswith("live_"):
    DODO_BASE_URL = "https://live.dodopayments.com"
else:
    # Default to test for safety (covers test_ prefix and unknown prefixes)
    DODO_BASE_URL = "https://test.dodopayments.com"

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


# Razorpay Request Models
class RazorpayOrderRequest(BaseModel):
    plan_type: str

class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan_type: str

# Razorpay pricing mapping in Paisa (₹1 = 100 Paisa)
RAZORPAY_PRICES = {
    "standard": 200,         # ₹2 (for testing)
    "business_pro": 399900     # ₹3999
}

@router.post("/razorpay/create-order")
async def create_razorpay_order(
    request: RazorpayOrderRequest,
    current_user: Any = Depends(get_current_user),
    db: Any = Depends(get_db)
):
    """Create a Razorpay order"""
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay API keys not configured")

    plan_type = request.plan_type.lower()
    amount_paisa = RAZORPAY_PRICES.get(plan_type)
    
    if not amount_paisa:
        raise HTTPException(status_code=400, detail=f"Invalid plan type: {request.plan_type}")

    try:
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        
        # Unique receipt id
        receipt_id = f"rcpt_{current_user.id}_{int(datetime.utcnow().timestamp())}"
        
        order_payload = {
            "amount": amount_paisa,
            "currency": "INR",
            "receipt": receipt_id,
            "notes": {
                "user_id": str(current_user.id),
                "plan_type": plan_type,
                "email": current_user.email
            }
        }
        
        order = client.order.create(data=order_payload)
        
        return {
            "order_id": order.get("id"),
            "amount": order.get("amount"),
            "currency": order.get("currency"),
            "key_id": RAZORPAY_KEY_ID,
            "user": {
                "name": current_user.full_name or "Valued Customer",
                "email": current_user.email,
                "phone": current_user.phone or ""
            }
        }
    except Exception as e:
        print(f"[Razorpay] Order creation exception: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to initiate transaction: {str(e)}")

@router.post("/razorpay/verify")
async def verify_razorpay_payment(
    request: RazorpayVerifyRequest,
    db: Any = Depends(get_db)
):
    """Verify Razorpay payment signature and activate plan"""
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay API keys not configured")

    try:
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        
        # Verify payment signature
        client.utility.verify_payment_signature({
            "razorpay_order_id": request.razorpay_order_id,
            "razorpay_payment_id": request.razorpay_payment_id,
            "razorpay_signature": request.razorpay_signature
        })
        
        # Securely retrieve order details to find user ID and plan type
        order_details = client.order.fetch(request.razorpay_order_id)
        notes = order_details.get("notes", {})
        user_id = notes.get("user_id")
        plan_type = notes.get("plan_type") or request.plan_type.lower()
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User metadata not found in order")
            
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        # Upgrade subscription plan
        user.subscription_plan = plan_type
        user.subscription_status = "active"
        
        from datetime import datetime, timedelta
        user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)
        
        db.commit()
        
        return {"status": "success", "message": f"Subscription activated successfully for {plan_type} plan."}
        
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Payment verification failed: Invalid signature")
    except Exception as e:
        print(f"[Razorpay] Verification exception: {e}")
        raise HTTPException(status_code=500, detail=f"Payment verification error: {str(e)}")

@router.post("/razorpay-webhook")
async def razorpay_webhook_endpoint(
    request: Request,
    x_razorpay_signature: str = Header(None, alias="X-Razorpay-Signature"),
    db: Any = Depends(get_db)
):
    """Handle Razorpay Webhook Events"""
    body = await request.body()
    body_str = body.decode("utf-8")
    
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing signature header")
        
    # Verify signature
    if RAZORPAY_WEBHOOK_SECRET:
        try:
            client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
            client.utility.verify_webhook_signature(
                body_str,
                x_razorpay_signature,
                RAZORPAY_WEBHOOK_SECRET
            )
        except Exception as e:
            print(f"[Razorpay Webhook] Signature verification failed: {e}")
            raise HTTPException(status_code=400, detail="Invalid webhook signature")
            
    payload = await request.json()
    event = payload.get("event")
    
    if event in ("order.paid", "payment.captured"):
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        
        if order_id:
            try:
                # Fetch order details to get metadata securely
                client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
                order_details = client.order.fetch(order_id)
                notes = order_details.get("notes", {})
                user_id = notes.get("user_id")
                plan_type = notes.get("plan_type", "standard")
                
                if user_id:
                    user = db.query(User).filter(User.id == int(user_id)).first()
                    if user and user.subscription_plan != plan_type:
                        user.subscription_plan = plan_type
                        user.subscription_status = "active"
                        
                        from datetime import datetime, timedelta
                        user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)
                        
                        db.commit()
                        print(f"✅ Webhook payment captured: Upgraded user {user_id} to {plan_type}")
            except Exception as e:
                print(f"[Razorpay Webhook] Error processing event: {e}")
                
    return {"status": "success"}





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

    frontend_url = os.getenv("FRONTEND_URL", "https://ai-digital-twin-seven.vercel.app").rstrip("/")

    payload = {
        "product_cart": [
            {
                "product_id": product_id,
                "quantity": 1
            }
        ],
        "return_url": f"{frontend_url}/dashboard?payment=success",
        "customer": {
            "email": current_user.email,
            "name": current_user.full_name or "Valued Customer"
        },
        "metadata": {
            "user_id": str(current_user.id),
            "plan_type": request.plan_type
        }
    }

    print(f"[Dodo] Creating checkout session: user={current_user.email} product={product_id} base={DODO_BASE_URL}")

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f"{DODO_BASE_URL}/checkouts",
                json=payload,
                headers={
                    "Authorization": f"Bearer {DODO_API_KEY}",
                    "Content-Type": "application/json"
                }
            )

            print(f"[Dodo] Response: status={response.status_code} body={response.text[:500]}")

            if response.status_code not in (200, 201):
                err_detail = "Failed to create checkout"
                try:
                    err = response.json()
                    err_detail = err.get("message") or err.get("error") or str(err)
                except Exception:
                    err_detail = response.text[:200]
                raise HTTPException(status_code=response.status_code, detail=err_detail)

            data = response.json()
            checkout_url = data.get("payment_link") or data.get("checkout_url") or data.get("url")

            if not checkout_url:
                print(f"[Dodo] No checkout URL in response: {data}")
                raise HTTPException(status_code=502, detail="Payment gateway returned no URL")

            return {"checkout_url": checkout_url}

        except HTTPException:
            raise
        except Exception as e:
            print(f"[Dodo] Exception: {type(e).__name__}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")

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
    current_user.subscription_expires_at = datetime.utcnow() + timedelta(days=3)
    current_user.has_used_trial = True
    current_user.message_count = 0  # Reset message count
    
    db.commit()
    return {"message": "Free trial started successfully! You get 50 AI messages and website embedding for 3 days."}

# ============ Plan Limits Config ============
PLAN_LIMITS = {
    "free": {
        "max_messages": 50,
        "features": ["website_embed"],
        "whatsapp": False,
        "whatsapp_basic": False,
        "voice_agent": False,
        "analytics": False,
        "custom_colors": False,
        "lead_generation": False,
        "url_scraping": False,
        "knowledge_docs": 1,
        "max_twins": 1
    },
    "standard": {
        "max_messages": -1, # Unlimited
        "features": ["website_embed", "custom_colors", "lead_generation", "url_scraping"],
        "whatsapp": False,        # Moved to Pro
        "whatsapp_basic": False,  # Moved to Pro
        "voice_agent": False,
        "analytics": False,
        "custom_colors": True,
        "lead_generation": True,
        "url_scraping": True,
        "knowledge_docs": 10,
        "max_twins": 3
    },
    "business_pro": {
        "max_messages": -1,  # Unlimited
        "features": ["website_embed", "custom_colors", "lead_generation", "url_scraping", "whatsapp", "whatsapp_advanced", "voice_agent", "analytics", "priority_support"],
        "whatsapp": True,
        "whatsapp_basic": True,
        "whatsapp_advanced": True,  # Full WhatsApp: meeting scheduling, table booking, etc.
        "voice_agent": True,
        "analytics": True,
        "advanced_analytics": True,
        "custom_colors": True,
        "lead_generation": True,
        "url_scraping": True,
        "knowledge_docs": 50,
        "max_twins": 10
    }
}

# Plan aliases
PLAN_LIMITS["starter"] = PLAN_LIMITS["free"]
PLAN_LIMITS["pro"] = PLAN_LIMITS["business_pro"]

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

