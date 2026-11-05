#!/usr/bin/env python3
"""
Approve or Reject Response Draft Script
Human Support Lead governance script. Moves draft to approved audit store.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

DRAFTS_DIR = Path(__file__).resolve().parent.parent / "artifacts" / "drafts"
APPROVED_DIR = Path(__file__).resolve().parent.parent / "artifacts" / "approved"

def process_approval(ticket_id: str, decision: str, approver: str = "Lead Support Engineer"):
    draft_file = DRAFTS_DIR / f"{ticket_id.upper()}.json"
    if not draft_file.exists():
        print(f"[ERROR] No pending draft found for ticket '{ticket_id}' at {draft_file}", file=sys.stderr)
        sys.exit(1)

    with open(draft_file, "r", encoding="utf-8") as f:
        draft = json.load(f)

    decision_norm = decision.lower()
    if decision_norm not in ["approve", "reject"]:
        print("[ERROR] Decision must be 'approve' or 'reject'", file=sys.stderr)
        sys.exit(1)

    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    target_file = APPROVED_DIR / f"{ticket_id.upper()}.json"

    draft["status"] = "APPROVED" if decision_norm == "approve" else "REJECTED"
    draft["approver"] = approver
    draft["decided_at"] = datetime.now(timezone.utc).isoformat()

    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(draft, f, indent=2)

    # Clean up pending draft
    draft_file.unlink(missing_ok=True)

    print(f"=== HUMAN GOVERNANCE DECISION LOGGED ===")
    print(f"Ticket ID:    {draft['ticket_id']}")
    print(f"Decision:     {draft['status']}")
    print(f"Approver:     {draft['approver']}")
    print(f"Timestamp:    {draft['decided_at']}")
    print(f"Audit Record: {target_file}")
    if draft["status"] == "APPROVED":
        print(f"Next Action:  Response marked approved for queue dispatch. (No unauthorized auto-send)")
    else:
        print(f"Next Action:  Returned to agents for revision.")
    print("========================================")

def main():
    parser = argparse.ArgumentParser(description="Human sign-off for customer response drafts")
    parser.add_argument("--ticket", required=True, help="Ticket ID (e.g. TKT-1001)")
    parser.add_argument("--decision", required=True, choices=["approve", "reject"], help="Human approval decision")
    parser.add_argument("--approver", default="Lead Support Engineer", help="Name of approver")
    args = parser.parse_args()
    process_approval(args.ticket, args.decision, args.approver)

if __name__ == "__main__":
    main()
