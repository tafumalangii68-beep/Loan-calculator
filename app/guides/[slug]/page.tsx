import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Article, Container, Sections, SourceList } from "@/components/content-blocks";
import { JsonLd } from "@/components/json-ld";
import { getGuide, guides } from "@/data/guides";
import { getLoanType } from "@/data/loan-types";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    type: "article",
  });
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

function calculatorName(href: string) {
  if (href === "/") return "Loan calculator";
  return getLoanType(href.slice(1))?.h1 ?? href;
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const path = `/guides/${guide.slug}`;
  const others = guides.filter((g) => g.slug !== guide.slug);

  return (
    <Container className="pt-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.metaDescription,
          datePublished: guide.published,
          dateModified: guide.updated,
          mainEntityOfPage: absoluteUrl(path),
          inLanguage: siteConfig.language,
          author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        }}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path },
        ]}
      />
      <article className="mt-6">
        <header className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{guide.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{guide.intro}</p>
          <p className="mt-4 text-sm text-muted">
            By the {siteConfig.name} team · Updated <time dateTime={guide.updated}>{dateFormat.format(new Date(guide.updated))}</time>
          </p>
        </header>
        <Article>
          <Sections sections={guide.sections} />

          <section aria-labelledby="try-it">
            <h2 id="try-it">Try it with your own numbers</h2>
            <ul>
              {guide.relatedCalculators.map((href) => (
                <li key={href}>
                  <Link href={href}>{calculatorName(href)}</Link>
                </li>
              ))}
            </ul>
          </section>

          <SourceList sources={guide.sources} />

          <section aria-labelledby="more-guides">
            <h2 id="more-guides">More guides</h2>
            <ul>
              {others.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`}>{g.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        </Article>
      </article>
    </Container>
  );
}
