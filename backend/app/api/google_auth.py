"""
Google OAuth Authentication Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
import requests
from ..database import get_db
from ..services import auth_service
from ..models import User

router = APIRouter(prefix="/auth", tags=["Google OAuth"])

# Google OAuth Configuration
config = Config(environ={
    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
    "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET")
})

oauth = OAuth(config)
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@router.get("/google")
async def google_login():
    """Initiate Google OAuth login"""
    redirect_uri = "http://localhost:8000/api/v1/auth/google/callback"
    return await oauth.google.authorize_redirect(redirect_uri)

@router.get("/google/callback")
async def google_auth_callback(request: Request, db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        # Extract user information
        email = user_info.get('email')
        name = user_info.get('name')
        google_id = user_info.get('sub')
        picture = user_info.get('picture')
        
        if not email:
            raise HTTPException(status_code=400, detail="Could not get email from Google")
        
        # Check if user exists
        user = auth_service.get_user_by_email(db, email)
        
        if not user:
            # Create new user
            user_data = {
                "email": email,
                "full_name": name,
                "oauth_provider": "google",
                "oauth_id": google_id,
                "profile_picture": picture,
                "is_verified": True
            }
            user = auth_service.create_oauth_user(db, user_data)
        else:
            # Update existing user's OAuth info
            if not user.oauth_provider:
                user.oauth_provider = "google"
                user.oauth_id = google_id
                user.profile_picture = picture
                user.is_verified = True
                db.commit()
        
        # Create JWT token
        access_token = auth_service.create_access_token(data={"sub": user.email, "user_id": user.id})
        
        # Redirect to frontend with token
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        redirect_url = f"{frontend_url}/auth/callback?token={access_token}"
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google auth failed: {str(e)}")
