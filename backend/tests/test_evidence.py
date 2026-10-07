import io


# Minimal valid 1×1 PNG (67 bytes)
MINIMAL_PNG = bytes([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
    0x54, 0x08, 0xD7, 0x63, 0xF8, 0xFF, 0xFF, 0x3F,
    0x00, 0x05, 0xFE, 0x02, 0xFE, 0xA7, 0x35, 0x81,
    0x84, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
    0x44, 0xAE, 0x42, 0x60, 0x82,
])


def test_register_returns_proof_id(client):
    resp = client.post(
        "/api/evidence",
        files={"file": ("photo.png", io.BytesIO(MINIMAL_PNG), "image/png")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["proofId"].startswith("PXL-")
    assert len(body["fileHash"]) == 64
    assert body["status"] == "registered"
    assert "timestamp" in body
    assert body["mimeType"] == "image/png"
    assert body["fileSizeBytes"] == len(MINIMAL_PNG)


def test_register_produces_unique_proof_ids(client):
    def register():
        resp = client.post(
            "/api/evidence",
            files={"file": ("photo.png", io.BytesIO(MINIMAL_PNG), "image/png")},
        )
        assert resp.status_code == 200
        return resp.json()["proofId"]

    ids = {register() for _ in range(5)}
    assert len(ids) == 5


def test_register_rejects_invalid_mime_type(client):
    resp = client.post(
        "/api/evidence",
        files={"file": ("script.exe", io.BytesIO(b"MZ\x90\x00"), "application/octet-stream")},
    )
    assert resp.status_code == 400
    assert "Unsupported file type" in resp.json()["detail"]


def test_register_rejects_empty_file(client):
    resp = client.post(
        "/api/evidence",
        files={"file": ("empty.png", io.BytesIO(b""), "image/png")},
    )
    assert resp.status_code == 400


def test_register_jpeg_accepted(client):
    # Minimal JPEG SOI marker
    jpeg_bytes = bytes([0xFF, 0xD8, 0xFF, 0xE0] + [0x00] * 50)
    resp = client.post(
        "/api/evidence",
        files={"file": ("photo.jpg", io.BytesIO(jpeg_bytes), "image/jpeg")},
    )
    assert resp.status_code == 200
