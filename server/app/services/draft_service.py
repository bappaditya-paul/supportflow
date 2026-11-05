import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional
from app.models import DraftResponse

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DRAFTS_DIR = BASE_DIR / "artifacts" / "drafts"
APPROVED_DIR = BASE_DIR / "artifacts" / "approved"

def get_draft_by_ticket(ticket_id: str) -> Optional[dict]:
    # Check pending
    f_pending = DRAFTS_DIR / f"{ticket_id.upper()}.json"
    if f_pending.exists():
        with open(f_pending, "r", encoding="utf-8") as f:
            return json.load(f)

    # Check approved
    f_approved = APPROVED_DIR / f"{ticket_id.upper()}.json"
    if f_approved.exists():
        with open(f_approved, "r", encoding="utf-8") as f:
            return json.load(f)

    return None

def list_all_drafts() -> List[dict]:
    all_drafts = []
    if DRAFTS_DIR.exists():
        for f in DRAFTS_DIR.glob("*.json"):
            with open(f, "r", encoding="utf-8") as fp:
                all_drafts.append(json.load(fp))
    if APPROVED_DIR.exists():
        for f in APPROVED_DIR.glob("*.json"):
            with open(f, "r", encoding="utf-8") as fp:
                all_drafts.append(json.load(fp))
    return all_drafts

def approve_draft(ticket_id: str, decision: str, approver: str = "Lead Support Engineer") -> dict:
    f_pending = DRAFTS_DIR / f"{ticket_id.upper()}.json"
    if not f_pending.exists():
        raise FileNotFoundError(f"No pending draft for ticket {ticket_id}")

    with open(f_pending, "r", encoding="utf-8") as f:
        draft = json.load(f)

    decision_norm = decision.lower()
    draft["status"] = "APPROVED" if decision_norm == "approve" else "REJECTED"
    draft["approver"] = approver
    draft["decided_at"] = datetime.now(timezone.utc).isoformat()

    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    f_target = APPROVED_DIR / f"{ticket_id.upper()}.json"
    with open(f_target, "w", encoding="utf-8") as f:
        json.dump(draft, f, indent=2)

    f_pending.unlink(missing_ok=True)
    return draft
