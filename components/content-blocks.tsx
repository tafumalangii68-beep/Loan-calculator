import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentSection, Source } from "@/types/content";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

/** Narrow reading column for long-form text. */
export function Article({ children }: { children: ReactNode }) {
  return <div className="prose-content mx-auto max-w-3xl">{children}</div>;
}

/**
 * Phrases that become contextual internal links inside article text. The first
 * match of each target on a page is linked; links to the current page are skipped.
 */
const autoLinks: { pattern: RegExp; href: string }[] = [
  { pattern: /\bamortization schedules?\b/i, href: "/guides/how-loan-amortization-works" },
  { pattern: /\bAPRs?\b/, href: "/guides/apr-vs-interest-rate" },
  { pattern: /\bextra (?:monthly )?payments?\b/i, href: "/guides/extra-loan-payments" },
  { pattern: /\bmortgages?\b/i, href: "/mortgage-loan-calculator" },
  { pattern: /\b(?:auto|car) loans?\b/i, href: "/auto-loan-calculator" },
  { pattern: /\bpersonal loans?\b/i, href: "/personal-loan-calculator" },
  { pattern: /\bstudent loans?\b/i, href: "/student-loan-calculator" },
];

function linkify(text: string, used: Set<string>): ReactNode[] {
  let best: { index: number; length: number; href: string } | null = null;
  for (const { pattern, href } of autoLinks) {
    if (used.has(href)) continue;
    const match = pattern.exec(text);
    if (match && (!best || match.index < best.index)) {
      best = { index: match.index, length: match[0].length, href };
    }
  }
  if (!best) return [text];
  used.add(best.href);
  const end = best.index + best.length;
  return [
    text.slice(0, best.index),
    <Link key={`${best.href}-${best.index}`} href={best.href}>
      {text.slice(best.index, end)}
    </Link>,
    ...linkify(text.slice(end), used),
  ];
}

export function Sections({ sections, currentPath }: { sections: ContentSection[]; currentPath?: string }) {
  // Shared across all sections so each target is linked once per page.
  const used = new Set<string>(currentPath ? [currentPath] : []);
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} aria-labelledby={slugify(section.heading)}>
          <h2 id={slugify(section.heading)}>{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{linkify(p, used)}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{linkify(item, used)}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <section aria-labelledby="sources">
      <h2 id="sources">Sources and further reading</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} rel="noopener noreferrer" target="_blank">
              {source.title}
            </a>{" "}
            — {source.publisher}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
