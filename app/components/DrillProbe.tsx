"use client";

import { useEffect, useMemo, useState } from "react";

// Synthetic stratigraphic column. Depths in meters from surface.
// Colors picked to read against the dark hero bg without competing with the
// shader's warm palette.
const STRATA = [
  { top: 0,    bot: 250,  name: "alluvium",     short: "alv", color: "#c8b896" },
  { top: 250,  bot: 800,  name: "shale",        short: "sh",  color: "#4a5258" },
  { top: 800,  bot: 1400, name: "sandstone",    short: "ss",  color: "#d4a672" },
  { top: 1400, bot: 2100, name: "limestone",    short: "ls",  color: "#c4ccd0" },
  { top: 2100, bot: 2900, name: "serpentinite", short: "srp", color: "#6a8a68" },
  { top: 2900, bot: 3500, name: "peridotite",   short: "per", color: "#2f2a32" },
];

const TOTAL_DEPTH = 3500;

type Data = {
  prob: number;
  horizon: { name: string; depth: number };
  mix: { name: string; pct: number; color: string }[];
  latency: number;
  formation: string;
  coords: { lat: number; lon: number };
};

function hash(x: number, y: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function generate(
  x: number,
  y: number,
  w: number,
  h: number,
  targetDepth: number,
): Data {
  const fx = w > 0 ? x / w : 0.5;
  const fy = h > 0 ? y / h : 0.5;
  const r = hash(Math.round(x), Math.round(y));
  // Probability biased toward serpentinite-rich pseudo-zones.
  const base = 0.5 + Math.sin(fx * 6.28) * 0.25 + Math.cos(fy * 4.0) * 0.15;
  const prob = Math.max(0.08, Math.min(0.96, base + (r - 0.5) * 0.18));

  // Horizon = user-selected target depth, snapped to the nearest stratum.
  const horizonDepth = Math.round(targetDepth);
  const horizonStratum = STRATA.find((s) => horizonDepth >= s.top && horizonDepth < s.bot) ?? STRATA[4];

  // Lithology mix — randomized but normalized.
  const raw = STRATA.map((s, i) => 0.05 + hash(x + i * 31, y - i * 7) * (i === 4 ? prob * 1.4 : 1));
  const sum = raw.reduce((a, b) => a + b, 0);
  const mix = STRATA.map((s, i) => ({
    name: s.short,
    pct: raw[i] / sum,
    color: s.color,
  }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);

  const latency = Math.floor(180 + hash(x - 3, y + 11) * 140);
  const formationId = `eb-${Math.floor(hash(x, y) * 9000 + 1000)}`;

  // Synthetic plausible WGS84 coords drifting around N. Africa serpentinite belts.
  const lat = (24 + (fy - 0.5) * 8 + r * 2).toFixed(4);
  const lon = (-3 + (fx - 0.5) * 12 + r * 2).toFixed(4);

  return {
    prob,
    horizon: { name: horizonStratum.name, depth: horizonDepth },
    mix,
    latency,
    formation: formationId,
    coords: { lat: parseFloat(lat), lon: parseFloat(lon) },
  };
}

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  onClose: () => void;
};

export default function DrillProbe({ x, y, width, height, onClose }: Props) {
  // Strat column always spans nav-to-bottom so the depth scale stays readable.
  // The drill probe descends from the top of the column down to the click point
  // — the user clicked at a target depth and we're drilling to reach it.
  const colTop = 80;
  const colHeight = Math.max(280, height - colTop - 80);
  const px = colHeight / TOTAL_DEPTH;
  // Map the click_y to a target depth so the horizon (and reported depth)
  // reflects where the user clicked.
  const clampedY = Math.max(colTop + 20, Math.min(colTop + colHeight - 20, y));
  const targetDepth = Math.max(
    80,
    Math.min(TOTAL_DEPTH - 80, ((clampedY - colTop) / colHeight) * TOTAL_DEPTH),
  );

  const data = useMemo(
    () => generate(x, y, width, height, targetDepth),
    [x, y, width, height, targetDepth],
  );

  // Layout — flip panel side if click is on right half.
  const flip = x > width * 0.55;
  const stratX = flip ? x - 76 : x + 20;
  const panelX = flip ? stratX - 248 : stratX + 76;
  const safePanelX = Math.max(16, Math.min(width - 244, panelX));

  // Phases: drill (0–700ms), then panel + data populate.
  const [phase, setPhase] = useState<"drill" | "show">("drill");
  useEffect(() => {
    const id = setTimeout(() => setPhase("show"), 700);
    return () => clearTimeout(id);
  }, []);

  // ESC + click-outside dismissal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const horizonY = colTop + data.horizon.depth * px;

  return (
    <div
      className="absolute inset-0 z-30"
      onClick={(e) => {
        // Close on click outside the panel/strat group.
        const t = e.target as HTMLElement;
        if (!t.closest("[data-drill-keep]")) onClose();
      }}
    >
      {/* dim overlay */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity duration-300"
        style={{ opacity: phase === "show" ? 1 : 0 }}
      />

      {/* drill probe vertical line */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="probeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(217,119,6,0)" />
            <stop offset="20%" stopColor="rgba(217,119,6,0.95)" />
            <stop offset="100%" stopColor="rgba(249,115,22,0.5)" />
          </linearGradient>
        </defs>

        {/* target crosshair at user click point */}
        <g>
          <circle cx={x} cy={clampedY} r={5} fill="none" stroke="#d97706" strokeWidth="1.2" />
          <circle cx={x} cy={clampedY} r={1.5} fill="#fff" />
          <line x1={x - 14} x2={x - 7} y1={clampedY} y2={clampedY} stroke="#d97706" strokeWidth="1" />
          <line x1={x + 7} x2={x + 14} y1={clampedY} y2={clampedY} stroke="#d97706" strokeWidth="1" />
          <line x1={x} x2={x} y1={clampedY - 14} y2={clampedY - 7} stroke="#d97706" strokeWidth="1" />
          <line x1={x} x2={x} y1={clampedY + 7} y2={clampedY + 14} stroke="#d97706" strokeWidth="1" />
        </g>

        {/* leader line connecting crosshair to strat column at same depth */}
        {phase === "show" && (
          <line
            x1={x}
            y1={clampedY}
            x2={flip ? stratX + 56 : stratX}
            y2={clampedY}
            stroke="rgba(249,115,22,0.55)"
            strokeWidth="1"
            strokeDasharray="2 3"
            style={{ animation: "drill-horizon 400ms ease-out forwards" }}
          />
        )}

        {/* probe shaft — animated drop from surface to target */}
        <line
          x1={x}
          y1={colTop}
          x2={x}
          y2={clampedY}
          stroke="url(#probeGrad)"
          strokeWidth="1.5"
          strokeDasharray={Math.max(1, clampedY - colTop)}
          strokeDashoffset={Math.max(1, clampedY - colTop)}
          style={{
            animation: "drill-drop 700ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        />
        {/* drill bit slides from surface down to click */}
        <g
          style={{
            animation: "drill-bit 700ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          <polygon
            points={`${x - 4},${colTop} ${x + 4},${colTop} ${x},${colTop + 9}`}
            fill="#f97316"
          />
        </g>

        {/* horizon pulse — overlays the click crosshair to mark the H₂ target */}
        {phase === "show" && (
          <g style={{ animation: "drill-horizon 400ms ease-out forwards" }}>
            <circle cx={x} cy={clampedY} r={9} fill="none" stroke="rgba(249,115,22,0.55)" strokeWidth="1">
              <animate
                attributeName="r"
                values="6;18;6"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;0;0.7"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>

      {/* stratigraphic column */}
      <div
        data-drill-keep
        className="absolute"
        style={{
          left: stratX,
          top: colTop,
          width: 56,
          height: colHeight,
          transform: phase === "show" ? "translateX(0)" : `translateX(${flip ? 12 : -12}px)`,
          opacity: phase === "show" ? 1 : 0,
          transition: "transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 360ms",
        }}
      >
        {/* lithology bars */}
        <div className="absolute inset-0 border hairline overflow-hidden">
          {STRATA.map((s) => {
            const top = (s.top / TOTAL_DEPTH) * 100;
            const h = ((s.bot - s.top) / TOTAL_DEPTH) * 100;
            return (
              <div
                key={s.name}
                className="absolute left-0 right-0"
                style={{
                  top: `${top}%`,
                  height: `${h}%`,
                  background: s.color,
                }}
              >
                <span
                  className="absolute left-1 top-1 text-mono text-[8px] uppercase tracking-wider"
                  style={{ color: "rgba(0,0,0,0.55)" }}
                >
                  {s.short}
                </span>
              </div>
            );
          })}
        </div>

        {/* depth ticks on outside edge */}
        <div
          className="absolute top-0 bottom-0 text-mono text-[9px] text-fg-mute"
          style={{
            [flip ? "right" : "left"]: -42,
            width: 38,
            textAlign: flip ? "right" : "left",
          }}
        >
          {[0, 500, 1000, 1500, 2000, 2500, 3000, 3500].map((d) => (
            <div
              key={d}
              className="absolute leading-none"
              style={{
                top: `${(d / TOTAL_DEPTH) * 100}%`,
                transform: "translateY(-50%)",
                [flip ? "right" : "left"]: 0,
              }}
            >
              {d}m
            </div>
          ))}
        </div>
      </div>

      {/* data panel */}
      <div
        data-drill-keep
        className="absolute border hairline bg-[var(--bg-card)]/95 backdrop-blur-md text-mono"
        style={{
          left: safePanelX,
          top: Math.min(colTop, height - 280),
          width: 240,
          opacity: phase === "show" ? 1 : 0,
          transform: phase === "show" ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 320ms 200ms, transform 320ms 200ms",
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b hairline">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent pulse" />
            <span className="text-[10px] uppercase tracking-widest text-fg-dim">
              archive agent · demo
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-fg-mute hover:text-fg text-[12px]"
            aria-label="dismiss"
          >
            ×
          </button>
        </div>

        <div className="px-3 py-3 space-y-3">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-fg-mute mb-1">
              extraction confidence
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-accent text-[28px] leading-none">
                {data.prob.toFixed(2)}
              </span>
              <span className="text-[10px] text-fg-mute">
                ± {(0.04 + (1 - data.prob) * 0.06).toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-widest text-fg-mute mb-1">
              top horizon
            </div>
            <div className="text-[12px] text-fg">
              {data.horizon.name} ·{" "}
              <span className="text-accent">{data.horizon.depth.toLocaleString()} m</span>
            </div>
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-widest text-fg-mute mb-1">
              lithology mix
            </div>
            <div className="flex h-2 overflow-hidden border hairline">
              {data.mix.map((m) => (
                <div
                  key={m.name}
                  style={{ width: `${m.pct * 100}%`, background: m.color }}
                  title={`${m.name} ${(m.pct * 100).toFixed(0)}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
              {data.mix.map((m) => (
                <span key={m.name} className="text-[9px] text-fg-mute">
                  <span
                    className="inline-block w-1.5 h-1.5 mr-1 align-middle"
                    style={{ background: m.color }}
                  />
                  {m.name} {(m.pct * 100).toFixed(0)}%
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 border-t hairline">
            <Field label="formation" value={data.formation} />
            <Field label="latency" value={`${data.latency} ms`} />
            <Field
              label="lat"
              value={`${data.coords.lat.toFixed(3)}°`}
            />
            <Field
              label="lon"
              value={`${data.coords.lon.toFixed(3)}°`}
            />
          </div>
        </div>

        <div className="px-3 py-2 border-t hairline text-[9px] uppercase tracking-widest text-fg-mute flex items-center justify-between">
          <span>esc · or click outside to dismiss</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes drill-drop {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes drill-bit {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(${Math.max(0, clampedY - colTop - 4)}px);
            opacity: 0;
          }
        }
        @keyframes drill-horizon {
          from {
            opacity: 0;
            transform: scale(0.4);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-widest text-fg-mute leading-tight">
        {label}
      </span>
      <span className="text-[11px] text-fg leading-tight">{value}</span>
    </div>
  );
}
