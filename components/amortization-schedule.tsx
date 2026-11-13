"use client";

import { useState } from "react";
import type { LoanResult } from "@/lib/loan-math";
import { formatCurrency } from "@/lib/format";

type View = "yearly" | "monthly";

export function AmortizationSchedule({ result }: { result: LoanResult }) {
  const [view, setView] = useState<View>("yearly");
  const hasExtra = result.extraMonthly > 0;

  return (
    <details className="mt-3 rounded-xl border border-line bg-white p-4 text-sm">
      <summary className="cursor-pointer font-medium text-ink">Amortization schedule</summary>

      <div role="group" aria-label="Schedule view" className="mt-3 inline-flex rounded-lg border border-line p-0.5">
        {(["yearly", "monthly"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={view === option}
            onClick={() => setView(option)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              view === option ? "bg-ink text-white" : "text-muted hover:text-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-3 max-h-96 overflow-auto rounded-lg border border-line" tabIndex={0} aria-label="Schedule table, scrollable">
        <table className="w-full text-right text-xs tabular-nums">
          <caption className="sr-only">
            {view === "yearly" ? "Amortization schedule by year" : "Amortization schedule by month"}
          </caption>
          <thead className="sticky top-0 bg-paper text-muted">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                {view === "yearly" ? "Year" : "Month"}
              </th>
              {view === "monthly" && (
                <th scope="col" className="px-3 py-2 font-medium">
                  Payment
                </th>
              )}
              <th scope="col" className="px-3 py-2 font-medium">
                Principal
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Interest
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {view === "yearly"
              ? result.yearly.map((year) => (
                  <tr key={year.year}>
                    <th scope="row" className="px-3 py-1.5 text-left font-normal text-ink">
                      {year.year}
                    </th>
                    <td className="px-3 py-1.5">{formatCurrency(year.principal)}</td>
                    <td className="px-3 py-1.5">{formatCurrency(year.interest)}</td>
                    <td className="px-3 py-1.5">{formatCurrency(year.endingBalance)}</td>
                  </tr>
                ))
              : result.schedule.map((row) => (
                  <tr key={row.period}>
                    <th scope="row" className="px-3 py-1.5 text-left font-normal text-ink">
                      {row.period}
                    </th>
                    <td className="px-3 py-1.5">{formatCurrency(row.payment)}</td>
                    <td className="px-3 py-1.5">{formatCurrency(row.principal + row.extra)}</td>
                    <td className="px-3 py-1.5">{formatCurrency(row.interest)}</td>
                    <td className="px-3 py-1.5">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {hasExtra && <p className="mt-2 text-xs text-muted">Principal includes your extra payments.</p>}
    </details>
  );
}
