import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { countries, countriesByName, CURRENCIES, getCountry, REGIONS } from "../data/countries.ts";
import { makeMoney } from "../lib/money.ts";
import { calculateLoan, calculatePayment, estimateApr, formatPeriods } from "../lib/loan-math.ts";
import { parseNumber, validateLoanForm } from "../lib/loan-validation.ts";

const REQUESTED = [
  "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Switzerland", "Austria",
  "Sweden", "Norway", "Denmark", "Finland", "Ireland", "Portugal", "Poland", "Greece", "Czechia", "Romania",
  "Hungary", "Ukraine", "Russia", "Slovakia", "Croatia", "Slovenia", "Bulgaria", "Lithuania", "Latvia", "Estonia",
  "Iceland", "Luxembourg", "Malta", "Cyprus", "Serbia", "Montenegro", "North Macedonia", "Albania",
  "Bosnia and Herzegovina", "Moldova", "Belarus", "Kosovo", "Türkiye", "Andorra", "Monaco", "Liechtenstein",
  "San Marino", "Vatican City",
];

/** ISO 4217 currency of each country (Bulgaria joined the euro on 1 January 2026). */
const EXPECTED_CURRENCY: Record<string, string> = {
  GB: "GBP", CH: "CHF", LI: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", IS: "ISK", PL: "PLN", CZ: "CZK", RO: "RON",
  HU: "HUF", UA: "UAH", RU: "RUB", BY: "BYN", MD: "MDL", RS: "RSD", MK: "MKD", AL: "ALL", BA: "BAM", TR: "TRY",
};

test("every requested European country is configured exactly once", () => {
  assert.equal(countries.length, 47);
  assert.deepEqual([...countries.map((c) => c.name)].sort(), [...REQUESTED].sort());
  assert.equal(new Set(countries.map((c) => c.slug)).size, 47, "slugs are unique");
  assert.equal(new Set(countries.map((c) => c.code)).size, 47, "codes are unique");
});

test("country codes and slugs follow ISO 3166-1, with the documented exceptions", () => {
  for (const c of countries) {
    assert.match(c.code, /^[A-Z]{2}$/);
    const expectedSlug = c.code === "GB" ? "uk" : c.code.toLowerCase();
    assert.equal(c.slug, expectedSlug, `${c.name} slug`);
    assert.ok(REGIONS.includes(c.region), `${c.name} region`);
  }
  assert.ok(getCountry("xk")?.codeNote, "Kosovo's XK code is explained");
});

test("currencies are valid ISO 4217 codes and not everything is euro", () => {
  const supported = new Set(Intl.supportedValuesOf("currency"));
  for (const c of countries) {
    assert.ok(supported.has(c.currency), `${c.name}: ${c.currency} is ISO 4217`);
    assert.ok(CURRENCIES[c.currency], `${c.currency} has display info`);
    assert.equal(c.currency, EXPECTED_CURRENCY[c.code] ?? "EUR", `${c.name} currency`);
  }
});

test("each country formats money in its locale and has a flag image", () => {
  for (const c of countries) {
    const money = makeMoney({ code: c.currency, locale: c.locale });
    assert.ok(money.format(1234.5).length > 0, `${c.name} formats`);
    assert.ok(existsSync(join("public", "flags", `${c.code.toLowerCase()}.webp`)), `${c.name} flag`);
  }
  assert.equal(makeMoney({ code: "GBP", locale: "en-GB" }).format(1234.5), "£1,234.50");
  assert.equal(makeMoney({ code: "EUR", locale: "de-DE" }).format(1234.5), "1.234,50 €");
});

test("country content is specific to each country", () => {
  const intros = new Set(countries.map((c) => c.intro));
  assert.equal(intros.size, countries.length, "no copied intros");
  for (const c of countries) {
    assert.ok(c.notes.length >= 3 && c.terms.length >= 3, `${c.name} has notes and terms`);
    assert.ok(c.regulator && c.aprTerm && c.aprShort, `${c.name} has regulator and APR term`);
  }
  assert.deepEqual(countriesByName.map((c) => c.name), [...countriesByName.map((c) => c.name)].sort((a, b) => a.localeCompare(b, "en")));
});

test("parseNumber reads European and US number formats", () => {
  assert.equal(parseNumber("250.000"), 250_000);
  assert.equal(parseNumber("250 000"), 250_000);
  assert.equal(parseNumber("1’250’000"), 1_250_000);
  assert.equal(parseNumber("1.234,56"), 1234.56);
  assert.equal(parseNumber("1,234.56"), 1234.56);
  assert.equal(parseNumber("€ 3.500"), 3500);
  assert.equal(parseNumber("3,5"), 3.5);
  assert.equal(parseNumber("3,5", "decimal"), 3.5);
  assert.equal(parseNumber("3,500", "decimal"), 3.5);
  assert.equal(parseNumber("3,500"), 3500);
  assert.ok(Number.isNaN(parseNumber("1,2,3.4.5")));
  assert.ok(Number.isNaN(parseNumber("--5")));
});

test("a German-style rate is not misread as a much higher rate", () => {
  const result = validateLoanForm(
    { amount: "250.000", downPayment: "", rate: "3,5", term: "25", termUnit: "years", extra: "", feePercent: "" },
    { hasDownPayment: false, hasFee: false, amountLabel: "Loan amount" },
  );
  assert.ok(result.ok);
  assert.equal(result.value.principal, 250_000);
  assert.equal(result.value.annualRatePercent, 3.5);
  assert.equal(result.value.payments, 300);
});

test("repayment frequency divides the annual rate by payments per year", () => {
  const weekly = calculatePayment(10_000, 5, 52, 52);
  const r = 0.05 / 52;
  assert.ok(Math.abs(weekly - (10_000 * r) / (1 - Math.pow(1 + r, -52))) < 1e-9);

  const quarterly = calculateLoan(20_000, 8, 20, 0, 4);
  assert.equal(quarterly.schedule.length, 20);
  assert.equal(quarterly.yearly.length, 5);
  assert.ok(quarterly.schedule.at(-1)!.balance === 0);

  const fortnightly = validateLoanForm(
    { amount: "10000", downPayment: "", rate: "6", term: "2", termUnit: "years", extra: "", feePercent: "" },
    { hasDownPayment: false, hasFee: false, amountLabel: "Loan amount", periodsPerYear: 26 },
  );
  assert.ok(fortnightly.ok);
  assert.equal(fortnightly.value.payments, 52);
  assert.equal(formatPeriods(52, 26), "2 years");

  // Monthly stays the default and matches the original behaviour.
  assert.equal(calculatePayment(25_000, 7.5, 60).toFixed(2), calculatePayment(25_000, 7.5, 60, 12).toFixed(2));
});

test("effective APR (EU/UK method) compounds the periodic rate", () => {
  const noFee = estimateApr(10_000, 10, 36, 0, { effective: true });
  assert.ok(Math.abs(noFee - (Math.pow(1 + 0.1 / 12, 12) - 1) * 100) < 1e-9);
  const withFee = estimateApr(10_000, 10, 36, 300, { effective: true });
  assert.ok(withFee > noFee, "a fee raises the APRC");
  // The US (nominal) method is unchanged.
  assert.equal(estimateApr(10_000, 10, 36, 0), 10);
});
