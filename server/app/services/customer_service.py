import json
from pathlib import Path
from typing import List, Optional
from app.models import Customer
from app.db.supabase import get_supabase_admin

DATA_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "customers.json"

def mask_email(email: str) -> str:
    if "@" not in email:
        return "***"
    user, domain = email.split("@", 1)
    if len(user) <= 2:
        return f"{user[0]}***@{domain}"
    return f"{user[:2]}***{user[-1]}@{domain}"

def _build_customer_from_dict(match: dict) -> Customer:
    mismatch = False
    mismatch_note = None
    if match.get("payment_status") == "paid" and match.get("plan") != match.get("expected_plan"):
        mismatch = True
        mismatch_note = f"Payment of ${match.get('payment_amount')} confirmed, but plan is '{match.get('plan')}' instead of '{match.get('expected_plan')}'!"
    elif match.get("payment_status") == "duplicate_charge_reported":
        mismatch = True
        mismatch_note = "Duplicate charge reported in ledger."
    elif match.get("discrepancy_detected"):
        mismatch = True
        mismatch_note = match.get("discrepancy_note")

    email = match.get("email", "")
    email_masked = match.get("email_masked") or mask_email(email)

    return Customer(
        customer_id=match["customer_id"],
        name=match["name"],
        email_masked=email_masked,
        plan=match.get("plan", "free"),
        expected_plan=match.get("expected_plan"),
        payment_status=match.get("payment_status", "unpaid"),
        payment_amount=float(match.get("payment_amount") or 0.0),
        payment_date=str(match.get("payment_date")) if match.get("payment_date") else None,
        transaction_id=match.get("transaction_id"),
        card_last4=match.get("card_last4"),
        discrepancy_detected=mismatch,
        discrepancy_note=mismatch_note
    )

def get_all_customers() -> List[Customer]:
    """Retrieve all customers from Supabase if online, falling back to local JSON data."""
    client = get_supabase_admin()
    if client:
        try:
            res = client.table("customers").select("*").execute()
            if res.data and len(res.data) > 0:
                return [_build_customer_from_dict(row) for row in res.data]
        except Exception:
            pass

    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    return [_build_customer_from_dict(item) for item in data]

def get_customer_by_id(customer_id: str) -> Optional[Customer]:
    """Retrieve customer by ID from Supabase if online, falling back to local JSON data."""
    client = get_supabase_admin()
    if client:
        try:
            res = client.table("customers").select("*").eq("customer_id", customer_id.upper()).execute()
            if res.data and len(res.data) > 0:
                return _build_customer_from_dict(res.data[0])
        except Exception:
            pass

    if not DATA_FILE.exists():
        return None
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    match = next((c for c in data if c["customer_id"].upper() == customer_id.upper()), None)
    if not match:
        return None

    return _build_customer_from_dict(match)
