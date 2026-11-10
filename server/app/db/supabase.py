import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(ENV_PATH)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_PUBLISHABLE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY", "")

_client: Optional[Client] = None


def get_supabase_admin() -> Optional[Client]:
    """Retrieve initialized Supabase admin client with service_role permissions."""
    global _client
    if _client is not None:
        return _client
    try:
        if SUPABASE_URL and SUPABASE_SECRET_KEY:
            _client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
            return _client
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
    return None


def is_supabase_configured() -> bool:
    """Check if Supabase credentials are configured in environment."""
    return bool(SUPABASE_URL and SUPABASE_SECRET_KEY)

