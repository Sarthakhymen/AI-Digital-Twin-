"""
Pydantic Schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
import re

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def password_complexity(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError('Password must contain at least one special character (@$!%*?&)')
        return v

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleLogin(BaseModel):
    code: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    subscription_status: str
    trial_started_at: Optional[datetime] = None
    subscription_expires_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Business Schemas
class BusinessBase(BaseModel):
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class BusinessCreate(BusinessBase):
    pass

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class BusinessResponse(BusinessBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Digital Twin Schemas
class DigitalTwinBase(BaseModel):
    name: str
    description: Optional[str] = None
    personality_profile: Optional[Dict[str, Any]] = None
    communication_style: Optional[Dict[str, Any]] = None

class DigitalTwinCreate(DigitalTwinBase):
    business_id: int

class DigitalTwinUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    personality_profile: Optional[Dict[str, Any]] = None
    communication_style: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class DigitalTwinResponse(DigitalTwinBase):
    id: int
    status: str
    business_id: int
    voice_samples: Optional[List[Dict]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class VoiceSampleUpload(BaseModel):
    filename: str
    duration: int

# Conversation Schemas
class ConversationMessage(BaseModel):
    role: str  # user or assistant
    content: str
    timestamp: datetime

class ConversationBase(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    channel: str = "whatsapp"

class ConversationCreate(ConversationBase):
    digital_twin_id: int

class ConversationResponse(ConversationBase):
    id: int
    digital_twin_id: int
    messages: List[ConversationMessage]
    duration: Optional[int] = None
    satisfaction_score: Optional[float] = None
    status: str
    created_at: datetime
    ended_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
