from app.utils.security import hash_password, verify_password

def test_password_hash_is_not_plaintext_and_verifies():
    stored = hash_password("correct-horse-battery")
    assert stored != "correct-horse-battery"
    assert verify_password("correct-horse-battery", stored)
    assert not verify_password("wrong-password", stored)
