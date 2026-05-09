"""
OAuth Service for handling third-party authentication
"""
from sqlalchemy.orm import Session
from ..models import User
from passlib.context import CryptContext
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_oauth_user(db: Session, user_data: dict) -> User:
    """Create a new user from OAuth provider"""
    # Generate random password for OAuth users (they won't use it)
    random_password = secrets.token_urlsafe(32)
    hashed_password = pwd_context.hash(random_password)
    
    db_user = User(
        email=user_data["email"],
        full_name=user_data.get("full_name"),
        hashed_password=hashed_password,
        oauth_provider=user_data.get("oauth_provider"),
        oauth_id=user_data.get("oauth_id"),
        profile_picture=user_data.get("profile_picture"),
        is_verified=user_data.get("is_verified", True),
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_oauth(db: Session, provider: str, oauth_id: str) -> User:
    """Get user by OAuth provider and ID"""
    return db.query(User).filter(
        User.oauth_provider == provider,
        User.oauth_id == oauth_id
    ).first()

def link_oauth_account(db: Session, user: User, provider: str, oauth_id: str, profile_picture: str = None):
    """Link OAuth account to existing user"""
    user.oauth_provider = provider
    user.oauth_id = oauth_id
    if profile_picture:
        user.profile_picture = profile_picture
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user
