import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Illustration with empty space on the left for the headline (1200×630).
  const background = await readFile(join(process.cwd(), "app/og-background.jpg"));
  const backgroundSrc = `data:image/jpeg;base64,${background.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "#252522" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={backgroundSrc} width={1200} height={630} alt="" style={{ position: "absolute", inset: 0 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 80px",
            width: 640,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width="72" height="72" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="9" fill="#205C40" />
              <rect x="4" y="8" width="24.5" height="4.2" rx="2.1" fill="#fff" />
              <rect x="4" y="14.1" width="17.6" height="4.2" rx="2.1" fill="#fff" />
              <rect x="4" y="20.2" width="12.2" height="4.2" rx="2.1" fill="#fff" />
            </svg>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 700, letterSpacing: -1 }}>
              <span>Loan</span>
              <span style={{ color: "#205C40" }}>Calm</span>
            </div>
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, marginTop: 36 }}>
            Loan Calculator
          </div>
          <div style={{ fontSize: 30, color: "#68645E", marginTop: 18, lineHeight: 1.3 }}>
            Monthly payment, total interest and a full amortization schedule
          </div>
        </div>
      </div>
    ),
    size,
  );
}
