import { formatDuration, type LoanResult } from "@/lib/loan-math";
import type { ParsedLoan } from "@/lib/loan-validation";
import { formatCurrency, formatPercent } from "@/lib/format";

export interface ComputedLoan {
  input: ParsedLoan;
  result: LoanResult;
  apr: number | null;
}

export function ResultPanel({ computed, excludes }: { computed: ComputedLoan | null; excludes: string }) {
  if (!computed) {
    return (
      <div
        aria-live="polite"
        className="flex h-full min-h-72 items-center justify-center rounded-2xl border border-dashed border-line-strong bg-paper p-6 text-center text-sm leading-relaxed text-muted"
      >
        Enter a valid loan amount, interest rate and term to see your monthly payment.
      </div>
    );
  }

  const { input, result, apr } = computed;
  const hasExtra = input.extraMonthly > 0;
  const interestShare = result.totalPaid > 0 ? (result.totalInterest / result.totalPaid) * 100 : 0;
  const downPercent = input.price ? (input.downPayment / input.price) * 100 : null;
  const r = result.monthlyRate;

  return (
    <div>
      <div className="rounded-2xl bg-accent-soft p-6">
        <p className="text-sm font-medium text-accent">Monthly payment</p>
        <p
          aria-live="polite"
          data-testid="monthly-payment"
          className="mt-1 font-serif text-5xl font-semibold tracking-tight text-ink tabular-nums sm:text-[3.5rem]"
        >
          {formatCurrency(result.scheduledPayment)}
        </p>
        {hasExtra && (
          <p className="mt-1 text-sm text-ink">
            + {formatCurrency(input.extraMonthly)} extra = {formatCurrency(result.scheduledPayment + input.extraMonthly)}{" "}
            per month
          </p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-muted">{excludes}</p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm [&>*:last-child:nth-child(odd)]:col-span-2">
        <Stat label="Amount borrowed" value={formatCurrency(input.principal)} />
        <Stat label="Total interest" value={formatCurrency(result.totalInterest)} />
        <Stat label="Total payments" value={formatCurrency(result.totalPaid)} />
        <Stat label="Payoff duration" value={formatDuration(result.payoffMonths)} />
        {downPercent !== null && <Stat label="Down payment" value={`${formatPercent(downPercent, 1)} of price`} />}
        {apr !== null && <Stat label="Estimated APR" value={formatPercent(apr)} />}
      </dl>

      {hasExtra && result.interestSaved > 0 && (
        <p className="mt-4 rounded-2xl border border-accent/20 bg-white p-4 text-sm leading-relaxed text-ink">
          Paying {formatCurrency(input.extraMonthly)} extra each month saves about{" "}
          <strong>{formatCurrency(result.interestSaved)}</strong> in interest and pays the loan off{" "}
          <strong>{formatDuration(result.monthsSaved)}</strong> sooner, if your lender applies extra payments to
          principal.
        </p>
      )}

      <div className="mt-5">
        <p className="mb-1.5 flex justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
            Principal {formatPercent(100 - interestShare, 0)}
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full bg-clay" />
            Interest {formatPercent(interestShare, 0)}
          </span>
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

      <details className="mt-5 rounded-2xl border border-line bg-paper p-4 text-sm">
        <summary className="cursor-pointer font-medium text-ink">How this was calculated</summary>
        <div className="mt-3 space-y-2 leading-relaxed text-muted">
          <p>
            Monthly rate <em>r</em> = {formatPercent(input.annualRatePercent, 3)} ÷ 12 = {r === 0 ? "0" : r.toFixed(6)}.
            Number of payments <em>n</em> = {input.termMonths}.
          </p>
          {r === 0 ? (
            <p>
              With a 0% rate the payment is the amount borrowed divided by the number of payments:{" "}
              {formatCurrency(input.principal)} ÷ {input.termMonths} = {formatCurrency(result.scheduledPayment)}.
            </p>
          ) : (
            <p>
              Payment = P × r(1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1), where P = {formatCurrency(input.principal)}.
              Each month, interest is charged on the remaining balance and the rest of the payment reduces the balance.
            </p>
          )}
          {apr !== null && (
            <p>
              The APR estimate assumes the {formatPercent(input.feePercent)} fee (
              {formatCurrency((input.principal * input.feePercent) / 100)}) is deducted from the money you receive, so you
              repay {formatCurrency(input.principal)} but receive {formatCurrency(input.principal * (1 - input.feePercent / 100))}.
            </p>
          )}
          <p>Lenders round to the cent and some accrue interest daily, so your statement may differ slightly.</p>
        </div>
      </details>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-ink tabular-nums">{value}</dd>
    </div>
  );
}
