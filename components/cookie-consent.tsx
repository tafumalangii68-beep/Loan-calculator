"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  onOpenCookieSettings,
  parseConsent,
  readRawConsent,
  saveConsent,
  subscribeToConsent,
  type OptionalCategory,
} from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

/** Server render and first hydration pass: unknown, so render nothing. */
const SERVER_SNAPSHOT = "__server__";

const categories: { key: OptionalCategory; title: string; description: string; inUse: string | null }[] = [
  {
    key: "analytics",
    title: "Analytics",
    description: "Would help us understand how the site is used, such as which pages are visited.",
    inUse: siteConfig.optionalServices.analytics?.name ?? null,
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Would be used to measure or personalize advertising.",
    inUse: siteConfig.optionalServices.marketing?.name ?? null,
  },
];

export function CookieConsent() {
  const raw = useSyncExternalStore(subscribeToConsent, readRawConsent, () => SERVER_SNAPSHOT);
  const consent = raw === SERVER_SNAPSHOT ? null : parseConsent(raw);
  const needsChoice = raw !== SERVER_SNAPSHOT && consent === null;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState({ analytics: false, marketing: false });

  useEffect(
    () =>
      onOpenCookieSettings(() => {
        const current = parseConsent(readRawConsent());
        setDraft({ analytics: current?.analytics ?? false, marketing: current?.marketing ?? false });
        dialogRef.current?.showModal();
      }),
    [],
  );

  const openSettings = () => {
    setDraft({ analytics: consent?.analytics ?? false, marketing: consent?.marketing ?? false });
    dialogRef.current?.showModal();
  };

  const choose = (choice: { analytics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    dialogRef.current?.close();
  };

  return (
    <>
      {needsChoice && (
        <section
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-line bg-white p-5 shadow-lg sm:inset-x-6 sm:bottom-6"
        >
          <h2 id="cookie-banner-title" className="text-sm font-semibold text-ink">
            Cookies and browser storage
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            We only use browser storage to remember this choice. No analytics or advertising scripts run, optional
            categories stay off unless you allow them, and your loan numbers are never stored. See our{" "}
            <Link href="/privacy-policy" className="link">
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => choose({ analytics: true, marketing: true })} className="btn-primary">
              Accept all
            </button>
            <button type="button" onClick={() => choose({ analytics: false, marketing: false })} className="btn-secondary">
              Reject optional
            </button>
            <button type="button" onClick={openSettings} className="btn-ghost">
              Cookie settings
            </button>
          </div>
        </section>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="cookie-settings-title"
        className="m-auto w-[min(100%-2rem,32rem)] rounded-2xl border border-line bg-white p-0 text-ink shadow-xl backdrop:bg-ink/40"
      >
        <form
          method="dialog"
          className="p-6"
          onSubmit={(e) => {
            e.preventDefault();
            choose(draft);
          }}
        >
          <h2 id="cookie-settings-title" className="font-serif text-xl font-semibold">
            Cookie settings
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Choose which optional categories you allow. You can change this at any time from “Cookie settings” in the
            footer.
          </p>

          <ul className="mt-5 space-y-3">
            <li className="rounded-xl border border-line p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold">Necessary</h3>
                <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-muted">Always on</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Remembers your cookie choice in your browser’s local storage. The site does not work as intended
                without it, so it can’t be switched off here.
              </p>
            </li>
            {categories.map((category) => (
              <li key={category.key} className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor={`consent-${category.key}`} className="text-sm font-semibold">
                    {category.title} <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id={`consent-${category.key}`}
                    type="checkbox"
                    role="switch"
                    checked={draft[category.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [category.key]: e.target.checked }))}
                    aria-describedby={`consent-${category.key}-desc`}
                    className="switch"
                  />
                </div>
                <p id={`consent-${category.key}-desc`} className="mt-1.5 text-sm leading-relaxed text-muted">
                  {category.description}{" "}
                  {category.inUse
                    ? `Service in use: ${category.inUse}.`
                    : "No service in this category is installed right now; your choice is saved and will be respected if one is added."}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => choose({ analytics: false, marketing: false })} className="btn-secondary">
              Reject optional
            </button>
            <button type="submit" className="btn-primary">
              Save choices
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
