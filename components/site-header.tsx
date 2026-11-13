import Link from "next/link";
import { mainNav, siteConfig } from "@/lib/site-config";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 rounded-md font-semibold text-ink" aria-label={`${siteConfig.name} home`}>
          <Logo />
          <span>{siteConfig.name}</span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-muted transition-colors hover:bg-white hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav links={mainNav} />
      </div>
    </header>
  );
}
