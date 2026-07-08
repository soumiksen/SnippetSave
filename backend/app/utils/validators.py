import re
from dataclasses import dataclass, field

_EMAIL_RE = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")
_DISPLAY_NAME_RE = re.compile(r"^[\w\s\-]{2,50}$")


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


def _validate_password_strength(password: str, result: ValidationResult) -> None:
    if len(password) < 8:
        result.errors.append("Password must be at least 8 characters.")
    if not re.search(r"[A-Z]", password):
        result.errors.append("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        result.errors.append("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        result.errors.append("Password must contain at least one number.")
