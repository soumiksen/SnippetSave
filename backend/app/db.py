import psycopg
from psycopg_pool import ConnectionPool
from psycopg.rows import dict_row
from flask import g


_pool: ConnectionPool | None = None


def init_db(app) -> None:
    global _pool
    _pool = ConnectionPool(
        conninfo=app.config["DATABASE_URL"],
        min_size=app.config["DB_POOL_MIN"],
        max_size=app.config["DB_POOL_MAX"],
        open=True,
    )
    app.teardown_appcontext(_release_connection)


def get_db():
    if "db" not in g:
        g.db = _pool.getconn()
        g.db.autocommit = False
    return g.db


def _release_connection(exception) -> None:
    db = g.pop("db", None)
    if db is not None:
        if exception:
            db.rollback()
        _pool.putconn(db)
