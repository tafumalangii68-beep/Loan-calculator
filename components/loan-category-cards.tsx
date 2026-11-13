import Link from "next/link";
import { ArrowRight, Car, GraduationCap, House, Wallet, type LucideIcon } from "lucide-react";

interface Category {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  {
    href: "/mortgage-loan-calculator",
    title: "Mortgage Loan",
    description: "Calculate home loan payments and total cost.",
    icon: House,
  },
  {
    href: "/auto-loan-calculator",
    title: "Auto Loan",
    description: "Estimate car loan payments and interest.",
    icon: Car,
  },
  {
    href: "/personal-loan-calculator",
    title: "Personal Loan",
    description: "Plan personal borrowing with easy calculations.",
    icon: Wallet,
  },
  {
    href: "/student-loan-calculator",
    title: "Student Loan",
    description: "Check student loan payments and payoff time.",
    icon: GraduationCap,
  },
];

/** Four cards linking to the dedicated calculators. Pass `exclude` to hide the current page. */
export function LoanCategoryCards({ exclude, headingLevel = "h3" }: { exclude?: string; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const items = categories.filter((c) => c.href !== exclude);

  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map(({ href, title, description, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-colors hover:border-accent/40 hover:bg-accent-soft/40"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
            </span>
            <Heading className="mt-5 text-lg font-semibold text-ink">{title}</Heading>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{description}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              Open calculator
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
