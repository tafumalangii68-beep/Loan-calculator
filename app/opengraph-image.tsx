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
  // Full LoanCalm logo (transparent PNG, 150px tall) shown above the headline.
  const logo = await readFile(join(process.cwd(), "app/og-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const logoHeight = 120;
  const logoWidth = Math.round((logo.readUInt32BE(16) / logo.readUInt32BE(20)) * logoHeight);

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />

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
