"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/lib/site-config";
import { navLinkClass } from "./nav-styles";

/**
 * Desktop header menu: links in a rounded pill, with the current section
 * highlighted. The Blog item is a server-rendered dropdown passed in as a slot.
 */
export function HeaderNav({
  links,
  blogMenu,
  countryPaths,
}: {
  links: NavLink[];
  blogMenu: ReactNode;
  /** Country page paths (/uk, /de, …), which belong to the Europe section */
  countryPaths: string[];
}) {
  const pathname = usePathname() ?? "/";
  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (href === "/countries" && countryPaths.includes(pathname));

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-0.5 rounded-full border border-line bg-white/80 p-1 shadow-[0_1px_2px_rgba(37,37,34,0.05)]">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.href} data-active={active} className="group/item">
              {link.href === "/guides" ? (
                blogMenu
              ) : (
                <Link href={link.href} aria-current={active ? "page" : undefined} className={navLinkClass}>
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
