"use client";

import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Calculator, ChevronDown, RotateCcw, ShieldCheck } from "lucide-react";
import { calculateLoan, estimateApr, FREQUENCIES, type Frequency } from "@/lib/loan-math";
import { validateLoanForm, type LoanField, type LoanFormValues, type TermUnit } from "@/lib/loan-validation";
import { calculatorPresets, type CalculatorPreset, type PresetKey } from "@/lib/calculator-presets";
import { makeMoney, USD, type CurrencyFormat } from "@/lib/money";
import { ResultPanel } from "./result-panel";
import { AmortizationSchedule } from "./amortization-schedule";

const FIELD_ORDER: LoanField[] = ["amount", "downPayment", "rate", "term", "extra", "feePercent"];

export const FREQUENCY_LABELS: Record<Frequency, { adjective: string; unit: string }> = {
  monthly: { adjective: "Monthly", unit: "month" },
  quarterly: { adjective: "Quarterly", unit: "quarter" },
  fortnightly: { adjective: "Fortnightly", unit: "fortnight" },
  weekly: { adjective: "Weekly", unit: "week" },
};

/**
 * Loan calculator. Results update instantly as valid values are typed.
 * Errors appear once a field has been left (blur) or after "Calculate loan"
 * is pressed, so people aren't scolded halfway through typing.
 *
 * `currency` switches symbols and number formatting (US dollars by default);
 * `showFrequency` adds a repayment-frequency choice (monthly only by default).
 */
export function LoanCalculator({
  preset: presetProp = "general",
  currency = USD,
  showFrequency = false,
}: {
  preset?: PresetKey | CalculatorPreset;
  currency?: CurrencyFormat;
  showFrequency?: boolean;
}) {
  const preset = typeof presetProp === "string" ? calculatorPresets[presetProp] : presetProp;
  const money = makeMoney(currency);
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const [values, setValues] = useState<LoanFormValues>(preset.defaults);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [touched, setTouched] = useState<Partial<Record<LoanField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const periodsPerYear = FREQUENCIES[frequency];
  const freq = FREQUENCY_LABELS[frequency];
  const paymentWord = preset.paymentWord ?? "payment";
  const symbolIsShort = money.symbol.length === 1;

  const validation = useMemo(
    () =>
      validateLoanForm(values, {
        hasDownPayment: preset.hasDownPayment,
        hasFee: preset.hasFee,
        amountLabel: preset.amountLabel,
        downPaymentLabel: preset.downPaymentLabel || undefined,
        periodsPerYear,
        maxAmount: preset.maxAmount,
        formatMoney: currency === USD ? undefined : money.formatWhole,
      }),
    [values, preset, periodsPerYear, money, currency],
  );

  const computed = useMemo(() => {
    if (!validation.ok) return null;
    const input = validation.value;
    const result = calculateLoan(
      input.principal,
      input.annualRatePercent,
      input.payments,
      input.extraMonthly,
      input.periodsPerYear,
    );
    const apr =
      input.feePercent > 0
        ? estimateApr(input.principal, input.annualRatePercent, input.payments, (input.principal * input.feePercent) / 100, {
            periodsPerYear: input.periodsPerYear,
            effective: preset.aprEffective,
          })
        : null;
    return { input, result, apr };
  }, [validation, preset.aprEffective]);

  const allErrors = validation.ok ? {} : validation.errors;
  const visibleError = (field: LoanField) => (submitted || touched[field] ? allErrors[field] : undefined);
  const visibleErrorCount = FIELD_ORDER.filter((f) => visibleError(f)).length;

  const update = (field: keyof LoanFormValues, value: string) => setValues((v) => ({ ...v, [field]: value }));
  const blur = (field: LoanField) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!validation.ok) {
      const first = FIELD_ORDER.find((field) => allErrors[field]);
      if (first) formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // On narrow screens the results sit below the form: bring them into view.
    const panel = resultsRef.current;
    if (panel && panel.getBoundingClientRect().top > window.innerHeight * 0.6) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      panel.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }
  };

  const handleReset = () => {
    setValues(preset.defaults);
    setFrequency("monthly");
    setTouched({});
    setSubmitted(false);
  };

  // "$", "€", "£" fit in front of the number; "CHF", "kr", "zł" read better after it.
  const currencyAffix = symbolIsShort ? { prefix: money.symbol } : { suffix: money.symbol };

  const fieldProps = (field: LoanField, key: keyof LoanFormValues = field) => ({
    id: `${id}-${field}`,
    name: field,
    value: values[key] as string,
    error: visibleError(field),
    onChange: (v: string) => update(key, v),
    onBlur: () => blur(field),
  });

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(37,37,34,0.04)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Loan details" className="space-y-5">
          {visibleErrorCount > 0 && (
            <div role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
              Please fix {visibleErrorCount === 1 ? "the highlighted field" : `the ${visibleErrorCount} highlighted fields`}.
            </div>
          )}

          <Field {...fieldProps("amount")} label={preset.amountLabel} hint={preset.amountHint} {...currencyAffix} required />

          {preset.hasDownPayment && (
            <Field
              {...fieldProps("downPayment")}
              label={preset.downPaymentLabel}
              hint={preset.downPaymentHint}
              {...currencyAffix}
              optional
            />
          )}

          <Field
            {...fieldProps("rate")}
            label="Interest rate (annual)"
            hint="The yearly rate from your loan offer. Use 0 for interest-free."
            suffix="%"
            required
          />

          <div>
            <label htmlFor={`${id}-term`} className="block text-sm font-medium text-ink">
              Loan term <span className="sr-only">(required)</span>
            </label>
            <p id={`${id}-term-hint`} className="mt-0.5 text-xs text-muted">
              How long you have to repay the loan.
            </p>
            <div className="mt-1.5 flex gap-2">
              <input
                id={`${id}-term`}
                name="term"
                inputMode="decimal"
                autoComplete="off"
                value={values.term}
                onChange={(e) => update("term", e.target.value)}
                onBlur={() => blur("term")}
                aria-invalid={visibleError("term") ? true : undefined}
                aria-describedby={`${id}-term-hint${visibleError("term") ? ` ${id}-term-error` : ""}`}
                aria-required="true"
                className={inputClass(Boolean(visibleError("term")))}
              />
              <div role="radiogroup" aria-label="Term unit" className="flex shrink-0 rounded-xl border border-line-strong bg-paper p-1">
                {(["years", "months"] as TermUnit[]).map((unit) => (
                  <label
                    key={unit}
                    className={`flex cursor-pointer items-center rounded-lg px-3 text-sm font-medium capitalize transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                      values.termUnit === unit ? "bg-accent text-white" : "text-muted hover:text-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${id}-unit`}
                      value={unit}
                      checked={values.termUnit === unit}
                      onChange={() => update("termUnit", unit)}
                      className="sr-only"
                    />
                    {unit}
                  </label>
                ))}
              </div>
            </div>
            {visibleError("term") && <FieldError id={`${id}-term-error`} message={visibleError("term")!} />}
          </div>

          {showFrequency && (
            <div>
              <label htmlFor={`${id}-frequency`} className="block text-sm font-medium text-ink">
                Repayment frequency
              </label>
              <p id={`${id}-frequency-hint`} className="mt-0.5 text-xs text-muted">
                How often you pay. The annual rate is divided by the number of {paymentWord}s per year.
              </p>
              <div className="relative mt-1.5">
                <select
                  id={`${id}-frequency`}
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  aria-describedby={`${id}-frequency-hint`}
                  className={`${inputClass(false)} appearance-none pr-10`}
                >
                  {(Object.keys(FREQUENCIES) as Frequency[]).map((f) => (
                    <option key={f} value={f}>
                      {FREQUENCY_LABELS[f].adjective} ({FREQUENCIES[f]} per year)
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
                />
              </div>
            </div>
          )}

          {preset.hasFee && (
            <Field
              {...fieldProps("feePercent")}
              label={preset.feeLabel ?? "Origination fee"}
              hint={preset.feeHint ?? "Upfront fee as a % of the loan, deducted from the money you receive."}
              suffix="%"
              optional
            />
          )}

          <details className="group rounded-xl border border-line bg-paper px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
              Extra {freq.adjective.toLowerCase()} {paymentWord}
              <ChevronDown aria-hidden="true" className="size-4 text-muted transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3">
              <Field
                {...fieldProps("extra")}
                label={`Extra amount each ${freq.unit}`}
                hint={`Paid on top of the required ${paymentWord} and applied to principal.`}
                {...currencyAffix}
                optional
              />
            </div>
          </details>

          <div className="flex flex-wrap gap-3 pt-1">
            <button type="submit" className="btn-primary h-12 flex-1 gap-2 rounded-xl px-6 text-base sm:flex-none">
              <Calculator aria-hidden="true" className="size-5" />
              Calculate loan
            </button>
            <button type="button" onClick={handleReset} className="btn-secondary h-12 gap-2 rounded-xl">
              <RotateCcw aria-hidden="true" className="size-4" />
              Reset
            </button>
          </div>

          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
            <ShieldCheck aria-hidden="true" className="mt-px size-4 shrink-0 text-accent" />
            Results update as you type. Everything is calculated in your browser — your numbers aren’t sent anywhere
            or saved.
          </p>
        </form>

        <section ref={resultsRef} aria-labelledby={`${id}-results`} className="min-w-0 scroll-mt-24">
          <h2 id={`${id}-results`} className="sr-only">
            Your results
          </h2>
          <ResultPanel
            computed={computed}
            excludes={preset.excludes}
            currency={currency}
            labels={{
              payment: `${freq.adjective} ${paymentWord}`,
              unit: freq.unit,
              // European presets call it a deposit; the US ones keep "Down payment".
              downPayment: paymentWord === "repayment" ? "Deposit" : undefined,
              apr: preset.aprLabel,
            }}
          />
        </section>
      </div>

      {computed && (
        <AmortizationSchedule
          result={computed.result}
          currency={currency}
          paymentLabel={`${freq.adjective} ${paymentWord}`}
        />
      )}
    </div>
  );
}

function inputClass(invalid: boolean) {
  return [
    "h-12 w-full min-w-0 rounded-xl border bg-white px-3.5 text-base text-ink tabular-nums",
    "focus:outline-none focus:ring-2",
    invalid ? "border-danger focus:ring-danger/30" : "border-line-strong focus:border-accent focus:ring-accent/25",
  ].join(" ");
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-danger">
      {message}
    </p>
  );
}

interface FieldProps {
  id: string;
  name: LoanField;
  label: string;
  hint: string;
  value: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  required?: boolean;
  optional?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function Field({ id, name, label, hint, value, error, prefix, suffix, required, optional, onChange, onBlur }: FieldProps) {
  const describedBy = [`${id}-hint`, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      <p id={`${id}-hint`} className="mt-0.5 text-xs text-muted">
        {hint}
      </p>
      <div className="relative mt-1.5">
        {prefix && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={name}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required ? true : undefined}
          className={`${inputClass(Boolean(error))} ${prefix ? "pl-8" : ""} ${suffix ? (suffix.length > 1 ? "pr-14" : "pr-9") : ""}`}
        />
        {suffix && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error && <FieldError id={`${id}-error`} message={error} />}
    </div>
  );
}
