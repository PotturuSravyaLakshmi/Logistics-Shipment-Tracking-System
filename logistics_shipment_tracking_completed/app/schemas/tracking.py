from pydantic import BaseModel
from datetime import datetime
from app.models import ShipmentStatus
class TimelineEvent(BaseModel):
    status: ShipmentStatus
    location: str
    note: str
    hub_name: str | None
    created_at: datetime
class TrackingOut(BaseModel):
    tracking_code: str
    description: str
    origin: str
    destination: str
    current_status: ShipmentStatus
    created_at: datetime
    updated_at: datetime
    timeline: list[TimelineEvent]
