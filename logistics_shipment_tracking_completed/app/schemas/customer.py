from pydantic import BaseModel
class CustomerSummary(BaseModel):
    id: int
    full_name: str
    email: str
