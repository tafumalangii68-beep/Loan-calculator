import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPageImage, IMAGE_HEIGHT, IMAGE_WIDTH } from "@/lib/images";

interface Category {
  href: string;
  title: string;
  description: string;
}

const categories: Category[] = [
  {
    href: "/mortgage-loan-calculator",
    title: "Mortgage Loan",
    description: "Calculate home loan payments and total cost.",
  },
  {
    href: "/auto-loan-calculator",
    title: "Auto Loan",
    description: "Estimate car loan payments and interest.",
  },
  {
    href: "/personal-loan-calculator",
    title: "Personal Loan",
    description: "Plan personal borrowing with easy calculations.",
  },
  {
    href: "/student-loan-calculator",
    title: "Student Loan",
    description: "Check student loan payments and payoff time.",
  },
];

/** Four cards linking to the dedicated calculators. Pass `exclude` to hide the current page. */
export function LoanCategoryCards({ exclude, headingLevel = "h3" }: { exclude?: string; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const items = categories.filter((c) => c.href !== exclude);

  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map(({ href, title, description }) => {
        const image = getPageImage(href);
        return (
          <li key={href}>
            <Link
              href={href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-accent/40 hover:bg-accent-soft/40"
            >
              {image && (
                <Image
                  src={image.src}
                  alt=""
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full border-b border-line"
                />
              )}
              <span className="flex flex-1 flex-col p-5">
                <Heading className="text-lg font-semibold text-ink">{title}</Heading>
                <span className="mt-1.5 block flex-1 text-sm leading-relaxed text-muted">{description}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Open calculator
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
