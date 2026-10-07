"""Create evidence table

Revision ID: 001
Revises:
Create Date: 2026-10-05
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "evidence",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("proof_id", sa.String(), nullable=False),
        sa.Column("file_hash", sa.String(64), nullable=False),
        sa.Column("file_path", sa.String(), nullable=False),
        sa.Column("original_filename", sa.String(), nullable=False),
        sa.Column("mime_type", sa.String(), nullable=False),
        sa.Column("file_size", sa.BigInteger(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("status", sa.String(), nullable=False, server_default="registered"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("proof_id"),
    )
    op.create_index("ix_evidence_proof_id", "evidence", ["proof_id"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_evidence_proof_id", table_name="evidence")
    op.drop_table("evidence")
