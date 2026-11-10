import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.auth import verify_token, DEMO_USERS

client = TestClient(app)

def test_auth_me_anonymous():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["authenticated"] is False
    assert data["user"] is None
    assert data["mode"] == "anonymous"

def test_auth_me_with_demo_tokens():
    for token, expected_user in DEMO_USERS.items():
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/v1/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["authenticated"] is True
        assert data["mode"] == "demo"
        assert data["user"]["email"] == expected_user["email"]
        assert data["user"]["name"] == expected_user["name"]

def test_auth_verify_unauthorized():
    response = client.get("/api/v1/auth/verify")
    assert response.status_code == 401

def test_auth_verify_invalid_token():
    headers = {"Authorization": "Bearer invalid_gibberish_token_12345"}
    response = client.get("/api/v1/auth/verify", headers=headers)
    assert response.status_code == 401

def test_auth_verify_success():
    headers = {"Authorization": "Bearer mock-jwt-alex-rivera"}
    response = client.get("/api/v1/auth/verify", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["verified"] is True
    assert data["user"]["name"] == "Alex Rivera"

def test_verify_token_helper():
    assert verify_token("") is None
    assert verify_token(None) is None
    assert verify_token("non-existent") is None
    user = verify_token("mock-jwt-hackathon-judge")
    assert user is not None
    assert user["role"] == "Auditor & Governance Evaluator"

