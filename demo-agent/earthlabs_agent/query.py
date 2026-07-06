"""Natural-language questions over the extracted store.

Two calls: (1) question -> read-only SQL via structured output,
(2) rows -> plain-English answer.
"""

import json
import sqlite3

from anthropic import Anthropic

from . import MODEL
from .schemas import SqlQuery
from .store import SCHEMA

MAX_ROWS = 200

SQL_PROMPT = """\
You translate a geologist's question into a single read-only SQLite SELECT
statement against this schema:

{schema}

Question: {question}

Only SELECT statements. Limit to {max_rows} rows unless the question demands
an aggregate.
"""

ANSWER_PROMPT = """\
Question: {question}

SQL used: {sql}

Rows (JSON): {rows}

Answer the question directly and concisely from these rows. If the rows are
empty or don't answer it, say so plainly — do not speculate.
"""


def _generate_sql(client: Anthropic, question: str) -> SqlQuery:
    response = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        output_config={
            "format": {"type": "json_schema", "schema": SqlQuery.model_json_schema()}
        },
        messages=[
            {
                "role": "user",
                "content": SQL_PROMPT.format(
                    schema=SCHEMA, question=question, max_rows=MAX_ROWS
                ),
            }
        ],
    )
    text = "".join(b.text for b in response.content if b.type == "text")
    return SqlQuery.model_validate(json.loads(text))


def ask(client: Anthropic, conn: sqlite3.Connection, question: str) -> str:
    plan = _generate_sql(client, question)
    sql = plan.sql.strip().rstrip(";")
    if not sql.lower().startswith("select"):
        raise ValueError(f"Refusing non-SELECT statement: {sql[:80]}")

    conn.execute("PRAGMA query_only = ON")
    try:
        rows = [dict(r) for r in conn.execute(sql).fetchmany(MAX_ROWS)]
    finally:
        conn.execute("PRAGMA query_only = OFF")

    response = client.messages.create(
        model=MODEL,
        max_tokens=4000,
        thinking={"type": "adaptive"},
        messages=[
            {
                "role": "user",
                "content": ANSWER_PROMPT.format(
                    question=question, sql=sql, rows=json.dumps(rows, default=str)
                ),
            }
        ],
    )
    return "".join(b.text for b in response.content if b.type == "text")
