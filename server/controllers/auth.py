from fastapi import HTTPException, status
from config.database import get_db
from models.user import create_user_document, user_schema
from utils.auth import hash_password, verify_password, create_access_token
from pydantic import BaseModel, EmailStr

# ── Request Schemas ───────────────────────────────────
class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

# ── Register ──────────────────────────────────────────
def register_user(data: RegisterRequest):
    db = get_db()

    if not data.name or not data.email or not data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide all fields"
        )

    if len(data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
    # Check if email exists
    existing = db["users"].find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    hashed  = hash_password(data.password)
    doc     = create_user_document(data.name, data.email.lower(), hashed)
    result  = db["users"].insert_one(doc)
    doc["_id"] = result.inserted_id

    # Generate token
    token = create_access_token({"id": str(result.inserted_id)})

    return {
        "success": True,
        "token":   token,
        "user":    user_schema(doc),
    }

# ── Login ─────────────────────────────────────────────
def login_user(data: LoginRequest):
    db = get_db()

    if not data.email or not data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide email and password"
        )

    # Find user
    user = db["users"].find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate token
    token = create_access_token({"id": str(user["_id"])})

    return {
        "success": True,
        "token":   token,
        "user":    user_schema(user),
    }

# ── Get Me ────────────────────────────────────────────
def get_me(current_user: dict):
    return {
        "success": True,
        "user":    user_schema(current_user),
    }
