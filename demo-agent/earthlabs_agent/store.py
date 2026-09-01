"""SQLite store for extracted documents."""

import json
import sqlite3
from pathlib import Path

from .schemas import ExtractedDocument

SCHEMA = """
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY,
    source_path TEXT UNIQUE NOT NULL,
    doc_type TEXT NOT NULL,
    title TEXT,
    summary TEXT,
    warnings TEXT,          -- JSON list of plausibility warnings
    extracted_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wells (
    id INTEGER PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id),
    well_name TEXT, operator TEXT, country TEXT, field_or_block TEXT,
    spud_date TEXT, completion_date TEXT,
    total_depth_m REAL, water_depth_m REAL,
    latitude REAL, longitude REAL, status TEXT
);

CREATE TABLE IF NOT EXISTS core_intervals (
    id INTEGER PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id),
    depth_top_m REAL, depth_base_m REAL, lithology TEXT, description TEXT
);

CREATE TABLE IF NOT EXISTS key_values (
    id INTEGER PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id),
    key TEXT NOT NULL, value TEXT NOT NULL, unit TEXT, page INTEGER
);
"""


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn


def insert_document(
    conn: sqlite3.Connection,
    source_path: str,
    doc: ExtractedDocument,
    warnings: list[str],
) -> int:
    cur = conn.execute(
        """INSERT INTO documents (source_path, doc_type, title, summary, warnings, extracted_json)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(source_path) DO UPDATE SET
             doc_type=excluded.doc_type, title=excluded.title, summary=excluded.summary,
             warnings=excluded.warnings, extracted_json=excluded.extracted_json""",
        (
            source_path,
            doc.doc_type,
            doc.title,
            doc.summary,
            json.dumps(warnings),
            doc.model_dump_json(),
        ),
    )
    doc_id = cur.lastrowid
    if cur.rowcount and doc_id == 0:  # updated existing row
        doc_id = conn.execute(
            "SELECT id FROM documents WHERE source_path = ?", (source_path,)
        ).fetchone()["id"]

    # Re-derive child rows from scratch on re-ingest.
    for table in ("wells", "core_intervals", "key_values"):
        conn.execute(f"DELETE FROM {table} WHERE document_id = ?", (doc_id,))

    if doc.well_header is not None:
        h = doc.well_header
        conn.execute(
            """INSERT INTO wells (document_id, well_name, operator, country, field_or_block,
               spud_date, completion_date, total_depth_m, water_depth_m, latitude, longitude, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (doc_id, h.well_name, h.operator, h.country, h.field_or_block,
             h.spud_date, h.completion_date, h.total_depth_m, h.water_depth_m,
             h.latitude, h.longitude, h.status),
        )
    for iv in doc.core_intervals:
        conn.execute(
            "INSERT INTO core_intervals (document_id, depth_top_m, depth_base_m, lithology, description) VALUES (?, ?, ?, ?, ?)",
            (doc_id, iv.depth_top_m, iv.depth_base_m, iv.lithology, iv.description),
        )
    for kv in doc.key_values:
        conn.execute(
            "INSERT INTO key_values (document_id, key, value, unit, page) VALUES (?, ?, ?, ?, ?)",
            (doc_id, kv.key, kv.value, kv.unit, kv.page),
        )
    conn.commit()
    return doc_id
