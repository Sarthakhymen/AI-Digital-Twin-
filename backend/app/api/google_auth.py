import os
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
import httpx
from ..database import get_db
from ..services import auth_service
from ..models import User
from ..schemas import GoogleLogin, Token

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

@router.post("/google", response_model=Token)
async def google_auth_frontend(data: GoogleLogin, db: Session = Depends(get_db)):
    """Handle Google OAuth from frontend (exchanging code for token)"""
    try:
        # 1. Exchange code for tokens using async httpx
        token_endpoint = "https://oauth2.googleapis.com/token"
        payload = {
            "code": data.code,
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_endpoint, data=payload)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to exchange code: {response.text}")
                
            token_data = response.json()
            google_access_token = token_data.get("access_token")
            
            # 2. Get user info using the access token
            userinfo_endpoint = "https://www.googleapis.com/oauth2/v3/userinfo"
            userinfo_response = await client.get(userinfo_endpoint, headers={"Authorization": f"Bearer {google_access_token}"})
            
            if userinfo_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info from Google")
                
            user_info = userinfo_response.json()
        
        # 3. Handle user creation/update
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
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except Exception as e:
        print(f"Error in google_auth_frontend: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Google auth failed: {str(e)}")

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
