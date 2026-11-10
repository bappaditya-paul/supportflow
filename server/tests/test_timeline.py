import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.timeline_service import get_ticket_timeline, add_timeline_message

client = TestClient(app)

def test_get_ticket_timeline():
    response = client.get("/api/v1/tickets/TKT-1001/timeline")
    assert response.status_code == 200
    timeline = response.json()
    assert isinstance(timeline, list)
    assert len(timeline) >= 1
    assert timeline[0]["ticket_id"] == "TKT-1001"

def test_add_ticket_timeline_message():
    payload = {
        "sender_type": "operator",
        "sender_name": "Test Operator",
        "text": "Automated verification message.",
        "visibility": "public"
    }
    response = client.post("/api/v1/tickets/TKT-1001/timeline", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["sender_name"] == "Test Operator"
    assert data["text"] == "Automated verification message."
    assert data["ticket_id"] == "TKT-1001"
