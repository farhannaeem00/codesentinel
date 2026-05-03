
from fastapi import APIRouter, Depends
from controllers.auth import (
    RegisterRequest,
    LoginRequest,
    register_user,
    login_user,
    get_me,
)
from middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register")
def register(data: RegisterRequest):
    return register_user(data)

@router.post("/login")
def login(data: LoginRequest):
    return login_user(data)

@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return get_me(current_user)