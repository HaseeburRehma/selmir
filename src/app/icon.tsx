import { ImageResponse } from "next/og";

// Generates the browser-tab favicon from the Selmir brand mark on the fly.
// A stylised "S" in the same red gradient as the wordmark, on the site's
// dark ground, so it reads as the Selmir Suljkanovic brand at 32 px.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'Times New Roman', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1,
            background: "linear-gradient(180deg, #c8175d 0%, #7a0b3f 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            transform: "translateY(-1px)",
          }}
        >
          S
        </span>
      </div>
    ),
    size,
  );
}
