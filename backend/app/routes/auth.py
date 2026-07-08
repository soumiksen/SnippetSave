import logging

from flask import Blueprint, current_app, g, jsonify, request

from ..extensions import limiter
from ..models.refresh_token import RefreshToken
from ..models.user import User
from ..utils.auth_decorators import token_required
from ..utils.exceptions import EmailAlreadyExistsError
from ..utils.tokens import create_access_token
from ..utils.validators import validate_login, validate_signup

logger = logging.getLogger(__name__)

auth_bp = Blueprint("auth", __name__)

REFRESH_COOKIE_NAME = "refresh_token"
REFRESH_COOKIE_PATH = "/api/auth"


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Request body must be JSON."}), 400

    validation = validate_signup(data)
    if not validation.is_valid:
        return jsonify({"errors": validation.errors}), 422

    try:
        user = User.create(
            email=data["email"].strip(),
            displayname=data["displayname"].strip(),
            password=data["password"],
        )
        return jsonify({"user": user}), 201

    except EmailAlreadyExistsError as e:
        return jsonify({"error": str(e)}), 409

    except Exception as e:
        logger.exception("Unhandled error in signup: %s", e)
        return jsonify({"error": "An unexpected error occurred."}), 500


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute; 20 per hour")
def login():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Request body must be JSON."}), 400

    validation = validate_login(data)
    if not validation.is_valid:
        return jsonify({"errors": validation.errors}), 422

    email = data["email"].strip()
    password = data["password"]

    try:
        user = User.find_by_email(email)

        if user is not None and User.is_locked(user):
            return (
                jsonify({"error": "Account is temporarily locked due to too many failed login attempts."}),
                423,
            )

        password_ok = User.verify_password(password, user["password_hash"] if user else None)

        if user is None or not password_ok:
            if user is not None:
                User.register_failed_login(
                    user["id"],
                    current_app.config["MAX_FAILED_LOGIN_ATTEMPTS"],
                    current_app.config["ACCOUNT_LOCKOUT_MINUTES"],
                )
            # Same generic message whether the email doesn't exist or the
            # password is wrong, so the response never confirms which emails
            # are registered.
            return jsonify({"error": "Invalid email or password."}), 401

        User.register_successful_login(user["id"])

        access_token = create_access_token(
            user_id=user["id"],
            secret_key=current_app.config["JWT_SECRET_KEY"],
            expires_minutes=current_app.config["JWT_ACCESS_TOKEN_EXPIRES_MINUTES"],
        )
        refresh_token = RefreshToken.create(
            user_id=user["id"],
            expires_days=current_app.config["JWT_REFRESH_TOKEN_EXPIRES_DAYS"],
        )

        response = jsonify(
            {
                "access_token": access_token,
                "token_type": "Bearer",
                "expires_in": current_app.config["JWT_ACCESS_TOKEN_EXPIRES_MINUTES"] * 60,
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "displayname": user["displayname"],
                },
            }
        )
        _set_refresh_cookie(response, refresh_token)
        return response, 200

    except Exception as e:
        logger.exception("Unhandled error in login: %s", e)
        return jsonify({"error": "An unexpected error occurred."}), 500


@auth_bp.route("/refresh", methods=["POST"])
@limiter.limit("10 per minute")
def refresh():
    raw_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not raw_token:
        return jsonify({"error": "Missing refresh token."}), 401

    try:
        token_row = RefreshToken.find_valid(raw_token)

        if token_row is None:
            existing = RefreshToken.find_any(raw_token)
            if existing is not None and existing["revoked_at"] is not None:
                # This token was already rotated out once before — presenting it
                # again means it was likely stolen. Kill every session for the
                # user so a leaked token can't be replayed indefinitely.
                RefreshToken.revoke_all_for_user(existing["user_id"])
                logger.warning(
                    "Reused refresh token detected for user %s; all sessions revoked.",
                    existing["user_id"],
                )
            response = jsonify({"error": "Invalid or expired refresh token."})
            _clear_refresh_cookie(response)
            return response, 401

        RefreshToken.revoke(token_row["id"])
        new_refresh_token = RefreshToken.create(
            user_id=token_row["user_id"],
            expires_days=current_app.config["JWT_REFRESH_TOKEN_EXPIRES_DAYS"],
        )
        access_token = create_access_token(
            user_id=token_row["user_id"],
            secret_key=current_app.config["JWT_SECRET_KEY"],
            expires_minutes=current_app.config["JWT_ACCESS_TOKEN_EXPIRES_MINUTES"],
        )

        response = jsonify(
            {
                "access_token": access_token,
                "token_type": "Bearer",
                "expires_in": current_app.config["JWT_ACCESS_TOKEN_EXPIRES_MINUTES"] * 60,
            }
        )
        _set_refresh_cookie(response, new_refresh_token)
        return response, 200

    except Exception as e:
        logger.exception("Unhandled error in refresh: %s", e)
        return jsonify({"error": "An unexpected error occurred."}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    raw_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if raw_token:
        RefreshToken.revoke_by_raw_token(raw_token)

    response = jsonify({})
    _clear_refresh_cookie(response)
    return response, 204


@auth_bp.route("/me", methods=["GET"])
@token_required
def me():
    user = User.find_by_id(g.user_id)
    if user is None:
        return jsonify({"error": "User not found."}), 404
    return jsonify({"user": user}), 200


def _set_refresh_cookie(response, raw_token: str) -> None:
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        raw_token,
        httponly=True,
        secure=current_app.config.get("SESSION_COOKIE_SECURE", True),
        samesite="Strict",
        path=REFRESH_COOKIE_PATH,
        max_age=current_app.config["JWT_REFRESH_TOKEN_EXPIRES_DAYS"] * 24 * 60 * 60,
    )


def _clear_refresh_cookie(response) -> None:
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        "",
        httponly=True,
        secure=current_app.config.get("SESSION_COOKIE_SECURE", True),
        samesite="Strict",
        path=REFRESH_COOKIE_PATH,
        max_age=0,
    )
