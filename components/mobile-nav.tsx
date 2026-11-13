"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavLink } from "@/lib/site-config";

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden" onKeyDown={(e) => e.key === "Escape" && close()}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink"
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-sm"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            <li>
              <Link href="/" onClick={close} className="block rounded-md px-2 py-3 text-ink hover:bg-beige">
                Loan calculator
              </Link>
            </li>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={close} className="block rounded-md px-2 py-3 text-ink hover:bg-beige">
                  {link.mobileLabel ?? link.label}
                </Link>
              </li>
            ))}
            <li className="px-2 pt-2 pb-3 sm:hidden">
              <Link href="/contact" onClick={close} className="btn-primary w-full rounded-full">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
