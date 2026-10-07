import uuid
from pathlib import Path

from app.core.config import settings

_MIME_TO_EXT: dict[str, str] = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/tiff": ".tiff",
}


def save_file(file_bytes: bytes, mime_type: str) -> str:
    storage_path = Path(settings.STORAGE_PATH)
    storage_path.mkdir(parents=True, exist_ok=True)

    # UUID filename — never expose or use the original user-supplied name on disk
    ext = _MIME_TO_EXT.get(mime_type, ".bin")
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = storage_path / filename
    dest.write_bytes(file_bytes)
    return str(dest)
