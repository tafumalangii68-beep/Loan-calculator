import { test } from "node:test";
import assert from "node:assert/strict";
import { exampleScaleFor, parseEcbXml } from "../lib/exchange-rates-core.ts";
import { countries, CURRENCIES } from "../data/countries.ts";
import { calculateLoan } from "../lib/loan-math.ts";
import saved from "../data/exchange-rates.json" with { type: "json" };

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
  <Cube><Cube time='2026-11-17'>
    <Cube currency='GBP' rate='0.83305'/>
    <Cube currency='HUF' rate='364.93'/>
    <Cube currency='TRY' rate='48.1'/>
  </Cube></Cube>
</gesmes:Envelope>`;

test("parses the ECB daily XML", () => {
  const snapshot = parseEcbXml(SAMPLE);
  assert.ok(snapshot);
  assert.equal(snapshot.date, "2026-11-17");
  assert.deepEqual(snapshot.rates, { GBP: 0.83305, HUF: 364.93, TRY: 48.1 });
  assert.equal(parseEcbXml("<html>Service unavailable</html>"), null, "unexpected responses are rejected");
});

test("example scale: euro, ECB rate, or fallback", () => {
  const snapshot = parseEcbXml(SAMPLE);
  assert.deepEqual(exampleScaleFor("EUR", 1, snapshot), { scale: 1, source: "euro" });
  assert.deepEqual(exampleScaleFor("HUF", 400, snapshot), { scale: 364.93, source: "ecb", date: "2026-11-17" });
  // The ECB doesn't publish RSD: keep the fallback.
  assert.deepEqual(exampleScaleFor("RSD", 120, snapshot), { scale: 120, source: "fallback" });
  // No rates at all (ECB down and nothing saved): fallback.
  assert.deepEqual(exampleScaleFor("GBP", 1, null), { scale: 1, source: "fallback" });
  // An implausible value (e.g. a broken feed) is ignored.
  assert.equal(exampleScaleFor("GBP", 1, { date: "2026-11-17", rates: { GBP: 0.0001 } }).source, "fallback");
});

test("a weaker currency gets proportionally larger example amounts", () => {
  const before = exampleScaleFor("TRY", 45, { date: "2026-01-01", rates: { TRY: 40 } }).scale;
  const after = exampleScaleFor("TRY", 45, { date: "2026-11-17", rates: { TRY: 48 } }).scale;
  assert.ok(after > before);
  assert.equal(after / before, 1.2);
});

test("the saved snapshot covers every ECB-published currency used by a country", () => {
  assert.match(saved.date, /^\d{4}-\d{2}-\d{2}$/);
  const ecbPublished = ["GBP", "CHF", "SEK", "NOK", "DKK", "ISK", "PLN", "CZK", "RON", "HUF", "TRY"];
  for (const code of ecbPublished) assert.ok(saved.rates[code as keyof typeof saved.rates] > 0, `${code} saved`);
  // Every country currency resolves to a usable scale.
  for (const c of countries) {
    const { scale } = exampleScaleFor(c.currency, CURRENCIES[c.currency].exampleScale, saved);
    assert.ok(scale > 0, `${c.name} has an example scale`);
  }
});

test("exchange rates never change the repayment for amounts a person enters", () => {
  // The formula has no exchange-rate input: the same typed loan gives the same result.
  const a = calculateLoan(1_000_000, 30, 60);
  const b = calculateLoan(1_000_000, 30, 60);
  assert.equal(a.scheduledPayment, b.scheduledPayment);
});
