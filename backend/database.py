# backend/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load .env from root folder
load_dotenv()

# MongoDB connection - using MONGO_URL from your .env
MONGODB_URI = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "ai_interviewsim")

if not MONGODB_URI:
    raise ValueError("MONGO_URL not found in environment variables. Check your .env file in root folder.")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
interviews_collection = db["interviews"]

def get_db():
    return db