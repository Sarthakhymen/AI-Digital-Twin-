"""
Analytics API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models import DigitalTwin, Conversation, User, Business
from .dependencies import RequirePlan, get_current_active_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/conversations")
def get_conversation_analytics(
    twin_id: Optional[int] = None,
    days: int = 30,
    current_user: User = Depends(RequirePlan(["business_pro"], feature_name="analytics")),
    db: Session = Depends(get_db)
):
    """Get conversation analytics slice"""
        
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = db.query(Conversation).join(DigitalTwin).join(Business).filter(
        Business.owner_id == current_user.id,
        Conversation.created_at >= start_date
    )
    
    if twin_id:
        query = query.filter(Conversation.digital_twin_id == twin_id)
    
    conversations = query.all()
    
    # Calculate metrics
    total_conversations = len(conversations)
    avg_duration = sum([c.duration or 0 for c in conversations]) / total_conversations if total_conversations > 0 else 0
    
    # Group by date for trends
    daily_stats = {}
    for conv in conversations:
        date_key = conv.created_at.strftime("%Y-%m-%d")
        if date_key not in daily_stats:
            daily_stats[date_key] = {"conversations": 0, "messages": 0}
        daily_stats[date_key]["conversations"] += 1
        daily_stats[date_key]["messages"] += len(conv.messages) if conv.messages else 0
    
    trends = [
        {"date": date, **stats}
        for date, stats in sorted(daily_stats.items())
    ]
    
    return {
        "total_conversations": total_conversations,
        "average_duration": round(avg_duration, 2),
        "trends": trends
    }

@router.get("/performance")
def get_performance_analytics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get performance analytics for all digital twins"""
    # Check subscription status
    if current_user.subscription_status == "expired":
        raise HTTPException(status_code=403, detail="Subscription expired. Please upgrade to Pro to view analytics.")
        
    # Get all digital twins for user
    digital_twins = db.query(DigitalTwin).join(Business).filter(
        Business.owner_id == current_user.id
    ).all()
    
    twin_performance = []
    for twin in digital_twins:
        conversations = db.query(Conversation).filter(
            Conversation.digital_twin_id == twin.id
        ).all()
        
        total_convos = len(conversations)
        satisfaction_scores = [c.satisfaction_score for c in conversations if c.satisfaction_score]
        avg_satisfaction = sum(satisfaction_scores) / len(satisfaction_scores) if satisfaction_scores else 0
        
        twin_performance.append({
            "twin_id": twin.id,
            "twin_name": twin.name,
            "total_conversations": total_convos,
            "average_satisfaction": round(avg_satisfaction, 2),
            "status": twin.status
        })
    
    return {
        "digital_twins": twin_performance,
        "summary": {
            "total_twins": len(digital_twins),
            "active_twins": len([t for t in digital_twins if t.status == "active"]),
            "total_conversations": sum([p["total_conversations"] for p in twin_performance])
        }
    }

@router.get("/channels")
def get_channel_analytics(
    days: int = 30,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get conversation breakdown by channel slice"""
    # Check subscription status
    if current_user.subscription_status == "expired":
        raise HTTPException(status_code=403, detail="Subscription expired. Please upgrade to Pro to view analytics.")
        
    start_date = datetime.utcnow() - timedelta(days=days)
    
    channels = db.query(
        Conversation.channel,
        func.count(Conversation.id).label("conversation_count"),
        func.avg(Conversation.duration).label("avg_duration")
    ).join(DigitalTwin).join(Business).filter(
        Business.owner_id == current_user.id,
        Conversation.created_at >= start_date
    ).group_by(Conversation.channel).all()
    
    return {
        "channels": [
            {
                "channel": channel[0],
                "conversations": channel[1],
                "average_duration": round(channel[2] or 0, 2)
            }
            for channel in channels
        ]
    }
