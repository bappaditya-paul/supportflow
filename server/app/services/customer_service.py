import json
from pathlib import Path
from typing import List, Optional
from app.models import Customer

DATA_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "customers.json"

def mask_email(email: str) -> str:
    if "@" not in email:
        return "***"
    user, domain = email.split("@", 1)
    if len(user) <= 2:
        return f"{user[0]}***@{domain}"
    return f"{user[:2]}***{user[-1]}@{domain}"

def get_customer_by_id(customer_id: str) -> Optional[Customer]:
    if not DATA_FILE.exists():
        return None
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    match = next((c for c in data if c["customer_id"].upper() == customer_id.upper()), None)
    if not match:
        return None

    mismatch = False
    mismatch_note = None
    if match.get("payment_status") == "paid" and match.get("plan") != match.get("expected_plan"):
        mismatch = True
        mismatch_note = f"Payment of ${match.get('payment_amount')} confirmed, but plan is '{match.get('plan')}' instead of '{match.get('expected_plan')}'!"
    elif match.get("payment_status") == "duplicate_charge_reported":
        mismatch = True
        mismatch_note = "Duplicate charge reported in ledger."

    return Customer(
        customer_id=match["customer_id"],
        name=match["name"],
        email_masked=mask_email(match["email"]),
        plan=match["plan"],
        expected_plan=match.get("expected_plan"),
        payment_status=match["payment_status"],
        payment_amount=match["payment_amount"],
        payment_date=match.get("payment_date"),
        transaction_id=match.get("transaction_id"),
        card_last4=match.get("card_last4"),
        discrepancy_detected=mismatch,
        discrepancy_note=mismatch_note
    )
