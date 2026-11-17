// Saves the latest ECB reference rates to data/exchange-rates.json.
// That file is the "last successfully saved" fallback the site uses when the
// ECB can't be reached during a build. Run: npm run rates:update
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ECB_DAILY_URL, parseEcbXml } from "../lib/exchange-rates-core.ts";

const target = fileURLToPath(new URL("../data/exchange-rates.json", import.meta.url));

const response = await fetch(ECB_DAILY_URL, { signal: AbortSignal.timeout(15_000) });
if (!response.ok) {
  console.error(`ECB request failed: HTTP ${response.status}. Keeping the existing snapshot.`);
  process.exit(1);
}
const snapshot = parseEcbXml(await response.text());
if (!snapshot) {
  console.error("Unexpected ECB response. Keeping the existing snapshot.");
  process.exit(1);
}

writeFileSync(
  target,
  `${JSON.stringify({ source: "European Central Bank euro foreign exchange reference rates", url: ECB_DAILY_URL, ...snapshot }, null, 2)}\n`,
);
console.log(`Saved ${Object.keys(snapshot.rates).length} ECB rates for ${snapshot.date} to data/exchange-rates.json`);
