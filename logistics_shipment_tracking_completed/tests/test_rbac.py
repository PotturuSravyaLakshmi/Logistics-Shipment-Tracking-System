from app.models import Role

def test_roles_are_defined():
    assert {r.value for r in Role} == {"customer", "agent", "admin"}
