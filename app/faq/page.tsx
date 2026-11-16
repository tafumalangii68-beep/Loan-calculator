import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { FaqList } from "@/components/faq-list";
import { allFaqs } from "@/data/faqs";
import { buildMetadata } from "@/lib/seo";
import { slugify } from "@/components/content-blocks";

export const metadata = buildMetadata({
  title: "Loan Calculator FAQ",
  description:
    "Answers to common questions about our loan calculators: how payments are calculated, APR vs. interest rate, extra payments, accuracy and privacy.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <SimplePage
      title="Frequently asked questions"
      path="/faq"
      intro="How the calculators work, what the results mean, and how we handle your data."
      related
    >
      {allFaqs.map((group) => (
        <section key={group.heading} aria-labelledby={slugify(group.heading)}>
          <h2 id={slugify(group.heading)}>{group.heading}</h2>
          <div className="not-prose">
            <FaqList items={group.items} />
          </div>
        </section>
      ))}
      <section aria-labelledby="still">
        <h2 id="still">Still have a question?</h2>
        <p>
          Try the <Link href="/guides">LoanCalm blog</Link>, or <Link href="/contact">contact us</Link>.
        </p>
      </section>
    </SimplePage>
  );
}
