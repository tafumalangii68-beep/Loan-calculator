import type { CalculatorPreset } from "./calculator-presets";
import { LIMITS } from "./loan-validation";
import { makeMoney, type CurrencyFormat } from "./money";

/** Loan types offered on every country page. */
export const COUNTRY_LOAN_KINDS = ["mortgage", "personal", "car", "student", "business"] as const;
export type CountryLoanKind = (typeof COUNTRY_LOAN_KINDS)[number];

export const COUNTRY_LOAN_LABELS: Record<CountryLoanKind, string> = {
  mortgage: "Mortgage / home loan",
  personal: "Personal loan",
  car: "Car loan",
  student: "Student loan",
  business: "Business loan",
};

/** The serializable facts a country calculator needs. */
export interface CountryCalculatorConfig {
  currency: CurrencyFormat;
  /** See CURRENCIES[code].exampleScale */
  exampleScale: number;
  /** Local short name of the APR, e.g. "TAEG" */
  aprShort: string;
}

/** Round to two significant figures so scaled examples look like real offers (e.g. 1,200,000). */
function nice(value: number): number {
  if (value <= 0) return 0;
  const magnitude = 10 ** (Math.floor(Math.log10(value)) - 1);
  return Math.round(value / magnitude) * magnitude;
}

/**
 * Example values in euros, scaled into each currency. They illustrate the
 * calculator and are labelled as examples, never as current market rates.
 */
const EXAMPLES: Record<CountryLoanKind, { amount: number; deposit?: number; rate: number; years: number }> = {
  mortgage: { amount: 300_000, deposit: 60_000, rate: 3.5, years: 25 },
  personal: { amount: 15_000, rate: 7.5, years: 5 },
  car: { amount: 25_000, deposit: 5_000, rate: 6, years: 5 },
  student: { amount: 20_000, rate: 4, years: 10 },
  business: { amount: 50_000, rate: 6.5, years: 5 },
};

export function buildCountryPresets(config: CountryCalculatorConfig): Record<CountryLoanKind, CalculatorPreset> {
  const money = makeMoney(config.currency);
  const amount = (eur: number) => money.formatNumber(nice(eur * config.exampleScale), 0);
  const rate = (r: number) => money.formatNumber(r, 2);

  const shared = {
    paymentWord: "repayment" as const,
    aprLabel: `Estimated ${config.aprShort}`,
    aprEffective: true,
    feeLabel: "Arrangement fee",
    feeHint: "Upfront fee as a % of the loan, deducted from the money you receive. Leave blank if there is none.",
    maxAmount: LIMITS.maxAmount * Math.max(1, config.exampleScale),
  };
  const empty = { downPayment: "", extra: "", feePercent: "" };
  const ex = EXAMPLES;

  return {
    mortgage: {
      ...shared,
      key: "mortgage",
      amountLabel: "Property price",
      amountHint: "Purchase price of the home.",
      hasDownPayment: true,
      downPaymentLabel: "Deposit (own funds)",
      downPaymentHint: "Savings you put towards the price. Leave blank for none.",
      hasFee: false,
      defaults: {
        ...empty,
        amount: amount(ex.mortgage.amount),
        downPayment: amount(ex.mortgage.deposit!),
        rate: rate(ex.mortgage.rate),
        term: String(ex.mortgage.years),
        termUnit: "years",
      },
      excludes:
        "Principal and interest only. Property taxes, insurance, notary and registration costs are not included unless you add them to the price.",
    },
    personal: {
      ...shared,
      key: "personal",
      amountLabel: "Loan amount",
      amountHint: "The amount stated on the loan offer.",
      hasDownPayment: false,
      downPaymentLabel: "",
      downPaymentHint: "",
      hasFee: true,
      defaults: { ...empty, amount: amount(ex.personal.amount), rate: rate(ex.personal.rate), term: String(ex.personal.years), termUnit: "years" },
      excludes: "Optional add-ons such as payment protection insurance are not included.",
    },
    car: {
      ...shared,
      key: "auto",
      amountLabel: "Vehicle price",
      amountHint: "Price of the car, including any costs you will finance.",
      hasDownPayment: true,
      downPaymentLabel: "Deposit and trade-in",
      downPaymentHint: "Cash deposit plus the value of any car you trade in.",
      hasFee: false,
      defaults: {
        ...empty,
        amount: amount(ex.car.amount),
        downPayment: amount(ex.car.deposit!),
        rate: rate(ex.car.rate),
        term: String(ex.car.years),
        termUnit: "years",
      },
      excludes:
        "Insurance, registration and vehicle taxes are excluded. Balloon (PCP-style) and lease contracts are not modelled.",
    },
    student: {
      ...shared,
      key: "student",
      amountLabel: "Loan balance",
      amountHint: "Balance when repayment starts.",
      hasDownPayment: false,
      downPaymentLabel: "",
      downPaymentHint: "",
      hasFee: false,
      defaults: { ...empty, amount: amount(ex.student.amount), rate: rate(ex.student.rate), term: String(ex.student.years), termUnit: "years" },
      excludes:
        "Models a fixed-rate instalment loan, such as a bank student loan. Government schemes with income-linked repayments are not modelled.",
    },
    business: {
      ...shared,
      key: "general",
      amountLabel: "Loan amount",
      amountHint: "The amount your business borrows.",
      hasDownPayment: false,
      downPaymentLabel: "",
      downPaymentHint: "",
      hasFee: true,
      defaults: { ...empty, amount: amount(ex.business.amount), rate: rate(ex.business.rate), term: String(ex.business.years), termUnit: "years" },
      excludes: "Assumes a fixed rate and equal instalments. Security, guarantees and VAT on fees are not included.",
    },
  };
}

/** Example scenarios for the worked-example table, in the country's currency. */
export function countryScenarios(exampleScale: number) {
  const scaled = (eur: number) => nice(eur * exampleScale);
  return [
    { label: "Home loan, 25 years at 3.5%", principal: scaled(240_000), ratePercent: 3.5, termMonths: 300 },
    { label: "Same home loan at 4.5%", principal: scaled(240_000), ratePercent: 4.5, termMonths: 300 },
    { label: "Same home loan over 20 years", principal: scaled(240_000), ratePercent: 3.5, termMonths: 240 },
    { label: "Car loan, 5 years at 6%", principal: scaled(20_000), ratePercent: 6, termMonths: 60 },
  ];
}
