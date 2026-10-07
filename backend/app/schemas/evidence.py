from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class EvidenceRegisterResponse(BaseModel):
    proofId: str
    fileHash: str
    status: str
    timestamp: datetime
    originalFilename: str
    mimeType: str
    fileSizeBytes: int


class VerifyResponse(BaseModel):
    proofId: str
    verified: bool
    message: str
    originalHash: Optional[str] = None
    submittedHash: Optional[str] = None
