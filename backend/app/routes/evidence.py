from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.schemas.evidence import EvidenceRegisterResponse
from app.services import evidence as evidence_svc
from app.services import hashing, storage

router = APIRouter()


@router.post(
    "/evidence",
    response_model=EvidenceRegisterResponse,
    summary="Register a new piece of evidence",
)
async def register_evidence(
    file: UploadFile = File(..., description="Image file to register as evidence"),
    db: Session = Depends(get_db),
):
    if file.content_type not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file type '{file.content_type}'. "
                f"Allowed types: {', '.join(settings.ALLOWED_MIME_TYPES)}"
            ),
        )

    file_bytes = await file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds the {settings.MAX_FILE_SIZE_MB} MB limit.",
        )

    file_hash = hashing.compute_sha256(file_bytes)
    file_path = storage.save_file(file_bytes, file.content_type)
    proof_id = evidence_svc.generate_proof_id(db)

    record = evidence_svc.create_evidence(
        db,
        proof_id=proof_id,
        file_hash=file_hash,
        file_path=file_path,
        original_filename=file.filename or "unknown",
        mime_type=file.content_type,
        file_size=len(file_bytes),
    )

    return EvidenceRegisterResponse(
        proofId=record.proof_id,
        fileHash=record.file_hash,
        status=record.status,
        timestamp=record.created_at,
        originalFilename=record.original_filename,
        mimeType=record.mime_type,
        fileSizeBytes=record.file_size,
    )
