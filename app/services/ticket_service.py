import json
from pathlib import Path
from typing import List, Optional
from app.models import Ticket
from app.db.supabase import get_supabase_admin

DATA_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "tickets.json"

def get_all_tickets() -> List[Ticket]:
    """Retrieve all tickets from Supabase if online, falling back to local JSON data."""
    client = get_supabase_admin()
    if client:
        try:
            res = client.table("tickets").select("*").order("created_at", desc=True).execute()
            if res.data and len(res.data) > 0:
                tickets = []
                for row in res.data:
                    tickets.append(Ticket(
                        ticket_id=row["ticket_id"],
                        customer_id=row.get("customer_id") or "CUS-UNKNOWN",
                        category=row.get("category", "general"),
                        priority=row.get("priority", "normal"),
                        subject=row.get("subject", "Support Inquiry"),
                        message=row.get("message", ""),
                        status=row.get("status", "open"),
                        created_at=str(row.get("created_at", "")),
                    ))
                return tickets
        except Exception:
            # Fallback to local data file when table is not yet created or unreachable
            pass

    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [Ticket(**item) for item in data]

def get_ticket_by_id(ticket_id: str) -> Optional[Ticket]:
    """Retrieve ticket by ID from Supabase if online, falling back to local JSON data."""
    client = get_supabase_admin()
    if client:
        try:
            res = client.table("tickets").select("*").eq("ticket_id", ticket_id.upper()).execute()
            if res.data and len(res.data) > 0:
                row = res.data[0]
                return Ticket(
                    ticket_id=row["ticket_id"],
                    customer_id=row.get("customer_id") or "CUS-UNKNOWN",
                    category=row.get("category", "general"),
                    priority=row.get("priority", "normal"),
                    subject=row.get("subject", "Support Inquiry"),
                    message=row.get("message", ""),
                    status=row.get("status", "open"),
                    created_at=str(row.get("created_at", "")),
                )
        except Exception:
            pass

    tickets = get_all_tickets()
    return next((t for t in tickets if t.ticket_id.upper() == ticket_id.upper()), None)
