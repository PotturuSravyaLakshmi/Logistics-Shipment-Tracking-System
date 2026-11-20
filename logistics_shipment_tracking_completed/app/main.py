from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.database import Base, engine
from app import models  # Register ORM models
from app.api import (
    auth,
    hubs,
    shipments,
    tracking,
    customers,
    agents,
    admin,
)
from app.utils.logger import logger

app = FastAPI(
    title="Logistics Shipment Tracking System",
    description="Event-driven shipment tracking API using FastAPI and SQLite",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers only once
# Register all routers only once
for router in (
    auth.router,
    hubs.router,
    shipments.router,
    tracking.router,
    customers.router,
    agents.router,
    admin.router,
):
    app.include_router(router)

# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Logistics Shipment Tracking API is running",
        "docs": "/docs",
    }


@app.get("/health", tags=["System"])
def health():
    return {"status": "ok"}