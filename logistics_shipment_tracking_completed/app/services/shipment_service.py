import secrets
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Shipment, ShipmentStatus, TrackingEvent, User

def new_tracking_code(db: Session) -> str:
    for _ in range(10):
        code = "SHP-" + secrets.token_hex(5).upper()
        if not db.query(Shipment).filter(Shipment.tracking_code == code).first(): return code
    raise HTTPException(status_code=500, detail="Could not generate a unique tracking code")

def create_shipment(db: Session, customer: User, description: str, origin: str, destination: str) -> Shipment:
    shipment = Shipment(tracking_code=new_tracking_code(db), description=description.strip(), origin=origin.strip(), destination=destination.strip(), customer_id=customer.id, status=ShipmentStatus.ORDERED)
    db.add(shipment); db.flush()
    db.add(TrackingEvent(shipment_id=shipment.id, status=ShipmentStatus.ORDERED, location=origin.strip(), note="Shipment order created", created_by=customer.id))
    db.commit(); db.refresh(shipment)
    return shipment

def get_shipment(db: Session, shipment_id: int) -> Shipment:
    shipment = db.get(Shipment, shipment_id)
    if not shipment: raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

def add_event(db: Session, shipment: Shipment, status: ShipmentStatus, location: str, note: str, hub_id: int | None, actor_id: int) -> TrackingEvent:
    allowed = {ShipmentStatus.ORDERED: {ShipmentStatus.TRANSIT}, ShipmentStatus.TRANSIT: {ShipmentStatus.DELIVERED}, ShipmentStatus.DELIVERED: set()}
    if status not in allowed[shipment.status]:
        raise HTTPException(status_code=409, detail=f"Invalid status transition: {shipment.status.value} -> {status.value}")
    if hub_id is not None:
        from app.models import Hub
        if not db.get(Hub, hub_id): raise HTTPException(status_code=404, detail="Hub not found")
    event = TrackingEvent(shipment_id=shipment.id, status=status, location=location.strip(), note=note.strip(), hub_id=hub_id, created_by=actor_id)
    shipment.status = status
    db.add(event); db.commit(); db.refresh(event)
    return event
