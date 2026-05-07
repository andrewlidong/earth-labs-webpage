"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CrustFallback from "./CrustFallback";

const CrustCanvas = dynamic(() => import("./CrustCanvas"), { ssr: false });

function detectWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

function HeroVisual() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);
  if (webgl === null) return <CrustFallback />;
  return webgl ? <CrustCanvas /> : <CrustFallback />;
}

function Coords() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 80);
    return () => clearInterval(id);
  }, []);
  const lat = (40.7128 + Math.sin(t * 0.04) * 0.0008).toFixed(6);
  const lon = (-74.006 + Math.cos(t * 0.05) * 0.0008).toFixed(6);
  const depth = (3214.7 + Math.sin(t * 0.07) * 12.4).toFixed(1);
  return (
    <span className="text-mono text-[11px] text-fg-mute">
      lat {lat}° / lon {lon}° / depth {depth} m
    </span>
  );
}

const BOOT_LINES = [
  "$ jennifer-h2 --warmup",
  "loading weights … 1.8B params",
  "corpus mounted · 25.0 PB",
  "ready.",
];

function Boot() {
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const line = BOOT_LINES[step] ?? "";
    if (chars < line.length) {
      const id = setTimeout(() => setChars((c) => c + 1), 22);
      return () => clearTimeout(id);
    }
    if (step < BOOT_LINES.length - 1) {
      const id = setTimeout(() => {
        setStep((s) => s + 1);
        setChars(0);
      }, 320);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setDone(true), 1100);
    return () => clearTimeout(id);
  }, [step, chars, done]);

  return (
    <div
      className={`text-mono text-[11px] tracking-wider text-fg-mute mb-6 transition-opacity duration-500 ${
        done ? "opacity-30" : "opacity-100"
      }`}
      style={{ minHeight: 16 }}
    >
      <span className="text-accent">›</span>{" "}
      <span className={done ? "" : "caret"}>
        {(BOOT_LINES[step] ?? "").slice(0, chars)}
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-[100svh] min-h-[680px] overflow-hidden border-b hairline">
      <div className="absolute inset-0 z-0">
        <HeroVisual />
      </div>
      <div className="scanline z-10" />
      <div className="noise z-10" />

      {/* corner crosshairs */}
      <CornerMark className="top-4 left-4" />
      <CornerMark className="top-4 right-4" flip />
      <CornerMark className="bottom-4 left-4" rotate />
      <CornerMark className="bottom-4 right-4" rotate flip />

      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-10 py-5 flex items-center justify-between text-mono text-[11px] tracking-widest uppercase text-fg-dim">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-accent pulse" />
          <span>earth-labs</span>
          <span className="text-fg-mute hidden sm:inline">/ subsurface foundation models</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#thesis" className="hover:text-fg transition-colors">thesis</a>
          <a href="#model" className="hover:text-fg transition-colors">model</a>
          <a href="#team" className="hover:text-fg transition-colors">team</a>
          <a href="mailto:hello@earth-labs.ai" className="hover:text-fg transition-colors">contact</a>
        </div>
        <div className="text-fg-mute hidden lg:block">stealth · 2026</div>
      </div>

      {/* main copy */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-10 pb-20 md:pb-28 pointer-events-none">
        <div className="max-w-5xl">
          <Boot />
          <h1 className="font-mono text-[clamp(2.4rem,7.2vw,7.5rem)] leading-[0.92] tracking-[-0.04em] text-fg">
            <span className="block hero-line hero-line-1">foundation models</span>
            <span className="block text-fg-dim hero-line hero-line-2">
              for the earth&apos;s crust.
            </span>
          </h1>
        </div>
      </div>

      {/* bottom telemetry */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-10 py-4 flex items-center justify-between text-mono text-[11px] text-fg-mute border-t hairline bg-black/30 backdrop-blur-sm">
        <Coords />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green pulse" />
          <span>training · tacc/horizon</span>
        </div>
      </div>
    </section>
  );
}

function CornerMark({
  className = "",
  rotate = false,
  flip = false,
}: {
  className?: string;
  rotate?: boolean;
  flip?: boolean;
}) {
  return (
    <div
      className={`absolute z-20 ${className}`}
      style={{
        transform: `${rotate ? "rotate(-90deg)" : ""} ${flip ? "scaleX(-1)" : ""}`,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M0 0H6M0 0V6" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </svg>
    </div>
  );
}
