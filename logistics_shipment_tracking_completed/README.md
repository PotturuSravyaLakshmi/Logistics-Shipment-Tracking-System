# Logistics Shipment Tracking System

A FastAPI + SQLite backend for creating shipments, registering logistics hubs, and tracking parcel movement through an append-only event history.

## Features
- Shipment creation with a unique, customer-facing tracking code.
- Shipment lifecycle: `ORDERED -> TRANSIT -> DELIVERED` (backward/invalid transitions are rejected).
- Hub records and hub-linked tracking events.
- Tracking timeline with timestamps, locations, notes, and status history.
- Basic registration/login with signed JWT bearer tokens and roles (`customer`, `agent`, `admin`).
- Input validation, database sessions, structured logging, and API tests.
- Interactive API documentation at `/docs`.

## Run locally (Windows PowerShell)
```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Edit .env and set a unique SECRET_KEY
uvicorn app.main:app --reload
```

On macOS/Linux, activate with `source .venv/bin/activate` instead. Open http://127.0.0.1:8000/docs.
SQLite database `logistics.db` is created automatically on first run.

## Suggested demo flow
1. `POST /auth/register` create a user (the public endpoint always creates a `customer`).
2. `POST /auth/login` with the same email/password; click **Authorize** in Swagger and paste the returned token.
3. Run `python seed_admin.py` in a second terminal to create a local admin account, then log in with that account. (Do not expose the seed script in production.)
4. `POST /hubs` create a hub with the admin token.
5. `POST /shipments` create a shipment; save the returned `tracking_code`.
6. `GET /tracking/{tracking_code}` view current status and event timeline.
7. `POST /shipments/{shipment_id}/events` add a status event. Use `TRANSIT` then `DELIVERED`.

## API overview
- `GET /health` health check
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `POST /hubs` (agent/admin), `GET /hubs` (authenticated)
- `POST /shipments` (authenticated), `GET /shipments` (authenticated; customers see their own)
- `GET /shipments/{shipment_id}` (owner or staff)
- `POST /shipments/{shipment_id}/events` (agent/admin)
- `GET /tracking/{tracking_code}` (public tracking lookup)

## Important production notes
This is a portfolio/demo backend, not a production carrier integration. Set a strong `SECRET_KEY`, use HTTPS, apply migrations (Alembic is intentionally not required for the starter), add rate limits and email verification, and restrict public tracking responses if tracking codes may be guessed. SQLite is suitable for local development; use PostgreSQL for concurrent production workloads.
