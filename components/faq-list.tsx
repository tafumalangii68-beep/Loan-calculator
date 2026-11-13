import type { Faq } from "@/types/content";

/** Accessible FAQ using native <details>, so it works without JavaScript. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((item) => (
        <details key={item.question} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-ink">
            <h3 className="text-base">{item.question}</h3>
            <span aria-hidden="true" className="mt-0.5 text-muted transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-2 leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
