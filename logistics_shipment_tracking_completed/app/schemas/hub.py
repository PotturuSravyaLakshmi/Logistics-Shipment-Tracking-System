from pydantic import BaseModel, Field, ConfigDict
class HubCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    city: str = Field(min_length=2, max_length=120)
    address: str = Field(default="", max_length=250)
class HubOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    city: str
    address: str
