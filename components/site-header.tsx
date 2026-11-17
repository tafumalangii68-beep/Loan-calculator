import Link from "next/link";
import { mainNav, siteConfig } from "@/lib/site-config";
import { buildSearchIndex } from "@/lib/search-index";
import { guides } from "@/data/guides";
import { BlogMenu } from "./blog-menu";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { SiteSearch } from "./site-search";

export function SiteHeader() {
  const searchIndex = buildSearchIndex();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="rounded-md" aria-label={`${siteConfig.name} — home`}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 text-[0.95rem]">
            {mainNav.map((link) => (
              <li key={link.href}>
                {link.href === "/guides" ? (
                  <BlogMenu label={link.label} />
                ) : (
                  <Link
                    href={link.href}
                    className="rounded-md px-2.5 py-2 text-ink/80 transition-colors hover:bg-beige hover:text-ink xl:px-3"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <SiteSearch index={searchIndex} />
          <MobileNav
            links={mainNav}
            blogPosts={guides.map((g) => ({ href: `/guides/${g.slug}`, label: g.title }))}
          />
        </div>
      </div>
    </header>
  );
}
