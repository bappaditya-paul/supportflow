"""
End-to-End Test for Customer Billing Discrepancy Workflow & Timeline Persistence
Verifies Phase 2 integrations:
1. Customer message timeline persistence
2. Operator message timeline persistence
3. Discrepancy detection and Stripe sync
4. Full human-in-the-loop draft approval and resolution
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services import customer_service, draft_service, timeline_service

client = TestClient(app)

def test_complete_billing_discrepancy_workflow():
    try:
        # 1. Reset initial customer state to have a billing discrepancy
        customer_service.sync_customer_plan("CUS-501", new_plan="free", expected_plan="pro")

        # 2. Query customer endpoint - verify discrepancy is detected
        cust_res = client.get("/customers/CUS-501")
        assert cust_res.status_code == 200
        cust_data = cust_res.json()
        assert cust_data["customer_id"] == "CUS-501"
        assert cust_data["plan"] == "free"
        assert cust_data["expected_plan"] == "pro"
        assert cust_data["discrepancy_detected"] is True

        # 3. Test customer message timeline persistence
        cust_msg_res = client.post(
            "/api/v1/tickets/TKT-1001/timeline",
            json={
                "sender_type": "customer",
                "sender_name": "Alex Morgan",
                "text": "I was charged $9.99 on Nov 4 but cannot access Pro features.",
                "visibility": "public"
            }
        )
        assert cust_msg_res.status_code == 200
        cust_msg = cust_msg_res.json()
        assert cust_msg["sender_type"] == "customer"
        assert cust_msg["ticket_id"] == "TKT-1001"
        assert "charged $9.99" in cust_msg["text"]

        # 4. Test operator message timeline persistence (internal note)
        op_msg_res = client.post(
            "/api/v1/tickets/TKT-1001/timeline",
            json={
                "sender_type": "operator",
                "sender_name": "Lead Operator",
                "text": "Stripe charge TXN-9001 verified. Reconciling database entitlement.",
                "visibility": "private"
            }
        )
        assert op_msg_res.status_code == 200
        op_msg = op_msg_res.json()
        assert op_msg["sender_type"] == "operator"
        assert op_msg["visibility"] == "private"

        # 5. Verify timeline retrieval includes both messages
        tl_res = client.get("/api/v1/tickets/TKT-1001/timeline")
        assert tl_res.status_code == 200
        timeline = tl_res.json()
        assert any(m["id"] == cust_msg["id"] or m["text"] == cust_msg["text"] for m in timeline)
        assert any(m["id"] == op_msg["id"] or m["text"] == op_msg["text"] for m in timeline)

        # 6. Test AI Draft approval
        draft_res = client.post(
            "/drafts/TKT-1001/approve",
            json={
                "decision": "approve",
                "approver": "Lead Support Lead"
            }
        )
        assert draft_res.status_code == 200
        assert draft_res.json()["status"] == "APPROVED"

        # 7. Test customer plan reconciliation sync (Sync Database to Stripe)
        sync_res = client.post("/customers/CUS-501/sync")
        assert sync_res.status_code == 200
        synced_cust = sync_res.json()
        assert synced_cust["plan"] == "pro"
        assert synced_cust["discrepancy_detected"] is False
        assert synced_cust["discrepancy_note"] is None

        # 8. Re-query customer endpoint - discrepancy is resolved
        verify_res = client.get("/customers/CUS-501")
        assert verify_res.status_code == 200
        verify_cust = verify_res.json()
        assert verify_cust["plan"] == "pro"
        assert verify_cust["discrepancy_detected"] is False

        # 9. Verify alias support on customer sync
        alias_sync = client.post("/customers/CUST-001/sync")
        assert alias_sync.status_code == 200
        assert alias_sync.json()["customer_id"] == "CUS-501"
    finally:
        # Restore baseline demo state for CUS-501
        customer_service.sync_customer_plan("CUS-501", new_plan="free", expected_plan="pro")
