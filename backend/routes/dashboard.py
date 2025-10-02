# backend/routes/dashboard.py
from fastapi import APIRouter, Depends, HTTPException
from backend.auth import get_current_user
from backend.database import interviews_collection, users_collection
from datetime import datetime, timedelta
from typing import Dict, Any

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# Utility to safely convert ObjectId to string
def serialize_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


@router.get("/stats")
def get_dashboard_stats(user: str = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Get dashboard statistics for the authenticated user
    Returns: total interviews, average score, interviews this week
    """
    
    # Get all interviews for this user (user is now clerkId)
    all_interviews = list(interviews_collection.find({"clerkId": user}))
    
    # Calculate total interviews
    total_interviews = len(all_interviews)
    
    # Calculate average confidence score
    confidence_scores = [
        interview.get("average_confidence", 0) 
        for interview in all_interviews 
        if interview.get("average_confidence")
    ]
    average_confidence = round(sum(confidence_scores) / len(confidence_scores) * 100, 1) if confidence_scores else 0
    
    # Calculate interviews this week
    one_week_ago = datetime.now() - timedelta(days=7)
    this_week = sum(
        1 for interview in all_interviews
        if datetime.fromisoformat(interview.get("date", datetime.now().isoformat())) > one_week_ago
    )
    
    # Calculate average focus score
    focus_scores = [
        interview.get("average_focus", 0)
        for interview in all_interviews
        if interview.get("average_focus")
    ]
    average_focus = round(sum(focus_scores) / len(focus_scores) * 100, 1) if focus_scores else 0
    
    # Calculate coding accuracy
    coding_attempts = 0
    coding_solved = 0
    for interview in all_interviews:
        feedback = interview.get("feedback", {})
        if "coding" in feedback:
            coding_data = feedback["coding"]
            if isinstance(coding_data, dict):
                coding_attempts += coding_data.get("attempted", 0)
                coding_solved += coding_data.get("solved", 0)
    
    coding_accuracy = round((coding_solved / coding_attempts * 100), 1) if coding_attempts > 0 else 0
    
    # Get most recent interview
    recent_interview = None
    last_active = None
    if all_interviews:
        sorted_interviews = sorted(
            all_interviews,
            key=lambda x: datetime.fromisoformat(x.get("date", datetime.now().isoformat())),
            reverse=True
        )
        recent = sorted_interviews[0]
        last_active = recent.get("date")
        recent_interview = {
            "role": recent.get("role"),
            "date": recent.get("date"),
            "confidence": round(recent.get("average_confidence", 0) * 100, 1)
        }
    
    return {
        "totalInterviews": total_interviews,
        "avgConfidence": average_confidence,
        "averageScore": average_confidence,  # Alias for compatibility
        "thisWeek": this_week,
        "averageFocus": average_focus,
        "codingAccuracy": coding_accuracy,
        "lastActive": last_active,
        "recentInterview": recent_interview
    }


@router.get("/performance")
def get_performance(user: str = Depends(get_current_user)):
    """Return performance grouped by category (Technical, HR, Coding)"""
    interviews = list(interviews_collection.find({"userId": user}))
    
    categories = {"technical": [], "behavioral": [], "coding": []}
    
    for interview in interviews:
        feedback = interview.get("feedback", {})
        mode = interview.get("mode", "custom")
        
        # Get scores from feedback
        if "technical" in feedback:
            tech_score = feedback["technical"].get("overall_score", 0)
            categories["technical"].append(tech_score)
        
        if "behavioral" in feedback:
            hr_score = feedback["behavioral"].get("overall_score", 0)
            categories["behavioral"].append(hr_score)
        
        if "coding" in feedback:
            code_score = feedback["coding"].get("overall_score", 0)
            categories["coding"].append(code_score)
    
    # Calculate averages
    result = {}
    for category, scores in categories.items():
        if scores:
            result[category] = round(sum(scores) / len(scores), 2)
        else:
            result[category] = 0
    
    return result


@router.get("/coding")
def get_coding(user: str = Depends(get_current_user)):
    """Return coding insights"""
    interviews = list(interviews_collection.find({"userId": user}))
    
    solved = 0
    attempted = 0
    mistakes = []
    
    for interview in interviews:
        feedback = interview.get("feedback", {})
        if "coding" in feedback:
            coding = feedback["coding"]
            solved += coding.get("solved", 0)
            attempted += coding.get("attempted", 0)
            mistakes.extend(coding.get("common_mistakes", []))
    
    return {
        "solved": solved,
        "attempted": attempted,
        "commonMistakes": mistakes[:5]  # top 5
    }


@router.get("/history")
def get_history(user: str = Depends(get_current_user)):
    """Return interview history"""
    interviews = list(
        interviews_collection
        .find({"userId": user})
        .sort("date", -1)
    )
    return [serialize_id(interview) for interview in interviews]


@router.get("/recent-interviews")
def get_recent_interviews(user: str = Depends(get_current_user), limit: int = 5):
    """Get recent interviews for the user"""
    interviews = list(
        interviews_collection
        .find({"userId": user})
        .sort("date", -1)
        .limit(limit)
    )
    
    return [serialize_id(interview) for interview in interviews]


@router.get("/performance-trend")
def get_performance_trend(user: str = Depends(get_current_user)):
    """
    Get performance trend data for charts
    Returns confidence and focus scores over time
    """
    interviews = list(
        interviews_collection
        .find({"userId": user})
        .sort("date", 1)
    )
    
    trend_data = []
    for interview in interviews:
        trend_data.append({
            "date": interview.get("date"),
            "confidence": round(interview.get("average_confidence", 0) * 100, 1),
            "focus": round(interview.get("average_focus", 0) * 100, 1),
            "role": interview.get("role")
        })
    
    return trend_data


@router.get("/notifications")
def get_notifications(user: str = Depends(get_current_user)):
    """Return notifications for dashboard"""
    total = interviews_collection.count_documents({"userId": user})
    
    notifications = [
        {"id": 1, "message": f"You have completed {total} interviews so far!"}
    ]
    
    # Check if user has profile data
    user_data = users_collection.find_one({"clerkId": user})
    if user_data and not user_data.get("skills"):
        notifications.append({
            "id": 2, 
            "message": "Update your profile and upload a resume for personalized interviews!"
        })
    
    return notifications