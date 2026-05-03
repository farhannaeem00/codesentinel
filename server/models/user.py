from datetime import datetime
from bson import ObjectId

def user_schema(user) -> dict:
    return {
        "id":         str(user["_id"]),
        "name":       user["name"],
        "email":      user["email"],
        "created_at": str(user.get("created_at", "")),
    }

def create_user_document(name: str, email: str, hashed_password: str) -> dict:
    return {
        "name":       name,
        "email":      email,
        "password":   hashed_password,
        "created_at": datetime.utcnow(),
    }