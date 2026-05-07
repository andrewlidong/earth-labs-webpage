import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "earth-labs — foundation models for Earth's crust";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050607",
          color: "#e8eaed",
          padding: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "ui-monospace, Menlo, monospace",
          backgroundImage:
            "radial-gradient(800px 400px at 80% 20%, rgba(217,119,6,0.18), transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9aa0a8",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: "#d97706",
            }}
          />
          earth-labs
        </div>

        <div
          style={{
            fontSize: 92,
            lineHeight: 1.0,
            letterSpacing: -3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>foundation models</div>
          <div style={{ color: "#8a9099" }}>for the earth&apos;s crust.</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            letterSpacing: 2,
            color: "#8a9099",
          }}
        >
          <div>jennifer-h2 · subsurface foundation model</div>
          <div>earth-labs.ai</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
