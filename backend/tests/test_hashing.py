from app.services.hashing import compute_sha256


def test_known_empty_hash():
    assert (
        compute_sha256(b"")
        == "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    )


def test_known_hello_hash():
    assert (
        compute_sha256(b"hello")
        == "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    )


def test_deterministic():
    data = b"ProofLens determinism test"
    assert compute_sha256(data) == compute_sha256(data)


def test_different_inputs_produce_different_hashes():
    assert compute_sha256(b"file_v1") != compute_sha256(b"file_v2")


def test_returns_64_hex_chars():
    result = compute_sha256(b"any bytes")
    assert len(result) == 64
    assert all(c in "0123456789abcdef" for c in result)
