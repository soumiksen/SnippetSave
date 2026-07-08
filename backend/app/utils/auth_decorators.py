from functools import wraps

import jwt
from flask import current_app, g, jsonify, request

from .tokens import decode_access_token


def authenticate_request():
    """Validate the Bearer access token and set g.user_id. Returns a Flask
    response tuple on failure, or None on success. Used both as the body of
    the `token_required` decorator and as a blueprint-wide before_request
    hook, so a route can't be left unprotected by omitting a decorator."""
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
    return None


def token_required(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        error_response = authenticate_request()
        if error_response is not None:
            return error_response
        return view(*args, **kwargs)

    return wrapper
