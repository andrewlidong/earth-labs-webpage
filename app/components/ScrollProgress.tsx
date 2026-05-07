"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      setPct(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full bg-accent origin-left"
        style={{
          transform: `scaleX(${pct})`,
          transition: "transform 120ms linear",
          boxShadow: "0 0 8px rgba(217, 119, 6, 0.6)",
        }}
      />
    </div>
  );
}
