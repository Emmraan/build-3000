import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "build-3000 - the essential concepts for building software with AI coding agents";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#161412",
          color: "#edeae4",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#d97706",
            marginBottom: 24,
          }}
        >
          Inspired by the Oxford 3000
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, display: "flex" }}>
          build
          <span style={{ color: "#d97706" }}>-</span>
          3000
        </div>
        <div style={{ marginTop: 28, fontSize: 34, lineHeight: 1.35, color: "#a8a29a" }}>
          The essential concepts for building software with AI coding agents.
        </div>
      </div>
    ),
    size,
  );
}
