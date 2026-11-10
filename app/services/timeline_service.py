import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.db.supabase import get_supabase_admin

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
TIMELINES_FILE = DATA_DIR / "timelines.json"


def _load_local_timelines() -> Dict[str, List[Dict[str, Any]]]:
    """Load timelines from local JSON storage."""
    if not TIMELINES_FILE.exists():
        return {}
    try:
        with open(TIMELINES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def _save_local_timelines(data: Dict[str, List[Dict[str, Any]]]) -> None:
    """Save timelines to local JSON storage."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(TIMELINES_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def get_ticket_timeline(ticket_id: str) -> List[Dict[str, Any]]:
    """Retrieve full conversation timeline for a ticket, querying Supabase first with local JSON persistence."""
    normalized_id = ticket_id.upper()
    client = get_supabase_admin()

    if client:
        try:
            res = (
                client.table("ticket_timeline")
                .select("*")
                .eq("ticket_id", normalized_id)
                .order("created_at", desc=False)
                .execute()
            )
            if res.data and len(res.data) > 0:
                timeline = []
                for item in res.data:
                    tool_call = None
                    if item.get("tool_name"):
                        tool_call = {
                            "name": item.get("tool_name"),
                            "params": item.get("tool_params") or {},
                            "result": item.get("tool_result") or {},
                            "status": item.get("tool_status", "completed"),
                        }
                    timeline.append({
                        "id": str(item.get("id")),
                        "ticket_id": normalized_id,
                        "sender_type": item.get("sender_type", "customer"),
                        "sender_name": item.get("sender_name", "Customer"),
                        "text": item.get("text", ""),
                        "visibility": item.get("visibility", "public"),
                        "created_at": str(item.get("created_at", "")),
                        "tool_call": tool_call,
                    })
                return timeline
        except Exception:
            pass

    # Fallback to local JSON persistence
    local_data = _load_local_timelines()
    if normalized_id in local_data:
        return local_data[normalized_id]

    # Default seed message if none exists
    seed = [{
        "id": f"msg-seed-{normalized_id}",
        "ticket_id": normalized_id,
        "sender_type": "customer",
        "sender_name": "Customer",
        "text": f"Support inquiry filed for {normalized_id}.",
        "visibility": "public",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }]
    return seed


def add_timeline_message(
    ticket_id: str,
    sender_type: str,
    sender_name: str,
    text: str,
    visibility: str = "public",
    tool_name: Optional[str] = None,
    tool_params: Optional[dict] = None,
    tool_result: Optional[dict] = None,
    tool_status: Optional[str] = None,
) -> Dict[str, Any]:
    """Append a new message or tool execution event to the conversation timeline."""
    normalized_id = ticket_id.upper()
    now_iso = datetime.now(timezone.utc).isoformat()
    msg_id = f"msg-{uuid.uuid4().hex[:8]}"

    tool_call = None
    if tool_name:
        tool_call = {
            "name": tool_name,
            "params": tool_params or {},
            "result": tool_result or {},
            "status": tool_status or "completed",
        }

    item: Dict[str, Any] = {
        "id": msg_id,
        "ticket_id": normalized_id,
        "sender_type": sender_type,
        "sender_name": sender_name,
        "text": text,
        "visibility": visibility,
        "created_at": now_iso,
    }
    if tool_call:
        item["tool_call"] = tool_call

    # Save to local storage
    local_data = _load_local_timelines()
    if normalized_id not in local_data:
        local_data[normalized_id] = []
    local_data[normalized_id].append(item)
    _save_local_timelines(local_data)

    # Persist to Supabase if available
    client = get_supabase_admin()
    if client:
        try:
            db_payload: Dict[str, Any] = {
                "ticket_id": normalized_id,
                "sender_type": sender_type,
                "sender_name": sender_name,
                "text": text,
                "visibility": visibility,
            }
            if tool_name:
                db_payload["tool_name"] = tool_name
                db_payload["tool_params"] = tool_params or {}
                db_payload["tool_result"] = tool_result or {}
                db_payload["tool_status"] = tool_status or "completed"
            insert_res = client.table("ticket_timeline").insert(db_payload).execute()
            if insert_res.data and len(insert_res.data) > 0 and "id" in insert_res.data[0]:
                item["id"] = str(insert_res.data[0]["id"])
        except Exception:
            pass
            pass

    return item


