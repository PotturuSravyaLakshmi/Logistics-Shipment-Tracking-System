
# Logistics Shipment Tracking System

## Project Overview
A full-stack web application designed to manage shipments and track parcel movement using unique tracking codes and event-based status updates.

## Technologies Used
- Frontend: React.js, Vite
- Backend: Python, FastAPI
- Database: SQLite
- ORM: SQLAlchemy
- Authentication: JWT
- Password Security: PBKDF2 with SHA-256

## Main Features
- User registration and login
- JWT-based authentication
- Role-based access control
- Shipment creation and tracking
- Tracking event history
- Shipment status management
- Admin dashboard

## Shipment Status Flow
ORDERED → TRANSIT → DELIVERED

## Project Structure
- backend/: FastAPI application
- frontend/: React application

## How to Run

### Backend
1. Create and activate a virtual environment.
2. Install dependencies:
   pip install -r requirements.txt
3. Start the server:
   uvicorn app.main:app --reload

### Frontend
1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev
