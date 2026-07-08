import logging

from flask import Blueprint, g, jsonify, request

from ..models.snippet import DEFAULT_PAGE_SIZE, Snippet
from ..utils.auth_decorators import authenticate_request
from ..utils.validators import is_valid_uuid, validate_snippet_create, validate_snippet_update

logger = logging.getLogger(__name__)

snippets_bp = Blueprint("snippets", __name__)


@snippets_bp.before_request
def _require_auth():
    return authenticate_request()


def _serialize(snippet: dict) -> dict:
    return {
        "id": str(snippet["id"]),
        "user_id": str(snippet["user_id"]),
        "title": snippet["title"],
        "content": snippet["content"],
        "language": snippet["language"],
        "created_at": snippet["created_at"].isoformat(),
        "updated_at": snippet["updated_at"].isoformat(),
    }


@snippets_bp.route("", methods=["GET"])
def list_snippets():
    try:
        limit = int(request.args.get("limit", DEFAULT_PAGE_SIZE))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        return jsonify({"error": "limit and offset must be integers."}), 400

    snippets = Snippet.list_for_user(g.user_id, limit=limit, offset=offset)
    return jsonify({"snippets": [_serialize(s) for s in snippets]}), 200


@snippets_bp.route("", methods=["POST"])
def create_snippet():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Request body must be JSON."}), 400

    validation = validate_snippet_create(data)
    if not validation.is_valid:
        return jsonify({"errors": validation.errors}), 422

    try:
        snippet = Snippet.create(
            user_id=g.user_id,
            title=data["title"].strip(),
            content=data["content"],
            language=(data.get("language") or "").strip() or None,
        )
        return jsonify({"snippet": _serialize(snippet)}), 201

    except Exception as e:
        logger.exception("Unhandled error in create_snippet: %s", e)
        return jsonify({"error": "An unexpected error occurred."}), 500


@snippets_bp.route("/<snippet_id>", methods=["GET"])
def get_snippet(snippet_id):
    if not is_valid_uuid(snippet_id):
        return jsonify({"error": "Snippet not found."}), 404

    snippet = Snippet.find_for_user(snippet_id, g.user_id)
    if snippet is None:
        return jsonify({"error": "Snippet not found."}), 404

    return jsonify({"snippet": _serialize(snippet)}), 200


@snippets_bp.route("/<snippet_id>", methods=["PUT"])
def update_snippet(snippet_id):
    if not is_valid_uuid(snippet_id):
        return jsonify({"error": "Snippet not found."}), 404

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Request body must be JSON."}), 400

    validation = validate_snippet_update(data)
    if not validation.is_valid:
        return jsonify({"errors": validation.errors}), 422

    try:
        clear_language = "language" in data and not (data.get("language") or "").strip()
        snippet = Snippet.update_for_user(
            snippet_id,
            g.user_id,
            title=data["title"].strip() if "title" in data else None,
            content=data.get("content") if "content" in data else None,
            language=(data.get("language") or "").strip() or None,
            clear_language=clear_language,
        )
        if snippet is None:
            return jsonify({"error": "Snippet not found."}), 404

        return jsonify({"snippet": _serialize(snippet)}), 200

    except Exception as e:
        logger.exception("Unhandled error in update_snippet: %s", e)
        return jsonify({"error": "An unexpected error occurred."}), 500


@snippets_bp.route("/<snippet_id>", methods=["DELETE"])
def delete_snippet(snippet_id):
    if not is_valid_uuid(snippet_id):
        return jsonify({"error": "Snippet not found."}), 404

    try:
        deleted = Snippet.delete_for_user(snippet_id, g.user_id)
        if not deleted:
            return jsonify({"error": "Snippet not found."}), 404

        return "", 204

    except Exception as e:
        logger.exception("Unhandled error in delete_snippet: %s", e)
        return jsonify({"error": "An unexpected error occurred."}), 500
