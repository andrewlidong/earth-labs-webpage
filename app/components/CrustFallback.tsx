// SVG fallback shown when WebGL is unavailable. Stratified layers + boreholes.
export default function CrustFallback() {
  const layers = [
    { y: 0, h: 90, c: "#f5c98a" },
    { y: 90, h: 80, c: "#c98a55" },
    { y: 170, h: 100, c: "#8c5638" },
    { y: 270, h: 110, c: "#5a3a2c" },
    { y: 380, h: 130, c: "#3a2422" },
    { y: 510, h: 200, c: "#5a1f18" },
    { y: 710, h: 200, c: "#7a2710" },
  ];
  const bores = [0.18, 0.36, 0.62, 0.84];
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      style={{ background: "#050607" }}
    >
      <defs>
        <filter id="rough" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" />
          <feDisplacementMap in="SourceGraphic" scale="40" />
        </filter>
        <linearGradient id="topfade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#050607" />
          <stop offset="22%" stopColor="#050607" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hot" cx="0.7" cy="0.78" r="0.5">
          <stop offset="0%" stopColor="#ff6a14" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff6a14" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter="url(#rough)" opacity="0.85">
        {layers.map((l, i) => (
          <rect key={i} x="-100" y={l.y} width="1640" height={l.h} fill={l.c} />
        ))}
      </g>
      <rect width="1440" height="900" fill="url(#hot)" />
      {bores.map((bx, i) => {
        const x = bx * 1440;
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1="60"
              y2="900"
              stroke="rgba(245,245,235,0.85)"
              strokeWidth="1.2"
            />
            {Array.from({ length: 6 }).map((_, j) => (
              <circle
                key={j}
                cx={x}
                cy={120 + j * 130}
                r={3}
                fill="#ffd178"
                opacity={0.85}
              />
            ))}
          </g>
        );
      })}
      <rect width="1440" height="900" fill="url(#topfade)" />
    </svg>
  );
}
