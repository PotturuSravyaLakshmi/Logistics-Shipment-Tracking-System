import hashlib, hmac, secrets
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_MINUTES

# PBKDF2 from Python's standard library avoids storing plaintext passwords.
def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 310_000).hex()
    return f"pbkdf2_sha256${salt}${digest}"

def verify_password(password: str, stored: str) -> bool:
    try:
        scheme, salt, expected = stored.split("$", 2)
        if scheme != "pbkdf2_sha256": return False
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 310_000).hex()
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False

def create_access_token(user_id: int, role: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    return jwt.encode({"sub": str(user_id), "role": role, "exp": expires}, SECRET_KEY, algorithm=ALGORITHM)
