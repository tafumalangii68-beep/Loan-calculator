import Link from "next/link";
import { ArrowRight, BadgeCheck, Calculator, Layers, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { LoanCalculator } from "@/components/loan-calculator";
import { HeroIllustration } from "@/components/hero-illustration";
import { LoanCategoryCards } from "@/components/loan-category-cards";
import { FaqList } from "@/components/faq-list";
import { CardLink, Container } from "@/components/content-blocks";
import { ScenarioTable } from "@/components/scenario-table";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/data/guides";
import { homeFaqs } from "@/data/faqs";
import { calculateLoan } from "@/lib/loan-math";
import { formatCurrency } from "@/lib/format";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";

// The layout's "%s | LoanCalm" template doesn't apply to the root page, so the brand is written out here.
const title = "Loan Calculator: Monthly Payment & Amortization | LoanCalm";
const description =
  "Free loan calculator from LoanCalm. Enter the amount, rate and term to see your monthly payment, total interest and a full amortization schedule. Private, no sign-up.";

export const metadata = buildMetadata({ title, description, path: "/", absoluteTitle: true });

const benefits = [
  { icon: BadgeCheck, title: "Accurate Results", text: "Standard amortization math, tested to the cent." },
  { icon: Zap, title: "Instant Calculations", text: "Results update as you type." },
  { icon: Sparkles, title: "100% Free to Use", text: "No sign-up, no fees, no catch." },
  { icon: Layers, title: "Multiple Loan Types", text: "Mortgage, auto, personal and student." },
];

// Worked example for the calculation guide, computed with the calculator's own code.
const example = calculateLoan(25_000, 7.5, 60);

function SectionHeading({ id, eyebrow, title, intro }: { id: string; eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-sm font-semibold tracking-wide text-accent uppercase">{eyebrow}</p>}
      <h2 id={id} className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-[2.25rem]">
        {title}
      </h2>
      {intro && <p className="mt-3 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={webPageJsonLd({ title, description, path: "/" })} />

      {/* Hero */}
      <Container className="pt-10 sm:pt-14">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Loan Calculator
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Calculate your monthly payment, total interest, and loan cost for any type of loan. Compare options and
              plan your finances with confidence.
            </p>
            <ul className="mt-8 grid max-w-xl grid-cols-2 gap-x-4 gap-y-4">
              {benefits.map(({ icon: Icon, title: t, text }) => (
                <li key={t} className="flex items-center gap-3 sm:items-start">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-sm leading-snug font-semibold text-ink sm:text-base">{t}</span>
                    <span className="hidden text-sm text-muted sm:block">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <HeroIllustration className="mx-auto hidden w-full max-w-lg md:block" />
        </div>
      </Container>

      {/* Calculator */}
      <Container className="mt-10 sm:mt-14">
        <div id="calculator" className="scroll-mt-24">
          <LoanCalculator />
        </div>
        <p className="mt-3 text-xs text-muted">
          Starting values are examples, not current rates. Replace them with the figures from your loan offer.
        </p>
      </Container>

      {/* Loan categories */}
      <Container className="mt-20">
        <section aria-labelledby="loan-types">
          <SectionHeading
            id="loan-types"
            eyebrow="Calculators"
            title="Choose your loan type"
            intro="Each calculator uses the same tested math, with fields and explanations made for that kind of loan."
          />
          <div className="mt-8">
            <LoanCategoryCards />
          </div>
        </section>
      </Container>

      {/* How it works */}
      <Container className="mt-20">
        <section aria-labelledby="how-it-works" className="rounded-3xl bg-beige px-6 py-12 sm:px-10">
          <SectionHeading id="how-it-works" eyebrow="How LoanCalm works" title="Three steps to a clear answer" />
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Enter your loan details",
                d: "Type the amount, the annual interest rate and the term from your loan offer. Switch between years and months.",
              },
              {
                t: "See your payment instantly",
                d: "Your monthly payment, total interest, total cost and payoff time update as you type — no button-mashing needed.",
              },
              {
                t: "Compare and plan",
                d: "Try a shorter term or an extra monthly payment, then open the amortization schedule to see every payment.",
              },
            ].map((step, i) => (
              <li key={step.t} className="rounded-2xl bg-white p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-accent font-serif text-lg font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.d}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      {/* Why use */}
      <Container className="mt-20">
        <section aria-labelledby="why">
          <SectionHeading id="why" eyebrow="Why use LoanCalm?" title="Built to be trusted, not to sell you a loan" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Calculator,
                t: "Transparent math",
                d: "Every result shows the formula and the numbers behind it, so you can check our work.",
              },
              {
                icon: ShieldCheck,
                t: "Private by design",
                d: "Calculations run in your browser. Nothing you type is sent to a server or saved.",
              },
              {
                icon: BadgeCheck,
                t: "No lender behind the numbers",
                d: "We’re not a lender or broker, and we don’t collect applications. Results are the same whoever you borrow from.",
              },
              {
                icon: Layers,
                t: "Made for comparing",
                d: "Compare terms, rates and extra payments side by side, with a full schedule for each option.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4 rounded-2xl border border-line bg-white p-6">
                <Icon aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <h3 className="font-semibold text-ink">{t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      {/* Understanding interest */}
      <Container className="mt-20">
        <section aria-labelledby="interest" className="mx-auto max-w-3xl">
          <SectionHeading id="interest" eyebrow="The basics" title="Understanding loan interest" />
          <div className="prose-content mt-6">
            <p>
              Interest is the price of borrowing. On an installment loan, the lender charges interest each month on the
              balance you still owe. Your fixed payment covers that month’s interest first, and the rest reduces the
              balance. Early on the balance is large, so more of each payment goes to interest. Later, more goes to
              principal.
            </p>
            <p>Three things decide how much interest you pay in total:</p>
            <ul>
              <li>
                <strong>The rate.</strong> A higher rate raises both the payment and the total cost.
              </li>
              <li>
                <strong>The term.</strong> A longer term lowers the monthly payment but means paying interest for
                longer.
              </li>
              <li>
                <strong>The amount.</strong> Every dollar borrowed earns interest until it’s repaid, so a larger down
                payment or extra principal payments reduce the total.
              </li>
            </ul>
            <p>Here’s the same $25,000 loan under four different rates and terms:</p>
            <ScenarioTable
              caption="How rate and term change the cost of a $25,000 loan"
              scenarios={[
                { label: "3 years at 7.5%", principal: 25_000, ratePercent: 7.5, termMonths: 36 },
                { label: "5 years at 7.5%", principal: 25_000, ratePercent: 7.5, termMonths: 60 },
                { label: "5 years at 10%", principal: 25_000, ratePercent: 10, termMonths: 60 },
                { label: "7 years at 10%", principal: 25_000, ratePercent: 10, termMonths: 84 },
              ]}
            />
            <p>
              The lowest monthly payment is rarely the cheapest loan. When comparing offers, also look at the APR, which
              includes fees as well as interest — our guide to{" "}
              <Link href="/guides/apr-vs-interest-rate">APR vs. interest rate</Link> explains the difference.
            </p>
          </div>
        </section>
      </Container>

      {/* Calculation guide */}
      <Container className="mt-20">
        <section aria-labelledby="guide" className="mx-auto max-w-3xl">
          <SectionHeading id="guide" eyebrow="Loan calculation guide" title="How the monthly payment is calculated" />
          <div className="prose-content mt-6">
            <p>LoanCalm uses the standard formula for a fixed-rate loan with monthly payments:</p>
            <p className="rounded-2xl border border-line bg-white px-5 py-5 text-center font-serif text-xl text-ink">
              Payment = P × r(1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1)
            </p>
            <h3>Step by step, for $25,000 at 7.5% over 5 years</h3>
            <ol>
              <li>
                <strong>P</strong>, the amount borrowed, is $25,000.
              </li>
              <li>
                <strong>r</strong>, the monthly rate, is 7.5% ÷ 12 = 0.625% (0.00625).
              </li>
              <li>
                <strong>n</strong>, the number of payments, is 5 × 12 = 60.
              </li>
              <li>
                Putting these into the formula gives a payment of <strong>{formatCurrency(example.scheduledPayment)}</strong>.
              </li>
              <li>
                Over 60 payments you pay {formatCurrency(example.totalPaid)} in total, so the interest is{" "}
                {formatCurrency(example.totalInterest)}.
              </li>
            </ol>
            <p>
              At a 0% rate the formula reduces to P ÷ n. Real lenders round to the cent and may accrue interest daily, so
              their figures can differ by a few cents. The calculator assumes a fixed rate and equal payments; it doesn’t
              model variable rates, balloon or interest-only loans. See the <Link href="/disclaimer">disclaimer</Link>{" "}
              for details.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {guides.map((guide) => (
              <CardLink key={guide.slug} href={`/guides/${guide.slug}`} title={guide.title}>
                {guide.intro.length > 110 ? `${guide.intro.slice(0, 107)}…` : guide.intro}
              </CardLink>
            ))}
          </div>
        </section>
      </Container>

      {/* FAQ */}
      <Container className="mt-20">
        <section aria-labelledby="faq" className="mx-auto max-w-3xl">
          <SectionHeading id="faq" eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-8">
            <FaqList items={homeFaqs} />
          </div>
          <p className="mt-4 text-sm text-muted">
            More answers on the{" "}
            <Link href="/faq" className="link">
              FAQ page
            </Link>
            .
          </p>
        </section>
      </Container>

      {/* Final CTA */}
      <Container className="mt-20">
        <section
          aria-labelledby="cta"
          className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-accent px-6 py-10 text-white sm:px-10 md:flex-row md:items-center"
        >
          <div className="max-w-xl">
            <h2 id="cta" className="font-serif text-3xl font-semibold tracking-tight">
              Plan your next loan with confidence
            </h2>
            <p className="mt-2 leading-relaxed text-white/80">
              Run each offer through the calculator with the same amount and term, then compare the APR and the total
              cost — not just the monthly payment.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#calculator"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
            >
              Calculate my loan
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
            <Link
              href="/guides"
              className="inline-flex h-12 items-center rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Read the guides
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
