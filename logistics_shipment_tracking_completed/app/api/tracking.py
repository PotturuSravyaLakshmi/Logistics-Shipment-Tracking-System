from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.tracking import TrackingOut
from app.services.tracking_service import get_tracking
router = APIRouter(prefix="/tracking", tags=["Public Tracking"])
@router.get("/{tracking_code}", response_model=TrackingOut)
def track(tracking_code: str, db: Session = Depends(get_db)):
    return get_tracking(db, tracking_code)
