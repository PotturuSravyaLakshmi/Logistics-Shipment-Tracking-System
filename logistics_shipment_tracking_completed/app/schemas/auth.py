from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models import Role
class RegisterIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
class LoginIn(BaseModel):
    email: EmailStr
    password: str
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    email: str
    role: Role
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
