import { Breadcrumbs } from "@/components/breadcrumbs";
import { CardLink, Container } from "@/components/content-blocks";
import { guides } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Loan Guides",
  description:
    "Plain-English guides to how loans work: amortization, APR vs. interest rate, and how extra payments reduce interest.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <Container className="pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ]}
      />
      <div className="mt-6 max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Loan guides</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          Short explanations of the ideas behind the calculators, with worked examples.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <CardLink key={guide.slug} href={`/guides/${guide.slug}`} title={guide.title}>
            {guide.metaDescription}
          </CardLink>
        ))}
      </div>
    </Container>
  );
}
