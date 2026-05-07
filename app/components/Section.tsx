import { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Deterministic per-section "marker" — gives each section a unique
// instrument-bar readout without storing per-section state.
function marker(num: string) {
  const n = parseInt(num, 10) || 0;
  const lat = (12 + n * 7.39) % 90;
  const lon = (-180 + (n * 41.7) % 360);
  const depth = 100 + n * 217;
  return {
    lat: lat.toFixed(2),
    lon: lon.toFixed(2),
    depth: depth.toString().padStart(4, "0"),
  };
}

export function Section({
  id,
  num,
  label,
  title,
  children,
  className = "",
}: {
  id?: string;
  num: string;
  label: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const m = marker(num);
  return (
    <section
      id={id}
      className={`relative border-b hairline scroll-mt-0 overflow-hidden ${className}`}
    >
      {/* CAD-style instrument strip at top */}
      <div className="border-t hairline bg-[var(--bg-elev)] px-6 md:px-10 py-2 flex items-center gap-3 text-mono text-[10px] uppercase tracking-widest text-fg-mute">
        <span className="text-accent">§ {num}</span>
        <span className="text-fg-dim">{label}</span>
        <span
          className="flex-1 border-t border-dashed opacity-50"
          style={{ borderColor: "var(--border-strong)" }}
          aria-hidden
        />
        <span className="hidden sm:inline">
          lat {m.lat}° · lon {m.lon}° · depth {m.depth}m
        </span>
        <span className="hidden md:inline">
          ┄ ┄ ┄ ┄
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-32">
        {/* giant numeral bleeding through */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute right-6 md:right-10 -top-2 md:-top-6 font-mono leading-none tracking-[-0.06em] text-fg"
          style={{
            fontSize: "clamp(7rem, 16vw, 14rem)",
            opacity: 0.045,
          }}
        >
          {num}
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <Reveal className="md:col-span-3 flex flex-col gap-2">
            <div className="section-num">§ {num}</div>
            <div className="label">{label}</div>
          </Reveal>
          <div className="md:col-span-9">
            {title && (
              <Reveal delay={80}>
                <h2 className="font-mono text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] text-fg mb-10 md:mb-14">
                  {title}
                </h2>
              </Reveal>
            )}
            <Reveal delay={160}>{children}</Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
