/**
 * Currency formatting for a given ISO 4217 code and BCP 47 locale, so the
 * same components can show US dollars, euros, Swiss francs or forints in the
 * way people in that country expect. Pure, no imports.
 */
export interface CurrencyFormat {
  /** ISO 4217 code, e.g. "EUR" */
  code: string;
  /** BCP 47 locale used for number formatting, e.g. "de-DE" */
  locale: string;
}

export const USD: CurrencyFormat = { code: "USD", locale: "en-US" };

export interface Money {
  code: string;
  locale: string;
  /** Currency symbol as written in the locale ("€", "£", "CHF", "kr", "zł") */
  symbol: string;
  format: (value: number) => string;
  /** Without minor units, for large figures */
  formatWhole: (value: number) => string;
  /** Plain grouped number in the locale, e.g. "250.000" */
  formatNumber: (value: number, maxDigits?: number) => string;
}

const cache = new Map<string, Money>();

export function makeMoney({ code, locale }: CurrencyFormat): Money {
  const key = `${code}|${locale}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const full = new Intl.NumberFormat(locale, { style: "currency", currency: code });
  const whole = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const symbol = full.formatToParts(0).find((p) => p.type === "currency")?.value ?? code;

  const money: Money = {
    code,
    locale,
    symbol,
    format: (value) => full.format(value),
    formatWhole: (value) => whole.format(value),
    formatNumber: (value, maxDigits = 2) =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: maxDigits }).format(value),
  };
  cache.set(key, money);
  return money;
}
