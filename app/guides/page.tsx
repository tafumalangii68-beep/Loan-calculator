import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/content-blocks";
import { GuideCards } from "@/components/guide-cards";
import { LoanCategoryCards } from "@/components/loan-category-cards";
import { PageImage } from "@/components/page-image";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Loan Blog & Guides",
  description:
    "The LoanCalm blog: plain-English guides to how loans work — amortization, APR vs. interest rate, and how extra payments reduce interest — with worked examples.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <Container className="pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/guides" },
        ]}
      />
      <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">LoanCalm blog</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            Plain-English guides to how loans work, with worked examples you can check in our{" "}
            <Link href="/" className="link">
              loan calculator
            </Link>
            .
          </p>
        </div>
        <PageImage path="/guides" priority sizes="(min-width: 768px) 50vw, 100vw" />
      </div>

      <section aria-labelledby="articles" className="mt-12">
        <h2 id="articles" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          All articles
        </h2>
        <div className="mt-6">
          <GuideCards headingLevel="h3" />
        </div>
      </section>

      <section aria-labelledby="calculators" className="mt-16">
        <h2 id="calculators" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Put it into practice
        </h2>
        <div className="mt-6">
          <LoanCategoryCards />
        </div>
      </section>
    </Container>
  );
}
