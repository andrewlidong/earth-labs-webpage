"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// A small fixed widget bottom-right that mimics a live training monitor:
// 8 GPU pulse cells, a moving loss sparkline, a step counter, throughput.
// Pure synthetic, but the cadence is calibrated so it reads as plausible.
const NGPU = 32;

export default function TrainingWidget() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(128432);
  const [loss, setLoss] = useState(0.0184);
  const [thru, setThru] = useState(384.2);
  const [heat, setHeat] = useState<number[]>(() => Array(NGPU).fill(0.5));
  const [open, setOpen] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lossHistory = useRef<number[]>(
    Array.from({ length: 60 }, (_, i) => 0.06 - i * 0.0007)
  );

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setStep((s) => s + 1);
      setLoss((l) => {
        const next = Math.max(
          0.0091,
          l - 0.00002 + (Math.random() - 0.5) * 0.0009
        );
        lossHistory.current.push(next);
        if (lossHistory.current.length > 60) lossHistory.current.shift();
        return next;
      });
      setThru(() => 380 + Math.sin(Date.now() / 4000) * 8 + (Math.random() - 0.5) * 3);
      setHeat(() =>
        Array.from({ length: NGPU }, (_, i) =>
          Math.min(
            1,
            Math.max(
              0.15,
              0.45 +
                Math.sin(Date.now() / 1200 + i * 0.7) * 0.25 +
                (Math.random() - 0.5) * 0.18
            )
          )
        )
      );
    }, 380);
    return () => clearInterval(id);
  }, []);

  // draw loss sparkline
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const w = cvs.clientWidth;
    const h = cvs.clientHeight;
    cvs.width = Math.floor(w * dpr);
    cvs.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const data = lossHistory.current;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = Math.max(0.001, max - min);

    // baseline
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.moveTo(0, h - 0.5);
    ctx.lineTo(w, h - 0.5);
    ctx.stroke();

    // line
    ctx.strokeStyle = "rgba(217,119,6,0.95)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // fill area
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = "rgba(217,119,6,0.10)";
    ctx.fill();
  }, [loss]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 text-mono text-[10px] uppercase tracking-widest text-fg-mute hover:text-accent border hairline bg-[var(--bg-elev)] px-3 py-2 transition-colors"
      >
        ◉ training
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[260px] border hairline bg-[var(--bg-card)]/95 backdrop-blur-md text-mono text-[11px] hidden md:block">
      <div className="flex items-center justify-between px-3 py-2 border-b hairline">
        <Link
          href="/console"
          className="flex items-center gap-2 group"
          title="open console"
        >
          <span className="w-1.5 h-1.5 bg-green pulse" />
          <span className="text-fg-dim group-hover:text-accent transition-colors uppercase tracking-widest text-[10px]">
            training · jennifer-h2
          </span>
          <span className="text-fg-mute group-hover:text-accent transition-colors text-[10px]">
            ↗
          </span>
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="text-fg-mute hover:text-fg text-[12px]"
          aria-label="hide"
        >
          ×
        </button>
      </div>

      <div className="px-3 py-3 space-y-3">
        <div>
          <div className="text-[9px] uppercase tracking-widest text-fg-mute mb-1">
            loss · last 60 steps
          </div>
          <canvas
            ref={canvasRef}
            className="block w-full"
            style={{ height: 36 }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
          <Metric label="step" value={step.toLocaleString()} />
          <Metric label="loss" value={loss.toFixed(4)} accent />
          <Metric label="lr" value="3.0e-5" />
          <Metric label="tok/s" value={`${thru.toFixed(1)}k`} />
        </div>

        <div>
          <div className="text-[9px] uppercase tracking-widest text-fg-mute mb-1">
            gpu · 4096 × h100
          </div>
          <div
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
          >
            {heat.map((v, i) => {
              const hot = v > 0.6;
              return (
                <div
                  key={i}
                  className="h-[6px]"
                  style={{
                    background: hot
                      ? `rgba(217,119,6,${v.toFixed(3)})`
                      : `rgba(232,234,237,${(v * 0.4).toFixed(3)})`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-3 py-2 border-t hairline flex items-center justify-between text-[9px] uppercase tracking-widest text-fg-mute">
        <span>tacc/horizon</span>
        <span>v0.4.1</span>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b hairline pb-1">
      <span className="text-[9px] uppercase tracking-widest text-fg-mute">
        {label}
      </span>
      <span className={accent ? "text-accent" : "text-fg"}>{value}</span>
    </div>
  );
}
