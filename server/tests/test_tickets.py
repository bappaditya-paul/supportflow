import pytest
from app.services.ticket_service import get_all_tickets, get_ticket_by_id
from app.services.customer_service import get_customer_by_id

def test_list_all_tickets():
    tickets = get_all_tickets()
    assert len(tickets) >= 3
    ticket_ids = [t.ticket_id for t in tickets]
    assert "TKT-1001" in ticket_ids

def test_ticket_lookup_valid():
    ticket = get_ticket_by_id("TKT-1001")
    assert ticket is not None
    assert ticket.customer_id == "CUS-501"
    assert ticket.category == "billing"
    assert ticket.priority == "high"

def test_ticket_lookup_invalid():
    ticket = get_ticket_by_id("TKT-9999")
    assert ticket is None

def test_customer_discrepancy_detection():
    customer = get_customer_by_id("CUS-501")
    assert customer is not None
    assert customer.payment_status == "paid"
    assert customer.plan == "free"
    assert customer.expected_plan == "pro"
    assert customer.discrepancy_detected is True
    assert "confirmed" in customer.discrepancy_note.lower()

def test_customer_pii_masking():
    customer = get_customer_by_id("CUS-501")
    assert customer is not None
    assert "alex.morgan@example.com" not in customer.email_masked
    assert "***" in customer.email_masked
