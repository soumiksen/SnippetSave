import logging
from flask import Blueprint, request, jsonify

from ..models.user import User
from ..utils.validators import validate_signup
from ..utils.exceptions import EmailAlreadyExistsError

logger = logging.getLogger(__name__)

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True)
    if not data:
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
