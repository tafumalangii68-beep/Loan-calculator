import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f8f6f2",
          color: "#24211e",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[520, 380, 220].map((w, i) => (
            <div key={w} style={{ width: w, height: 28, borderRadius: 14, background: "#2e6a5c", opacity: 1 - i * 0.2 }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 36, color: "#625c55", marginTop: 12 }}>{siteConfig.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
