from fastapi import HTTPException, Header, Depends
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from backend.database import get_db

# Security config
SECRET_KEY = "1234"  # ⚠️ move this to config/settings.py in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# --- Password Helpers ---
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# --- JWT Helpers ---
def create_access_token(data: dict) -> str:
    """Create JWT token with expiry"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# --- Dependency ---
def get_current_user(authorization: str = Header(...), db=Depends(get_db)):
    """
    Extract user info from JWT token (expects Authorization: Bearer <token>)
    Returns full user object from DB.
    """
    try:
        token = authorization.split(" ")[1]  # Strip "Bearer "
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")  # we store user email in "sub"

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db["users"].find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Convert ObjectId to string for frontend safety
        user["_id"] = str(user["_id"])
        return user

    except (JWTError, IndexError):
        raise HTTPException(status_code=401, detail="Invalid or missing token")
