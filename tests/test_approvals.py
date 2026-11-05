import pytest
import shutil
from pathlib import Path
from app.services.draft_service import approve_draft, get_draft_by_ticket
from scripts.create_draft import create_draft

def test_draft_creation_and_approval(tmp_path):
    ticket_id = "TKT-TEST"
    create_draft(
        ticket_id=ticket_id,
        draft_text="Hello, your plan is verified.",
        evidence="Paid $9.99",
        policies="Billing Policy"
    )

    draft = get_draft_by_ticket(ticket_id)
    assert draft is not None
    assert draft["status"] == "PENDING_APPROVAL"
    assert draft["human_approval_required"] is True

    # Approve
    approved = approve_draft(ticket_id, decision="approve", approver="Senior Support Lead")
    assert approved["status"] == "APPROVED"
    assert approved["approver"] == "Senior Support Lead"
    assert "decided_at" in approved

    # Clean up test artifacts
    base_dir = Path(__file__).resolve().parent.parent
    (base_dir / "artifacts" / "approved" / f"{ticket_id}.json").unlink(missing_ok=True)
