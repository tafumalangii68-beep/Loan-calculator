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

export function Sections({ sections }: { sections: ContentSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} aria-labelledby={slugify(section.heading)}>
          <h2 id={slugify(section.heading)}>{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
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

export function CardLink({ href, title, children }: { href: string; title: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-line bg-white p-5 transition-colors hover:border-accent/50"
    >
      <span className="font-semibold text-ink group-hover:text-accent-strong">{title}</span>
      <span className="mt-1.5 block text-sm leading-relaxed text-muted">{children}</span>
    </Link>
  );
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
