"use client";

import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Calculator, RotateCcw, ShieldCheck } from "lucide-react";
import { calculateLoan, estimateApr, formatDuration, type LoanResult } from "@/lib/loan-math";
import {
  validateLoanForm,
  type LoanErrors,
  type LoanField,
  type LoanFormValues,
  type ParsedLoan,
  type TermUnit,
} from "@/lib/loan-validation";
import { calculatorPresets, type PresetKey } from "@/lib/calculator-presets";
import { formatCurrency, formatPercent } from "@/lib/format";
import { AmortizationSchedule } from "./amortization-schedule";

interface Computed {
  input: ParsedLoan;
  result: LoanResult;
  apr: number | null;
}

function compute(input: ParsedLoan): Computed {
  const result = calculateLoan(input.principal, input.annualRatePercent, input.termMonths, input.extraMonthly);
  const apr =
    input.feePercent > 0
      ? estimateApr(input.principal, input.annualRatePercent, input.termMonths, (input.principal * input.feePercent) / 100)
      : null;
  return { input, result, apr };
}

const FIELD_ORDER: LoanField[] = ["amount", "downPayment", "rate", "term", "extra", "feePercent"];
const EMPTY_VALUES: Omit<LoanFormValues, "termUnit"> = {
  amount: "",
  downPayment: "",
  rate: "",
  term: "",
  extra: "",
  feePercent: "",
};

export function LoanCalculator({ preset: presetKey = "general" }: { preset?: PresetKey }) {
  const preset = calculatorPresets[presetKey];
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const options = { hasDownPayment: preset.hasDownPayment, hasFee: preset.hasFee, amountLabel: preset.amountLabel };

  const [values, setValues] = useState<LoanFormValues>(preset.defaults);
  const [errors, setErrors] = useState<LoanErrors>({});
  const [computed, setComputed] = useState<Computed | null>(() => {
    const initial = validateLoanForm(preset.defaults, options);
    return initial.ok ? compute(initial.value) : null;
  });
  const [isStale, setIsStale] = useState(false);

  const update = (field: keyof LoanFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
    if (computed) setIsStale(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const outcome = validateLoanForm(values, options);
    if (!outcome.ok) {
      setErrors(outcome.errors);
      const first = FIELD_ORDER.find((field) => outcome.errors[field]);
      if (first) formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setComputed(compute(outcome.value));
    setIsStale(false);
  };

  const handleReset = () => {
    setValues({ ...EMPTY_VALUES, termUnit: preset.defaults.termUnit });
    setErrors({});
    setComputed(null);
    setIsStale(false);
    formRef.current?.querySelector<HTMLInputElement>('[name="amount"]')?.focus();
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const downPercent = useMemo(() => {
    if (!computed?.input.price) return null;
    return (computed.input.downPayment / computed.input.price) * 100;
  }, [computed]);

  return (
    <div className="grid gap-6 rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
      <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Loan details" className="space-y-5">
        {errorCount > 0 && (
          <div role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
            Please fix {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} to
            calculate.
          </div>
        )}

        <Field
          id={`${id}-amount`}
          name="amount"
          label={preset.amountLabel}
          hint={preset.amountHint}
          prefix="$"
          value={values.amount}
          error={errors.amount}
          onChange={(v) => update("amount", v)}
          required
        />

        {preset.hasDownPayment && (
          <Field
            id={`${id}-down`}
            name="downPayment"
            label={preset.downPaymentLabel}
            hint={preset.downPaymentHint}
            prefix="$"
            value={values.downPayment}
            error={errors.downPayment}
            onChange={(v) => update("downPayment", v)}
            optional
          />
        )}

        <Field
          id={`${id}-rate`}
          name="rate"
          label="Interest rate"
          hint="Annual rate from your loan offer. Use 0 for interest-free."
          suffix="%"
          value={values.rate}
          error={errors.rate}
          onChange={(v) => update("rate", v)}
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
              inputMode="numeric"
              autoComplete="off"
              value={values.term}
              onChange={(e) => update("term", e.target.value)}
              aria-invalid={errors.term ? true : undefined}
              aria-describedby={`${id}-term-hint${errors.term ? ` ${id}-term-error` : ""}`}
              aria-required="true"
              className={inputClass(Boolean(errors.term))}
            />
            <select
              aria-label="Term unit"
              value={values.termUnit}
              onChange={(e) => update("termUnit", e.target.value as TermUnit)}
              className="h-11 rounded-lg border border-line-strong bg-white px-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="years">years</option>
              <option value="months">months</option>
            </select>
          </div>
          {errors.term && <FieldError id={`${id}-term-error`} message={errors.term} />}
        </div>

        <Field
          id={`${id}-extra`}
          name="extra"
          label="Extra monthly payment"
          hint="Additional principal you plan to pay each month."
          prefix="$"
          value={values.extra}
          error={errors.extra}
          onChange={(v) => update("extra", v)}
          optional
        />

        {preset.hasFee && (
          <Field
            id={`${id}-fee`}
            name="feePercent"
            label="Origination fee"
            hint="Upfront fee as a % of the loan, deducted from the money you receive."
            suffix="%"
            value={values.feePercent}
            error={errors.feePercent}
            onChange={(v) => update("feePercent", v)}
            optional
          />
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            <Calculator aria-hidden="true" className="size-4" />
            Calculate payment
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-line-strong bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Clear
          </button>
        </div>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
          <ShieldCheck aria-hidden="true" className="mt-px size-4 shrink-0 text-accent" />
          Calculated in your browser. Your numbers are not sent anywhere or saved, and no account is needed.
        </p>
      </form>

      <section aria-labelledby={`${id}-results`} className="min-w-0">
        <h2 id={`${id}-results`} className="sr-only">
          Results
        </h2>
        <div aria-live="polite" aria-atomic="false">
          {computed ? (
            <Results computed={computed} isStale={isStale} downPercent={downPercent} excludes={preset.excludes} />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center rounded-xl border border-dashed border-line-strong bg-paper p-6 text-center text-sm text-muted">
              Enter your loan details and select “Calculate payment” to see your monthly payment and schedule.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Results({
  computed,
  isStale,
  downPercent,
  excludes,
}: {
  computed: Computed;
  isStale: boolean;
  downPercent: number | null;
  excludes: string;
}) {
  const { input, result, apr } = computed;
  const hasExtra = input.extraMonthly > 0;
  const interestShare = result.totalPaid > 0 ? (result.totalInterest / result.totalPaid) * 100 : 0;
  const r = result.monthlyRate;

  return (
    <div className={isStale ? "opacity-60 transition-opacity" : "transition-opacity"}>
      {isStale && (
        <p className="mb-3 rounded-lg bg-warn-soft px-3 py-2 text-xs font-medium text-warn">
          You changed your inputs. Select “Calculate payment” to update these results.
        </p>
      )}

      <div className="rounded-xl bg-accent-soft p-5">
        <p className="text-sm font-medium text-accent-strong">Monthly payment</p>
        <p className="mt-1 font-serif text-4xl font-semibold tracking-tight text-ink tabular-nums sm:text-5xl">
          {formatCurrency(result.scheduledPayment)}
        </p>
        {hasExtra && (
          <p className="mt-1 text-sm text-ink">
            + {formatCurrency(input.extraMonthly)} extra = {formatCurrency(result.scheduledPayment + input.extraMonthly)}{" "}
            per month
          </p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-muted">{excludes}</p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px [&>*:last-child:nth-child(odd)]:col-span-2 overflow-hidden rounded-xl border border-line bg-line text-sm">
        <Stat label="Amount borrowed" value={formatCurrency(input.principal)} />
        <Stat label="Total interest" value={formatCurrency(result.totalInterest)} />
        <Stat label="Total of payments" value={formatCurrency(result.totalPaid)} />
        <Stat label="Paid off in" value={formatDuration(result.payoffMonths)} />
        {downPercent !== null && <Stat label="Down payment" value={formatPercent(downPercent, 1) + " of price"} />}
        {apr !== null && <Stat label="Estimated APR" value={formatPercent(apr)} />}
      </dl>

      {hasExtra && result.interestSaved > 0 && (
        <p className="mt-4 rounded-xl border border-accent/25 bg-white p-4 text-sm leading-relaxed text-ink">
          Paying {formatCurrency(input.extraMonthly)} extra each month saves about{" "}
          <strong>{formatCurrency(result.interestSaved)}</strong> in interest and pays the loan off{" "}
          <strong>{formatDuration(result.monthsSaved)}</strong> sooner, assuming your lender applies extra payments to
          principal.
        </p>
      )}

      <div className="mt-5">
        <p className="mb-1.5 flex justify-between text-xs text-muted">
          <span>Principal {formatPercent(100 - interestShare, 0)}</span>
          <span>Interest {formatPercent(interestShare, 0)}</span>
        </p>
        <div
          className="flex h-2.5 overflow-hidden rounded-full bg-line"
          role="img"
          aria-label={`Of the total paid, ${formatPercent(100 - interestShare, 0)} is principal and ${formatPercent(interestShare, 0)} is interest.`}
        >
          <div className="bg-accent" style={{ width: `${100 - interestShare}%` }} />
          <div className="bg-clay" style={{ width: `${interestShare}%` }} />
        </div>
      </div>

      <details className="group mt-5 rounded-xl border border-line bg-paper p-4 text-sm">
        <summary className="cursor-pointer font-medium text-ink">How this was calculated</summary>
        <div className="mt-3 space-y-2 leading-relaxed text-muted">
          <p>
            Monthly rate <em>r</em> = {formatPercent(input.annualRatePercent, 3)} ÷ 12 ={" "}
            {r === 0 ? "0" : r.toFixed(6)}. Number of payments <em>n</em> = {input.termMonths}.
          </p>
          {r === 0 ? (
            <p>
              With a 0% rate the payment is the amount borrowed divided by the number of payments:{" "}
              {formatCurrency(input.principal)} ÷ {input.termMonths} = {formatCurrency(result.scheduledPayment)}.
            </p>
          ) : (
            <p>
              Payment = P × r(1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1), where P = {formatCurrency(input.principal)}
              . Each month, interest is charged on the remaining balance and the rest of the payment reduces the
              balance.
            </p>
          )}
          {apr !== null && (
            <p>
              The APR estimate assumes the {formatPercent(input.feePercent)} fee (
              {formatCurrency((input.principal * input.feePercent) / 100)}) is deducted from the money you receive,
              so you repay {formatCurrency(input.principal)} but receive{" "}
              {formatCurrency(input.principal * (1 - input.feePercent / 100))}.
            </p>
          )}
          <p>Lenders round to the cent and some accrue interest daily, so your statement may differ slightly.</p>
        </div>
      </details>

      <AmortizationSchedule result={result} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink tabular-nums">{value}</dd>
    </div>
  );
}

function inputClass(invalid: boolean) {
  return [
    "h-11 w-full min-w-0 rounded-lg border bg-white px-3 text-base text-ink tabular-nums placeholder:text-muted/70",
    "focus:outline-none focus:ring-2",
    invalid ? "border-danger focus:ring-danger/30" : "border-line-strong focus:border-accent focus:ring-accent/30",
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
}

function Field({ id, name, label, hint, value, error, prefix, suffix, required, optional, onChange }: FieldProps) {
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
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
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
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required ? true : undefined}
          className={`${inputClass(Boolean(error))} ${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`}
        />
        {suffix && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error && <FieldError id={`${id}-error`} message={error} />}
    </div>
  );
}
