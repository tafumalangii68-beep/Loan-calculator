// Server-side only: imported by server components (country pages).
import savedSnapshot from "@/data/exchange-rates.json";
import { ECB_DAILY_URL, parseEcbXml, type RateSnapshot } from "./exchange-rates-core";

/** How often country pages refetch ECB rates and regenerate: once a day. */
export const RATES_REVALIDATE_SECONDS = 86_400;

export interface ExchangeRates extends RateSnapshot {
  origin: "ecb-live" | "saved-snapshot";
}

/**
 * Latest ECB reference rates, fetched at most once a day (Next.js data cache).
 *
 * If the ECB can't be reached:
 * - at build time (or in development), use the last successfully saved
 *   snapshot in data/exchange-rates.json, so the build never fails;
 * - during a background daily regeneration, throw, so Next.js keeps serving
 *   the last successfully generated pages with the rates they already had.
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    const response = await fetch(ECB_DAILY_URL, {
      next: { revalidate: RATES_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`ECB rates request failed: HTTP ${response.status}`);
    const snapshot = parseEcbXml(await response.text());
    if (!snapshot) throw new Error("ECB rates response could not be parsed");
    return { ...snapshot, origin: "ecb-live" };
  } catch (error) {
    const phase = process.env.NEXT_PHASE;
    const canUseSaved = phase === "phase-production-build" || phase === "phase-development-server";
    if (!canUseSaved) throw error;
    console.warn(`Using saved exchange rates from ${savedSnapshot.date}:`, (error as Error).message);
    return { date: savedSnapshot.date, rates: savedSnapshot.rates, origin: "saved-snapshot" };
  }
}
