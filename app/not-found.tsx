import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/content-blocks";
import { loanTypes } from "@/data/loan-types";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium text-accent">404</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">We couldn’t find that page</h1>
        <p className="mt-4 leading-relaxed text-muted">
          The link may be out of date, or the address may have a typo. These pages might help:
        </p>
        <Link href="/" className="btn-primary mt-6">
          Go to the loan calculator
        </Link>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {loanTypes.map((page) => (
            <li key={page.slug}>
              <Link href={`/${page.slug}`} className="link">
                {page.h1}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/guides" className="link">
              Guides
            </Link>
          </li>
          <li>
            <Link href="/faq" className="link">
              FAQ
            </Link>
          </li>
        </ul>
      </div>
    </Container>
  );
}
