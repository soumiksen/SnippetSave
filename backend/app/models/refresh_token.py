import uuid
from datetime import datetime, timedelta, timezone

from psycopg.rows import dict_row

from ..db import get_db
from ..utils.tokens import generate_refresh_token, hash_refresh_token


class RefreshToken:
    @staticmethod
    def create(user_id: str, expires_days: int) -> str:
        raw_token = generate_refresh_token()
        db = get_db()
        with db.cursor() as cur:
            cur.execute(
                """
                INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    str(uuid.uuid4()),
                    user_id,
                    hash_refresh_token(raw_token),
                    datetime.now(timezone.utc) + timedelta(days=expires_days),
                ),
            )
            db.commit()
        return raw_token

    @staticmethod
    def find_valid(raw_token: str) -> dict | None:
        db = get_db()
        with db.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT id, user_id, expires_at, revoked_at
                FROM refresh_tokens
                WHERE token_hash = %s
                """,
                (hash_refresh_token(raw_token),),
            )
            row = cur.fetchone()

        if row is None:
            return None
        if row["revoked_at"] is not None:
            return None
        if row["expires_at"] <= datetime.now(timezone.utc):
            return None
        return row

    @staticmethod
    def find_any(raw_token: str) -> dict | None:
        """Look up a token regardless of revoked/expired status, to detect reuse of a
        rotated-out refresh token — a signal that it may have been stolen."""
        db = get_db()
        with db.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT id, user_id, expires_at, revoked_at
                FROM refresh_tokens
                WHERE token_hash = %s
                """,
                (hash_refresh_token(raw_token),),
            )
            return cur.fetchone()

    @staticmethod
    def revoke(token_id: str) -> None:
        db = get_db()
        with db.cursor() as cur:
            cur.execute(
                "UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = %s AND revoked_at IS NULL",
                (token_id,),
            )
            db.commit()

    @staticmethod
    def revoke_by_raw_token(raw_token: str) -> None:
        db = get_db()
        with db.cursor() as cur:
            cur.execute(
                """
                UPDATE refresh_tokens
                SET revoked_at = NOW()
                WHERE token_hash = %s AND revoked_at IS NULL
                """,
                (hash_refresh_token(raw_token),),
            )
            db.commit()

    @staticmethod
    def revoke_all_for_user(user_id: str) -> None:
        db = get_db()
        with db.cursor() as cur:
            cur.execute(
                """
                UPDATE refresh_tokens
                SET revoked_at = NOW()
                WHERE user_id = %s AND revoked_at IS NULL
                """,
                (user_id,),
            )
            db.commit()
