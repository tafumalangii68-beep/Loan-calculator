import Link from "next/link";
import { LoanCalculator } from "@/components/loan-calculator";
import { FaqList } from "@/components/faq-list";
import { CardLink, Container } from "@/components/content-blocks";
import { ScenarioTable } from "@/components/scenario-table";
import { JsonLd } from "@/components/json-ld";
import { loanTypes } from "@/data/loan-types";
import { guides } from "@/data/guides";
import { homeFaqs } from "@/data/faqs";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";

const title = "Loan Calculator — Monthly Payment & Amortization Schedule";
const description =
  "Free loan calculator: enter the amount, rate and term to see your monthly payment, total interest, payoff time and a full amortization schedule. Private, no sign-up.";

export const metadata = buildMetadata({ title, description, path: "/", absoluteTitle: true });

export default function HomePage() {
  return (
    <>
      <JsonLd data={webPageJsonLd({ title, description, path: "/" })} />

      <Container className="pt-10 pb-12 sm:pt-14">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Loan Calculator</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            Work out the monthly payment on any fixed-rate loan, see how much interest you’ll pay in total, and get a
            month-by-month amortization schedule.
          </p>
        </div>
        <div id="calculator" className="mt-8 scroll-mt-6">
          <LoanCalculator />
        </div>
        <p className="mt-3 text-xs text-muted">
          The starting values are examples only, not current rates. Replace them with the figures from your loan offer.
        </p>
      </Container>

      <Container>
        <div className="prose-content mx-auto max-w-3xl">
          <section aria-labelledby="what-it-does">
            <h2 id="what-it-does">What this loan calculator does</h2>
            <p>
              It estimates the regular monthly payment for a fixed-rate installment loan — the kind of loan you repay in
              equal monthly amounts over a set term. That covers most personal, auto, student and mortgage loans, as well
              as many small-business and equipment loans.
            </p>
            <p>Along with the payment, you get:</p>
            <ul>
              <li>the total interest you’ll pay over the life of the loan,</li>
              <li>the total of all payments (amount borrowed plus interest),</li>
              <li>a yearly and monthly amortization schedule showing how each payment is split, and</li>
              <li>how much an extra monthly payment would save, and how much sooner you’d be debt-free.</li>
            </ul>
          </section>

          <section aria-labelledby="how-to-use">
            <h2 id="how-to-use">How to use it</h2>
            <ol>
              <li>
                <strong>Loan amount</strong> — the amount you are borrowing, not including any down payment.
              </li>
              <li>
                <strong>Interest rate</strong> — the yearly rate on your loan offer. Enter 0 for an interest-free loan.
              </li>
              <li>
                <strong>Loan term</strong> — how long you have to repay, in years or months. Choose the unit with the
                drop-down.
              </li>
              <li>
                <strong>Extra monthly payment</strong> (optional) — any amount you plan to pay on top of the required
                payment.
              </li>
              <li>
                Select <strong>Calculate payment</strong>. Change any value and calculate again to compare scenarios,
                or select <strong>Clear</strong> to start over.
              </li>
            </ol>
          </section>

          <section aria-labelledby="how-calculated">
            <h2 id="how-calculated">How the payment is calculated</h2>
            <p>
              The calculator uses the standard formula for a fully amortizing loan with monthly payments and monthly
              compounding:
            </p>
            <p className="rounded-xl border border-line bg-white px-5 py-4 text-center font-serif text-lg">
              Payment = P × r(1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1)
            </p>
            <p>
              <strong>P</strong> is the amount borrowed, <strong>r</strong> is the annual rate divided by 12, and{" "}
              <strong>n</strong> is the number of monthly payments. Each month, interest is charged on the remaining
              balance and the rest of the payment reduces the balance. Read{" "}
              <Link href="/guides/how-loan-amortization-works">how loan amortization works</Link> for a step-by-step
              example.
            </p>
          </section>

          <section aria-labelledby="examples">
            <h2 id="examples">Example: how rate and term change the cost</h2>
            <p>The same $25,000 loan under four different rates and terms:</p>
            <ScenarioTable
              caption="Loan cost examples"
              scenarios={[
                { label: "3 years at 7.5%", principal: 25_000, ratePercent: 7.5, termMonths: 36 },
                { label: "5 years at 7.5%", principal: 25_000, ratePercent: 7.5, termMonths: 60 },
                { label: "5 years at 10%", principal: 25_000, ratePercent: 10, termMonths: 60 },
                { label: "7 years at 10%", principal: 25_000, ratePercent: 10, termMonths: 84 },
              ]}
            />
            <p>
              A longer term lowers the payment but increases the total interest, and a higher rate raises both. The
              lowest monthly payment is rarely the cheapest loan.
            </p>
          </section>

          <section aria-labelledby="affects">
            <h2 id="affects">What affects your result</h2>
            <ul>
              <li>
                <strong>Rate vs. APR.</strong> Your payment is based on the interest rate. The APR also includes fees,
                so it is better for comparing offers. See <Link href="/guides/apr-vs-interest-rate">APR vs. interest rate</Link>.
              </li>
              <li>
                <strong>Fees.</strong> Fees that are added to the loan increase the amount borrowed. Fees deducted from
                what you receive raise the effective cost but not the payment.
              </li>
              <li>
                <strong>Extra costs.</strong> Mortgage payments often include taxes and insurance through escrow, which
                are not part of the loan payment.
              </li>
              <li>
                <strong>Interest accrual.</strong> Some lenders charge interest daily, so the exact split depends on when
                your payment arrives.
              </li>
            </ul>
          </section>

          <section aria-labelledby="limitations">
            <h2 id="limitations">Limitations</h2>
            <p>
              Results are estimates for general information. They assume a fixed rate, equal monthly payments that pay
              the loan off by the end of the term, and no missed or late payments. The calculator does not model
              variable rates, interest-only or balloon loans, income-driven student loan plans, or credit cards. It is
              not a loan offer and does not reflect the rate you might qualify for. Read the full{" "}
              <Link href="/disclaimer">disclaimer</Link>.
            </p>
          </section>
        </div>
      </Container>

      <Container className="mt-16">
        <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-[1.75rem]">Calculators for specific loans</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Each one uses the same math, with fields and explanations for that kind of loan.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loanTypes.map((page) => (
            <CardLink key={page.slug} href={`/${page.slug}`} title={page.h1}>
              {page.cardSummary}
            </CardLink>
          ))}
        </div>
      </Container>

      <Container className="mt-16">
        <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-[1.75rem]">Guides</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {guides.map((guide) => (
            <CardLink key={guide.slug} href={`/guides/${guide.slug}`} title={guide.title}>
              {guide.metaDescription}
            </CardLink>
          ))}
        </div>
      </Container>

      <Container className="mt-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-[1.75rem]">Frequently asked questions</h2>
          <div className="mt-6">
            <FaqList items={homeFaqs} />
          </div>
          <p className="mt-4 text-sm text-muted">
            More answers on the <Link href="/faq" className="link">FAQ page</Link>.
          </p>
        </div>
      </Container>

      <Container className="mt-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-accent-soft p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">Before you sign</h2>
          <p className="mt-2 leading-relaxed text-ink/85">
            Run every offer through the calculator using the same amount and term, then compare the APR and the total of
            payments, not only the monthly figure. When you’re ready, your lender’s official disclosure gives you the
            exact numbers.
          </p>
          <a href="#calculator" className="btn-primary mt-5">
            Back to the calculator
          </a>
        </div>
      </Container>
    </>
  );
}
