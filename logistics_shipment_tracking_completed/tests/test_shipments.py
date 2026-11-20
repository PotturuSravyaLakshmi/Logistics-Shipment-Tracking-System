from app.models import ShipmentStatus

def test_status_lifecycle_values():
    assert [s.value for s in ShipmentStatus] == ["ORDERED", "TRANSIT", "DELIVERED"]
