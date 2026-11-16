import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/content-blocks";
import { CountryCards } from "@/components/country-cards";
import { CountrySelector } from "@/components/country-selector";
import { JsonLd } from "@/components/json-ld";
import { countries, countriesByName, REGIONS, selectorCountries } from "@/data/countries";
import { slugify } from "@/components/content-blocks";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

const title = "Loan Calculators for European Countries";
const description = `Loan calculators for ${countries.length} European countries, each in the local currency with the local name for the APR, worked examples and country-specific guidance.`;

export const metadata = buildMetadata({ title, description, path: "/countries" });

export default function CountriesPage() {
  const currencies = new Set(countries.map((c) => c.currency));

  return (
    <Container className="pt-8">
      <JsonLd data={webPageJsonLd({ title, description, path: "/countries" })} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: title,
          numberOfItems: countries.length,
          itemListElement: countriesByName.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${c.name} loan calculator`,
            url: absoluteUrl(`/${c.slug}`),
          })),
        }}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Countries", path: "/countries" },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Loan calculators across Europe
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {countries.length} countries and {currencies.size} currencies. Each page uses the local currency and number
            format, explains how loans are quoted there and lets you calculate mortgage, personal, car, student and
            business loan repayments.
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
          <CountrySelector countries={selectorCountries()} />
        </div>
      </div>

      {REGIONS.map((region) => {
        const items = countriesByName.filter((c) => c.region === region);
        return (
          <section key={region} aria-labelledby={slugify(region)} className="mt-14">
            <h2 id={slugify(region)} className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {region}
            </h2>
            <div className="mt-5">
              <CountryCards items={items} />
            </div>
          </section>
        );
      })}

      <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
        Country pages explain local terms and conventions in general. They do not show current market rates, and{" "}
        LoanCalm is not a lender or broker. Kosovo is listed with the code XK, a user-assigned code used by
        international organisations because Kosovo has no official ISO 3166 code.
      </p>
    </Container>
  );
}
