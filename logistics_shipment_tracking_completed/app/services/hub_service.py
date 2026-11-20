from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Hub

def create_hub(db: Session, name: str, city: str, address: str) -> Hub:
    if db.query(Hub).filter(Hub.name == name).first():
        raise HTTPException(status_code=409, detail="A hub with this name already exists")
    hub = Hub(name=name.strip(), city=city.strip(), address=address.strip())
    db.add(hub); db.commit(); db.refresh(hub)
    return hub
