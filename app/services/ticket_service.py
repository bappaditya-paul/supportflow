import json
from pathlib import Path
from typing import List, Optional
from app.models import Ticket

DATA_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "tickets.json"

def get_all_tickets() -> List[Ticket]:
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [Ticket(**item) for item in data]

def get_ticket_by_id(ticket_id: str) -> Optional[Ticket]:
    tickets = get_all_tickets()
    return next((t for t in tickets if t.ticket_id.upper() == ticket_id.upper()), None)
