from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import evidence, verification

app = FastAPI(
    title="ProofLens API",
    description=(
        "Digital evidence verification platform. "
        "Register image evidence with a tamper-evident SHA-256 fingerprint "
        "and verify authenticity at any time."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evidence.router, prefix="/api", tags=["Evidence"])
app.include_router(verification.router, prefix="/api", tags=["Verification"])


@app.get("/health", tags=["Health"], summary="Service health check")
def health_check():
    return {"status": "ok", "service": "ProofLens API", "version": "1.0.0"}
