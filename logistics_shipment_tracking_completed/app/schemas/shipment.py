from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from app.models import ShipmentStatus
class ShipmentCreate(BaseModel):
    description: str = Field(min_length=2, max_length=250)
    origin: str = Field(min_length=2, max_length=120)
    destination: str = Field(min_length=2, max_length=120)
class ShipmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    tracking_code: str
    description: str
    origin: str
    destination: str
    status: ShipmentStatus
    customer_id: int
    created_at: datetime
    updated_at: datetime
class EventCreate(BaseModel):
    status: ShipmentStatus
    location: str = Field(min_length=2, max_length=160)
    note: str = Field(default="", max_length=1000)
    hub_id: int | None = None
class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    shipment_id: int
    status: ShipmentStatus
    location: str
    note: str
    hub_id: int | None
    created_by: int | None
    created_at: datetime
