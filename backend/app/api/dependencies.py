from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Any, List, Optional
from datetime import datetime, timedelta
import pytz

from ..database import get_db
from ..models import User
from ..services import auth_service

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user."""
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def check_subscription_status(user: User):
    """Check if the user's subscription is valid and not expired."""
    # Free trial expiry check
    if user.subscription_plan == "free" and user.trial_started_at:
        # Check if 3 days have passed
        now = datetime.now(pytz.utc)
        trial_end = user.trial_started_at + timedelta(days=3)
        if now > trial_end:
            user.subscription_status = "expired"
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your free trial has expired. Please upgrade your plan."
            )
            
    if user.subscription_status == "expired":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your subscription has expired. Please upgrade your plan."
        )

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get current user and ensure they are active and subscription is valid."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    check_subscription_status(current_user)
    return current_user

class RequirePlan:
    """Dependency class to require specific subscription plans or features."""
    def __init__(self, allowed_plans: List[str], feature_name: Optional[str] = None):
        self.allowed_plans = allowed_plans
        self.feature_name = feature_name

    def __call__(self, user: User = Depends(get_current_active_user)):
        # Admin override
        if user.is_admin:
            return user
            
        # Admin custom feature override for the specific user
        if self.feature_name and user.custom_features:
            feature_status = user.custom_features.get(self.feature_name)
            if feature_status is True:
                return user
            elif feature_status is False:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access denied. This feature has been disabled by an administrator."
                )

        if user.subscription_plan not in self.allowed_plans:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Upgrade your plan to access this feature. Required plan(s): {', '.join(self.allowed_plans)}"
            )
        return user

def get_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Ensure current user is an admin."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user
