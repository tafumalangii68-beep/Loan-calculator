import { calculateLoan, formatDuration } from "@/lib/loan-math";
import { formatPercent } from "@/lib/format";
import { makeMoney, USD, type CurrencyFormat } from "@/lib/money";
import type { Scenario } from "@/types/content";

/**
 * Worked examples, computed at build time with the same functions as the
 * calculator so the numbers on the page always match the tool.
 */
export function ScenarioTable({
  scenarios,
  caption,
  currency = USD,
  paymentLabel = "Monthly payment",
}: {
  scenarios: Scenario[];
  caption: string;
  currency?: CurrencyFormat;
  paymentLabel?: string;
}) {
  const { format: formatCurrency, formatWhole: formatCurrencyWhole } = makeMoney(currency);
  const rows = scenarios.map((s) => ({ s, r: calculateLoan(s.principal, s.ratePercent, s.termMonths, s.extraMonthly ?? 0) }));
  const showExtra = scenarios.some((s) => s.extraMonthly);

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-line bg-white" tabIndex={0} aria-label={`${caption}, scrollable table`}>
      <table className="w-full min-w-[36rem] text-sm tabular-nums">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-paper text-left text-xs text-muted">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">Scenario</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Borrowed</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Rate</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Term</th>
            {showExtra && <th scope="col" className="px-4 py-2.5 text-right font-medium">Paid off in</th>}
            <th scope="col" className="px-4 py-2.5 text-right font-medium">{paymentLabel}</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Total interest</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map(({ s, r }) => (
            <tr key={s.label}>
              <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink">{s.label}</th>
              <td className="px-4 py-2.5 text-right">{formatCurrencyWhole(s.principal)}</td>
              <td className="px-4 py-2.5 text-right">{formatPercent(s.ratePercent)}</td>
              <td className="px-4 py-2.5 text-right">{formatDuration(s.termMonths)}</td>
              {showExtra && <td className="px-4 py-2.5 text-right">{formatDuration(r.payoffMonths)}</td>}
              <td className="px-4 py-2.5 text-right">
                {formatCurrency(r.scheduledPayment + (s.extraMonthly ?? 0))}
              </td>
              <td className="px-4 py-2.5 text-right">{formatCurrencyWhole(r.totalInterest)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
