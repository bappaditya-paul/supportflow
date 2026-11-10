import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional
from app.db.supabase import get_supabase_admin

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DRAFTS_DIR = BASE_DIR / "artifacts" / "drafts"
APPROVED_DIR = BASE_DIR / "artifacts" / "approved"

def get_draft_by_ticket(ticket_id: str) -> Optional[dict]:
    """Retrieve draft from Supabase if online, falling back to local files."""
    client = get_supabase_admin()
    if client:
        try:
            res = client.table("agent_drafts").select("*").eq("ticket_id", ticket_id.upper()).execute()
            if res.data and len(res.data) > 0:
                row = res.data[0]
                return {
                    "ticket_id": row["ticket_id"],
                    "status": row.get("status", "PENDING_APPROVAL"),
                    "draft_text": row.get("draft_text", ""),
                    "evidence_used": row.get("evidence_used", ""),
                    "policy_references": row.get("policy_references", ""),
                    "quality_score": row.get("quality_score", "0.95"),
                    "human_approval_required": row.get("human_approval_required", True),
                    "approver": row.get("approver_name"),
                    "decided_at": row.get("decided_at"),
                    "created_at": row.get("created_at"),
                }
        except Exception:
            pass

    # Check pending in filesystem
    f_pending = DRAFTS_DIR / f"{ticket_id.upper()}.json"
    if f_pending.exists():
        with open(f_pending, "r", encoding="utf-8") as f:
            return json.load(f)

    # Check approved in filesystem
    f_approved = APPROVED_DIR / f"{ticket_id.upper()}.json"
    if f_approved.exists():
        with open(f_approved, "r", encoding="utf-8") as f:
            return json.load(f)

    return None

def list_all_drafts() -> List[dict]:
    """List all drafts from Supabase if online, falling back to local files."""
    client = get_supabase_admin()
    if client:
        try:
            res = client.table("agent_drafts").select("*").order("created_at", desc=True).execute()
            if res.data and len(res.data) > 0:
                drafts = []
                for row in res.data:
                    drafts.append({
                        "ticket_id": row["ticket_id"],
                        "status": row.get("status", "PENDING_APPROVAL"),
                        "draft_text": row.get("draft_text", ""),
                        "evidence_used": row.get("evidence_used", ""),
                        "policy_references": row.get("policy_references", ""),
                        "quality_score": row.get("quality_score", "0.95"),
                        "human_approval_required": row.get("human_approval_required", True),
                        "approver": row.get("approver_name"),
                        "decided_at": row.get("decided_at"),
                        "created_at": row.get("created_at"),
                    })
                return drafts
        except Exception:
            pass

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
    """Approve or reject draft, persisting to both local disk and Supabase if available."""
    f_pending = DRAFTS_DIR / f"{ticket_id.upper()}.json"
    f_approved = APPROVED_DIR / f"{ticket_id.upper()}.json"

    draft = None
    if f_pending.exists():
        with open(f_pending, "r", encoding="utf-8") as f:
            draft = json.load(f)
    elif f_approved.exists():
        with open(f_approved, "r", encoding="utf-8") as f:
            draft = json.load(f)
    else:
        # Check if exists in Supabase
        client = get_supabase_admin()
        if client:
            try:
                res = client.table("agent_drafts").select("*").eq("ticket_id", ticket_id.upper()).execute()
                if res.data and len(res.data) > 0:
                    draft = res.data[0]
            except Exception:
                pass

    if not draft:
        raise FileNotFoundError(f"No pending draft for ticket {ticket_id}")

    decision_norm = decision.lower()
    status_val = "APPROVED" if decision_norm == "approve" else "REJECTED"
    now_iso = datetime.now(timezone.utc).isoformat()

    draft["status"] = status_val
    draft["approver"] = approver
    draft["decided_at"] = now_iso

    # Persist to local filesystem
    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    f_target = APPROVED_DIR / f"{ticket_id.upper()}.json"
    with open(f_target, "w", encoding="utf-8") as f:
        json.dump(draft, f, indent=2)

    if f_pending.exists():
        f_pending.unlink(missing_ok=True)

    # Persist to Supabase if configured and available
    client = get_supabase_admin()
    if client:
        try:
            client.table("agent_drafts").upsert({
                "ticket_id": ticket_id.upper(),
                "status": status_val,
                "draft_text": draft.get("draft_text", ""),
                "evidence_used": draft.get("evidence_used", ""),
                "policy_references": draft.get("policy_references", ""),
                "quality_score": draft.get("quality_score", "0.95"),
                "human_approval_required": draft.get("human_approval_required", True),
                "approver_name": approver,
                "decided_at": now_iso,
            }).execute()

            # Record in timeline for audit trail
            client.table("ticket_timeline").insert({
                "ticket_id": ticket_id.upper(),
                "sender_type": "operator",
                "sender_name": approver,
                "text": f"Operator decision: {status_val}. Dispatched draft response to customer.",
                "visibility": "public",
                "tool_name": "approve_draft",
                "tool_status": "completed"
            }).execute()
        except Exception:
            pass

    return draft
