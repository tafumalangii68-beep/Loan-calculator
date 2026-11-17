/**
 * Pure exchange-rate helpers: parse the ECB daily reference-rate XML and turn
 * a rate into the scale used for a country's example loan amounts.
 * No imports, so it can be unit tested and used by scripts directly.
 *
 * Exchange rates only scale the *example* amounts a calculator starts with.
 * They never touch amounts a person types or the repayment formula.
 */

/** Rates as units of currency per 1 euro, e.g. { GBP: 0.85, HUF: 400 } */
export type RateMap = Record<string, number>;

export interface RateSnapshot {
  /** ECB reference date, YYYY-MM-DD */
  date: string;
  rates: RateMap;
}

export const ECB_DAILY_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

/**
 * Parse eurofxref-daily.xml. Returns null if the document doesn't look like
 * the ECB feed (no date or no rates), so callers can fall back safely.
 */
export function parseEcbXml(xml: string): RateSnapshot | null {
  const date = /time=['"](\d{4}-\d{2}-\d{2})['"]/.exec(xml)?.[1];
  const rates: RateMap = {};
  for (const match of xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([0-9]+(?:\.[0-9]+)?)['"]/g)) {
    const rate = Number(match[2]);
    if (Number.isFinite(rate) && rate > 0) rates[match[1]] = rate;
  }
  if (!date || Object.keys(rates).length === 0) return null;
  return { date, rates };
}

export interface ExampleScale {
  /** Units of the currency per euro used to scale the example amounts */
  scale: number;
  /** Where the scale came from */
  source: "euro" | "ecb" | "fallback";
  /** ECB reference date when `source` is "ecb" */
  date?: string;
}

/**
 * Scale for a currency's example amounts: 1 for the euro, the ECB rate when
 * one is available and plausible, otherwise the hand-set fallback.
 * A rate more than 50× away from the fallback is treated as a bad value.
 */
export function exampleScaleFor(currency: string, fallback: number, snapshot: RateSnapshot | null): ExampleScale {
  if (currency === "EUR") return { scale: 1, source: "euro" };
  const rate = snapshot?.rates[currency];
  if (rate && Number.isFinite(rate) && rate > 0 && rate / fallback < 50 && fallback / rate < 50) {
    return { scale: rate, source: "ecb", date: snapshot!.date };
  }
  return { scale: fallback, source: "fallback" };
}
