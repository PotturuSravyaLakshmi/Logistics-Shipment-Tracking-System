
from getpass import getpass

from app.database import SessionLocal
from app.models import User, Role
from app.utils.security import hash_password
from app.utils.validators import normalize_email

full_name = input("Agent full name: ").strip()
email = normalize_email(input("Agent email: "))
password = getpass("Agent password: ")

db = SessionLocal()

try:
    existing = db.query(User).filter(User.email == email).first()

    if existing:
        print(f"Account already exists with role: {existing.role.value}")
    else:
        agent = User(
            full_name=full_name,
            email=email,
            password_hash=hash_password(password),
            role=Role.AGENT,
        )
        db.add(agent)
        db.commit()
        print("Agent account created successfully.")
finally:
    db.close()










    