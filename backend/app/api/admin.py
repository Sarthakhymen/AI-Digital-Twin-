from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
import psutil
import platform
from datetime import datetime

from ..database import get_db, engine
from ..models import User, ManualPayment, DigitalTwin, Business
from ..services.auth_service import get_current_user
from ..schemas import UserResponse, DigitalTwinResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

def check_admin(current_user: User = Depends(get_current_user)):
    """Middleware to ensure only admins can access these routes"""
    # Specifically check for your email or is_admin flag
    if not current_user.is_admin and current_user.email != "nexora.aidigital.twin@gmail.com":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access the admin dashboard"
        )
    return current_user

@router.get("/status")
def get_system_status(db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    """Get system and database status"""
    # DB Status
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception as e:
        print(f"DB Status Error: {e}")

    # System Stats
    cpu_usage = psutil.cpu_percent()
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')

    return {
        "status": "healthy" if db_ok else "degraded",
        "database": {
            "connected": db_ok,
            "type": engine.name,
            "total_users": db.query(User).count(),
            "total_payments": db.query(ManualPayment).count(),
            "total_twins": db.query(DigitalTwin).count()
        },
        "system": {
            "platform": platform.system(),
            "cpu_usage": f"{cpu_usage}%",
            "memory_usage": f"{memory.percent}%",
            "disk_usage": f"{disk.percent}%",
            "uptime": "N/A" # In a real app we'd track this
        },
        "timestamp": datetime.utcnow()
    }

@router.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    """List all registered users"""
    return db.query(User).all()

@router.post("/users/{user_id}/toggle-admin")
def toggle_user_admin(user_id: int, db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    """Toggle admin status for a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_admin = not user.is_admin
    db.commit()
    return {"message": f"User admin status set to {user.is_admin}"}

@router.get("/payments")
def list_payments(db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    """List all manual payments"""
    return db.query(ManualPayment).order_by(ManualPayment.created_at.desc()).all()

@router.get("/digital-twins", response_model=List[DigitalTwinResponse])
def list_all_twins(db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    """List all digital twins across the platform"""
    return db.query(DigitalTwin).all()

@router.post("/db/execute")
def execute_raw_query(query: str, db: Session = Depends(get_db), admin: User = Depends(check_admin)):
    """Execute a raw SQL query (USE WITH EXTREME CAUTION)"""
    # Block dangerous keywords for minimal safety
    dangerous = ["DROP", "TRUNCATE", "DELETE", "UPDATE"]
    if any(word in query.upper() for word in dangerous) and admin.email != "nexora.aidigital.twin@gmail.com":
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
