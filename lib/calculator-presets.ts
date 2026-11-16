import type { LoanFormValues } from "./loan-validation";

export type PresetKey = "general" | "mortgage" | "auto" | "personal" | "student";

export interface CalculatorPreset {
  key: PresetKey;
  amountLabel: string;
  amountHint: string;
  hasDownPayment: boolean;
  downPaymentLabel: string;
  downPaymentHint: string;
  hasFee: boolean;
  /** Example starting values. They are illustrations, not current market rates. */
  defaults: LoanFormValues;
  /** Sentence shown under the result describing what the payment excludes. */
  excludes: string;
  /** "payment" (US) or "repayment" (UK/European usage). */
  paymentWord?: "payment" | "repayment";
  /** Label for the APR estimate, e.g. "Estimated APRC (TAEG)". */
  aprLabel?: string;
  /** Annualise the APR estimate as an effective rate (EU/UK APRC method). */
  aprEffective?: boolean;
  feeLabel?: string;
  feeHint?: string;
  /** Largest amount accepted, in the calculator's currency. */
  maxAmount?: number;
}

const empty = { downPayment: "", extra: "", feePercent: "" };

export const calculatorPresets: Record<PresetKey, CalculatorPreset> = {
  general: {
    key: "general",
    amountLabel: "Loan amount",
    amountHint: "The amount you borrow.",
    hasDownPayment: false,
    downPaymentLabel: "",
    downPaymentHint: "",
    hasFee: false,
    defaults: { ...empty, amount: "25,000", rate: "7.5", term: "5", termUnit: "years" },
    excludes: "Fees, insurance and taxes are not included unless they are part of the amount you borrow.",
  },
  mortgage: {
    key: "mortgage",
    amountLabel: "Home price",
    amountHint: "Purchase price of the home.",
    hasDownPayment: true,
    downPaymentLabel: "Down payment",
    downPaymentHint: "Cash you put down. Leave blank for none.",
    hasFee: false,
    defaults: { ...empty, amount: "400,000", downPayment: "80,000", rate: "6.5", term: "30", termUnit: "years" },
    excludes:
      "This is principal and interest only. Property tax, homeowners insurance, mortgage insurance (PMI) and HOA dues are extra.",
  },
  auto: {
    key: "auto",
    amountLabel: "Vehicle price",
    amountHint: "Price including any taxes and fees you will finance.",
    hasDownPayment: true,
    downPaymentLabel: "Down payment and trade-in",
    downPaymentHint: "Cash down plus trade-in value, minus anything still owed on the trade-in.",
    hasFee: false,
    defaults: { ...empty, amount: "35,000", downPayment: "5,000", rate: "7", term: "60", termUnit: "months" },
    excludes: "Registration, insurance and any add-ons are excluded unless you included them in the vehicle price.",
  },
  personal: {
    key: "personal",
    amountLabel: "Loan amount",
    amountHint: "The amount stated on the loan offer, before any fee is deducted.",
    hasDownPayment: false,
    downPaymentLabel: "",
    downPaymentHint: "",
    hasFee: true,
    defaults: { ...empty, amount: "15,000", rate: "12", term: "36", termUnit: "months", feePercent: "3" },
    excludes: "Late fees and optional add-ons such as payment protection are not included.",
  },
  student: {
    key: "student",
    amountLabel: "Loan balance",
    amountHint: "Balance when repayment starts, including any interest already added.",
    hasDownPayment: false,
    downPaymentLabel: "",
    downPaymentHint: "",
    hasFee: false,
    defaults: { ...empty, amount: "30,000", rate: "6", term: "10", termUnit: "years" },
    excludes:
      "Assumes a fixed rate and level payments, like a standard 10-year plan. Income-driven plans, deferment and forgiveness are not modeled.",
  },
};
