import type { ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { Container } from "./content-blocks";
import { GuideCards } from "./guide-cards";
import { LoanCategoryCards } from "./loan-category-cards";
import { PageImage } from "./page-image";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

/** Shared layout for About, Contact, legal and other text pages. */
export function SimplePage({
  title,
  path,
  intro,
  updated,
  children,
  related = false,
}: {
  title: string;
  path: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
  /** Show calculator and blog cards under the content (for non-legal pages). */
  related?: boolean;
}) {
  return (
    <Container className="pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: title, path },
        ]}
      />
      <div className="prose-content mx-auto mt-6 max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="text-lg text-muted">{intro}</p>}
        {updated && (
          <p className="text-sm text-muted">
            Last updated: <time dateTime={updated}>{dateFormat.format(new Date(updated))}</time>
          </p>
        )}
        <PageImage path={path} priority className="not-prose" />
        {children}
      </div>
      {related && (
        <>
          <section aria-labelledby="calculators" className="mt-16">
            <h2 id="calculators" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Loan calculators
            </h2>
            <div className="mt-6">
              <LoanCategoryCards />
            </div>
          </section>
          <section aria-labelledby="from-the-blog" className="mt-16">
            <h2 id="from-the-blog" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              From the blog
            </h2>
            <div className="mt-6">
              <GuideCards />
            </div>
          </section>
        </>
      )}
    </Container>
  );
}
