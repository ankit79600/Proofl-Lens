import io


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


def _register(client) -> tuple[str, bytes]:
    resp = client.post(
        "/api/evidence",
        files={"file": ("original.png", io.BytesIO(MINIMAL_PNG), "image/png")},
    )
    assert resp.status_code == 200
    return resp.json()["proofId"], MINIMAL_PNG


def test_verify_original_file_succeeds(client):
    proof_id, original_bytes = _register(client)
    resp = client.post(
        "/api/verify",
        data={"proof_id": proof_id},
        files={"file": ("original.png", io.BytesIO(original_bytes), "image/png")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["verified"] is True
    assert "matches" in body["message"].lower()
    assert body["originalHash"] == body["submittedHash"]


def test_verify_modified_file_fails(client):
    proof_id, _ = _register(client)
    tampered = b"\x00" * 200  # completely different bytes
    resp = client.post(
        "/api/verify",
        data={"proof_id": proof_id},
        files={"file": ("tampered.png", io.BytesIO(tampered), "image/png")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["verified"] is False
    assert "modified" in body["message"].lower()
    assert body["originalHash"] != body["submittedHash"]


def test_verify_unknown_proof_id_returns_404(client):
    resp = client.post(
        "/api/verify",
        data={"proof_id": "PXL-XXXXXX"},
        files={"file": ("x.png", io.BytesIO(b"fake"), "image/png")},
    )
    assert resp.status_code == 404


def test_verify_empty_file_returns_400(client):
    proof_id, _ = _register(client)
    resp = client.post(
        "/api/verify",
        data={"proof_id": proof_id},
        files={"file": ("empty.png", io.BytesIO(b""), "image/png")},
    )
    assert resp.status_code == 400
