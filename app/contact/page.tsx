import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { ContactForm } from "@/components/contact-form";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: `How to contact ${siteConfig.name} with questions, corrections or feedback about our loan calculators and guides.`,
  path: "/contact",
});

export default function ContactPage() {
  const email = siteConfig.contactEmail;

  return (
    <SimplePage
      title="Contact us"
      path="/contact"
      intro="Questions, corrections or ideas for the calculators are all welcome."
    >
      {email ? (
        <>
          <section aria-labelledby="email">
            <h2 id="email">Email</h2>
            <p>
              Email us at <a href={`mailto:${email}`}>{email}</a>. We read every message, though we can’t promise an
              individual reply.
            </p>
          </section>
          <section aria-labelledby="draft">
            <h2 id="draft">Write your message here</h2>
            <p>Prefer to type here? The form below opens your email app with your message filled in.</p>
            <div className="not-prose rounded-2xl border border-line bg-white p-5 sm:p-6">
              <ContactForm email={email} />
            </div>
          </section>
        </>
      ) : (
        <section aria-labelledby="unavailable">
          <h2 id="unavailable">Contact details coming soon</h2>
          <p>
            Our contact email address is being set up. In the meantime, the <Link href="/faq">FAQ</Link> answers the
            most common questions about the calculators.
          </p>
        </section>
      )}

      <section aria-labelledby="before">
        <h2 id="before">Before you write</h2>
        <ul>
          <li>
            Please don’t send account numbers, Social Security numbers or other sensitive personal or financial
            information.
          </li>
          <li>
            We can’t give personal financial advice or help with a specific loan application. For questions about your
            loan, contact your lender or servicer.
          </li>
          <li>
            If you’re reporting a calculation issue, include the numbers you entered and the result you expected.
          </li>
        </ul>
      </section>
    </SimplePage>
  );
}
