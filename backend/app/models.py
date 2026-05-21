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
    hashed_password = Column(String(255), nullable=True)  # Nullable for OAuth users
    full_name = Column(String(255))
    phone = Column(String(50))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    oauth_provider = Column(String(50))  # 'google', 'microsoft', etc.
    oauth_id = Column(String(255))  # Provider's user ID
    profile_picture = Column(String(500))  # URL to profile image
    subscription_plan = Column(String(50), default="free")  # free, standard, business_pro
    subscription_status = Column(String(50), default="active")  # active, expired, pending_verification
    has_used_trial = Column(Boolean, default=False)  # Prevent repeat free trials
    trial_started_at = Column(DateTime(timezone=True))
    subscription_expires_at = Column(DateTime(timezone=True))
    message_count = Column(Integer, default=0)  # Track messages per billing cycle
    custom_features = Column(JSON, default=dict)  # Admin-overridden features mapping
    preferences = Column(JSON, default=lambda: {"conversation_summaries": False})
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
    knowledge_documents = relationship("KnowledgeDocument", back_populates="digital_twin", cascade="all, delete-orphan")
    leads = relationship("LeadCapture", back_populates="digital_twin", cascade="all, delete-orphan")
    daily_summaries = relationship("DailySummary", back_populates="digital_twin", cascade="all, delete-orphan")

    @property
    def widget_token(self) -> str:
        import hashlib
        from .services.auth_service import SECRET_KEY
        twin_id = self.id or 0
        return hashlib.sha256(f"{SECRET_KEY}-{twin_id}".encode()).hexdigest()[:16]

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

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    digital_twin_id = Column(Integer, ForeignKey("digital_twins.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), default="pdf")  # pdf, txt, etc.
    file_size = Column(Integer, default=0)  # bytes
    chunk_count = Column(Integer, default=0)
    status = Column(String(50), default="processing")  # processing, ready, error
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    digital_twin = relationship("DigitalTwin", back_populates="knowledge_documents")
    chunks = relationship("KnowledgeChunk", back_populates="document", cascade="all, delete-orphan")

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("knowledge_documents.id"), nullable=False)
    digital_twin_id = Column(Integer, ForeignKey("digital_twins.id"), nullable=False)
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    document = relationship("KnowledgeDocument", back_populates="chunks")

class ManualPayment(Base):
    __tablename__ = "manual_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    email = Column(String(255), nullable=False)
    transaction_id = Column(String(100), nullable=False, unique=True)
    amount = Column(Float, default=0.0)
    status = Column(String(50), default="pending")  # pending, verified, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    verified_at = Column(DateTime(timezone=True))

class ProWaitlist(Base):
    __tablename__ = "pro_waitlist"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(50))
    business_name = Column(String(255))
    message = Column(Text)
    status = Column(String(50), default="waiting")  # waiting, contacted, converted
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LeadCapture(Base):
    """Stores leads (emails) captured from the embedded chat widget"""
    __tablename__ = "lead_captures"
    
    id = Column(Integer, primary_key=True, index=True)
    digital_twin_id = Column(Integer, ForeignKey("digital_twins.id"), nullable=False)
    name = Column(String(255))
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    message = Column(Text)  # Optional initial message from widget
    source = Column(String(100), default="web_widget")  # web_widget, whatsapp, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    digital_twin = relationship("DigitalTwin", back_populates="leads")


class DailySummary(Base):
    __tablename__ = "daily_summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    digital_twin_id = Column(Integer, ForeignKey("digital_twins.id"), nullable=False)
    summary_date = Column(String(10), nullable=False)  # YYYY-MM-DD
    content = Column(Text, nullable=False)  # Markdown text summaries
    conversation_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    digital_twin = relationship("DigitalTwin", back_populates="daily_summaries")


