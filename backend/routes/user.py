# backend/routes/user.py
from fastapi import APIRouter, Depends, HTTPException
from backend.auth import get_current_user, get_current_user_full
from backend.database import users_collection
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/user", tags=["user"])

class EducationItem(BaseModel):
    degree: str
    institution: str
    year: str

class ExperienceItem(BaseModel):
    title: str
    company: str
    duration: str
    description: str

class ProjectItem(BaseModel):
    title: str
    tech: List[str]
    description: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    role: Optional[str] = None
    skills: Optional[List[str]] = None
    education: Optional[List[EducationItem]] = None
    experience: Optional[List[ExperienceItem]] = None
    projects: Optional[List[ProjectItem]] = None
    groq_api_key: Optional[str] = None


@router.get("/profile")
def get_profile(user_data: dict = Depends(get_current_user_full)):
    """Get full user profile"""
    return user_data


@router.put("/profile")
def update_profile(
    profile_data: UserProfileUpdate,
    user: str = Depends(get_current_user)
):
    """Update user profile information"""
    
    # Remove None values from update
    update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    # Update user in database
    result = users_collection.update_one(
        {"clerkId": user},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return updated user data
    updated_user = users_collection.find_one({"clerkId": user})
    updated_user["_id"] = str(updated_user["_id"])
    
    return {"message": "Profile updated successfully", "user": updated_user}


@router.delete("/profile")
def delete_profile(user: str = Depends(get_current_user)):
    """Delete user profile (soft delete - just marks as deleted)"""
    result = users_collection.update_one(
        {"clerkId": user},
        {"$set": {"deleted": True, "deletedAt": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Profile deleted successfully"}