import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateLoan, calculatePayment, estimateApr, formatDuration } from "../lib/loan-math.ts";
import { parseNumber, validateLoanForm, type LoanFormValues } from "../lib/loan-validation.ts";

const near = (actual: number, expected: number, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);

test("payment matches the textbook amortization formula", () => {
  // $200,000 at 6% for 30 years -> $1,199.10 (standard published example)
  near(calculatePayment(200_000, 6, 360), 1199.1);
  // $10,000 at 5% for 5 years -> $188.71
  near(calculatePayment(10_000, 5, 60), 188.71);
  // $25,000 at 7.5% for 60 months -> $500.95
  near(calculatePayment(25_000, 7.5, 60), 500.95);
});

test("0% interest divides principal evenly", () => {
  assert.equal(calculatePayment(12_000, 0, 24), 500);
  const result = calculateLoan(12_000, 0, 24);
  assert.equal(result.totalInterest, 0);
  near(result.totalPaid, 12_000);
  assert.equal(result.payoffMonths, 24);
});

test("schedule pays the loan off exactly at the end of the term", () => {
  const result = calculateLoan(200_000, 6, 360);
  assert.equal(result.schedule.length, 360);
  assert.equal(result.schedule.at(-1)!.balance, 0);
  near(result.totalPaid, result.principal + result.totalInterest);
  // Known total interest for this example: ~$231,676.38
  near(result.totalInterest, 231_676.38, 1);
  // First month: interest = 200000 * 0.005 = 1000
  near(result.schedule[0].interest, 1000);
});

test("yearly summary adds up to the full schedule", () => {
  const result = calculateLoan(30_000, 6.8, 120);
  assert.equal(result.yearly.length, 10);
  const yearlyInterest = result.yearly.reduce((s, y) => s + y.interest, 0);
  near(yearlyInterest, result.totalInterest);
  const yearlyPrincipal = result.yearly.reduce((s, y) => s + y.principal, 0);
  near(yearlyPrincipal, 30_000);
});

test("extra payments shorten the loan and save interest", () => {
  const result = calculateLoan(200_000, 6, 360, 200);
  assert.ok(result.payoffMonths < 360);
  assert.ok(result.interestSaved > 0);
  assert.equal(result.monthsSaved, 360 - result.payoffMonths);
  assert.equal(result.schedule.at(-1)!.balance, 0);
  near(result.totalPaid, 200_000 + result.totalInterest);
});

test("extra payment larger than the balance does not overpay", () => {
  const result = calculateLoan(1_000, 10, 12, 5_000);
  assert.equal(result.payoffMonths, 1);
  near(result.totalPaid, 1_000 + 1_000 * (0.1 / 12));
});

test("APR estimate exceeds the note rate when a fee is deducted", () => {
  assert.equal(estimateApr(10_000, 10, 36, 0), 10);
  const apr = estimateApr(10_000, 10, 36, 500);
  // A 5% fee on a 3-year loan adds roughly 3.3-3.5 points of APR
  assert.ok(apr > 13.2 && apr < 13.6, `apr was ${apr}`);
});

test("formatDuration", () => {
  assert.equal(formatDuration(60), "5 years");
  assert.equal(formatDuration(61), "5 years 1 month");
  assert.equal(formatDuration(11), "11 months");
});

test("parseNumber accepts friendly formats and rejects junk", () => {
  assert.equal(parseNumber("25,000"), 25_000);
  assert.equal(parseNumber(" $1,250.50 "), 1250.5);
  assert.equal(parseNumber("6.5%"), 6.5);
  assert.equal(parseNumber(".5"), 0.5);
  assert.ok(Number.isNaN(parseNumber("")));
  assert.ok(Number.isNaN(parseNumber("abc")));
  assert.ok(Number.isNaN(parseNumber("12abc")));
  assert.ok(Number.isNaN(parseNumber("1e5")));
});

const base: LoanFormValues = {
  amount: "25000",
  downPayment: "",
  rate: "7.5",
  term: "5",
  termUnit: "years",
  extra: "",
  feePercent: "",
};
const opts = { hasDownPayment: false, hasFee: false, amountLabel: "Loan amount" };

test("validation accepts a normal loan", () => {
  const result = validateLoanForm(base, opts);
  assert.ok(result.ok);
  if (result.ok) assert.equal(result.value.termMonths, 60);
});

test("validation rejects empty, zero, negative and absurd values", () => {
  const cases: Array<[Partial<LoanFormValues>, string]> = [
    [{ amount: "" }, "amount"],
    [{ amount: "0" }, "amount"],
    [{ amount: "-500" }, "amount"],
    [{ amount: "abc" }, "amount"],
    [{ amount: "500000000" }, "amount"],
    [{ rate: "" }, "rate"],
    [{ rate: "-1" }, "rate"],
    [{ rate: "150" }, "rate"],
    [{ term: "0" }, "term"],
    [{ term: "51" }, "term"],
    [{ term: "601", termUnit: "months" }, "term"],
    [{ term: "12.5", termUnit: "months" }, "term"],
    [{ extra: "-10" }, "extra"],
  ];
  for (const [patch, field] of cases) {
    const result = validateLoanForm({ ...base, ...patch }, opts);
    assert.equal(result.ok, false, JSON.stringify(patch));
    if (!result.ok) assert.ok(field in result.errors, `${JSON.stringify(patch)} should flag ${field}`);
  }
});

test("validation allows a 0% rate", () => {
  assert.ok(validateLoanForm({ ...base, rate: "0" }, opts).ok);
});

test("down payment is subtracted and must be below the price", () => {
  const withDown = { hasDownPayment: true, hasFee: false, amountLabel: "Home price" };
  const ok = validateLoanForm({ ...base, amount: "400000", downPayment: "80000" }, withDown);
  assert.ok(ok.ok);
  if (ok.ok) assert.equal(ok.value.principal, 320_000);
  const bad = validateLoanForm({ ...base, amount: "400000", downPayment: "400000" }, withDown);
  assert.equal(bad.ok, false);
});
