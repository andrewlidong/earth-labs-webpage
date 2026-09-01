import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "earth-labs.ai";
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
            fontSize: 168,
            lineHeight: 1.0,
            letterSpacing: -6,
            display: "flex",
          }}
        >
          earth-labs<span style={{ color: "#8a9099" }}>.ai</span>
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
          <div>the archive agent</div>
          <div>subsurface data, unlocked</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
