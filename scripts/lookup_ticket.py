#!/usr/bin/env python3
"""
Lookup Ticket Script
Deterministic CLI tool for AI agents and human support operators.
"""

import argparse
import json
import sys
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "tickets.json"

def lookup_ticket(ticket_id: str):
    if not DATA_PATH.exists():
        print(f"[ERROR] Data file not found: {DATA_PATH}", file=sys.stderr)
        sys.exit(1)

    with open(DATA_PATH, "r") as f:
        tickets = json.load(f)

    match = next((t for t in tickets if t["ticket_id"].upper() == ticket_id.upper()), None)
    if not match:
        print(f"[NOT_FOUND] No ticket found matching ID '{ticket_id}'")
        sys.exit(1)

    print("=== TICKET RECORD ===")
    print(f"Ticket ID:   {match['ticket_id']}")
    print(f"Customer ID: {match['customer_id']}")
    print(f"Category:    {match['category'].upper()}")
    print(f"Priority:    {match['priority'].upper()}")
    print(f"Status:      {match['status'].upper()}")
    print(f"Subject:     {match['subject']}")
    print(f"Message:     \"{match['message']}\"")
    print(f"Created At:  {match['created_at']}")
    print("=====================")

def main():
    parser = argparse.ArgumentParser(description="Lookup customer support ticket by ID")
    parser.add_argument("--id", required=True, help="Ticket ID (e.g. TKT-1001)")
    args = parser.parse_args()
    lookup_ticket(args.id)

if __name__ == "__main__":
    main()
