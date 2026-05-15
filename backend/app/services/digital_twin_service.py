"""
Digital Twin Service
Handles business logic for digital twin operations
"""
from typing import Dict, Any
import json
import os
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from ..models import DigitalTwin, Business
from ..ai import training_service

class DigitalTwinService:
    """Service for managing digital twins"""
    
    def start_training(self, db: Session, twin_id: int) -> Dict[str, Any]:
        """Start the training process for a digital twin"""
        digital_twin = db.query(DigitalTwin).filter(DigitalTwin.id == twin_id).first()
        if not digital_twin:
            return {"success": False, "error": "Digital twin not found"}
        
        # In production, this would trigger an async job
        # For MVP, we'll simulate the training process
        digital_twin.status = "training"
        db.commit()
        
        return {
            "success": True,
            "message": "Training started",
            "twin_id": twin_id,
            "status": "training"
        }
    
    def process_voice_sample(self, db: Session, twin_id: int, file) -> Dict[str, Any]:
        """Process uploaded voice sample"""
        digital_twin = db.query(DigitalTwin).filter(DigitalTwin.id == twin_id).first()
        if not digital_twin:
            return {"success": False, "error": "Digital twin not found"}
        
        # Ensure directory exists
        os.makedirs("uploads/voice_samples", exist_ok=True)
        
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join("uploads/voice_samples", unique_filename)
        
        # Read file content and save
        content = file.file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Store voice sample metadata
        voice_samples = digital_twin.voice_samples or []
        sample_data = {
            "id": str(uuid.uuid4()),
            "filename": file.filename,
            "url": f"/uploads/voice_samples/{unique_filename}",
            "content_type": file.content_type,
            "size": len(content),
            "uploaded_at": str(datetime.utcnow())
        }
        
        # Update JSON field (need to handle list mutation for SQLAlchemy)
        new_samples = list(voice_samples)
        new_samples.append(sample_data)
        digital_twin.voice_samples = new_samples
        flag_modified(digital_twin, "voice_samples")
        
        db.commit()
        db.refresh(digital_twin)
        
        return {
            "success": True,
            "message": "Voice sample uploaded successfully",
            "sample": sample_data
        }
    
    async def train_with_ai(self, db: Session, twin_id: int) -> Dict[str, Any]:
        """Train digital twin using AI services"""
        digital_twin = db.query(DigitalTwin).join(Business).filter(
            DigitalTwin.id == twin_id
        ).first()
        
        if not digital_twin:
            return {"success": False, "error": "Digital twin not found"}
        
        # Get business description for context
        business_description = digital_twin.business.description or ""
        
        # Process voice samples with AI
        voice_samples = digital_twin.voice_samples or []
        if voice_samples:
            # In production, this would call Modal.com functions
            training_result = await training_service.train_from_voice_samples(
                voice_samples=voice_samples,
                business_description=business_description
            )
            
            if training_result.get("success"):
                # Update digital twin with generated profile
                digital_twin.personality_profile = training_result.get("personality_profile", {})
                digital_twin.communication_style = training_result.get("communication_style", {})
                digital_twin.status = "trained"
                db.commit()
                
                return {
                    "success": True,
                    "message": "Training completed successfully",
                    "profile": digital_twin.personality_profile
                }
        
        return {"success": False, "error": "Training failed"}

# Singleton instance
digital_twin_service = DigitalTwinService()
