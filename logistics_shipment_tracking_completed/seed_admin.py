"""Create a local admin account for development/demo use only.
Run: python seed_admin.py
"""
import getpass
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models import User, Role
from app.utils.security import hash_password

Base.metadata.create_all(bind=engine)
email = input("Admin email: ").strip().lower()
name = input("Admin full name: ").strip()
password = getpass.getpass("Admin password (8+ characters): ")
if len(password) < 8:
    raise SystemExit("Password must contain at least 8 characters.")
with SessionLocal() as db:  # type: Session
    if db.query(User).filter(User.email == email).first():
        raise SystemExit("An account with this email already exists; no changes made.")
    user = User(full_name=name, email=email, password_hash=hash_password(password), role=Role.ADMIN)
    db.add(user)
    db.commit()
print("Admin created. Log in through POST /auth/login. Do not expose this script in a public production environment.")
