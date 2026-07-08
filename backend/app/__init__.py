from flask import Flask
from .config import get_config
from .db import init_db
from .extensions import limiter


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(get_config())

    init_db(app)
    limiter.init_app(app)

    from .routes.auth import auth_bp
    from .routes.health import health_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(health_bp, url_prefix="/api")

    return app
