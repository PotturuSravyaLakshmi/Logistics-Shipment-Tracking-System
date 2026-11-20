import re

def normalize_email(email: str) -> str:
    return email.strip().lower()

def valid_password(password: str) -> bool:
    return len(password) >= 8

def valid_tracking_code(code: str) -> bool:
    return bool(re.fullmatch(r"SHP-[A-F0-9]{10}", code))
