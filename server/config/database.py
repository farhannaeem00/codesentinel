import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("Missing MONGO_URI in .env")

client = MongoClient(MONGO_URI)
db     = client["codesentinel"]

def get_db():
    return db