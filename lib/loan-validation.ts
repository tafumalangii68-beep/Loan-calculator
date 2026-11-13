/**
 * Input parsing and validation for the loan calculator form.
 * Pure functions with no imports so they can be unit tested directly.
 */

export type TermUnit = "years" | "months";

export interface LoanFormValues {
  /** Loan amount, or purchase price when `hasDownPayment` is true */
  amount: string;
  downPayment: string;
  rate: string;
  term: string;
  termUnit: TermUnit;
  extra: string;
  /** Upfront fee as a percentage of the loan amount */
  feePercent: string;
}

export type LoanField = "amount" | "downPayment" | "rate" | "term" | "extra" | "feePercent";
export type LoanErrors = Partial<Record<LoanField, string>>;

export interface ValidationOptions {
  hasDownPayment: boolean;
  hasFee: boolean;
  amountLabel: string;
}

export interface ParsedLoan {
  principal: number;
  price: number | null;
  downPayment: number;
  annualRatePercent: number;
  termMonths: number;
  extraMonthly: number;
  feePercent: number;
}

export type ValidationResult = { ok: true; value: ParsedLoan } | { ok: false; errors: LoanErrors };

export const LIMITS = {
  maxAmount: 100_000_000,
  maxRate: 100,
  maxYears: 50,
  maxMonths: 600,
  maxFeePercent: 25,
} as const;

/**
 * Parse a number typed by a person: accepts "25,000", "$25000", "6.5%",
 * and surrounding spaces. Returns NaN for anything else, including "",
 * "1e5", "12abc" and "--5".
 */
export function parseNumber(raw: string): number {
  const cleaned = raw.trim().replace(/[$,%\s]/g, "");
  if (cleaned === "" || !/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return Number.NaN;
  return Number(cleaned);
}

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function validateLoanForm(values: LoanFormValues, options: ValidationOptions): ValidationResult {
  const errors: LoanErrors = {};
  const label = options.amountLabel.toLowerCase();

  // Amount (or purchase price)
  const amount = parseNumber(values.amount);
  if (values.amount.trim() === "") errors.amount = `Enter the ${label}.`;
  else if (Number.isNaN(amount)) errors.amount = `Enter the ${label} as a number, for example 25000.`;
  else if (amount <= 0) errors.amount = `The ${label} must be greater than zero.`;
  else if (amount > LIMITS.maxAmount) errors.amount = `This calculator supports amounts up to ${money(LIMITS.maxAmount)}.`;

  // Down payment
  let downPayment = 0;
  if (options.hasDownPayment && values.downPayment.trim() !== "") {
    downPayment = parseNumber(values.downPayment);
    if (Number.isNaN(downPayment)) errors.downPayment = "Enter the down payment as a number, or leave it blank.";
    else if (downPayment < 0) errors.downPayment = "The down payment cannot be negative.";
    else if (!errors.amount && downPayment >= amount)
      errors.downPayment = `The down payment must be less than the ${label}, or there is nothing to borrow.`;
  }

  // Interest rate (0% is allowed — promotional financing exists)
  const rate = parseNumber(values.rate);
  if (values.rate.trim() === "") errors.rate = "Enter the annual interest rate. Use 0 for an interest-free loan.";
  else if (Number.isNaN(rate)) errors.rate = "Enter the interest rate as a number, for example 6.5.";
  else if (rate < 0) errors.rate = "The interest rate cannot be negative.";
  else if (rate > LIMITS.maxRate) errors.rate = `Enter a rate of ${LIMITS.maxRate}% or less.`;

  // Term
  const term = parseNumber(values.term);
  const isYears = values.termUnit === "years";
  const maxTerm = isYears ? LIMITS.maxYears : LIMITS.maxMonths;
  let termMonths = 0;
  if (values.term.trim() === "") errors.term = "Enter the loan term.";
  else if (Number.isNaN(term)) errors.term = "Enter the loan term as a number.";
  else if (term <= 0) errors.term = "The loan term must be greater than zero.";
  else if (term > maxTerm) errors.term = `Enter a term of ${maxTerm} ${values.termUnit} or less.`;
  else {
    termMonths = isYears ? term * 12 : term;
    if (!Number.isInteger(Math.round(termMonths * 1e6) / 1e6))
      errors.term = isYears
        ? "Use whole months: enter the term in months, or a year value such as 2.5."
        : "Enter a whole number of months.";
    else termMonths = Math.round(termMonths);
  }

  // Extra monthly payment
  let extra = 0;
  if (values.extra.trim() !== "") {
    extra = parseNumber(values.extra);
    if (Number.isNaN(extra)) errors.extra = "Enter the extra payment as a number, or leave it blank.";
    else if (extra < 0) errors.extra = "The extra payment cannot be negative.";
    else if (extra > LIMITS.maxAmount) errors.extra = "The extra payment is larger than this calculator supports.";
  }

  // Upfront fee
  let feePercent = 0;
  if (options.hasFee && values.feePercent.trim() !== "") {
    feePercent = parseNumber(values.feePercent);
    if (Number.isNaN(feePercent)) errors.feePercent = "Enter the fee as a percentage, or leave it blank.";
    else if (feePercent < 0) errors.feePercent = "The fee cannot be negative.";
    else if (feePercent > LIMITS.maxFeePercent) errors.feePercent = `Enter a fee of ${LIMITS.maxFeePercent}% or less.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const principal = options.hasDownPayment ? amount - downPayment : amount;
  return {
    ok: true,
    value: {
      principal,
      price: options.hasDownPayment ? amount : null,
      downPayment,
      annualRatePercent: rate,
      termMonths,
      extraMonthly: extra,
      feePercent,
    },
  };
}
