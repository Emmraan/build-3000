import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "build-3000";

/**
 * iOS home-screen tile matching the app/icon.svg mark: charcoal tile, amber
 * highlighter stroke behind the bold lowercase "b", amber "3" tucked top
 * right. Rendered at build time by next/og - no image-editing dependencies.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#1c1917",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 25,
            bottom: 40,
            width: 105,
            height: 41,
            borderRadius: 16,
            background: "#d97706",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            bottom: -14,
            fontSize: 133,
            fontWeight: 800,
            color: "#faf9f7",
            fontFamily: "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            display: "flex",
          }}
        >
          b
        </div>
        <div
          style={{
            position: "absolute",
            right: 26,
            top: 18,
            fontSize: 61,
            fontWeight: 700,
            color: "#d97706",
            fontFamily: "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            display: "flex",
          }}
        >
          3
        </div>
      </div>
    ),
    size,
  );
}
