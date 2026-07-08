import uuid
import bcrypt
import psycopg
from psycopg.rows import dict_row

from ..db import get_db
from ..utils.exceptions import EmailAlreadyExistsError


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
