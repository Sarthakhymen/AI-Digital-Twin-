"""
Authentication API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Any
from sqlalchemy.orm import Session
from ..database import get_db
from ..services import auth_service
from ..schemas import UserCreate, UserLogin, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Any = Depends(get_db)):
    """Register a new user"""
    existing_user = auth_service.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = auth_service.create_user(db, user_data)
    return user

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Any = Depends(get_db)):
    """Authenticate user and return JWT token"""
    user = auth_service.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = auth_service.create_access_token(data={"sub": user.email, "user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Any = Depends(get_db)
):
    """Get current authenticated user"""
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)
    return user

from .dependencies import get_current_active_user

@router.get("/features")
def get_user_features(current_user: Any = Depends(get_current_active_user)):
    """Get resolved user features based on subscription plan and admin overrides."""
    try:
        # Only allow paid features if status is active
        status = current_user.subscription_status
        plan = current_user.subscription_plan or "free"
        
        if status != "active" and plan != "free":
            # If payment is pending or expired, downgrade features to free
            base_features = PLAN_LIMITS["free"].copy()
            plan = "free" # Report as free for UI consistency
        else:
            base_features = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"]).copy()
    except ImportError:
        base_features = {}
        plan = current_user.subscription_plan or "free"
        
    custom_features = current_user.custom_features or {}
    
    resolved_features = {
        "plan": plan,
        "status": current_user.subscription_status,
        "max_twins": custom_features.get("max_twins", base_features.get("max_twins", 1)),
        "max_knowledge_files": custom_features.get("max_knowledge_files", base_features.get("max_knowledge_files", 5)),
        "max_messages": -1 if custom_features.get("unlimited_messages") else custom_features.get("max_messages", base_features.get("max_messages", 100)),
        "advanced_analytics": custom_features.get("advanced_analytics", base_features.get("advanced_analytics", False)),
        "voice_agent": custom_features.get("voice_agent", base_features.get("voice_agent", False)),
        "whatsapp": custom_features.get("whatsapp", base_features.get("whatsapp", False)),
        "api_access": custom_features.get("api_access", base_features.get("api_access", False))
    }

    
    return resolved_features

@router.post("/refresh", response_model=Token)
def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Any = Depends(get_db)
):
    """Refresh JWT token"""
    token = credentials.credentials
    new_token = auth_service.refresh_token(db, token)
    return new_token
