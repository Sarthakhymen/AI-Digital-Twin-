"""
Business Management API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..services import auth_service
from ..schemas import BusinessCreate, BusinessResponse, BusinessUpdate
from ..models import Business, User

router = APIRouter(prefix="/businesses", tags=["Businesses"])
security = HTTPBearer()

def get_current_user_dependency(
    credentials: HTTPBearer = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    return auth_service.get_current_user(db, token)

@router.get("/", response_model=List[BusinessResponse])
def get_businesses(
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get all businesses for current user"""
    businesses = db.query(Business).filter(Business.owner_id == current_user.id).all()
    return businesses

@router.post("/", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
def create_business(
    business_data: BusinessCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Create a new business"""
    business = Business(
        name=business_data.name,
        description=business_data.description,
        industry=business_data.industry,
        website=business_data.website,
        phone=business_data.phone,
        email=business_data.email,
        owner_id=current_user.id
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return business

@router.get("/{business_id}", response_model=BusinessResponse)
def get_business(
    business_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get a specific business by ID"""
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    return business

@router.put("/{business_id}", response_model=BusinessResponse)
def update_business(
    business_id: int,
    business_data: BusinessUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Update a business"""
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    for key, value in business_data.dict(exclude_unset=True).items():
        setattr(business, key, value)
    
    db.commit()
    db.refresh(business)
    return business

@router.delete("/{business_id}")
def delete_business(
    business_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Delete a business"""
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    db.delete(business)
    db.commit()
    return {"message": "Business deleted successfully"}
