import uuid

from psycopg.rows import dict_row

from ..db import get_db

MAX_PAGE_SIZE = 100
DEFAULT_PAGE_SIZE = 50


class Snippet:
    @staticmethod
    def create(user_id: str, title: str, content: str, language: str | None) -> dict:
        db = get_db()
        with db.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                INSERT INTO snippets (id, user_id, title, content, language)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, user_id, title, content, language, created_at, updated_at
                """,
                (str(uuid.uuid4()), user_id, title, content, language or None),
            )
            db.commit()
            return cur.fetchone()

    @staticmethod
    def list_for_user(user_id: str, limit: int = DEFAULT_PAGE_SIZE, offset: int = 0) -> list[dict]:
        limit = max(1, min(limit, MAX_PAGE_SIZE))
        offset = max(0, offset)

        db = get_db()
        with db.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT id, user_id, title, content, language, created_at, updated_at
                FROM snippets
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
                """,
                (user_id, limit, offset),
            )
            return cur.fetchall()

    @staticmethod
    def find_for_user(snippet_id: str, user_id: str) -> dict | None:
        # Scoping every lookup to (id, user_id) in a single query means a
        # snippet that exists but belongs to someone else is indistinguishable
        # from one that doesn't exist — callers can't accidentally leak it.
        db = get_db()
        with db.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT id, user_id, title, content, language, created_at, updated_at
                FROM snippets
                WHERE id = %s AND user_id = %s
                """,
                (snippet_id, user_id),
            )
            return cur.fetchone()

    @staticmethod
    def update_for_user(
        snippet_id: str,
        user_id: str,
        title: str | None = None,
        content: str | None = None,
        language: str | None = None,
        clear_language: bool = False,
    ) -> dict | None:
        db = get_db()
        with db.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                UPDATE snippets
                SET title = COALESCE(%s, title),
                    content = COALESCE(%s, content),
                    language = CASE WHEN %s THEN NULL ELSE COALESCE(%s, language) END
                WHERE id = %s AND user_id = %s
                RETURNING id, user_id, title, content, language, created_at, updated_at
                """,
                (title, content, clear_language, language, snippet_id, user_id),
            )
            db.commit()
            return cur.fetchone()

    @staticmethod
    def delete_for_user(snippet_id: str, user_id: str) -> bool:
        db = get_db()
        with db.cursor() as cur:
            cur.execute(
                "DELETE FROM snippets WHERE id = %s AND user_id = %s",
                (snippet_id, user_id),
            )
            db.commit()
            return cur.rowcount > 0
