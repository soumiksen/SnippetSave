import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone

import jwt

ACCESS_TOKEN_ALGORITHM = "HS256"


def create_access_token(user_id: str, secret_key: str, expires_minutes: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=expires_minutes),
        "jti": str(uuid.uuid4()),
    }
    return jwt.encode(payload, secret_key, algorithm=ACCESS_TOKEN_ALGORITHM)


def decode_access_token(token: str, secret_key: str) -> dict:
    return jwt.decode(token, secret_key, algorithms=[ACCESS_TOKEN_ALGORITHM])


def generate_refresh_token() -> str:
    return secrets.token_urlsafe(48)


def hash_refresh_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
