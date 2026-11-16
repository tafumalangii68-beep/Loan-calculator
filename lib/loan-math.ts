/**
 * Pure loan math. No React, no imports — so it can be unit tested with
 * Node's built-in test runner and reused on server and client.
 *
 * Method: standard fixed-rate amortization with monthly compounding,
 * which is how most US installment loans (mortgages, auto, personal and
 * student loans) are quoted. Lenders round each payment to the cent and
 * may use daily interest accrual, so real statements can differ by a few
 * cents or dollars from these figures.
 */

export interface AmortizationRow {
  /** 1-based payment number */
  period: number;
  /** Interest charged this month */
  interest: number;
  /** Principal repaid by the scheduled payment */
  principal: number;
  /** Additional principal paid this month */
  extra: number;
  /** Total paid this month (interest + principal + extra) */
  payment: number;
  /** Balance remaining after this payment */
  balance: number;
}

export interface YearSummary {
  year: number;
  interest: number;
  principal: number;
  totalPaid: number;
  endingBalance: number;
}

export interface ScheduleSummary {
  payoffMonths: number;
  totalInterest: number;
  totalPaid: number;
}

export interface LoanResult extends ScheduleSummary {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
  extraMonthly: number;
  /** Payments per year (12 = monthly) */
  periodsPerYear: number;
  /** Interest rate per payment period (per month for monthly loans) */
  monthlyRate: number;
  /** Required monthly payment, before any extra payment */
  scheduledPayment: number;
  schedule: AmortizationRow[];
  yearly: YearSummary[];
  /** The same loan with no extra payments, for comparison */
  baseline: ScheduleSummary;
  interestSaved: number;
  monthsSaved: number;
}

/** Balances below half a cent are treated as paid off. */
const PAID_OFF = 0.005;

/**
 * Repayment frequencies, as payments per year. The nominal annual rate is
 * divided by this number to get the rate per payment period.
 */
export const FREQUENCIES = {
  monthly: 12,
  quarterly: 4,
  fortnightly: 26,
  weekly: 52,
} as const;
export type Frequency = keyof typeof FREQUENCIES;

/**
 * Payment for a fully amortizing fixed-rate loan:
 *   M = P × r(1 + r)^n / ((1 + r)^n − 1)
 * where r is the rate per period (annual rate ÷ payments per year) and n the
 * number of payments. With a 0% rate the payment is simply P / n.
 * `termMonths` is the number of payments; it equals months for monthly loans.
 */
export function calculatePayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
  periodsPerYear = 12,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRatePercent / 100 / periodsPerYear;
  if (r === 0) return principal / termMonths;
  const growth = Math.pow(1 + r, termMonths);
  return (principal * r * growth) / (growth - 1);
}

function runSchedule(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
  extraMonthly: number,
  periodsPerYear: number,
) {
  const r = annualRatePercent / 100 / periodsPerYear;
  const payment = calculatePayment(principal, annualRatePercent, termMonths, periodsPerYear);
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let period = 1; balance > PAID_OFF && period <= termMonths; period++) {
    const interest = balance * r;
    let principalPart = payment - interest;
    let extra = extraMonthly;

    if (principalPart >= balance) {
      principalPart = balance;
      extra = 0;
    } else if (principalPart + extra > balance) {
      extra = balance - principalPart;
    }

    balance -= principalPart + extra;
    if (balance < PAID_OFF) balance = 0;

    rows.push({
      period,
      interest,
      principal: principalPart,
      extra,
      payment: interest + principalPart + extra,
      balance,
    });
  }

  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);
  const totalPaid = rows.reduce((sum, row) => sum + row.payment, 0);
  return { payment, rows, totalInterest, totalPaid, payoffMonths: rows.length };
}

export function summarizeByYear(rows: AmortizationRow[], periodsPerYear = 12): YearSummary[] {
  const years: YearSummary[] = [];
  for (const row of rows) {
    const year = Math.ceil(row.period / periodsPerYear);
    let summary = years[year - 1];
    if (!summary) {
      summary = { year, interest: 0, principal: 0, totalPaid: 0, endingBalance: 0 };
      years.push(summary);
    }
    summary.interest += row.interest;
    summary.principal += row.principal + row.extra;
    summary.totalPaid += row.payment;
    summary.endingBalance = row.balance;
  }
  return years;
}

/**
 * Full schedule for a fixed-rate loan. With `periodsPerYear` other than 12,
 * "months" in the field names means payment periods (weeks, quarters, …):
 * `termMonths` is the number of payments and `extraMonthly` the extra paid
 * with each payment.
 */
export function calculateLoan(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
  extraMonthly = 0,
  periodsPerYear = 12,
): LoanResult {
  const withExtra = runSchedule(principal, annualRatePercent, termMonths, extraMonthly, periodsPerYear);
  const baseline =
    extraMonthly > 0 ? runSchedule(principal, annualRatePercent, termMonths, 0, periodsPerYear) : withExtra;

  return {
    principal,
    annualRatePercent,
    termMonths,
    extraMonthly,
    periodsPerYear,
    monthlyRate: annualRatePercent / 100 / periodsPerYear,
    scheduledPayment: withExtra.payment,
    payoffMonths: withExtra.payoffMonths,
    totalInterest: withExtra.totalInterest,
    totalPaid: withExtra.totalPaid,
    schedule: withExtra.rows,
    yearly: summarizeByYear(withExtra.rows, periodsPerYear),
    baseline: {
      payoffMonths: baseline.payoffMonths,
      totalInterest: baseline.totalInterest,
      totalPaid: baseline.totalPaid,
    },
    interestSaved: Math.max(0, baseline.totalInterest - withExtra.totalInterest),
    monthsSaved: Math.max(0, baseline.payoffMonths - withExtra.payoffMonths),
  };
}

/**
 * Estimate the APR of a loan whose upfront fee is deducted from the money
 * you receive. APR is the monthly rate at which the payments you make equal
 * the cash you actually receive, multiplied by 12 (the US Truth in Lending
 * convention for monthly-payment loans). Solved by bisection.
 */
export function estimateApr(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
  feeAmount: number,
  options: { periodsPerYear?: number; effective?: boolean } = {},
): number {
  const { periodsPerYear = 12, effective = false } = options;
  const payment = calculatePayment(principal, annualRatePercent, termMonths, periodsPerYear);
  // Effective (EU/UK APRC style) means compounding the periodic rate over a year.
  const annualize = (periodRate: number) =>
    effective ? (Math.pow(1 + periodRate, periodsPerYear) - 1) * 100 : periodRate * periodsPerYear * 100;
  if (feeAmount <= 0 || principal - feeAmount <= 0) {
    return effective ? annualize(annualRatePercent / 100 / periodsPerYear) : annualRatePercent;
  }
  const netProceeds = principal - feeAmount;

  const presentValue = (monthlyRate: number) =>
    monthlyRate === 0
      ? payment * termMonths
      : (payment * (1 - Math.pow(1 + monthlyRate, -termMonths))) / monthlyRate;

  let low = 0;
  let high = 1; // 100% per month — far above any realistic APR
  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2;
    if (presentValue(mid) > netProceeds) low = mid;
    else high = mid;
  }
  return annualize((low + high) / 2);
}

/** Duration of `payments` payments at the given frequency, e.g. "4 years 11 months". */
export function formatPeriods(payments: number, periodsPerYear = 12): string {
  if (periodsPerYear === 12) return formatDuration(payments);
  return formatDuration(Math.round((payments * 12) / periodsPerYear));
}

/** "5 years 3 months", "11 months", "30 years" */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? "month" : "months"}`);
  return parts.join(" ") || "0 months";
}
