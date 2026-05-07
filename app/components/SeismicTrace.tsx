"use client";

import { useEffect, useRef } from "react";

// Multi-channel seismic-record-style strip. Renders 6 horizontal traces with
// time-varying noise + a propagating "event" pulse. Pure 2D canvas, very cheap.
export default function SeismicTrace() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const r = cvs.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cvs.width = Math.floor(w * dpr);
      cvs.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    const channels = 6;
    let t0 = performance.now();
    const noiseSeed = (i: number, x: number, t: number) => {
      // cheap pseudo-noise
      const s = Math.sin(x * 0.012 + t * 0.4 + i * 7.7) +
        Math.sin(x * 0.045 - t * 0.7 + i * 3.1) * 0.6 +
        Math.sin(x * 0.11 + t * 1.3 + i * 1.9) * 0.3;
      return s / 1.9;
    };

    const draw = () => {
      const now = performance.now();
      const t = (now - t0) / 1000;

      ctx.clearRect(0, 0, w, h);

      // baseline center marks (left labels area + right edge)
      const left = 56;
      const right = w - 12;
      const trackH = (h - 16) / channels;

      for (let i = 0; i < channels; i++) {
        const y0 = 8 + trackH * (i + 0.5);

        // label
        ctx.fillStyle = "rgba(154,160,168,0.55)";
        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(`ch${String(i + 1).padStart(2, "0")}`, 8, y0 + 3);

        // hairline midline
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(left, y0);
        ctx.lineTo(right, y0);
        ctx.stroke();

        // trace
        ctx.strokeStyle = i === 2 ? "rgba(217,119,6,0.85)" : "rgba(232,234,237,0.55)";
        ctx.lineWidth = i === 2 ? 1.2 : 1;
        ctx.beginPath();
        const amp = trackH * 0.36;
        for (let x = left; x <= right; x += 2) {
          let v = noiseSeed(i, x - left, t);
          // propagating event pulse — a Gaussian envelope sweeping right
          const eventX = ((t * 180) % (right - left + 240)) - 120;
          const dx = (x - left) - eventX;
          const env = Math.exp(-(dx * dx) / 1400) * (1 + i * 0.05);
          v += Math.sin(dx * 0.18) * env * 1.6;
          const y = y0 + v * amp;
          if (x === left) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // top + bottom hairline
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0.5); ctx.lineTo(w, 0.5);
      ctx.moveTo(0, h - 0.5); ctx.lineTo(w, h - 0.5);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative border-b hairline bg-[var(--bg-elev)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-3">
        <div className="flex items-center justify-between text-mono text-[10px] uppercase tracking-widest text-fg-mute mb-2">
          <span>seismic record · live · channels 01—06</span>
          <span>sample rate 1 khz · gain 12 db</span>
        </div>
        <canvas
          ref={ref}
          className="block w-full"
          style={{ height: 140 }}
        />
      </div>
    </div>
  );
}
