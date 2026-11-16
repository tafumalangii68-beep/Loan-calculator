"use client";

import { useId, useState } from "react";
import { ChevronDown, TableProperties } from "lucide-react";
import type { LoanResult } from "@/lib/loan-math";
import { makeMoney, USD, type CurrencyFormat } from "@/lib/money";

type View = "monthly" | "yearly";

const th = "px-4 py-2.5 font-medium";
const td = "px-4 py-2";

export function AmortizationSchedule({
  result,
  currency = USD,
  paymentLabel = "Monthly payment",
}: {
  result: LoanResult;
  currency?: CurrencyFormat;
  /** Column heading for each payment, e.g. "Weekly repayment" */
  paymentLabel?: string;
}) {
  const { format: formatCurrency } = makeMoney(currency);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("monthly");
  const panelId = useId();
  // The per-payment view is called "monthly" for monthly loans, "per payment" otherwise.
  const viewLabel = (v: View) => (v === "monthly" && result.periodsPerYear !== 12 ? "per payment" : v);

  const totalPrincipal = result.schedule.reduce((s, r) => s + r.principal + r.extra, 0);
  const hasExtra = result.extraMonthly > 0;

  return (
    <section aria-label="Amortization schedule" className="mt-8 border-t border-line pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper"
        >
          <TableProperties aria-hidden="true" className="size-4 text-accent" />
          {open ? "Hide amortization schedule" : "View amortization schedule"}
          <ChevronDown aria-hidden="true" className={`size-4 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div role="group" aria-label="Schedule view" className="inline-flex rounded-xl border border-line bg-paper p-1">
            {(["monthly", "yearly"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => setView(option)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  view === option ? "bg-accent text-white" : "text-muted hover:text-ink"
                }`}
              >
                {viewLabel(option)}
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div id={panelId} className="mt-4">
          <dl className="grid gap-3 sm:grid-cols-3">
            <Total label="Total principal" value={formatCurrency(totalPrincipal)} />
            <Total label="Total interest" value={formatCurrency(result.totalInterest)} />
            <Total label="Total payments" value={formatCurrency(result.totalPaid)} />
          </dl>

          <div
            className="mt-4 max-h-[28rem] overflow-auto rounded-2xl border border-line"
            tabIndex={0}
            aria-label="Amortization table, scrollable"
          >
            <table className="w-full min-w-[34rem] text-right text-sm tabular-nums">
              <caption className="sr-only">
                {view === "monthly" ? `Amortization schedule, ${paymentLabel.toLowerCase()}s` : "Amortization schedule by year"}
              </caption>
              <thead className="sticky top-0 bg-beige text-xs text-muted">
                <tr>
                  <th scope="col" className={`${th} text-left`}>
                    {view === "monthly" ? "Payment no." : "Year"}
                  </th>
                  <th scope="col" className={th}>
                    {view === "monthly" ? paymentLabel : "Paid this year"}
                  </th>
                  <th scope="col" className={th}>Principal</th>
                  <th scope="col" className={th}>Interest</th>
                  <th scope="col" className={th}>Remaining balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {view === "monthly"
                  ? result.schedule.map((row) => (
                      <tr key={row.period}>
                        <th scope="row" className={`${td} text-left font-normal text-muted`}>{row.period}</th>
                        <td className={td}>{formatCurrency(row.payment)}</td>
                        <td className={td}>{formatCurrency(row.principal + row.extra)}</td>
                        <td className={td}>{formatCurrency(row.interest)}</td>
                        <td className={`${td} text-ink`}>{formatCurrency(row.balance)}</td>
                      </tr>
                    ))
                  : result.yearly.map((year) => (
                      <tr key={year.year}>
                        <th scope="row" className={`${td} text-left font-normal text-muted`}>{year.year}</th>
                        <td className={td}>{formatCurrency(year.totalPaid)}</td>
                        <td className={td}>{formatCurrency(year.principal)}</td>
                        <td className={td}>{formatCurrency(year.interest)}</td>
                        <td className={`${td} text-ink`}>{formatCurrency(year.endingBalance)}</td>
                      </tr>
                    ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-accent-soft font-semibold text-ink">
                <tr>
                  <th scope="row" className={`${td} py-2.5 text-left`}>Total</th>
                  <td className={`${td} py-2.5`}>{formatCurrency(result.totalPaid)}</td>
                  <td className={`${td} py-2.5`}>{formatCurrency(totalPrincipal)}</td>
                  <td className={`${td} py-2.5`}>{formatCurrency(result.totalInterest)}</td>
                  <td className={`${td} py-2.5`}>{formatCurrency(0)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {hasExtra && <p className="mt-2 text-xs text-muted">Principal includes your extra payments.</p>}
        </div>
      )}
    </section>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink tabular-nums">{value}</dd>
    </div>
  );
}
