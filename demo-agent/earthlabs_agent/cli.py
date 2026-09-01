"""earthlabs-agent CLI.

  earthlabs-agent ingest well_report.pdf core_photos_log.pdf
  earthlabs-agent ingest --batch ./data/pdfs        # archive-scale, 50% price
  earthlabs-agent query "wells deeper than 2000 m with core descriptions"
"""

import argparse
import json
import sys
from pathlib import Path

from anthropic import Anthropic

from .batch import collect_results, submit_batches
from .extract import extract_pdf
from .query import ask
from .store import connect, insert_document
from .validate import plausibility_warnings

DEFAULT_DB = Path("data/earthlabs.db")


def cmd_ingest(args: argparse.Namespace) -> int:
    client = Anthropic()
    conn = connect(args.db)

    if args.batch:
        pdfs = sorted(Path(args.paths[0]).glob("**/*.pdf"))
        if not pdfs:
            print("no PDFs found", file=sys.stderr)
            return 1
        for batch_id in submit_batches(client, pdfs):
            for name, doc in collect_results(client, batch_id).items():
                warnings = plausibility_warnings(doc)
                insert_document(conn, name, doc, warnings)
                flag = f"  ⚠ {len(warnings)} warnings" if warnings else ""
                print(f"stored {name} [{doc.doc_type}]{flag}")
        return 0

    for path_str in args.paths:
        path = Path(path_str)
        print(f"extracting {path.name} ...")
        doc = extract_pdf(client, path)
        warnings = plausibility_warnings(doc)
        insert_document(conn, str(path), doc, warnings)
        print(f"  type: {doc.doc_type}")
        print(f"  summary: {doc.summary}")
        for w in warnings:
            print(f"  ⚠ {w}")
    return 0


def cmd_query(args: argparse.Namespace) -> int:
    client = Anthropic()
    conn = connect(args.db)
    print(ask(client, conn, args.question))
    return 0


def cmd_show(args: argparse.Namespace) -> int:
    conn = connect(args.db)
    for row in conn.execute(
        "SELECT id, doc_type, source_path, title, warnings FROM documents ORDER BY id"
    ):
        n_warn = len(json.loads(row["warnings"] or "[]"))
        flag = f"  ⚠ {n_warn}" if n_warn else ""
        print(f"[{row['id']}] {row['doc_type']:18s} {row['source_path']}{flag}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(prog="earthlabs-agent", description=__doc__)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help="SQLite store path")
    sub = parser.add_subparsers(dest="command", required=True)

    p_ingest = sub.add_parser("ingest", help="extract PDFs into the store")
    p_ingest.add_argument("paths", nargs="+", help="PDF files, or one directory with --batch")
    p_ingest.add_argument("--batch", action="store_true",
                          help="use the Batches API (directory input, 50%% price, async)")
    p_ingest.set_defaults(func=cmd_ingest)

    p_query = sub.add_parser("query", help="ask a question in plain English")
    p_query.add_argument("question")
    p_query.set_defaults(func=cmd_query)

    p_show = sub.add_parser("show", help="list ingested documents")
    p_show.set_defaults(func=cmd_show)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
