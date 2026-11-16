import { List } from "lucide-react";

/** "In this article" box linking to the article's h2 sections by id. */
export function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-labelledby="toc-heading" className="not-prose rounded-2xl border border-line bg-white p-5 sm:p-6">
      <p id="toc-heading" className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted uppercase">
        <List aria-hidden="true" className="size-4 text-accent" />
        In this article
      </p>
      <ol className="mt-3 grid list-none gap-x-6 gap-y-1.5 space-y-0 pl-0 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-2 text-[0.95rem]">
            <span className="w-5 shrink-0 text-right text-muted tabular-nums">{i + 1}.</span>
            <a href={`#${item.id}`} className="text-ink/85 hover:text-accent-strong hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
