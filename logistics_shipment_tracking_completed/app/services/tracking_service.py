from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from app.models import Shipment, TrackingEvent

def get_tracking(db: Session, tracking_code: str) -> dict:
    shipment = db.query(Shipment).options(joinedload(Shipment.events).joinedload(TrackingEvent.hub)).filter(Shipment.tracking_code == tracking_code.upper()).first()
    if not shipment: raise HTTPException(status_code=404, detail="Tracking code not found")
    timeline = [{"status": e.status, "location": e.location, "note": e.note, "hub_name": e.hub.name if e.hub else None, "created_at": e.created_at} for e in sorted(shipment.events, key=lambda x: x.created_at)]
    return {"tracking_code": shipment.tracking_code, "description": shipment.description, "origin": shipment.origin, "destination": shipment.destination, "current_status": shipment.status, "created_at": shipment.created_at, "updated_at": shipment.updated_at, "timeline": timeline}
