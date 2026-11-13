import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/site-config";
import { CookieSettingsButton } from "./cookie-settings-button";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-beige/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link href="/" className="inline-block rounded-md" aria-label={`${siteConfig.name} — home`}>
            <Logo />
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Free, private loan calculators and plain-English guides. Results are estimates for general information,
            not financial advice or a loan offer.
          </p>
        </div>
        {footerNav.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="text-sm font-semibold text-ink">{group.heading}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
              {group.heading === "About" && (
                <li>
                  <CookieSettingsButton className="text-muted transition-colors hover:text-ink" />
                </li>
              )}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} {siteConfig.name}. All calculations run in your browser.
        </p>
      </div>
    </footer>
  );
}
