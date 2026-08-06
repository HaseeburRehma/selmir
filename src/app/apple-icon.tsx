import { ImageResponse } from "next/og";

// iOS home-screen icon — same brand mark as `icon.tsx`, scaled up to
// Apple's 180x180 requirement.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0918",
        }}
      >
        <span
          style={{
            fontFamily: "'Times New Roman', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 1,
            background: "linear-gradient(180deg, #c8175d 0%, #7a0b3f 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            transform: "translateY(-6px)",
          }}
        >
          S
        </span>
      </div>
    ),
    size,
  );
}
