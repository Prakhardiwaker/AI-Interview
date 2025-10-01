from fastapi import HTTPException, Header, Depends
from backend.database import users_collection
from typing import Optional

def get_current_user(x_user_id: Optional[str] = Header(None), x_user_email: Optional[str] = Header(None)):
    """
    Get or create user based on Clerk data sent from frontend.
    Frontend sends:
    - X-User-Id: Clerk user ID
    - X-User-Email: User's email
    """
    if not x_user_id or not x_user_email:
        raise HTTPException(
            status_code=401, 
            detail="Authentication required. Please sign in with Clerk."
        )
    
    # Check if user exists in MongoDB
    user = users_collection.find_one({"clerkId": x_user_id})
    
    if not user:
        # First time user - create new document
        new_user = {
            "clerkId": x_user_id,
            "email": x_user_email,
            "name": "",
            "phone": "",
            "linkedin": "",
            "github": "",
            "role": "",
            "skills": [],
            "education": [],
            "experience": [],
            "projects": [],
            "groq_api_key": None,
            "createdAt": None
        }
        users_collection.insert_one(new_user)
        user = new_user
    
    # Return clerkId for session management
    return user["clerkId"]


def get_current_user_full(x_user_id: Optional[str] = Header(None), x_user_email: Optional[str] = Header(None)):
    """
    Returns full user object from MongoDB.
    Use this when you need complete user data.
    """
    if not x_user_id or not x_user_email:
        raise HTTPException(
            status_code=401, 
            detail="Authentication required"
        )
    
    user = users_collection.find_one({"clerkId": x_user_id})
    
    if not user:
        # Create user if doesn't exist
        new_user = {
            "clerkId": x_user_id,
            "email": x_user_email,
            "name": "",
            "phone": "",
            "linkedin": "",
            "github": "",
            "role": "",
            "skills": [],
            "education": [],
            "experience": [],
            "projects": [],
            "groq_api_key": None,
            "createdAt": None
        }
        users_collection.insert_one(new_user)
        return new_user
    
    user["_id"] = str(user["_id"])
    return user