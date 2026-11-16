import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CURRENCIES, type Country } from "@/data/countries";
import { Flag } from "./flag";

/** Grid of country cards linking to each country's calculator page. */
export function CountryCards({ items, headingLevel = "h3" }: { items: Country[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((country) => (
        <li key={country.slug}>
          <Link
            href={`/${country.slug}`}
            className="group flex h-full items-center gap-3.5 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-accent/40 hover:bg-accent-soft/40"
          >
            <Flag code={country.code} className="h-8 w-auto" />
            <span className="min-w-0 flex-1">
              <Heading className="truncate font-semibold text-ink group-hover:text-accent-strong">{country.name}</Heading>
              <span className="block truncate text-xs text-muted">
                {country.currency} · {CURRENCIES[country.currency]?.name}
              </span>
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
