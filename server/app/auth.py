import os
from typing import Optional, Dict, Any
from pathlib import Path
from dotenv import load_dotenv
import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(ENV_PATH)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_JWKS_URL = os.getenv(
    "SUPABASE_JWKS_URL",
    f"{SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json" if SUPABASE_URL else ""
)

# Initialize JWKS client for remote key retrieval and caching if URL configured
jwks_client = jwt.PyJWKClient(SUPABASE_JWKS_URL, cache_keys=True) if SUPABASE_JWKS_URL else None
security = HTTPBearer(auto_error=False)

DEMO_USERS = {
    "mock-jwt-alex-rivera": {
        "id": "usr-demo-001",
        "email": "alex.rivera@supportflow.ai",
        "name": "Alex Rivera",
        "role": "Lead Support Engineer",
        "is_demo": True,
    },
    "mock-jwt-sarah-chen": {
        "id": "usr-demo-002",
        "email": "sarah.chen@supportflow.ai",
        "name": "Sarah Chen",
        "role": "Founder & Tier-3 Escalation Lead",
        "is_demo": True,
    },
    "mock-jwt-hackathon-judge": {
        "id": "usr-demo-003",
        "email": "judge@switch-hackathon.ai",
        "name": "Hackathon Judge (Guest Operator)",
        "role": "Auditor & Governance Evaluator",
        "is_demo": True,
    },
}

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify Supabase JWT token or demo token.
    Returns user payload or None if invalid.
    """
    if not token:
        return None

    # Handle demo persona tokens for 1-click testability
    if token in DEMO_USERS:
        return DEMO_USERS[token]

    if not jwks_client:
        return None

    try:
        # Get signing key from Supabase JWKS endpoint
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        # Decode and verify payload
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256", "HS256"],
            audience="authenticated",
            options={"verify_exp": True}
        )
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("user_metadata", {}).get("full_name") or payload.get("user_metadata", {}).get("name") or payload.get("email"),
            "role": payload.get("role", "authenticated"),
            "raw_payload": payload,
            "is_demo": False,
        }
    except Exception as e:
        # Log error in debug mode if needed
        return None

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> Optional[Dict[str, Any]]:
    """Optional authentication dependency: returns user dict or None."""
    if not credentials:
        return None
    return verify_token(credentials.credentials)

async def require_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> Dict[str, Any]:
    """Strict authentication dependency: raises 401 if unauthenticated."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization bearer token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = verify_token(credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

