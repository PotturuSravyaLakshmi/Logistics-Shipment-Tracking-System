from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.config import SECRET_KEY, ALGORITHM
from app.database import get_db
from app.models import User, Role

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired access token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        user_id = int(payload.get("sub", ""))
    except (JWTError, ValueError, TypeError):
        raise error

    user = db.get(User, user_id)

    if not user:
        raise error

    # Block access for deactivated accounts
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated",
        )

    return user



def require_roles(*roles: Role):
    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="You do not have permission for this action")
        return user
    return checker
