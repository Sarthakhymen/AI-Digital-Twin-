"""
Dashboard API Routes - Overview and summary data
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta
from ..database import get_db
from ..services import auth_service
from ..models import DigitalTwin, Conversation, User, Business

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
from .dependencies import get_current_active_user

@router.get("/")
def get_dashboard_overview(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard overview data"""
    # Get user's businesses
    businesses = db.query(Business).filter(Business.owner_id == current_user.id).all()
    business_ids = [b.id for b in businesses]
    
    # Get digital twins
    digital_twins = db.query(DigitalTwin).filter(
        DigitalTwin.business_id.in_(business_ids)
    ).all()
    
    # Get recent conversations (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_conversations = db.query(Conversation).join(DigitalTwin).filter(
        DigitalTwin.business_id.in_(business_ids),
        Conversation.created_at >= week_ago
    ).all()
    
    # Calculate stats
    total_conversations = len(recent_conversations)
    avg_satisfaction = 0
    if recent_conversations:
        scores = [c.satisfaction_score for c in recent_conversations if c.satisfaction_score]
        if scores:
            avg_satisfaction = sum(scores) / len(scores)
    
    # Recent activity
    recent_activity = []
    for conv in sorted(recent_conversations, key=lambda x: x.created_at, reverse=True)[:5]:
        recent_activity.append({
            "type": "conversation",
            "description": f"New conversation with {conv.customer_name or 'Unknown'}",
            "timestamp": conv.created_at,
            "digital_twin_id": conv.digital_twin_id
        })
    
    return {
        "stats": {
            "total_businesses": len(businesses),
            "total_digital_twins": len(digital_twins),
            "active_twins": len([t for t in digital_twins if t.status == "active"]),
            "weekly_conversations": total_conversations,
            "average_satisfaction": round(avg_satisfaction * 20, 1) if avg_satisfaction else 0  # Convert to percentage
        },
        "recent_activity": recent_activity,
        "digital_twins": [
            {
                "id": t.id,
                "name": t.name,
                "status": t.status,
                "business_id": t.business_id,
                "created_at": t.created_at
            }
            for t in digital_twins
        ]
    }

@router.get("/analytics/overview")
def get_analytics_overview(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get analytics overview for charts"""
    # Get user's businesses
    businesses = db.query(Business).filter(Business.owner_id == current_user.id).all()
    business_ids = [b.id for b in businesses]
    
    # Get conversations for last 30 days
    month_ago = datetime.utcnow() - timedelta(days=30)
    conversations = db.query(Conversation).join(DigitalTwin).filter(
        DigitalTwin.business_id.in_(business_ids),
        Conversation.created_at >= month_ago
    ).all()
    
    # Daily conversation data
    daily_data = {}
    for i in range(30):
        date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        daily_data[date] = {"conversations": 0, "satisfaction": 0, "count": 0}
    
    for conv in conversations:
        date = conv.created_at.strftime("%Y-%m-%d")
        if date in daily_data:
            daily_data[date]["conversations"] += 1
            if conv.satisfaction_score:
                daily_data[date]["satisfaction"] += conv.satisfaction_score
                daily_data[date]["count"] += 1
    
    # Format for chart
    conversation_data = [
        {
            "date": date,
            "conversations": data["conversations"],
            "satisfaction": round(data["satisfaction"] / data["count"], 1) if data["count"] > 0 else 0
        }
        for date, data in sorted(daily_data.items())
    ]
    
    # Channel breakdown
    channel_data = {}
    for conv in conversations:
        channel = conv.channel or "unknown"
        if channel not in channel_data:
            channel_data[channel] = 0
        channel_data[channel] += 1
    
    return {
        "conversation_trends": conversation_data,
        "channels": [
            {"name": name, "value": count}
            for name, count in channel_data.items()
        ]
    }
