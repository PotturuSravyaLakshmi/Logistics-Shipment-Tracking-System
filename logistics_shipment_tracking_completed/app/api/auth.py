from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas.auth import RegisterIn, LoginIn, UserOut, TokenOut
from app.services.auth_service import register, login
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter(prefix="/auth", tags=["Authentication"])
@router.post("/register", response_model=UserOut, status_code=201)
def register_user(data: RegisterIn, db: Session = Depends(get_db)):
    return register(db, data.full_name, str(data.email), data.password)
@router.post("/login", response_model=TokenOut)
def login_user(data: LoginIn, db: Session = Depends(get_db)):
    return {"access_token": login(db, str(data.email), data.password)}
@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
@router.post("/token", response_model=TokenOut)
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    token = login(
        db,
        form_data.username,
        form_data.password,
    )
    return {
        "access_token": token,
        "token_type": "bearer",
    }