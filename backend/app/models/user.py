import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import psycopg
from psycopg.rows import dict_row

from ..db import get_db
from ..utils.exceptions import EmailAlreadyExistsError

# Checked against when no matching user is found, so that a failed login for a
# nonexistent email takes the same time as one for a real user with a wrong
# password. Prevents timing attacks from revealing which emails are registered.
_DUMMY_PASSWORD_HASH = bcrypt.hashpw(b"not-a-real-password", bcrypt.gensalt(rounds=12))


class User:
    @staticmethod
    def create(email: str, displayname: str, password: str) -> dict:
        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(rounds=12),
        ).decode("utf-8")

        db = get_db()
        try:
            with db.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                    INSERT INTO users (id, email, displayname, password_hash)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, email, displayname, created_at
                    """,
                    (str(uuid.uuid4()), email.lower(), displayname, password_hash),
                )
                db.commit()
                row = cur.fetchone()
                return {
                    "id": row["id"],
                    "email": row["email"],
                    "displayname": row["displayname"],
                    "created_at": row["created_at"].isoformat(),
                }
        except psycopg.errors.UniqueViolation:
            db.rollback()
            raise EmailAlreadyExistsError("A user with this email already exists.")
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def find_by_email(email: str) -> dict | None:
        db = get_db()
        with db.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT id, email, displayname, password_hash,
                       failed_login_attempts, locked_until
                FROM users
                WHERE email = %s
                """,
                (email.lower(),),
            )
            return cur.fetchone()

    @staticmethod
    def find_by_id(user_id: str) -> dict | None:
        db = get_db()
        with db.cursor(row_factory=dict_row) as cur:
            cur.execute(
                "SELECT id, email, displayname FROM users WHERE id = %s",
                (user_id,),
            )
            return cur.fetchone()

    @staticmethod
    def verify_password(password: str, password_hash: str | None) -> bool:
        hash_bytes = password_hash.encode("utf-8") if password_hash else _DUMMY_PASSWORD_HASH
        return bcrypt.checkpw(password.encode("utf-8"), hash_bytes)

    @staticmethod
    def is_locked(user: dict) -> bool:
        locked_until = user.get("locked_until")
        return locked_until is not None and locked_until > datetime.now(timezone.utc)

    @staticmethod
    def register_failed_login(user_id: str, max_attempts: int, lockout_minutes: int) -> None:
        db = get_db()
        with db.cursor() as cur:
            cur.execute(
                """
                UPDATE users
                SET failed_login_attempts = failed_login_attempts + 1,
                    locked_until = CASE
                        WHEN failed_login_attempts + 1 >= %s
                        THEN %s
                        ELSE locked_until
                    END
                WHERE id = %s
                """,
                (
                    max_attempts,
                    datetime.now(timezone.utc) + timedelta(minutes=lockout_minutes),
                    user_id,
                ),
            )
            db.commit()

    @staticmethod
    def register_successful_login(user_id: str) -> None:
        db = get_db()
        with db.cursor() as cur:
            cur.execute(
                """
                UPDATE users
                SET failed_login_attempts = 0,
                    locked_until = NULL,
                    last_login_at = NOW()
                WHERE id = %s
                """,
                (user_id,),
            )
            db.commit()
