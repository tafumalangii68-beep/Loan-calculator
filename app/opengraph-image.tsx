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
          background: "#FAF8F5",
          color: "#252522",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="96" height="96" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill="#205C40" />
            <path d="M8.5 23.5C8.5 14 14 8.5 23.5 8.5 23.5 18 18 23.5 8.5 23.5Z" fill="#E9F0E4" />
            <path d="M9.5 22.5 18.5 13.5" stroke="#205C40" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: -1.5 }}>
            <span>Loan</span>
            <span style={{ color: "#205C40" }}>Calm</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -2 }}>Loan Calculator</div>
          <div style={{ fontSize: 36, color: "#68645E", marginTop: 14 }}>
            Monthly payment, total interest and a full amortization schedule
          </div>
        </div>
        <div style={{ display: "flex", height: 14, borderRadius: 7, background: "#E9F0E4" }}>
          <div style={{ width: "83%", background: "#205C40", borderRadius: 7 }} />
        </div>
      </div>
    ),
    size,
  );
}
