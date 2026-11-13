import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Terms and Conditions",
  description: `The terms that apply when you use ${siteConfig.name}, including acceptable use, accuracy of results and limitation of liability.`,
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <SimplePage title="Terms and conditions" path="/terms-and-conditions" updated={siteConfig.legalUpdated}>
      <p>
        These terms apply to your use of {siteConfig.name} at {siteConfig.url.replace(/^https?:\/\//, "")} (the
        “site”). By using the site, you agree to them. If you don’t agree, please don’t use the site.
      </p>

      <section aria-labelledby="service">
        <h2 id="service">What the site provides</h2>
        <p>
          The site provides free calculators and educational articles about loans. It is provided for general
          information only. We are not a lender, broker, or financial, legal or tax adviser, and nothing on the site is
          an offer of credit, a credit decision, or personalized advice.
        </p>
      </section>

      <section aria-labelledby="accuracy">
        <h2 id="accuracy">Accuracy of results</h2>
        <p>
          The calculators produce estimates based on the information you enter and on the assumptions described on each
          page, such as a fixed interest rate and equal monthly payments. Actual loan terms, payments and costs are set
          by your lender and can differ because of rounding, fees, interest accrual methods, taxes, insurance and other
          factors. Always rely on your lender’s official disclosures. We try to keep the site accurate and up to date
          but do not guarantee that it is complete, correct or current. See our <Link href="/disclaimer">disclaimer</Link>.
        </p>
      </section>

      <section aria-labelledby="use">
        <h2 id="use">Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>use the site for anything unlawful or to mislead others about loan terms;</li>
          <li>try to disrupt, overload or gain unauthorized access to the site or its hosting;</li>
          <li>scrape or copy the site in bulk, or reproduce it in a way that suggests it is your own work.</li>
        </ul>
      </section>

      <section aria-labelledby="ip">
        <h2 id="ip">Intellectual property</h2>
        <p>
          The site’s text, design and code are owned by the site operator or its licensors. You may use the calculators
          and share links to the site freely, and you may quote short excerpts with a link back. Any other reproduction
          requires permission.
        </p>
      </section>

      <section aria-labelledby="links">
        <h2 id="links">Links to other websites</h2>
        <p>
          We link to external sources, such as government websites, for further reading. We don’t control those sites
          and aren’t responsible for their content or practices.
        </p>
      </section>

      <section aria-labelledby="availability">
        <h2 id="availability">Availability and changes</h2>
        <p>
          We may change, suspend or discontinue any part of the site at any time without notice. We may also update
          these terms. The date at the top shows the latest version, and continuing to use the site means you accept
          the updated terms.
        </p>
      </section>

      <section aria-labelledby="liability">
        <h2 id="liability">Disclaimer of warranties and limitation of liability</h2>
        <p>
          The site is provided “as is” and “as available”, without warranties of any kind, express or implied, to the
          fullest extent permitted by law. To the fullest extent permitted by law, we are not liable for any loss or
          damage arising from your use of the site or your reliance on its results, including financial decisions made
          using the calculators. Some jurisdictions do not allow certain limitations, so some of the above may not apply
          to you.
        </p>
      </section>

      <section aria-labelledby="law">
        <h2 id="law">Governing law</h2>
        <p>
          {siteConfig.legal.governingLaw
            ? `These terms are governed by the laws of ${siteConfig.legal.governingLaw}, without regard to conflict-of-law rules.`
            : "These terms are governed by the laws applicable where the site operator is based, without regard to conflict-of-law rules."}{" "}
          Nothing in these terms limits any rights you have under consumer protection laws that cannot be waived.
        </p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">Contact</h2>
        <p>
          Questions about these terms can be sent through our <Link href="/contact">contact page</Link>.
        </p>
      </section>
    </SimplePage>
  );
}
