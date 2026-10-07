import random
import string

from sqlalchemy.orm import Session

from app.models.evidence import Evidence


def generate_proof_id(db: Session) -> str:
    chars = string.ascii_uppercase + string.digits
    while True:
        candidate = "PXL-" + "".join(random.choices(chars, k=6))
        if not db.query(Evidence).filter(Evidence.proof_id == candidate).first():
            return candidate


def create_evidence(
    db: Session,
    *,
    proof_id: str,
    file_hash: str,
    file_path: str,
    original_filename: str,
    mime_type: str,
    file_size: int,
) -> Evidence:
    record = Evidence(
        proof_id=proof_id,
        file_hash=file_hash,
        file_path=file_path,
        original_filename=original_filename,
        mime_type=mime_type,
        file_size=file_size,
        status="registered",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_by_proof_id(db: Session, proof_id: str) -> Evidence | None:
    return db.query(Evidence).filter(Evidence.proof_id == proof_id).first()
