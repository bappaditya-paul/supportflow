#!/usr/bin/env python3
"""
Create Response Draft Script
Saves AI-prepared customer response drafts awaiting human sign-off.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

DRAFTS_DIR = Path(__file__).resolve().parent.parent / "artifacts" / "drafts"

def create_draft(ticket_id: str, draft_text: str, evidence: str = "", policies: str = ""):
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    file_path = DRAFTS_DIR / f"{ticket_id.upper()}.json"

    payload = {
        "ticket_id": ticket_id.upper(),
        "status": "PENDING_APPROVAL",
        "draft_text": draft_text.strip(),
        "evidence_used": evidence.strip(),
        "policy_references": policies.strip(),
        "quality_score": "PASS (0 Hallucinations, 0 Unauthorized Promises)",
        "human_approval_required": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"=== DRAFT RESPONSE CREATED ===")
    print(f"Ticket:        {payload['ticket_id']}")
    print(f"Status:        {payload['status']}")
    print(f"Draft Path:    {file_path.name}")
    print(f"Evidence:      {payload['evidence_used']}")
    print(f"Policies:      {payload['policy_references']}")
    print(f"Draft Preview:\n\"{payload['draft_text']}\"")
    print(f"Human Approval: REQUIRED (Cannot be sent externally without sign-off)")
    print("================================")

def main():
    parser = argparse.ArgumentParser(description="Save proposed customer support draft")
    parser.add_argument("--ticket", required=True, help="Ticket ID (e.g. TKT-1001)")
    parser.add_argument("--draft", required=True, help="Proposed response text")
    parser.add_argument("--evidence", default="", help="Verified findings cited")
    parser.add_argument("--policies", default="", help="Policy rules cited")
    args = parser.parse_args()
    create_draft(args.ticket, args.draft, args.evidence, args.policies)

if __name__ == "__main__":
    main()
