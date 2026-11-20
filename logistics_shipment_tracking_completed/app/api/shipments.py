from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.models import User, Role, Shipment, TrackingEvent
from app.schemas.shipment import ShipmentCreate, ShipmentOut, EventCreate, EventOut
from app.services.shipment_service import create_shipment, get_shipment, add_event
router = APIRouter(prefix="/shipments", tags=["Shipments"])
@router.post("", response_model=ShipmentOut, status_code=201)
def create(data: ShipmentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return create_shipment(db, user, data.description, data.origin, data.destination)
@router.get("", response_model=list[ShipmentOut])
def list_mine(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = db.query(Shipment)
    if user.role == Role.CUSTOMER: q = q.filter(Shipment.customer_id == user.id)
    return q.order_by(Shipment.created_at.desc()).all()
@router.get("/{shipment_id}", response_model=ShipmentOut)
def detail(shipment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    s = get_shipment(db, shipment_id)
    if user.role == Role.CUSTOMER and s.customer_id != user.id: raise HTTPException(status_code=403, detail="Not your shipment")
    return s
@router.post("/{shipment_id}/events", response_model=EventOut, status_code=201)
def create_event(shipment_id: int, data: EventCreate, db: Session = Depends(get_db), user: User = Depends(require_roles(Role.AGENT, Role.ADMIN))):
    s = get_shipment(db, shipment_id)
    return add_event(db, s, data.status, data.location, data.note, data.hub_id, user.id)
@router.get("/{shipment_id}/events", response_model=list[EventOut])
def shipment_events(shipment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    s = get_shipment(db, shipment_id)
    if user.role == Role.CUSTOMER and s.customer_id != user.id: raise HTTPException(status_code=403, detail="Not your shipment")
    return db.query(TrackingEvent).filter(TrackingEvent.shipment_id == shipment_id).order_by(TrackingEvent.created_at).all()
