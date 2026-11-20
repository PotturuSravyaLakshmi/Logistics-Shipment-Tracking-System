from pydantic import BaseModel
class AgentSummary(BaseModel):
    id: int
    full_name: str
