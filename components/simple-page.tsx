import type { ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { Container } from "./content-blocks";
import { GuideCards } from "./guide-cards";
import { LoanCategoryCards } from "./loan-category-cards";
import { PageImage } from "./page-image";
import { getPageImage } from "@/lib/images";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

/** Shared layout for About, Contact, legal and other text pages. */
export function SimplePage({
  title,
  path,
  intro,
  updated,
  children,
  related = false,
  highlights,
}: {
  title: string;
  path: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
  /** Show calculator and blog cards under the content (for non-legal pages). */
  related?: boolean;
  /** Optional full-width row (e.g. cards) between the hero and the text. */
  highlights?: ReactNode;
}) {
  const hasImage = Boolean(getPageImage(path));
  const updatedLine = updated && (
    <p className="mt-3 text-sm text-muted">
      Last updated: <time dateTime={updated}>{dateFormat.format(new Date(updated))}</time>
    </p>
  );

  return (
    <Container className="pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: title, path },
        ]}
      />
      {hasImage ? (
        <>
          {/* Hero: title on the left, illustration on the right (stacks on mobile). */}
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
              {intro && <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{intro}</p>}
              {updatedLine}
            </div>
            <PageImage path={path} priority sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          {highlights && <div className="mt-10">{highlights}</div>}
          <div className="prose-content mx-auto mt-6 max-w-3xl">{children}</div>
        </>
      ) : (
        <div className="prose-content mx-auto mt-6 max-w-3xl">
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          {intro && <p className="text-lg text-muted">{intro}</p>}
          {updatedLine}
          {children}
        </div>
      )}
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
