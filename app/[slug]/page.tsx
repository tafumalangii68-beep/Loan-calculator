import Link from "next/link";
import { notFound } from "next/navigation";
import { LoanCalculator } from "@/components/loan-calculator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { GuideCards } from "@/components/guide-cards";
import { PageImage } from "@/components/page-image";
import { Container, Sections, SourceList } from "@/components/content-blocks";
import { LoanCategoryCards } from "@/components/loan-category-cards";
import { ScenarioTable } from "@/components/scenario-table";
import { JsonLd } from "@/components/json-ld";
import { getLoanType, loanTypes } from "@/data/loan-types";
import { countries, getCountry } from "@/data/countries";
import { CountryPage, countryMetadata } from "@/components/country-page";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";

export const dynamicParams = false;

// One root-level dynamic segment serves two kinds of page: the US loan-type
// calculators (/mortgage-loan-calculator, …) and the European country pages
// (/uk, /de, …). Next.js allows only one dynamic segment per level.
export function generateStaticParams() {
  return [...loanTypes.map((page) => ({ slug: page.slug })), ...countries.map((c) => ({ slug: c.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (country) return countryMetadata(country);
  const page = getLoanType(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.slug}`,
  });
}

export default async function LoanTypePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (country) return <CountryPage country={country} />;
  const page = getLoanType(slug);
  if (!page) notFound();

  const path = `/${page.slug}`;

  return (
    <>
      <JsonLd data={webPageJsonLd({ title: page.metaTitle, description: page.metaDescription, path })} />
      <Container className="pt-8 pb-12">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: page.h1, path },
          ]}
        />
        <div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{page.h1}</h1>
            <p className="mt-3 text-lg leading-relaxed text-muted">{page.intro}</p>
          </div>
          <PageImage path={path} priority sizes="(min-width: 768px) 45vw, 100vw" className="hidden md:block" />
        </div>
        <div className="mt-8">
          <LoanCalculator preset={page.preset} />
        </div>
        <p className="mt-3 text-xs text-muted">
          The starting values are examples only, not current rates. Replace them with your own figures.
        </p>
      </Container>

      <Container>
        <div className="prose-content mx-auto max-w-3xl">
          <Sections sections={page.sections} currentPath={path} />

          <section aria-labelledby="worked-example">
            <h2 id="worked-example">{page.scenarioHeading}</h2>
            <p>{page.scenarioIntro}</p>
            <ScenarioTable scenarios={page.scenarios} caption={page.scenarioHeading} />
            <p>{page.scenarioTakeaway}</p>
          </section>

          <section aria-labelledby="method">
            <h2 id="method">How the calculation works</h2>
            <p>
              The {page.shortName.toLowerCase()} calculator uses the same fixed-rate amortization formula as our main{" "}
              <Link href="/">loan calculator</Link>. Interest is charged monthly on the remaining balance, and equal
              payments pay off the loan by the end of the term. For a step-by-step walkthrough, read{" "}
              <Link href="/guides/how-loan-amortization-works">how loan amortization works</Link>.
            </p>
          </section>

          <section aria-labelledby="faq">
            <h2 id="faq">{page.shortName} loan questions</h2>
            <div className="not-prose mt-4">
              <FaqList items={page.faqs} />
            </div>
          </section>

          <SourceList sources={page.sources} />
        </div>
      </Container>

      <Container className="mt-16">
        <section aria-labelledby="related-articles">
          <h2 id="related-articles" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Related articles
          </h2>
          <div className="mt-6">
            <GuideCards />
          </div>
        </section>
      </Container>

      <Container className="mt-16">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Other loan calculators</h2>
          <div className="mt-6">
            <LoanCategoryCards exclude={path} />
          </div>
          <p className="mt-6 text-sm text-muted">
            Have a different kind of loan? Use the general <Link href="/" className="link">loan payment calculator</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
