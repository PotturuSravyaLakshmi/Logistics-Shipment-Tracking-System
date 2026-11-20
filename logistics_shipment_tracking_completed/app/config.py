import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./logistics.db")
SECRET_KEY = os.getenv("SECRET_KEY", "development-only-change-me")
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "60"))
ALGORITHM = "HS256"
