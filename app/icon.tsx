import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          borderRadius: 6,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2,
          padding: "4px 4px 5px 4px",
          border: "1.5px solid #3b82f6",
          boxSizing: "border-box",
        }}
      >
        {/* Bar chart columns - left to right going up */}
        <div style={{ width: 4, height: 8, background: "#10b981", borderRadius: 1, display: "flex" }} />
        <div style={{ width: 4, height: 12, background: "#3b82f6", borderRadius: 1, display: "flex" }} />
        <div style={{ width: 4, height: 6, background: "#10b981", borderRadius: 1, display: "flex" }} />
        <div style={{ width: 4, height: 16, background: "#8b5cf6", borderRadius: 1, display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
