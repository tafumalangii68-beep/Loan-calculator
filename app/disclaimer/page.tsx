import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description: `${siteConfig.name} provides estimates for general information only. Read about the calculators’ assumptions and why results are not financial advice or a loan offer.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <SimplePage title="Disclaimer" path="/disclaimer" updated={siteConfig.legalUpdated}>
      <section aria-labelledby="info">
        <h2 id="info">General information only</h2>
        <p>
          The calculators and articles on {siteConfig.name} are for general educational purposes. They are not
          financial, investment, legal or tax advice, and they do not take your personal circumstances into account.
          Before making a borrowing decision, speak to your lender and, where appropriate, a qualified professional.
        </p>
      </section>

      <section aria-labelledby="estimates">
        <h2 id="estimates">Results are estimates</h2>
        <p>Each calculator assumes:</p>
        <ul>
          <li>a fixed interest rate for the whole term;</li>
          <li>equal monthly payments that fully repay the loan by the end of the term;</li>
          <li>interest calculated monthly on the remaining balance;</li>
          <li>payments made in full and on time, with any extra payment applied to principal.</li>
        </ul>
        <p>
          Real loans can differ. Lenders round amounts, may accrue interest daily, may charge fees, and may include
          taxes, insurance or other costs in your payment. The calculators do not model variable rates, interest-only
          or balloon loans, income-driven student loan plans, deferment or forgiveness.
        </p>
      </section>

      <section aria-labelledby="no-offer">
        <h2 id="no-offer">Not a loan offer</h2>
        <p>
          We are not a lender or broker. Results do not indicate the rate or terms you will be offered, or whether you
          will qualify for credit. Example rates on the site are illustrations, not current market rates. Your lender’s
          official disclosures, such as the Truth in Lending disclosure or Loan Estimate, are the authoritative source
          for your loan’s terms.
        </p>
      </section>

      <section aria-labelledby="external">
        <h2 id="external">External links</h2>
        <p>
          We link to outside sources for reference. We aren’t responsible for their content, and a link doesn’t imply
          endorsement.
        </p>
      </section>

      <p>
        See also our <Link href="/terms-and-conditions">terms and conditions</Link>.
      </p>
    </SimplePage>
  );
}
