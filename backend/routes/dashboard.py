from fastapi import APIRouter, Depends, HTTPException
from pymongo.collection import Collection
import sys
import os
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from backend.database import get_db

from backend.auth import get_current_user  # JWT auth dependency

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# Utility to safely convert ObjectId to string
def serialize_id(doc):
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/stats")
async def get_dashboard_stats(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    """Return overall stats for the dashboard"""
    interviews: Collection = db["interviews"]

    user_interviews = list(interviews.find({"userId": user["_id"]}))
    if not user_interviews:
        return {"totalInterviews": 0, "avgConfidence": 0, "codingAccuracy": 0, "lastActive": None}

    total = len(user_interviews)
    avg_conf = sum(i.get("confidenceScore", 0) for i in user_interviews) / total
    coding_attempts = sum(i.get("coding", {}).get("attempted", 0) for i in user_interviews)
    coding_correct = sum(i.get("coding", {}).get("solved", 0) for i in user_interviews)
    coding_accuracy = (coding_correct / coding_attempts * 100) if coding_attempts else 0
    last_active = max(i.get("date") for i in user_interviews)

    return {
        "totalInterviews": total,
        "avgConfidence": round(avg_conf, 2),
        "codingAccuracy": round(coding_accuracy, 2),
        "lastActive": last_active
    }


@router.get("/performance")
async def get_performance(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    """Return performance grouped by category (Technical, HR, Coding)"""
    interviews: Collection = db["interviews"]
    data = list(interviews.find({"userId": user["_id"]}))

    categories = {}
    for i in data:
        mode = i.get("mode", "Unknown")
        score = i.get("score", 0)
        if mode not in categories:
            categories[mode] = []
        categories[mode].append(score)

    return {cat: sum(vals) / len(vals) for cat, vals in categories.items()}


@router.get("/coding")
async def get_coding(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    """Return coding insights"""
    interviews: Collection = db["interviews"]
    data = list(interviews.find({"userId": user["_id"]}))

    solved = sum(i.get("coding", {}).get("solved", 0) for i in data)
    attempted = sum(i.get("coding", {}).get("attempted", 0) for i in data)
    mistakes = []
    for i in data:
        mistakes.extend(i.get("feedback", {}).get("mistakes", []))

    return {
        "solved": solved,
        "attempted": attempted,
        "commonMistakes": mistakes[:5]  # top 5
    }


@router.get("/history")
async def get_history(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    """Return interview history"""
    interviews: Collection = db["interviews"]
    data = list(interviews.find({"userId": user["_id"]}).sort("date", -1))
    return [serialize_id(i) for i in data]


@router.get("/profile")
async def get_profile(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    """Return user profile snapshot"""
    users: Collection = db["users"]
    user_data = users.find_one({"_id": user["_id"]})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_id(user_data)


@router.get("/feedback")
async def get_feedback(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    """Return feedback insights"""
    feedbacks: Collection = db["feedback"]
    data = list(feedbacks.find({"userId": user["_id"]}).sort("date", -1))
    return [serialize_id(f) for f in data]


@router.get("/notifications")
async def get_notifications(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    """Return notifications for dashboard"""
    interviews: Collection = db["interviews"]
    total = interviews.count_documents({"userId": user["_id"]})
    return [
        {"id": 1, "message": f"You have completed {total} interviews so far!"},
        {"id": 2, "message": "Don’t forget to update your profile for better feedback."}
    ]
