from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
import platform
from datetime import datetime

from ..database import get_db, engine
from ..models import User, ManualPayment, DigitalTwin, Business
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

