"""Output schemas for extraction.

All models forbid extra fields so model_json_schema() emits
additionalProperties: false, which the API's structured-output mode requires.
Numeric range constraints (ge/le) are deliberately avoided — the structured
output grammar doesn't support them, so plausibility checks live in
validate.py instead.
"""

from typing import Literal

from pydantic import BaseModel, ConfigDict


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


DocType = Literal[
    "well_header",
    "core_description",
    "survey_report",
    "completion_report",
    "other",
]


class WellHeader(StrictModel):
    well_name: str | None = None
    operator: str | None = None
    country: str | None = None
    field_or_block: str | None = None
    spud_date: str | None = None
    completion_date: str | None = None
    total_depth_m: float | None = None
    water_depth_m: float | None = None
    latitude: float | None = None
    longitude: float | None = None
    status: str | None = None


class CoreInterval(StrictModel):
    depth_top_m: float | None = None
    depth_base_m: float | None = None
    lithology: str | None = None
    description: str | None = None


class SurveyInfo(StrictModel):
    survey_name: str | None = None
    survey_type: str | None = None
    area: str | None = None
    acquisition_year: int | None = None
    contractor: str | None = None


class KeyValue(StrictModel):
    """Catch-all for extracted facts that don't fit the typed sections."""

    key: str
    value: str
    unit: str | None = None
    page: int | None = None


class ExtractedDocument(StrictModel):
    doc_type: DocType
    title: str | None = None
    summary: str
    well_header: WellHeader | None = None
    core_intervals: list[CoreInterval] = []
    survey: SurveyInfo | None = None
    key_values: list[KeyValue] = []


class SqlQuery(StrictModel):
    """Structured output for the NL -> SQL step."""

    sql: str
    explanation: str
