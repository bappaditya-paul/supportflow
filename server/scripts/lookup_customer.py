#!/usr/bin/env python3
"""
Lookup Customer Script
Deterministic CLI tool with automated PII masking and mismatch detection.
"""

import argparse
import json
import sys
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "customers.json"

def mask_email(email: str) -> str:
    if "@" not in email:
        return "***"
    user, domain = email.split("@", 1)
    if len(user) <= 2:
        return f"{user[0]}***@{domain}"
    return f"{user[:2]}***{user[-1]}@{domain}"

def lookup_customer(customer_id: str):
    if not DATA_PATH.exists():
        print(f"[ERROR] Data file not found: {DATA_PATH}", file=sys.stderr)
        sys.exit(1)

    with open(DATA_PATH, "r") as f:
        customers = json.load(f)

    match = next((c for c in customers if c["customer_id"].upper() == customer_id.upper()), None)
    if not match:
        print(f"[NOT_FOUND] No customer found matching ID '{customer_id}'")
        sys.exit(1)

    # Check for discrepancies
    mismatch = False
    mismatch_note = ""
    if match.get("payment_status") == "paid" and match.get("plan") != match.get("expected_plan"):
        mismatch = True
        mismatch_note = f"CRITICAL: Payment of ${match.get('payment_amount')} confirmed, but plan is '{match.get('plan')}' instead of '{match.get('expected_plan')}'!"
    elif match.get("payment_status") == "duplicate_charge_reported":
        mismatch = True
        mismatch_note = "ALERT: Duplicate charge reported in ledger. Dual transaction IDs detected."

    print("=== CUSTOMER INVESTIGATION REPORT ===")
    print(f"Customer ID:     {match['customer_id']}")
    print(f"Name:            {match['name']}")
    print(f"Email (Masked):  {mask_email(match['email'])}")
    print(f"Current Plan:    {match['plan'].upper()}")
    print(f"Expected Plan:   {match.get('expected_plan', 'UNKNOWN').upper()}")
    print(f"Payment Status:  {match['payment_status'].upper()}")
    print(f"Payment Amount:  ${match['payment_amount']}")
    print(f"Payment Date:    {match.get('payment_date', 'N/A')}")
    print(f"Transaction ID:  {match.get('transaction_id', 'N/A')}")
    print(f"Card Ending:     ****{match.get('card_last4', '0000')}")
    print("--- DIAGNOSTIC FINDINGS ---")
    if mismatch:
        print(f"DISCREPANCY:     YES")
        print(f"Finding:         {mismatch_note}")
    else:
        print(f"DISCREPANCY:     NO (Records consistent)")
    print("=====================================")

def main():
    parser = argparse.ArgumentParser(description="Lookup customer account by ID")
    parser.add_argument("--id", required=True, help="Customer ID (e.g. CUS-501)")
    args = parser.parse_args()
    lookup_customer(args.id)

if __name__ == "__main__":
    main()
