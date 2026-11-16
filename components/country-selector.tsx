"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { Flag } from "./flag";

export interface SelectorCountry {
  slug: string;
  code: string;
  name: string;
  currency: string;
  aliases: string[];
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Searchable country picker (WAI-ARIA combobox with a listbox popup).
 * Type to filter by name, other names, ISO code or currency; use the arrow
 * keys and Enter to choose, Escape to close. Choosing a country opens its page.
 */
export function CountrySelector({
  countries,
  label = "Choose Your Country",
  placeholder = "Search or select your country",
}: {
  countries: SelectorCountry[];
  label?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const id = useId();
  const listId = `${id}-list`;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const sorted = useMemo(() => [...countries].sort((a, b) => a.name.localeCompare(b.name, "en")), [countries]);
  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return sorted;
    return sorted.filter((c) =>
      [c.name, c.code, c.currency, c.slug, ...c.aliases].some((field) => normalize(field).includes(q)),
    );
  }, [query, sorted]);

  const choose = (country: SelectorCountry) => {
    setOpen(false);
    setQuery(country.name);
    router.push(`/${country.slug}`);
  };

  const moveActive = (index: number) => {
    setActive(index);
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) setOpen(true);
        else if (results.length) moveActive(Math.min(active + 1, results.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (results.length) moveActive(Math.max(active - 1, 0));
        break;
      case "Home":
        if (open && results.length) {
          event.preventDefault();
          moveActive(0);
        }
        break;
      case "End":
        if (open && results.length) {
          event.preventDefault();
          moveActive(results.length - 1);
        }
        break;
      case "Enter":
        if (open && results[active]) {
          event.preventDefault();
          choose(results[active]);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        } else setQuery("");
        break;
    }
  };

  const activeId = open && results[active] ? `${id}-opt-${results[active].slug}` : undefined;

  return (
    <div className="relative">
      <label htmlFor={`${id}-input`} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative mt-2">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="h-13 w-full rounded-2xl border border-line-strong bg-white pr-12 pl-11 text-base text-ink shadow-[0_1px_2px_rgba(37,37,34,0.04)] placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/25 focus:outline-none"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close country list" : "Open country list"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setOpen((v) => !v);
            inputRef.current?.focus();
          }}
          className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-muted hover:bg-paper hover:text-ink"
        >
          <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {open ? `${results.length} ${results.length === 1 ? "country" : "countries"} available` : ""}
      </p>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label="European countries"
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-auto rounded-2xl border border-line bg-white p-1.5 shadow-lg"
      >
        {results.length === 0 ? (
          <li className="px-3 py-3 text-sm text-muted">No European country matches “{query}”.</li>
        ) : (
          results.map((country, index) => (
            <li
              key={country.slug}
              id={`${id}-opt-${country.slug}`}
              role="option"
              aria-selected={index === active}
              data-index={index}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(country)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                index === active ? "bg-accent-soft text-ink" : "text-ink/90"
              }`}
            >
              <Flag code={country.code} className="h-4 w-auto" />
              <span className="flex-1 font-medium">{country.name}</span>
              <span className="text-xs font-semibold tracking-wide text-muted">{country.currency}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
