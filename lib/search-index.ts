import { loanTypes } from "@/data/loan-types";
import { guides } from "@/data/guides";
import { allFaqs } from "@/data/faqs";
import { countries, COUNTRY_ALIASES } from "@/data/countries";

export interface SearchEntry {
  title: string;
  href: string;
  /** Short text shown under the title */
  summary: string;
  /** Category label, e.g. "Calculator" */
  kind: string;
  /** Extra words that should match but aren't displayed */
  keywords?: string;
}

/**
 * Static search index built from the site's own content at build time.
 * It is small (a few KB), so the header search filters it in the browser —
 * no search service or API is involved.
 */
export function buildSearchIndex(): SearchEntry[] {
  return [
    {
      title: "Loan calculator",
      href: "/#calculator",
      summary: "Monthly payment, total interest and amortization schedule for any fixed-rate loan.",
      kind: "Calculator",
      keywords: "payment amortization schedule extra payment interest",
    },
    ...loanTypes.map((page) => ({
      title: page.h1,
      href: `/${page.slug}`,
      summary: page.cardSummary,
      kind: "Calculator",
      keywords: `${page.shortName} ${page.sections.map((s) => s.heading).join(" ")}`,
    })),
    {
      title: "Loan calculators by country",
      href: "/countries",
      summary: "Calculators for European countries in the local currency.",
      kind: "Countries",
      keywords: "europe european country currency",
    },
    ...countries.map((c) => ({
      title: `${c.name} loan calculator`,
      href: `/${c.slug}`,
      summary: `Loan repayments in ${c.currency}. Explains the ${c.aprShort}.`,
      kind: "Country",
      keywords: `${c.code} ${c.currency} ${c.region} ${(COUNTRY_ALIASES[c.code] ?? []).join(" ")} mortgage europe`,
    })),
    ...guides.map((guide) => ({
      title: guide.title,
      href: `/guides/${guide.slug}`,
      summary: guide.metaDescription,
      kind: "Blog",
      keywords: guide.sections.map((s) => s.heading).join(" "),
    })),
    ...allFaqs.flatMap((group) =>
      group.items.map((faq) => ({
        title: faq.question,
        href: "/faq",
        summary: faq.answer.length > 120 ? `${faq.answer.slice(0, 117)}…` : faq.answer,
        kind: "FAQ",
      })),
    ),
    { title: "About LoanCalm", href: "/about", summary: "Who we are and how the calculators work.", kind: "Page" },
    { title: "Contact us", href: "/contact", summary: "Questions, corrections and feedback.", kind: "Page", keywords: "email" },
    { title: "Privacy policy", href: "/privacy-policy", summary: "How we handle information.", kind: "Page", keywords: "data" },
    { title: "Terms and conditions", href: "/terms-and-conditions", summary: "Terms of use.", kind: "Page" },
    { title: "Cookie policy", href: "/cookie-policy", summary: "Cookies, browser storage and your choices.", kind: "Page" },
    { title: "Disclaimer", href: "/disclaimer", summary: "Results are estimates, not financial advice.", kind: "Page" },
  ];
}

/** Every query word must appear somewhere in the entry. Title matches rank first. */
export function searchEntries(index: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return index
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const haystack = `${title} ${entry.summary} ${entry.keywords ?? ""} ${entry.kind}`.toLowerCase();
      if (!words.every((w) => haystack.includes(w))) return null;
      const score = words.filter((w) => title.includes(w)).length;
      return { entry, score };
    })
    .filter((x): x is { entry: SearchEntry; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.entry);
}
