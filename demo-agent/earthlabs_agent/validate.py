"""Physics-plausibility checks on extracted values.

This is the domain-aware layer generic document-AI doesn't have. Findings are
warnings for human review, not hard failures — the point is to flag likely
extraction errors (unit mixups, OCR digit errors) before they enter the store.
"""

from .schemas import ExtractedDocument


def plausibility_warnings(doc: ExtractedDocument) -> list[str]:
    w: list[str] = []
    h = doc.well_header

    if h is not None:
        if h.total_depth_m is not None and not (0 < h.total_depth_m < 15000):
            w.append(f"total_depth_m={h.total_depth_m} outside plausible range (0, 15000)")
        if h.water_depth_m is not None and not (0 <= h.water_depth_m < 11000):
            w.append(f"water_depth_m={h.water_depth_m} outside plausible range [0, 11000)")
        if h.latitude is not None and not (-90 <= h.latitude <= 90):
            w.append(f"latitude={h.latitude} out of range")
        if h.longitude is not None and not (-180 <= h.longitude <= 180):
            w.append(f"longitude={h.longitude} out of range")

    for i, iv in enumerate(doc.core_intervals):
        if (
            iv.depth_top_m is not None
            and iv.depth_base_m is not None
            and iv.depth_base_m < iv.depth_top_m
        ):
            w.append(f"core_intervals[{i}]: base {iv.depth_base_m} above top {iv.depth_top_m}")

    return w
