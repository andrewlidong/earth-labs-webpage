"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// A pseudo-live JENNIFER-H2 training console. Generates plausible log lines
// at varying cadences and auto-scrolls. No network, no realism beyond shape.

type Level = "info" | "ok" | "warn" | "event";
type Line = { t: number; level: Level; text: string };

const STEP_BASE = 128_432;
const LR = "3.0e-5";

// Pseudo-random helpers that don't burn entropy on cosmetic logs.
const rand = (n = 1) => Math.random() * n;
const pick = <T,>(xs: T[]) => xs[Math.floor(rand(xs.length))];

const RANKS = [0, 1, 2, 3, 4, 5, 6, 7];
const CKPT_DIRS = [
  "s3://earth-labs/ckpt/jennifer-h2",
  "s3://earth-labs/ckpt/jennifer-h2-mirror",
];
const BASIN_INGESTS = [
  "north-sea/diskos",
  "permian-basin/nibi-2",
  "samail/ophiolite-east",
  "pyrenees/serpentine-belt",
  "ross-sea/iodp-405",
  "bohemian-massif/epos-cz",
];
const EVAL_TASKS = [
  ["lithology", "AUC"],
  ["porosity", "R²"],
  ["serpentinization", "F1"],
  ["fault-detect", "AP"],
  ["h2-prospectivity", "AUC"],
];

function pad(n: number, w: number) {
  return n.toString().padStart(w, "0");
}

function ts(ms: number) {
  const d = new Date(ms);
  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1, 2) +
    "-" +
    pad(d.getUTCDate(), 2) +
    "T" +
    pad(d.getUTCHours(), 2) +
    ":" +
    pad(d.getUTCMinutes(), 2) +
    ":" +
    pad(d.getUTCSeconds(), 2) +
    "." +
    pad(d.getUTCMilliseconds(), 3) +
    "Z"
  );
}

// Build a single log line. The state machine for step/loss/checkpoint lives
// inside the closure so we don't have to thread it through React state.
function makeStreamer() {
  let step = STEP_BASE;
  let loss = 0.0184;
  let nextCkpt = 600 + Math.floor(rand(400));
  let nextEval = 80 + Math.floor(rand(120));
  let stepCounter = 0;

  return function nextLine(): Line {
    const now = Date.now();
    stepCounter++;

    // Roll dice for which kind of line this should be.
    const r = rand(1);

    if (stepCounter >= nextEval) {
      nextEval = stepCounter + 80 + Math.floor(rand(140));
      const [task, metric] = pick(EVAL_TASKS);
      const score = (0.78 + rand(0.18)).toFixed(3);
      const n = 1024 << Math.floor(rand(3));
      return {
        t: now,
        level: "ok",
        text: `eval/${task} ${metric}=${score} (n=${n})`,
      };
    }

    if (stepCounter >= nextCkpt) {
      nextCkpt = stepCounter + 600 + Math.floor(rand(400));
      const dir = pick(CKPT_DIRS);
      const size = (3.0 + rand(0.8)).toFixed(2);
      return {
        t: now,
        level: "event",
        text: `checkpoint saved → ${dir}-${step}.pt (${size} GB) · sha256:${Math.floor(
          rand(0xffffff),
        )
          .toString(16)
          .padStart(6, "0")}…`,
      };
    }

    if (r < 0.08) {
      // gpu utilization snapshot
      const utils = RANKS.map(() => 88 + Math.floor(rand(11))).join(",");
      const mem = (74 + rand(8)).toFixed(1);
      const temp = 60 + Math.floor(rand(8));
      return {
        t: now,
        level: "info",
        text: `gpu/0..7 util=${utils} mem=${mem}GB temp=${temp}C`,
      };
    }

    if (r < 0.12) {
      const basin = pick(BASIN_INGESTS);
      const n = 200 + Math.floor(rand(800));
      const tb = (0.3 + rand(2.4)).toFixed(2);
      return {
        t: now,
        level: "info",
        text: `corpus/${basin}: ingested ${n} borehole logs (Δ +${tb} TB)`,
      };
    }

    if (r < 0.135) {
      const link = 1 + Math.floor(rand(8));
      return {
        t: now,
        level: "warn",
        text: `infiniband link ${link}/8 reset (auto-recovered, ${
          5 + Math.floor(rand(40))
        }ms)`,
      };
    }

    if (r < 0.145) {
      const node = pick(["tacc-h-0214", "tacc-h-0301", "tacc-h-0188"]);
      return {
        t: now,
        level: "warn",
        text: `node ${node}: ecc single-bit corrected (count=${Math.floor(
          rand(4),
        ) + 1})`,
      };
    }

    // default: a step line
    step += 1;
    loss = Math.max(0.0091, loss - 0.00002 + (rand(1) - 0.5) * 0.0009);
    const tps = (380 + rand(8) - 4).toFixed(1);
    const grad = (rand(0.8) + 0.2).toFixed(3);
    return {
      t: now,
      level: "info",
      text: `step=${step} loss=${loss.toFixed(
        4,
      )} lr=${LR} tok/s=${tps}k grad_norm=${grad}`,
    };
  };
}

function levelClass(l: Level) {
  switch (l) {
    case "ok":
      return "text-green";
    case "warn":
      return "text-[#facc15]";
    case "event":
      return "text-accent";
    default:
      return "text-fg-dim";
  }
}

function levelTag(l: Level) {
  switch (l) {
    case "ok":
      return "OK ";
    case "warn":
      return "WRN";
    case "event":
      return "EVT";
    default:
      return "INF";
  }
}

const MAX_LINES = 500;

export default function ConsolePage() {
  const [lines, setLines] = useState<Line[]>([]);
  const [paused, setPaused] = useState(false);
  const [now, setNow] = useState(Date.now());
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickyBottom = useRef(true);

  // start the streamer on mount
  useEffect(() => {
    const stream = makeStreamer();

    // seed with a small backlog so the screen isn't empty on entry
    const seeded: Line[] = [];
    const base = Date.now() - 12_000;
    for (let i = 0; i < 18; i++) {
      const l = stream();
      l.t = base + i * 600;
      seeded.push(l);
    }
    setLines(seeded);

    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      timer = setInterval(() => {
        setLines((prev) => {
          const next = prev.concat(stream());
          if (next.length > MAX_LINES) next.splice(0, next.length - MAX_LINES);
          return next;
        });
      }, 240);
    };
    start();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  // pause/resume via key press
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "p") {
        e.preventDefault();
        setPaused((p) => !p);
      }
      if (e.key === "Escape" || e.key === "q") {
        window.location.href = "/";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // tick the clock for the header readout
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // auto-scroll to bottom unless the user has scrolled away
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (stickyBottom.current && !paused) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines, paused]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickyBottom.current = dist < 24;
  };

  const visibleLines = paused ? lines : lines;

  return (
    <main className="h-screen flex flex-col bg-[var(--bg)] text-fg font-mono">
      {/* top bar */}
      <div className="border-b hairline px-4 md:px-6 py-2 flex items-center gap-3 text-mono text-[11px] uppercase tracking-widest text-fg-dim">
        <Link
          href="/"
          className="text-fg-mute hover:text-accent transition-colors"
        >
          ← /
        </Link>
        <span className="text-accent">earth-labs</span>
        <span className="text-fg-mute">/</span>
        <span>jennifer-h2 · console</span>
        <span className="flex-1" />
        <span className="hidden sm:inline text-fg-mute">{ts(now)}</span>
        <span className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 ${
              paused ? "bg-[#facc15]" : "bg-green"
            } pulse`}
          />
          <span>{paused ? "paused" : "live"}</span>
        </span>
      </div>

      {/* sub bar — connection meta */}
      <div className="border-b hairline px-4 md:px-6 py-1.5 flex items-center gap-4 text-mono text-[10px] uppercase tracking-widest text-fg-mute bg-[var(--bg-elev)]">
        <span>tacc/horizon · 4096 × h100 · ib · zfs</span>
        <span>v0.4.1</span>
        <span className="hidden md:inline">
          ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄
        </span>
        <span className="flex-1" />
        <span>uptime · 14d 06:21:08</span>
      </div>

      {/* log stream */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-3 text-[12px] leading-[1.55] bg-black/30"
      >
        {visibleLines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">
            <span className="text-fg-mute">{ts(l.t)}</span>{" "}
            <span className={`${levelClass(l.level)} mr-2`}>
              [{levelTag(l.level)}]
            </span>
            <span className={levelClass(l.level)}>{l.text}</span>
          </div>
        ))}
        <div className="text-accent">
          ›{" "}
          <span
            className="inline-block"
            style={{
              animation: "caret-blink 0.9s steps(1) infinite",
            }}
          >
            ▋
          </span>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t hairline px-4 md:px-6 py-2 flex items-center gap-4 text-mono text-[10px] uppercase tracking-widest text-fg-mute">
        <span>
          <span className="text-fg-dim">space / p</span> pause
        </span>
        <span>
          <span className="text-fg-dim">esc / q</span> disconnect
        </span>
        <span className="flex-1" />
        <span className="hidden sm:inline">
          {visibleLines.length} lines · max {MAX_LINES}
        </span>
      </div>
    </main>
  );
}
