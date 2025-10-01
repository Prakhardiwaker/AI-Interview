# backend/llm_groq_config.py
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Load .env from root folder
load_dotenv()

GROQ_API_KEY = os.getenv("DEFAULT_GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("DEFAULT_GROQ_API_KEY not found in environment variables. Check your .env file in root folder.")

llm = ChatGroq(groq_api_key=GROQ_API_KEY, model="llama3-8b-8192")
code_llm = ChatGroq(groq_api_key=GROQ_API_KEY, model="llama3-70b-8192")