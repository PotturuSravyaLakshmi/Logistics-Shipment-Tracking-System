
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.models import User, Role, Hub
from app.schemas.hub import HubCreate, HubOut
from app.services.hub_service import create_hub

router = APIRouter(prefix="/hubs", tags=["Hubs"])


# Only admins can create hubs
@router.post("", response_model=HubOut, status_code=201)
def add_hub(
    data: HubCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(Role.ADMIN)),
):
    return create_hub(db, data.name, data.city, data.address)


# Authenticated users can view hubs
@router.get("", response_model=list[HubOut])
def list_hubs(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return db.query(Hub).order_by(Hub.city, Hub.name).all()
