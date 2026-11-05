from fastapi.testclient import TestClient
from app.main import app

def test_websocket_ghost_typing():
    client = TestClient(app)
    with client.websocket_connect("/ws") as ws1:
        with client.websocket_connect("/ws") as ws2:
            ws1.send_json({"type": "GHOST_TYPING", "ticket_id": "TKT-1001", "text": "I need help", "is_typing": True})
            data = ws2.receive_json()
            assert data["type"] == "GHOST_TYPING"
            assert data["text"] == "I need help"
            assert data["is_typing"] is True
