"""Archive-scale ingestion via the Message Batches API (50% price, async).

Use `ingest` in cli.py for a handful of PDFs; use this for hundreds.
Batch limits: 100,000 requests / 256 MB per batch — the submitter chunks
requests so each batch stays under the size cap.
"""

import base64
import json
import time
from pathlib import Path

from anthropic import Anthropic

from . import MODEL
from .extract import EXTRACTION_PROMPT, MAX_PDF_BYTES
from .schemas import ExtractedDocument

BATCH_BYTES_BUDGET = 200 * 1024 * 1024  # stay under the 256 MB request cap


def _request_for(pdf_path: Path) -> dict:
    pdf_b64 = base64.standard_b64encode(pdf_path.read_bytes()).decode()
    return {
        "custom_id": pdf_path.name,
        "params": {
            "model": MODEL,
            "max_tokens": 16000,
            "thinking": {"type": "adaptive"},
            "output_config": {
                "format": {
                    "type": "json_schema",
                    "schema": ExtractedDocument.model_json_schema(),
                }
            },
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
                                "type": "base64",
                                "media_type": "application/pdf",
                                "data": pdf_b64,
                            },
                        },
                        {"type": "text", "text": EXTRACTION_PROMPT},
                    ],
                }
            ],
        },
    }


def submit_batches(client: Anthropic, pdf_paths: list[Path]) -> list[str]:
    """Submit PDFs in size-bounded batches; returns batch IDs."""
    batch_ids: list[str] = []
    requests: list[dict] = []
    budget = 0

    def flush() -> None:
        nonlocal requests, budget
        if requests:
            batch = client.messages.batches.create(requests=requests)
            batch_ids.append(batch.id)
            print(f"submitted batch {batch.id} ({len(requests)} documents)")
            requests, budget = [], 0

    for p in sorted(pdf_paths):
        size = p.stat().st_size
        if size > MAX_PDF_BYTES:
            print(f"skipping {p.name}: {size / 1e6:.0f} MB exceeds per-request limit")
            continue
        b64_size = size * 4 // 3
        if budget + b64_size > BATCH_BYTES_BUDGET:
            flush()
        requests.append(_request_for(p))
        budget += b64_size
    flush()
    return batch_ids


def collect_results(client: Anthropic, batch_id: str) -> dict[str, ExtractedDocument]:
    """Poll one batch until it ends, then return results keyed by filename.

    Results arrive in arbitrary order — always key by custom_id.
    """
    while True:
        batch = client.messages.batches.retrieve(batch_id)
        if batch.processing_status == "ended":
            break
        counts = batch.request_counts
        print(f"{batch_id}: processing={counts.processing} succeeded={counts.succeeded}")
        time.sleep(60)

    extracted: dict[str, ExtractedDocument] = {}
    for result in client.messages.batches.results(batch_id):
        if result.result.type == "succeeded":
            message = result.result.message
            text = "".join(b.text for b in message.content if b.type == "text")
            extracted[result.custom_id] = ExtractedDocument.model_validate(
                json.loads(text)
            )
        else:
            print(f"{result.custom_id}: {result.result.type}")
    return extracted
