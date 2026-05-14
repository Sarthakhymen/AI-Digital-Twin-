"""
Digital Twin Management API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..services.auth_service import get_current_user
from ..services.digital_twin_service import digital_twin_service
from ..schemas import DigitalTwinCreate, DigitalTwinResponse, DigitalTwinUpdate, VoiceSampleUpload
from ..models import DigitalTwin, User, Business

router = APIRouter(prefix="/digital-twins", tags=["Digital Twins"])
security = HTTPBearer()

def get_current_user_dependency(
    credentials: HTTPBearer = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    return get_current_user(db, token)

@router.get("/", response_model=List[DigitalTwinResponse])
def get_digital_twins(
    business_id: Optional[int] = None,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get all digital twins for user or specific business"""
    query = db.query(DigitalTwin).join(Business).filter(Business.owner_id == current_user.id)
    
    if business_id:
        query = query.filter(DigitalTwin.business_id == business_id)
    
    digital_twins = query.all()
    return digital_twins

@router.post("/", response_model=DigitalTwinResponse, status_code=status.HTTP_201_CREATED)
def create_digital_twin(
    twin_data: DigitalTwinCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Create a new digital twin"""
    # Check subscription status
    if current_user.subscription_status == "expired":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your subscription has expired. Please upgrade to Pro to create more digital twins."
        )
    
    # Verify business ownership
    business = db.query(Business).filter(
        Business.id == twin_data.business_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    digital_twin = DigitalTwin(
        name=twin_data.name,
        description=twin_data.description,
        personality_profile=twin_data.personality_profile,
        communication_style=twin_data.communication_style,
        business_id=twin_data.business_id,
        status="training"
    )
    
    db.add(digital_twin)
    db.commit()
    db.refresh(digital_twin)
    
    # Start training process
    digital_twin_service.start_training(db, digital_twin.id)
    
    return digital_twin

@router.get("/{twin_id}", response_model=DigitalTwinResponse)
def get_digital_twin(
    twin_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get a specific digital twin"""
    digital_twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not digital_twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    return digital_twin

@router.put("/{twin_id}", response_model=DigitalTwinResponse)
def update_digital_twin(
    twin_id: int,
    twin_data: DigitalTwinUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Update a digital twin"""
    digital_twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not digital_twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    # Check subscription status
    if current_user.subscription_status == "expired":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your subscription has expired. Please upgrade to Pro to update digital twins."
        )
    
    for key, value in twin_data.dict(exclude_unset=True).items():
        setattr(digital_twin, key, value)
    
    db.commit()
    db.refresh(digital_twin)
    return digital_twin

@router.post("/{twin_id}/voice-samples")
def upload_voice_sample(
    twin_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Upload voice sample for digital twin training"""
    digital_twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not digital_twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    # Check subscription status
    if current_user.subscription_status == "expired":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your subscription has expired. Please upgrade to Pro to upload voice samples."
        )
    
    result = digital_twin_service.process_voice_sample(db, twin_id, file)
    return result

@router.post("/{twin_id}/activate")
def activate_digital_twin(
    twin_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Activate a trained digital twin"""
    digital_twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not digital_twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    # Check subscription status
    if current_user.subscription_status == "expired":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your subscription has expired. Please upgrade to Pro to activate digital twins."
        )
    
    # In MVP, allow activation from training state
    # if digital_twin.status != "trained":
    #     raise HTTPException(status_code=400, detail="Digital twin must be trained before activation")
    
    digital_twin.status = "active"
    db.commit()
    
    return {"message": "Digital twin activated successfully", "status": "active"}

@router.delete("/{twin_id}")
def delete_digital_twin(
    twin_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Delete a digital twin"""
    digital_twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not digital_twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    db.delete(digital_twin)
    db.commit()
    return {"message": "Digital twin deleted successfully"}
