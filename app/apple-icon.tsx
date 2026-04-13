import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          borderRadius: 36,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 10,
          padding: "24px 24px 28px 24px",
          border: "6px solid #3b82f6",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: 22, height: 44, background: "#10b981", borderRadius: 4, display: "flex" }} />
        <div style={{ width: 22, height: 68, background: "#3b82f6", borderRadius: 4, display: "flex" }} />
        <div style={{ width: 22, height: 34, background: "#10b981", borderRadius: 4, display: "flex" }} />
        <div style={{ width: 22, height: 90, background: "#8b5cf6", borderRadius: 4, display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
