from functools import wraps

import jwt
from flask import current_app, g, jsonify, request

from .tokens import decode_access_token


def token_required(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header."}), 401

        token = auth_header[len("Bearer "):].strip()
        try:
            payload = decode_access_token(token, current_app.config["JWT_SECRET_KEY"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Access token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid access token."}), 401

        g.user_id = payload["sub"]
        return view(*args, **kwargs)

    return wrapper
