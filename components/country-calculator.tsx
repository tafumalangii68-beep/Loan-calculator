"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Briefcase, Car, GraduationCap, House, Wallet, type LucideIcon } from "lucide-react";
import {
  buildCountryPresets,
  COUNTRY_LOAN_KINDS,
  COUNTRY_LOAN_LABELS,
  type CountryCalculatorConfig,
  type CountryLoanKind,
} from "@/lib/country-presets";
import { LoanCalculator } from "./loan-calculator";

const ICONS: Record<CountryLoanKind, LucideIcon> = {
  mortgage: House,
  personal: Wallet,
  car: Car,
  student: GraduationCap,
  business: Briefcase,
};

/**
 * Loan calculator for a country page: tabs for each loan type, all in the
 * country's currency, with a repayment-frequency choice.
 */
export function CountryCalculator({ config }: { config: CountryCalculatorConfig }) {
  const presets = useMemo(() => buildCountryPresets(config), [config]);
  const [kind, setKind] = useState<CountryLoanKind>("mortgage");
  const id = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, automatic activation).
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = COUNTRY_LOAN_KINDS.indexOf(kind);
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % COUNTRY_LOAN_KINDS.length;
    if (event.key === "ArrowLeft") next = (index - 1 + COUNTRY_LOAN_KINDS.length) % COUNTRY_LOAN_KINDS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = COUNTRY_LOAN_KINDS.length - 1;
    if (next === null) return;
    event.preventDefault();
    const nextKind = COUNTRY_LOAN_KINDS[next];
    setKind(nextKind);
    tabRefs.current[nextKind]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Loan type"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {COUNTRY_LOAN_KINDS.map((k) => {
          const Icon = ICONS[k];
          const selected = k === kind;
          return (
            <button
              key={k}
              ref={(el) => {
                tabRefs.current[k] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${k}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setKind(k)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                selected
                  ? "border-accent bg-accent text-white"
                  : "border-line-strong bg-white text-ink hover:border-accent/50 hover:text-accent"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {COUNTRY_LOAN_LABELS[k]}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${kind}`} className="mt-2">
        {/* Keyed so switching loan type starts from that type's example values. */}
        <LoanCalculator key={kind} preset={presets[kind]} currency={config.currency} showFrequency />
      </div>
    </div>
  );
}
