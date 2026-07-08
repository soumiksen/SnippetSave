import re
import uuid
from dataclasses import dataclass, field

_EMAIL_RE = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")
_DISPLAY_NAME_RE = re.compile(r"^[\w\s\-]{2,50}$")
_LANGUAGE_RE = re.compile(r"^[a-zA-Z0-9+#.\-]{1,50}$")

MAX_SNIPPET_TITLE_LENGTH = 200
MAX_SNIPPET_CONTENT_LENGTH = 100_000


@dataclass
class ValidationResult:
    errors: list[str] = field(default_factory=list)

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0


def validate_signup(data: dict) -> ValidationResult:
    result = ValidationResult()

    email = (data.get("email") or "").strip()
    displayname = (data.get("displayname") or "").strip()
    password = data.get("password") or ""

    if not email:
        result.errors.append("Email is required.")
    elif not _EMAIL_RE.match(email):
        result.errors.append("Invalid email format.")
    elif len(email) > 255:
        result.errors.append("Email must not exceed 255 characters.")

    if not displayname:
        result.errors.append("Display name is required.")
    elif not _DISPLAY_NAME_RE.match(displayname):
        result.errors.append(
            "Display name must be 2–50 characters and may contain letters, "
            "numbers, spaces, underscores, or hyphens."
        )

    if not password:
        result.errors.append("Password is required.")
    else:
        _validate_password_strength(password, result)

    return result


def validate_login(data: dict) -> ValidationResult:
    result = ValidationResult()

    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not email:
        result.errors.append("Email is required.")
    elif len(email) > 255:
        result.errors.append("Invalid email format.")

    if not password:
        result.errors.append("Password is required.")

    return result


def validate_snippet_create(data: dict) -> ValidationResult:
    result = ValidationResult()

    title = (data.get("title") or "").strip()
    content = data.get("content") or ""
    language = (data.get("language") or "").strip()

    if not title:
        result.errors.append("Title is required.")
    elif len(title) > MAX_SNIPPET_TITLE_LENGTH:
        result.errors.append(f"Title must not exceed {MAX_SNIPPET_TITLE_LENGTH} characters.")

    if not content:
        result.errors.append("Content is required.")
    elif len(content) > MAX_SNIPPET_CONTENT_LENGTH:
        result.errors.append(f"Content must not exceed {MAX_SNIPPET_CONTENT_LENGTH} characters.")

    if language and not _LANGUAGE_RE.match(language):
        result.errors.append("Language must be 1–50 characters (letters, numbers, '+', '#', '.', '-').")

    return result


def validate_snippet_update(data: dict) -> ValidationResult:
    result = ValidationResult()

    if not any(key in data for key in ("title", "content", "language")):
        result.errors.append("At least one of title, content, or language must be provided.")
        return result

    if "title" in data:
        title = (data.get("title") or "").strip()
        if not title:
            result.errors.append("Title cannot be empty.")
        elif len(title) > MAX_SNIPPET_TITLE_LENGTH:
            result.errors.append(f"Title must not exceed {MAX_SNIPPET_TITLE_LENGTH} characters.")

    if "content" in data:
        content = data.get("content") or ""
        if not content:
            result.errors.append("Content cannot be empty.")
        elif len(content) > MAX_SNIPPET_CONTENT_LENGTH:
            result.errors.append(f"Content must not exceed {MAX_SNIPPET_CONTENT_LENGTH} characters.")

    if "language" in data:
        language = (data.get("language") or "").strip()
        if language and not _LANGUAGE_RE.match(language):
            result.errors.append("Language must be 1–50 characters (letters, numbers, '+', '#', '.', '-').")

    return result


def is_valid_uuid(value: str) -> bool:
    try:
        uuid.UUID(str(value))
        return True
    except (ValueError, AttributeError, TypeError):
        return False


def _validate_password_strength(password: str, result: ValidationResult) -> None:
    if len(password) < 8:
        result.errors.append("Password must be at least 8 characters.")
    if not re.search(r"[A-Z]", password):
        result.errors.append("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        result.errors.append("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        result.errors.append("Password must contain at least one number.")
