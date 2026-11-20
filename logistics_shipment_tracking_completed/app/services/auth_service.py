from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import User, Role
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.validators import normalize_email

def register(db: Session, full_name: str, email: str, password: str) -> User:
    email = normalize_email(email)
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(full_name=full_name.strip(), email=email, password_hash=hash_password(password), role=Role.CUSTOMER)
    db.add(user); db.commit(); db.refresh(user)
    return user


def login(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter(
        User.email == normalize_email(email)
    ).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
        )

    # Prevent deactivated users from logging in
    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Your account has been deactivated",
        )

    return create_access_token(user.id, user.role.value)
