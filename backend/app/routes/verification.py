from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.evidence import VerifyResponse
from app.services import evidence as evidence_svc
from app.services import hashing

router = APIRouter()


@router.post(
    "/verify",
    response_model=VerifyResponse,
    summary="Verify an image against registered evidence",
)
async def verify_evidence(
    proof_id: str = Form(..., description="The Proof ID returned at registration"),
    file: UploadFile = File(..., description="Image file to verify"),
    db: Session = Depends(get_db),
):
    record = evidence_svc.get_by_proof_id(db, proof_id)
    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No evidence found for Proof ID '{proof_id}'.",
        )

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    submitted_hash = hashing.compute_sha256(file_bytes)
    verified = submitted_hash == record.file_hash

    return VerifyResponse(
        proofId=proof_id,
        verified=verified,
        message=(
            "Evidence matches the original registered file."
            if verified
            else "Evidence has been modified."
        ),
        originalHash=record.file_hash,
        submittedHash=submitted_hash,
    )
