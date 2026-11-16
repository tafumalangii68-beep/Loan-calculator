import Link from "next/link";
import { Scale, ShieldCheck, Target } from "lucide-react";
import { SimplePage } from "@/components/simple-page";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "About Us",
  description: `What ${siteConfig.name} is, how our calculators work, how we write our guides, and what we do and don’t do with your data.`,
  path: "/about",
});

const highlights = [
  {
    icon: Target,
    title: "Our mission",
    text: "Make loan math simple, free and easy to check, so you can compare offers with confidence.",
  },
  {
    icon: Scale,
    title: "Our values",
    text: "Accuracy, transparency and plain English. Every result shows the formula behind it.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Calculations run in your browser. Nothing you type is sent to a server or saved.",
  },
];

export default function AboutPage() {
  return (
    <SimplePage
      title="About us"
      path="/about"
      intro={`${siteConfig.name} is a free loan calculator that helps you check a monthly payment, see the total interest and compare options before you commit.`}
      related
      highlights={
        <ul className="grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-line bg-white p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <h2 className="mt-4 font-semibold text-ink">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      }
    >
      <section aria-labelledby="why">
        <h2 id="why">Why this site exists</h2>
        <p>
          Loan offers are full of numbers — rates, APRs, terms, fees — and it’s hard to see what they mean for your
          budget. {siteConfig.name} gives you a quick, honest way to check a monthly payment, see the total interest,
          and compare scenarios before you commit.
        </p>
      </section>

      <section aria-labelledby="how">
        <h2 id="how">How the calculators work</h2>
        <p>
          Every calculator on this site uses the standard fixed-rate amortization formula, and the methodology is
          written out on each page. The calculations are tested against published worked examples. Worked examples in
          our guides are computed from the same code as the calculators, so the numbers always match.
        </p>
        <p>
          Everything runs in your browser. There’s nothing to sign up for, and your loan details are not sent to a
          server or saved.
        </p>
      </section>

      <section aria-labelledby="content">
        <h2 id="content">How we write our guides</h2>
        <p>
          Our <Link href="/guides">blog</Link> explains the ideas behind the calculators, starting with{" "}
          <Link href="/guides/how-loan-amortization-works">how loan amortization works</Link>.
        </p>
        <ul>
          <li>We explain how loans work in plain English, with worked examples you can check yourself.</li>
          <li>
            Factual and regulatory points link to primary sources such as the Consumer Financial Protection Bureau and
            Federal Student Aid.
          </li>
          <li>We state the limitations of each calculator rather than overstating its precision.</li>
          <li>Each guide shows the date it was last updated, and we correct errors when we find them.</li>
        </ul>
      </section>

      <section aria-labelledby="not">
        <h2 id="not">What we are not</h2>
        <p>
          We are not a lender, broker or financial adviser. We don’t offer loans, collect applications, or rank lenders,
          and the calculators don’t favor any lender. Our content is general information, not personalized advice. See
          our <Link href="/disclaimer">disclaimer</Link>.
        </p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">Get in touch</h2>
        <p>
          Found an error or have a suggestion? <Link href="/contact">Contact us</Link> — corrections are especially
          welcome.
        </p>
      </section>
    </SimplePage>
  );
}
