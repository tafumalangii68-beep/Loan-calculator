"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchEntries, type SearchEntry } from "@/lib/search-index";

const SUGGESTIONS = ["mortgage", "APR", "extra payment", "student loan", "amortization"];

/** Header search: a native <dialog> that filters a small static index. */
export function SiteSearch({ index }: { index: SearchEntry[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const results = searchEntries(index, query);

  const open = () => {
    setQuery("");
    setActive(0);
    dialogRef.current?.showModal();
    inputRef.current?.focus();
  };
  const close = () => dialogRef.current?.close();
  const go = (href: string) => {
    close();
    router.push(href);
  };

  // Ctrl/⌘ + K or "/" opens search from anywhere (except while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable=true]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setQuery("");
        setActive(0);
        dialogRef.current?.showModal();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-beige"
      >
        <Search aria-hidden="true" className="size-5" />
        <span className="sr-only">Search the site</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search the site"
        onClick={(e) => {
          if (e.target === dialogRef.current) close(); // click on backdrop
        }}
        className="mx-auto mt-[12vh] w-[min(100%-2rem,36rem)] rounded-2xl border border-line bg-white p-0 text-ink shadow-xl backdrop:bg-ink/40"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden="true" className="size-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Escape") {
                // type="search" would otherwise just clear the text on Escape.
                e.preventDefault();
                close();
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                go(results[active].href);
              }
            }}
            placeholder="Search calculators, guides and FAQs"
            aria-label="Search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            autoComplete="off"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={close} className="rounded-md p-1.5 text-muted hover:bg-beige hover:text-ink">
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Close search</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-3">
              <p className="text-xs font-medium text-muted">Try searching for</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink hover:border-accent/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted" role="status">
              No results for “{query}”. Try a broader word such as “loan” or “interest”.
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search results">
              {results.map((r, i) => (
                <li key={`${r.href}-${r.title}`} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <a
                    href={r.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(r.href);
                    }}
                    onMouseEnter={() => setActive(i)}
                    tabIndex={-1}
                    className={`block rounded-xl px-3 py-2.5 ${i === active ? "bg-accent-soft" : ""}`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium text-ink">{r.title}</span>
                      <span className="shrink-0 text-xs text-muted">{r.kind}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{r.summary}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="hidden border-t border-line px-4 py-2 text-xs text-muted sm:block">
          ↑ ↓ to move · Enter to open · Esc to close
        </p>
      </dialog>
    </>
  );
}
