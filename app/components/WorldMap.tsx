"use client";

// Equirectangular projection — purely a coordinate plane with the corpus's
// dataset locations marked. We dropped continent silhouettes deliberately;
// this reads as a scientific instrument, not a geography lesson.

type Site = {
  // lon: -180..180, lat: -90..90
  lon: number;
  lat: number;
  name: string;
  sub: string;
  weight: number; // 0..1
};

const sites: Site[] = [
  { lon: 4, lat: 60, name: "diskos", sub: "north sea · 22 PB", weight: 1.0 },
  { lon: 5, lat: 52, name: "tno", sub: "netherlands · 5,800", weight: 0.6 },
  { lon: 14, lat: 50, name: "epos", sub: "europe · 800 TB", weight: 0.5 },
  { lon: -98, lat: 38, name: "nibi", sub: "usa · 182,193", weight: 0.95 },
  { lon: 134, lat: -25, name: "aus.gov", sub: "4,000 km 2D seismic", weight: 0.7 },
  { lon: -150, lat: 5, name: "iodp/lily", sub: "pacific · 2 PB", weight: 0.65 },
  { lon: 70, lat: -20, name: "iodp/lily", sub: "indian ocean", weight: 0.55 },
  { lon: -25, lat: 0, name: "iodp/lily", sub: "atlantic", weight: 0.55 },
  { lon: -55, lat: -50, name: "iodp/lily", sub: "south atlantic", weight: 0.45 },
  { lon: 100, lat: 30, name: "geoph.", sub: "asia", weight: 0.4 },
];

const W = 1000;
const H = 400;
const project = (lon: number, lat: number) => ({
  x: ((lon + 180) / 360) * W,
  y: ((90 - lat) / 180) * H,
});

// Heuristic landmass: a few overlapping ellipses with a tiny phase noise.
// Not geographically accurate, but recognizable enough to anchor the map
// without resorting to bad continent paths.
type Cont = [
  centerLon: number,
  centerLat: number,
  halfLon: number,
  halfLat: number
];
const CONTINENTS: Cont[] = [
  [-100, 48, 36, 22], // North America
  [-62, -18, 22, 28], // South America
  [12, 50, 28, 15], // Europe
  [85, 58, 65, 18], // Russia / N Asia
  [20, 2, 28, 35], // Africa
  [78, 25, 28, 22], // South / SE Asia
  [115, 32, 22, 18], // E Asia / China
  [115, -1, 18, 8], // Indonesia
  [135, -25, 18, 12], // Australia
  [-42, 72, 18, 10], // Greenland
];
function isLand(lon: number, lat: number) {
  // Antarctica strip
  if (lat <= -64) return true;
  for (const [cl, ct, wl, ht] of CONTINENTS) {
    const dx = (lon - cl) / wl;
    const dy = (lat - ct) / ht;
    const noise =
      Math.sin(lon * 0.18 + lat * 0.22) * 0.12 +
      Math.sin(lon * 0.07 - lat * 0.13) * 0.08;
    if (Math.sqrt(dx * dx + dy * dy) + noise < 1.0) return true;
  }
  return false;
}

const COLS = 80;
const ROWS = 36;
const landDots: { x: number; y: number }[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const lon = (c / COLS) * 360 - 180;
    const lat = 90 - (r / ROWS) * 180;
    if (isLand(lon, lat)) {
      const { x, y } = project(lon, lat);
      landDots.push({ x, y });
    }
  }
}

export default function WorldMap() {
  return (
    <div className="border hairline bg-[var(--bg-card)] p-4 md:p-6">
      <div className="flex items-center justify-between text-mono text-[10px] uppercase tracking-widest text-fg-mute mb-4">
        <span>corpus coverage · equirectangular</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent pulse" />
          {sites.length} active basins · 25.0 PB
        </span>
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Global corpus coverage map"
        >
          {/* stippled landmass */}
          <g fill="rgba(232,234,237,0.16)">
            {landDots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={1.4} />
            ))}
          </g>

          {/* graticule — 30° spacing */}
          <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none">
            {[30, 60, 90, 120, 150].map((lat) => {
              const y = (lat / 180) * H;
              return (
                <g key={`h${lat}`}>
                  <line x1="0" x2={W} y1={y} y2={y} />
                </g>
              );
            })}
            {[30, 60, 90, 120, 150, 210, 240, 270, 300, 330].map((lon) => {
              const x = (lon / 360) * W;
              return <line key={`v${lon}`} x1={x} x2={x} y1="0" y2={H} />;
            })}
          </g>

          {/* equator + prime meridian + tropics */}
          <g stroke="rgba(255,255,255,0.10)" strokeWidth="1">
            <line x1="0" x2={W} y1={H / 2} y2={H / 2} />
            <line x1={W / 2} x2={W / 2} y1="0" y2={H} />
          </g>
          <g
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeDasharray="3 4"
          >
            {/* tropic of cancer (~23.5° N) and capricorn */}
            <line x1="0" x2={W} y1={(66.5 / 180) * H} y2={(66.5 / 180) * H} />
            <line x1="0" x2={W} y1={(113.5 / 180) * H} y2={(113.5 / 180) * H} />
          </g>

          {/* axis labels (lon/lat) */}
          <g
            fill="rgba(154,160,168,0.55)"
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="9"
          >
            {[-180, -120, -60, 0, 60, 120, 180].map((lon) => {
              const x = ((lon + 180) / 360) * W;
              return (
                <text key={`lonl${lon}`} x={x + 3} y={H - 4}>
                  {lon}°
                </text>
              );
            })}
            {[-60, -30, 0, 30, 60].map((lat) => {
              const y = ((90 - lat) / 180) * H;
              return (
                <text key={`latl${lat}`} x="6" y={y - 3}>
                  {lat}°
                </text>
              );
            })}
          </g>

          {/* dataset sites */}
          <g>
            {sites.map((s, i) => {
              const { x, y } = project(s.lon, s.lat);
              const r = 3 + s.weight * 5;
              const labelLeft = x > W * 0.7;
              return (
                <g key={i}>
                  {/* halo pulse */}
                  <circle
                    cx={x}
                    cy={y}
                    r={r * 3}
                    fill="rgba(217,119,6,0.18)"
                    style={{
                      transformOrigin: `${x}px ${y}px`,
                      animation: `wm-pulse ${2.6 + i * 0.27}s ease-in-out infinite`,
                      animationDelay: `${i * 0.18}s`,
                    }}
                  />
                  <circle cx={x} cy={y} r={r} fill="rgba(217,119,6,0.9)" />
                  <circle cx={x} cy={y} r={1.2} fill="#fff" />

                  {/* leader line + label */}
                  <line
                    x1={x}
                    y1={y}
                    x2={labelLeft ? x - 18 : x + 18}
                    y2={y}
                    stroke="rgba(217,119,6,0.45)"
                    strokeWidth="0.7"
                  />
                  <text
                    x={labelLeft ? x - 22 : x + 22}
                    y={y + 3}
                    textAnchor={labelLeft ? "end" : "start"}
                    fill="rgba(232,234,237,0.95)"
                    fontFamily="ui-monospace, Menlo, monospace"
                    fontSize="11"
                  >
                    {s.name}
                  </text>
                  <text
                    x={labelLeft ? x - 22 : x + 22}
                    y={y + 14}
                    textAnchor={labelLeft ? "end" : "start"}
                    fill="rgba(154,160,168,0.75)"
                    fontFamily="ui-monospace, Menlo, monospace"
                    fontSize="9"
                  >
                    {s.sub}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <style jsx>{`
        @keyframes wm-pulse {
          0%,
          100% {
            transform: scale(0.55);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}
