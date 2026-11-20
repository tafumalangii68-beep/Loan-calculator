import Image from "next/image";
import Link from "next/link";
import { getCountryImage, IMAGE_HEIGHT, IMAGE_WIDTH } from "@/lib/images";
import { ArrowRight, Info } from "lucide-react";
import {
  countries,
  countryH1Name,
  countryInSentence,
  CURRENCIES,
  type Country,
} from "@/data/countries";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { makeMoney } from "@/lib/money";
import { countryScenarios } from "@/lib/country-presets";
import { getExchangeRates } from "@/lib/exchange-rates";
import { guides } from "@/data/guides";
import { exampleScaleFor } from "@/lib/exchange-rates-core";
import { Breadcrumbs } from "./breadcrumbs";
import { Container, guideAutoLinks, linkify } from "./content-blocks";
import { CountryCalculator } from "./country-calculator";
import { CountryCards } from "./country-cards";
import { FaqList } from "./faq-list";
import { Flag } from "./flag";
import { GuideCards } from "./guide-cards";
import { JsonLd } from "./json-ld";
import { ScenarioTable } from "./scenario-table";

const rateFormat = new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 6 });
const rateDateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" });
const formatRateDate = (isoDate: string) => rateDateFormat.format(new Date(`${isoDate}T00:00:00Z`));

function copy(country: Country) {
  const where = countryInSentence(country);
  const h1Name = countryH1Name(country);
  const currency = CURRENCIES[country.currency];
  const money = makeMoney({ code: country.currency, locale: country.locale });
  return { where, h1Name, currency, money };
}

export function countryMetadata(country: Country) {
  const { where, h1Name, currency } = copy(country);
  return buildMetadata({
    title: `${h1Name} Loan Calculator (${country.currency}): Mortgage, Car & Personal Loans`,
    description: `Free loan calculator for ${where} in ${currency.name} (${country.currency}). Work out monthly, fortnightly or weekly repayments, total interest and an amortization schedule, and see how the ${country.aprShort} works.`,
    path: `/${country.slug}`,
  });
}

function countryFaqs(country: Country) {
  const { where, currency, money } = copy(country);
  return [
    {
      question: `What is the ${country.aprShort} on a loan in ${where}?`,
      answer: `The ${country.aprTerm} is the yearly cost of a loan including interest and compulsory fees, so it is usually higher than the nominal rate. Lenders in ${where} disclose it so that offers can be compared on the same basis. Enter the nominal rate in this calculator and use the ${country.aprShort} to compare offers.`,
    },
    {
      question: `Which currency does this calculator use for ${where}?`,
      answer: `Amounts are in ${currency.name} (${country.currency}) and are written the way they usually are in ${where}, for example ${money.format(1234.5)}. You can type amounts and rates with either a comma or a full stop as the decimal separator.`,
    },
    {
      question: `Are the interest rates on this page current rates in ${where}?`,
      answer: `No. The starting values are examples that show how the calculator works. Real rates depend on the lender, the type of loan and your circumstances, so enter the rate from your own offer.`,
    },
    {
      question: `Who supervises lenders in ${where}?`,
      answer: `${country.regulator}. ${siteConfig.name} is an independent calculator: it is not a lender or broker, does not offer loans and cannot guarantee that any loan will be approved.`,
    },
  ];
}

export async function CountryPage({ country }: { country: Country }) {
  const { where, h1Name, currency, money } = copy(country);
  // Example amounts follow the latest ECB rate; typed amounts and the formula never do.
  const rates = await getExchangeRates();
  const example = exampleScaleFor(country.currency, currency.exampleScale, rates);
  const path = `/${country.slug}`;
  const meta = countryMetadata(country);
  const title = `${h1Name} Loan Calculator`;
  const description = String(meta.description);
  const faqs = countryFaqs(country);
  const neighbours = countries.filter((c) => c.region === country.region && c.slug !== country.slug).slice(0, 8);
  const scenarios = countryScenarios(example.scale);
  const image = getCountryImage(country.slug, country.region);
  // Articles that list this country's calculator as related, country-specific ones first.
  const countryGuides = guides
    .filter((g) => g.relatedCalculators.includes(path))
    .sort((a, b) => a.relatedCalculators.indexOf(path) - b.relatedCalculators.indexOf(path));
  // Contextual links to the European guides, each linked once per page.
  const linked = new Set<string>();

  const facts = [
    { label: "Currency", value: `${currency.name} (${country.currency}, ${money.symbol})` },
    { label: "Written as", value: money.format(250000) },
    { label: "Cost of credit shown as", value: country.aprTerm },
    ...(example.source === "ecb"
      ? [
          {
            label: "Exchange rate",
            value: `1 EUR = ${rateFormat.format(example.scale)} ${country.currency} (ECB, ${formatRateDate(example.date!)})`,
          },
        ]
      : []),
    { label: "Supervisor", value: country.regulator },
    { label: "Status", value: country.status },
  ];

  return (
    <>
      <JsonLd data={webPageJsonLd({ title, description, path })} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: `${siteConfig.name} ${title}`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any (web browser)",
          url: absoluteUrl(path),
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: country.currency },
        }}
      />

      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Countries", path: "/countries" },
            { name: country.name, path },
          ]}
        />

        {/* Hero */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              <Flag code={country.code} className="h-3.5 w-auto" />
              {country.region}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{country.intro}</p>
            {image && (
              <Image
                src={image.src}
                alt={image.alt}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                className="mt-6 hidden h-auto w-full rounded-3xl border border-line sm:block"
              />
            )}
          </div>
          <aside aria-labelledby="at-a-glance" className="rounded-3xl border border-line bg-white p-6">
            <div className="flex items-center gap-3">
              <Flag code={country.code} className="h-9 w-auto" />
              <h2 id="at-a-glance" className="font-serif text-xl font-semibold text-ink">
                {country.name} at a glance
              </h2>
            </div>
            <dl className="mt-4 divide-y divide-line text-sm">
              {facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 py-2.5">
                  <dt className="text-muted">{fact.label}</dt>
                  <dd className="font-medium break-words text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {country.codeNote && <p className="mt-3 text-xs leading-relaxed text-muted">{country.codeNote}</p>}
          </aside>
        </div>

        {/* Calculator */}
        <section aria-labelledby="calculator-heading" className="mt-12">
          <h2 id="calculator-heading" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Calculate your repayments in {country.currency}
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Choose a loan type, then enter the amount, the nominal annual rate from your offer and the term.
          </p>
          <div id="calculator" className="mt-6 scroll-mt-24">
            <CountryCalculator
              config={{
                currency: { code: country.currency, locale: country.locale },
                exampleScale: example.scale,
                aprShort: country.aprShort,
              }}
            />
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <Info aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            Starting values are examples only, not current {country.name} rates. Replace them with the figures from your
            loan offer.
            {example.source === "ecb" &&
              ` Example amounts are converted from euro examples at the ECB reference rate of ${formatRateDate(example.date!)} and update daily; amounts you enter are never converted.`}
          </p>
        </section>
      </Container>

      {/* Country guide */}
      <Container className="mt-16">
        <div className="prose-content mx-auto max-w-3xl">
          <section aria-labelledby="how-loans-work">
            <h2 id="how-loans-work">How loans work in {where}</h2>
            <ul>
              {country.notes.map((note) => (
                <li key={note.slice(0, 40)}>{linkify(note, linked, guideAutoLinks)}</li>
              ))}
            </ul>
            {countryGuides.length > 0 && (
              <>
                <h3>Guides for {where}</h3>
                <ul>
                  {countryGuides.map((g) => (
                    <li key={g.slug}>
                      <Link href={`/guides/${g.slug}`}>{g.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section aria-labelledby="key-terms">
            <h2 id="key-terms">Key loan terms in {where}</h2>
            <dl className="not-prose mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
              {country.terms.map((t) => (
                <div key={t.term} className="px-5 py-4">
                  <dt className="font-semibold text-ink">{t.term}</dt>
                  <dd className="mt-1 leading-relaxed text-muted">{linkify(t.meaning, linked, guideAutoLinks)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="comparing">
            <h2 id="comparing">Comparing offers with the {country.aprShort}</h2>
            <p>
              The nominal rate sets your instalment, but the {country.aprTerm} also counts compulsory fees, so it is the
              better figure for comparing offers. If an offer has an arrangement fee, enter it on the personal or
              business loan tab: the calculator then shows an estimated {country.aprShort}, worked out as an effective
              annual rate in the way the APRC is calculated in the EU and the UK. Local disclosure rules can differ, so
              treat it as an estimate and rely on the figure in your offer.
            </p>
            <p>
              See <Link href="/guides/apr-names-in-europe">what the APR is called across Europe</Link>, whether a{" "}
              <Link href="/guides/fixed-vs-variable-rates-europe">fixed or variable rate</Link> suits you, and{" "}
              <Link href="/guides/how-loan-amortization-works">how amortization works</Link> to read the schedule.
            </p>
          </section>

          <section aria-labelledby="worked-examples">
            <h2 id="worked-examples">Worked examples in {currency.name === "euro" ? "euros" : country.currency}</h2>
            <p>
              The same maths as the calculator, using illustrative rates to show how the rate and the term change the
              cost. They are not current rates in {where}.
            </p>
            <ScenarioTable
              scenarios={scenarios}
              caption={`Example loans in ${country.currency}`}
              currency={{ code: country.currency, locale: country.locale }}
              paymentLabel="Monthly repayment"
            />
            <p>
              A one-point higher rate raises both the repayment and the total interest, while a shorter term raises the
              repayment but cuts the interest. Paying extra each month has a similar effect; see{" "}
              <Link href="/guides/extra-loan-payments">how extra payments reduce interest</Link>.
            </p>
          </section>

          <section aria-labelledby="faq">
            <h2 id="faq">{country.name} loan questions</h2>
            <div className="not-prose mt-4">
              <FaqList items={faqs} />
            </div>
          </section>
        </div>
      </Container>

      {/* Related */}
      {neighbours.length > 0 && (
        <Container className="mt-16">
          <section aria-labelledby="nearby">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="nearby" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                More calculators in {country.region}
              </h2>
              <Link href="/countries" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                All countries
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="mt-6">
              <CountryCards items={neighbours} />
            </div>
          </section>
        </Container>
      )}

      <Container className="mt-16">
        <section aria-labelledby="from-the-blog">
          <h2 id="from-the-blog" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            From the blog
          </h2>
          <div className="mt-6">
            <GuideCards />
          </div>
        </section>
      </Container>
    </>
  );
}
