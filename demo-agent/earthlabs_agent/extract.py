"""PDF -> ExtractedDocument via the Claude API.

Sends the PDF as a native document block (no OCR pipeline needed) and
constrains the response to the ExtractedDocument JSON schema via
output_config.format, so the output always parses.
"""

import base64
import json
from pathlib import Path

from anthropic import Anthropic

from . import MODEL
from .schemas import ExtractedDocument

# 32 MB request cap for base64 PDF input; leave headroom for the prompt.
MAX_PDF_BYTES = 30 * 1024 * 1024

EXTRACTION_PROMPT = """\
You are a subsurface data extraction agent for exploration archives.

Classify this document (well header, core description, survey report,
completion report, or other) and extract every structured fact it contains
into the provided schema.

Rules:
- Convert depths to meters (note original units in key_values if converted).
- Report coordinates as decimal degrees; record the stated datum in key_values.
- Never invent values. A field you cannot find stays null.
- Anything factual that doesn't fit the typed sections goes in key_values
  with its page number.
- summary: 2-3 sentences a geologist would find useful.
"""


def extract_pdf(client: Anthropic, pdf_path: Path) -> ExtractedDocument:
    raw = pdf_path.read_bytes()
    if len(raw) > MAX_PDF_BYTES:
        raise ValueError(
            f"{pdf_path.name} is {len(raw) / 1e6:.0f} MB — over the API limit. "
            "Split it or upload via the Files API."
        )
    pdf_b64 = base64.standard_b64encode(raw).decode()

    response = client.messages.create(
        model=MODEL,
        max_tokens=16000,
        thinking={"type": "adaptive"},
        output_config={
            "format": {
                "type": "json_schema",
                "schema": ExtractedDocument.model_json_schema(),
            }
        },
        messages=[
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
    )

    if response.stop_reason == "max_tokens":
        raise RuntimeError(f"Output truncated for {pdf_path.name}; raise max_tokens.")

    text = "".join(b.text for b in response.content if b.type == "text")
    return ExtractedDocument.model_validate(json.loads(text))
