# earth-labs demo agent

Exploration PDFs in, structured queryable data out. This is the sales demo /
pilot scaffold for the earth-labs archive agent (see `../docs/pitch.md`).

Point it at PDFs → it classifies each document (well header, core description,
survey report, completion report), extracts every structured fact into typed
JSON via Claude's structured outputs, runs physics-plausibility checks on the
values, loads everything into SQLite, and answers plain-English questions
over the result.

## Setup

```sh
cd demo-agent
python -m venv .venv && source .venv/bin/activate
pip install -e .
export ANTHROPIC_API_KEY=sk-ant-...   # or `ant auth login`
```

## Usage

```sh
# One-off extraction (interactive, per-document)
earthlabs-agent ingest path/to/well_report.pdf

# Archive-scale: submit a whole directory via the Batches API (50% price, async)
earthlabs-agent ingest --batch ./data/pdfs

# List what's in the store, with plausibility-warning flags
earthlabs-agent show

# Ask questions in plain English (NL -> read-only SQL -> answer)
earthlabs-agent query "which wells are deeper than 2000 m and who operates them?"
```

The store lives at `data/earthlabs.db` (override with `--db`).

## Where to get public sample PDFs (no NDA needed)

- **Norwegian Offshore Directorate factpages** (https://factpages.sodir.no) —
  public wellbore documents for thousands of NCS wells: completion reports,
  final well reports, core photos. The DISKOS public portal
  (https://www.sodir.no/en/diskos/) has the underlying archive.
- **BOEM/BSEE data center** (https://www.data.boem.gov) — US offshore well
  files, paleo reports, and survey documentation.
- **USGS Core Research Center** (https://www.usgs.gov/core-research-center) —
  core and cuttings descriptions for US onshore wells.
- **IODP/ODP reports** (https://www.iodp.org) — site reports with lithology
  descriptions, publicly archived.

Drop downloads into `data/pdfs/` and run the batch ingest.

## Architecture

```
earthlabs_agent/
  schemas.py    Pydantic models = the extraction contract (OSDU-flavored)
  extract.py    PDF -> ExtractedDocument (native PDF input + structured outputs)
  validate.py   physics-plausibility checks (the domain-aware layer)
  store.py      SQLite: documents / wells / core_intervals / key_values
  query.py      NL question -> read-only SQL -> plain-English answer
  batch.py      Batches API submitter/collector for archive-scale runs
  cli.py        entry point
```

Design notes:

- **v1 scope is text-and-table documents.** Raster log-curve digitization is
  deliberately out of scope (see the pitch).
- Extraction uses `claude-opus-4-8` with adaptive thinking and a JSON-schema-
  constrained response, so output always parses — no regex cleanup layer.
- The NL query path only ever executes `SELECT` statements, enforced both by
  prompt and by a hard check + `PRAGMA query_only`.
- Every extracted value that fails a plausibility check is flagged for human
  review, not silently dropped — that review queue is a product feature.
