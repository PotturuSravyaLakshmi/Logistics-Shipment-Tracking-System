
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_roles
from app.models import User, Role, Shipment, Hub, TrackingEvent

router = APIRouter(prefix="/admin", tags=["Admin"])


class AdminUserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    role: Role


class RoleUpdate(BaseModel):
    role: Role



@router.get("/stats")
def stats(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(Role.ADMIN)),
):
    users = db.query(User).all()

    return {
        "total_users": len(users),
        "customers": sum(u.role == Role.CUSTOMER for u in users),
        "agents": sum(u.role == Role.AGENT for u in users),
        "admins": sum(u.role == Role.ADMIN for u in users),
        "shipments": db.query(Shipment).count(),
        "hubs": db.query(Hub).count(),
        "tracking_events": db.query(TrackingEvent).count(),
    }


@router.get("/users", response_model=list[AdminUserOut])
def list_users(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(Role.ADMIN)),
):
    return db.query(User).order_by(User.id.desc()).all()


@router.patch("/users/{user_id}/role", response_model=AdminUserOut)
def update_user_role(
    user_id: int,
    data: RoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles(Role.ADMIN)),
):
    target = db.get(User, user_id)

    if target is None:
        raise HTTPException(status_code=404, detail="User not found")

    if target.id == admin.id and data.role != Role.ADMIN:
        raise HTTPException(
            status_code=400,
            detail="You cannot remove your own admin role",
        )

    target.role = data.role
    db.commit()
    db.refresh(target)

    return target

@router.delete("/users/{user_id}")
def delete_agent(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles(Role.ADMIN)),
):
    target = db.get(User, user_id)

    if target is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if target.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    if target.role != Role.AGENT:
        raise HTTPException(
            status_code=403,
            detail="Only agent accounts can be deleted",
        )

    # Prevent deletion if the agent has associated shipments.
    shipment_count = (
        db.query(Shipment)
        .filter(Shipment.customer_id == target.id)
        .count()
    )

    if shipment_count > 0:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete this agent because shipments are associated with this account.",
        )

    db.delete(target)
    db.commit()

    return {"message": "Agent deleted successfully"}

@router.patch("/users/{user_id}/deactivate")
def deactivate_agent(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles(Role.ADMIN)),
):
    target = db.get(User, user_id)

    if target is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if target.role != Role.AGENT:
        raise HTTPException(
            status_code=403,
            detail="Only agent accounts can be deactivated",
        )

    if not target.is_active:
        return {"message": "Agent is already deactivated"}

    target.is_active = False
    db.commit()

    return {"message": "Agent deactivated successfully"}

