from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
import platform
from datetime import datetime

from ..database import get_db, engine
from ..models import User, ManualPayment, DigitalTwin, Business, ProWaitlist
from .auth import get_current_user
from ..schemas import UserResponse, DigitalTwinResponse
from pydantic import BaseModel, EmailStr
from datetime import timedelta

router = APIRouter(prefix="/admin", tags=["Admin"])

def check_admin(current_user: Any = Depends(get_current_user)):
    """Middleware to ensure only admins can access these routes"""
    # Specifically check for your email or is_admin flag
    if not current_user.is_admin and current_user.email not in ["sarthak2005shavarn@gmail.com", "nexora.aidigital.twin@gmail.com"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access the admin dashboard"
        )
    return current_user

@router.get("/status", response_model=None)
def get_system_status(db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """Get system and database status"""
    # DB Status
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception as e:
        print(f"DB Status Error: {e}")

    # System Stats (Imported inside to prevent startup failures on some environments)
    try:
        import psutil
        cpu_usage = psutil.cpu_percent()
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        sys_stats = {
            "platform": platform.system(),
            "cpu_usage": f"{cpu_usage}%",
            "memory_usage": f"{memory.percent}%",
            "disk_usage": f"{disk.percent}%"
        }
    except Exception:
        sys_stats = {
            "platform": platform.system(),
            "cpu_usage": "N/A",
            "memory_usage": "N/A",
            "disk_usage": "N/A"
        }

    return {
        "status": "healthy" if db_ok else "degraded",
        "database": {
            "connected": db_ok,
            "type": engine.name,
            "total_users": db.query(User).count(),
            "total_payments": db.query(ManualPayment).count(),
            "total_twins": db.query(DigitalTwin).count()
        },
        "system": sys_stats,
        "timestamp": datetime.utcnow()
    }

@router.get("/users", response_model=List[UserResponse])
def list_users(db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """List all registered users"""
    return db.query(User).all()

@router.post("/users/{user_id}/toggle-admin")
def toggle_user_admin(user_id: int, db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """Toggle admin status for a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_admin = not user.is_admin
    db.commit()
    return {"message": f"User admin status set to {user.is_admin}"}

class FeatureToggleRequest(BaseModel):
    feature_name: str
    feature_status: bool | None

@router.post("/users/{user_id}/features")
def toggle_user_feature(user_id: int, request: FeatureToggleRequest, db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """Toggle a specific feature for a user, overriding their base plan limits."""
    from sqlalchemy.orm.attributes import flag_modified
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    custom_features = user.custom_features or {}
    if request.feature_status is None:
        if request.feature_name in custom_features:
            del custom_features[request.feature_name]
    else:
        custom_features[request.feature_name] = request.feature_status
        
    user.custom_features = custom_features
    flag_modified(user, "custom_features")
    
    db.commit()
    return {"message": f"Feature '{request.feature_name}' updated successfully.", "custom_features": user.custom_features}

class SubscriptionUpdateRequest(BaseModel):
    subscription_plan: str
    subscription_status: str
    subscription_expires_at: datetime | None = None
    message_count: int | None = None

@router.post("/users/{user_id}/subscription")
def update_user_subscription(user_id: int, request: SubscriptionUpdateRequest, db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """Admin: Directly update subscription plan, status, message count, and expiration for a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.subscription_plan = request.subscription_plan
    user.subscription_status = request.subscription_status
    user.subscription_expires_at = request.subscription_expires_at
    if request.message_count is not None:
        user.message_count = request.message_count
        
    db.commit()
    return {
        "message": f"Subscription for user {user.email} updated successfully.",
        "subscription_plan": user.subscription_plan,
        "subscription_status": user.subscription_status,
        "subscription_expires_at": user.subscription_expires_at,
        "message_count": user.message_count
    }

@router.get("/payments")
def list_payments(db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """List all manual payments"""
    return db.query(ManualPayment).order_by(ManualPayment.created_at.desc()).all()

class PaymentVerification(BaseModel):
    transaction_id: str
    action: str  # 'verify' or 'reject'

@router.post("/payments/verify")
def verify_payment(verification: PaymentVerification, db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """Verify a manual payment and activate the user"""
    payment = db.query(ManualPayment).filter(ManualPayment.transaction_id == verification.transaction_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")
    
    if verification.action == "verify":
        payment.status = "verified"
        payment.verified_at = datetime.utcnow()
        
        # Activate user
        user = db.query(User).filter(User.email == payment.email).first()
        if user:
            user.subscription_plan = "pro"
            user.subscription_status = "active"
            # Set expiration to 30 days from now
            user.subscription_expires_at = datetime.utcnow() + timedelta(days=30)
            db.commit()
            return {"message": f"Payment verified. User {user.email} is now PRO."}
        else:
            db.commit()
            return {"message": "Payment verified but no matching user found for this email."}
    
    elif verification.action == "reject":
        payment.status = "rejected"
        # If user exists, reset their status
        user = db.query(User).filter(User.email == payment.email).first()
        if user and user.subscription_status == "pending_verification":
            user.subscription_status = "expired" # Or whatever appropriate
            
        db.commit()
        return {"message": "Payment rejected."}
    
    return {"message": "Invalid action."}

@router.get("/digital-twins", response_model=List[DigitalTwinResponse])
def list_all_twins(db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """List all digital twins across the platform"""
    return db.query(DigitalTwin).all()

@router.post("/db/execute")
def execute_raw_query(query: str, db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """Execute a raw SQL query (USE WITH EXTREME CAUTION)"""
    # Block dangerous keywords for minimal safety
    dangerous = ["DROP", "TRUNCATE", "DELETE", "UPDATE"]
    if any(word in query.upper() for word in dangerous) and admin_user.email not in ["sarthak2005shavarn@gmail.com", "nexora.aidigital.twin@gmail.com"]:
        raise HTTPException(status_code=403, detail="Destructive queries are restricted to the main owner.")

    try:
        result = db.execute(text(query))
        if query.strip().upper().startswith("SELECT"):
            # Format results as list of dicts
            return [dict(row._mapping) for row in result]
        else:
            db.commit()
            return {"message": "Query executed successfully", "rows_affected": result.rowcount}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/db/tables")
def list_tables(db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """List all tables in the database"""
    try:
        if engine.name == "sqlite":
            result = db.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        else:
            result = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public';"))
        return [row[0] for row in result if not row[0].startswith('sqlite_')]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============ Business Pro Waitlist ============

class WaitlistJoinRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str = ""
    business_name: str = ""
    message: str = ""

@router.post("/waitlist/join")
async def join_pro_waitlist(
    request: WaitlistJoinRequest,
    db: Any = Depends(get_db)
):
    """Public endpoint: Join the Business Pro waitlist queue"""
    # Check if already in waitlist
    existing = db.query(ProWaitlist).filter(ProWaitlist.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="You're already on the waitlist! We'll reach out soon.")
    
    entry = ProWaitlist(
        full_name=request.full_name,
        email=request.email,
        phone=request.phone,
        business_name=request.business_name,
        message=request.message,
        status="waiting"
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    
    return {"message": "You've been added to the Business Pro waitlist! We'll notify you when it launches."}

@router.get("/waitlist")
def list_waitlist(db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """Admin: List all waitlist entries"""
    entries = db.query(ProWaitlist).order_by(ProWaitlist.created_at.desc()).all()
    return [
        {
            "id": e.id,
            "full_name": e.full_name,
            "email": e.email,
            "phone": e.phone,
            "business_name": e.business_name,
            "message": e.message,
            "status": e.status,
            "created_at": e.created_at.isoformat() if e.created_at else None
        }
        for e in entries
    ]

class WaitlistStatusUpdate(BaseModel):
    status: str  # 'waiting', 'contacted', 'converted'

@router.put("/waitlist/{entry_id}")
def update_waitlist_status(entry_id: int, update: WaitlistStatusUpdate, db: Any = Depends(get_db), admin_user: Any = Depends(check_admin)):
    """Admin: Update waitlist entry status"""
    entry = db.query(ProWaitlist).filter(ProWaitlist.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Waitlist entry not found")
    
    entry.status = update.status
    db.commit()
    return {"message": f"Waitlist entry updated to '{update.status}'."}


