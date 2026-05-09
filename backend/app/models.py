"""
SQLAlchemy Models for AI Digital Twin Creator
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(50))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    businesses = relationship("Business", back_populates="owner", cascade="all, delete-orphan")

class Business(Base):
    __tablename__ = "businesses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    industry = Column(String(100))
    website = Column(String(255))
    phone = Column(String(50))
    email = Column(String(255))
    address = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="businesses")
    digital_twins = relationship("DigitalTwin", back_populates="business", cascade="all, delete-orphan")

class DigitalTwin(Base):
    __tablename__ = "digital_twins"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="training")  # training, active, paused, archived
    personality_profile = Column(JSON)
    communication_style = Column(JSON)
    voice_samples = Column(JSON)  # Array of voice sample metadata
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    business = relationship("Business", back_populates="digital_twins")
    conversations = relationship("Conversation", back_populates="digital_twin", cascade="all, delete-orphan")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    digital_twin_id = Column(Integer, ForeignKey("digital_twins.id"), nullable=False)
    customer_name = Column(String(255))
    customer_phone = Column(String(50))
    channel = Column(String(50))  # whatsapp, phone, email
    messages = Column(JSON)  # Array of message objects
    duration = Column(Integer)  # Duration in seconds
    satisfaction_score = Column(Float)
    status = Column(String(50), default="active")  # active, completed, escalated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    
    # Relationships
    digital_twin = relationship("DigitalTwin", back_populates="conversations")
