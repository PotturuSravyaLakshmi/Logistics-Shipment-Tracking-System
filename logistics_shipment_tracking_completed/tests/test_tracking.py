from fastapi.testclient import TestClient
from app.main import app

def test_health_endpoint():
    response = TestClient(app).get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_unknown_tracking_code_returns_404():
    response = TestClient(app).get("/tracking/SHP-0000000000")
    assert response.status_code == 404
