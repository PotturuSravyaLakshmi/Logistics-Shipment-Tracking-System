from datetime import datetime, timezone
from sqlalchemy import Boolean, String, Integer, DateTime, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class Role(str, enum.Enum):
    CUSTOMER = "customer"
    AGENT = "agent"
    ADMIN = "admin"

class ShipmentStatus(str, enum.Enum):
    ORDERED = "ORDERED"
    TRANSIT = "TRANSIT"
    DELIVERED = "DELIVERED"

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    role: Mapped[Role] = mapped_column(SAEnum(Role), default=Role.CUSTOMER)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    shipments: Mapped[list["Shipment"]] = relationship(back_populates="customer")
    is_active: Mapped[bool] = mapped_column(
    Boolean,
    default=True,
    nullable=False,
)
class Hub(Base):
    __tablename__ = "hubs"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    city: Mapped[str] = mapped_column(String(120), index=True)
    address: Mapped[str] = mapped_column(String(250), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    events: Mapped[list["TrackingEvent"]] = relationship(back_populates="hub")

class Shipment(Base):
    __tablename__ = "shipments"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    tracking_code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    description: Mapped[str] = mapped_column(String(250))
    origin: Mapped[str] = mapped_column(String(120))
    destination: Mapped[str] = mapped_column(String(120))
    status: Mapped[ShipmentStatus] = mapped_column(SAEnum(ShipmentStatus), default=ShipmentStatus.ORDERED)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)
    customer: Mapped[User] = relationship(back_populates="shipments")
    events: Mapped[list["TrackingEvent"]] = relationship(back_populates="shipment", cascade="all, delete-orphan", order_by="TrackingEvent.created_at")

class TrackingEvent(Base):
    __tablename__ = "tracking_events"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    shipment_id: Mapped[int] = mapped_column(ForeignKey("shipments.id"), index=True)
    status: Mapped[ShipmentStatus] = mapped_column(SAEnum(ShipmentStatus))
    location: Mapped[str] = mapped_column(String(160))
    note: Mapped[str] = mapped_column(Text, default="")
    hub_id: Mapped[int | None] = mapped_column(ForeignKey("hubs.id"), nullable=True)
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)
    shipment: Mapped[Shipment] = relationship(back_populates="events")
    hub: Mapped[Hub | None] = relationship(back_populates="events")
