from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.models import User, Role

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("/me/shipments")
def my_shipments(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return [
        {
            "tracking_code": s.tracking_code,
            "description": s.description,
            "status": s.status.value,
        }
        for s in user.shipments
    ]


@router.get(
    "/",
    dependencies=[Depends(require_roles(Role.ADMIN))],
)
def list_customers(db: Session = Depends(get_db)):
    customers = (
        db.query(User)
        .filter(User.role == Role.CUSTOMER)
        .order_by(User.id)
        .all()
    )

    return [
        {
            "id": customer.id,
            "full_name": customer.full_name,
            "email": customer.email,
            "role": customer.role.value,
        }
        for customer in customers
    ]