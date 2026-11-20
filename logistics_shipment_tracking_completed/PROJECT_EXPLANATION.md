# Explain this project to a recruiter

## 30-second introduction
“My project is a Logistics Shipment Tracking System built with FastAPI and SQLite. A customer creates a shipment and receives a unique tracking code. Every movement is stored as a timestamped tracking event linked to a hub. The API updates the shipment through ORDERED, TRANSIT, and DELIVERED, rejects invalid status jumps, and provides a tracking timeline. I used FastAPI for REST APIs, SQLAlchemy for database access, SQLite for lightweight persistent storage, and JWT authentication with roles to protect staff actions.”

## Request flow
1. Client sends JSON to a FastAPI endpoint.
2. Pydantic schema validates required fields and lengths.
3. Dependency opens a SQLAlchemy database session and checks JWT/role if required.
4. Service layer applies business rules (tracking code generation, valid status transition).
5. SQLAlchemy writes shipment/event data to SQLite.
6. API returns JSON; `/tracking/{code}` reconstructs the chronological event timeline.

## Why these technologies?
- **FastAPI:** clean REST endpoints, automatic Swagger docs, request validation, dependency injection.
- **SQLite:** file-based database, no separate database server, easy to run and demonstrate locally.
- **SQLAlchemy:** maps Python classes to relational tables and parameterizes database operations.
- **Pydantic:** validates incoming/outgoing API data and gives clear 422 errors for invalid input.
- **JWT:** clients send a signed bearer token after login; protected routes identify the user without server-side session storage.
- **Event log:** each status change is saved as a separate row instead of overwriting history, so the timeline explains where/when the parcel moved.
- **Service layer:** keeps business rules separate from HTTP routing, making code easier to test and maintain.
- **Pytest + TestClient:** checks important behaviors automatically.

## Database tables
- `users`: account, password hash, role.
- `hubs`: named logistics locations.
- `shipments`: current shipment state, tracking code, origin/destination, owner.
- `tracking_events`: append-only history of each status/location update; optional hub and staff user references.

## Main design rule
Allowed transitions are ORDERED → TRANSIT → DELIVERED. The shipment row stores the **current status** for quick listing, while `tracking_events` stores the **history** for audit and tracking. Shipment creation automatically inserts the first ORDERED event. Staff can add the next event, and an invalid transition returns HTTP 409.

## Demo narration
“I first register and log in as a customer. I create a shipment and copy the generated tracking code. The system creates an ORDERED event automatically. A staff account then records TRANSIT at a hub and later DELIVERED at the destination. Finally, I call the public tracking endpoint and show the timeline. If I try to mark an ORDERED parcel as DELIVERED directly, the service rejects it because the workflow rules must be respected.”

## Important honest limitation
The public register endpoint intentionally creates only customer accounts. Agent/admin accounts should be provisioned by an administrator, seed script, or controlled database operation; do not allow public users to select their own privileged role. The included project is a strong local portfolio starter, but production deployment needs migrations, secret management, rate limiting, HTTPS, stronger operational monitoring, and privacy review of public tracking data.
