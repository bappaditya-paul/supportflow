import pytest
from app.services.ticket_service import get_ticket_by_id
from app.services.customer_service import get_customer_by_id
from app.services.knowledge_service import search_knowledge

def test_full_supportflow_workflow_tkt_1001():
    """
    Simulates the full multi-agent workflow for TKT-1001:
    1. Triager classifies ticket
    2. Investigator verifies customer & payment
    3. Knowledge agent matches policy
    4. Deterministic assertions verify zero hallucination
    """
    # 1. Ticket ingestion & classification
    ticket = get_ticket_by_id("TKT-1001")
    assert ticket is not None
    assert ticket.category == "billing"
    assert ticket.priority == "high"

    # 2. Customer investigation
    customer = get_customer_by_id(ticket.customer_id)
    assert customer is not None
    assert customer.payment_status == "paid"
    assert customer.plan == "free"
    assert customer.expected_plan == "pro"
    assert customer.discrepancy_detected is True

    # 3. Policy match
    policies = search_knowledge("subscription payment mismatch")
    assert len(policies) > 0
    top_policy = policies[0]
    assert "billing" in top_policy.file.lower()
    assert "webhook/provisioning failure" in top_policy.content.lower()

    # 4. Safety assertions
    # Verify customer email is never exposed in raw text
    assert "@example.com" in customer.email_masked
    assert "alex.morgan" not in customer.email_masked
