# Logistics Shipment Tracking System— Logistics Shipment Tracking Frontend

React + Vite frontend for your FastAPI backend.

## Requirements
- Node.js 18+ and npm
- Your FastAPI backend

## 1. Start the backend
From your backend project folder:
```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```
Open `http://127.0.0.1:8001/docs` to confirm it is running.

## 2. Configure and start frontend
Open PowerShell in this frontend folder:
```powershell
Copy-Item .env.example .env
npm install
npm run dev
```
Open the local URL Vite prints (usually `http://localhost:5173`).

If your backend uses another port, update `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8001
```
Restart Vite after changing `.env`.

## Features
- Customer registration and login
- JWT bearer token sent to protected endpoints
- Shipment dashboard with counts
- Create shipment form
- Shipment search and status filter
- Public tracking code lookup and event timeline
- Sign out

## API routes expected
- `POST /auth/register` with `full_name`, `email`, `password`
- `POST /auth/login` with `email`, `password`, returning `access_token`
- `GET /auth/me`
- `GET /shipments`
- `POST /shipments` with `description`, `origin`, `destination`
- `GET /tracking/{tracking_code}`

## If the browser shows a CORS error
Add this in `app/main.py` after creating the FastAPI `app` object:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
Keep explicit origins in production. Do not use hiding buttons in the frontend as a security boundary; backend role checks must remain enabled.

## Response shape note
Tracking supports common response keys `events` or `tracking_events`. If your API response uses other field names, adapt `Tracking` in `src/App.jsx`.
