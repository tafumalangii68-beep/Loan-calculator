# LoanCalm — Loan Calculator & Planning

LoanCalm is a fast, private, SEO-focused loan calculator website built with Next.js (App Router), TypeScript and Tailwind CSS.

- Live loan calculator (results update as you type) with monthly payment, total interest, payoff time, extra-payment savings and a yearly/monthly amortization schedule.
- Header site search (Ctrl/⌘+K), hand-drawn SVG hero illustration, and loan category cards.
- Dedicated mortgage, auto, personal (with origination fee → APR) and student loan calculators.
- Three guides, FAQ, About, Contact, Privacy, Terms, Cookie Policy, Disclaimer and a custom 404 page.
- Cookie consent banner and settings dialog. Optional scripts load only after consent, and none are configured.
- Metadata, canonical URLs, Open Graph image, sitemap, robots.txt and Schema.org structured data.

There are **no environment variables, API keys, database or backend**. Every page is prerendered as static HTML, and the calculators run entirely in the browser.

## Requirements

- Node.js 20.9 or newer (developed on Node 26)
- npm

## Commands

```bash
npm install         # install dependencies
npm run dev         # start the dev server at http://localhost:3000
npm run build       # production build (prerenders all pages)
npm start           # serve the production build
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # unit tests for the loan math and validation (Node's built-in test runner)
```

## Before launch — required

1. **Domain:** set `url` in [`lib/site-config.ts`](lib/site-config.ts). It is currently the placeholder `https://www.loancalm.example`, which is used for canonical URLs, the sitemap, robots.txt and structured data.
2. **Contact email:** set `contactEmail` in `lib/site-config.ts`. Until you do, the Contact page shows a "coming soon" notice instead of an email address or form.
3. **Legal review:** have the Privacy Policy, Terms, Cookie Policy and Disclaimer reviewed for your jurisdiction. Optionally set `legal.governingLaw`. Update `legalUpdated` whenever the policies change.
4. **Hosting logs:** the Privacy Policy describes typical host request logs in general terms. Confirm it matches your host's actual practices.
5. **Source links:** the cited consumerfinance.gov and studentaid.gov pages block automated checks (they return HTTP 403 to scripts), so open each link in a browser once to confirm it works. They are in `data/loan-types.ts` and `data/guides.ts`.
6. Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console after deployment.

If you later add analytics, advertising or affiliate links, update `optionalServices` in the site config, the Privacy and Cookie policies, and the About page's "What we are not" section.

## Deployment

Any Node host that supports Next.js works, for example Vercel, Netlify or a Node server running `npm run build && npm start`. No configuration or secrets are needed. On Vercel: import the repository and deploy with the defaults.

## Project structure

```
app/                    Routes, layout, sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
  [slug]/page.tsx       The four loan-type calculator pages (static, from data/loan-types.ts)
                        /mortgage-calculator permanently redirects to /mortgage-loan-calculator (next.config.ts)
  guides/               Guide index and guide pages (from data/guides.ts)
components/             Calculator, result panel, amortization table, category cards, hero illustration,
                        header/footer, site search, cookie consent, breadcrumbs, FAQ, page shells
lib/
  loan-math.ts          Pure amortization math (payment, schedule, APR estimate) — unit tested
  loan-validation.ts    Input parsing and validation — unit tested
  calculator-presets.ts Fields and example values per calculator
  site-config.ts        Site name, domain, email, navigation  ← edit this
  seo.ts                Metadata and JSON-LD helpers
  consent.ts            Consent storage (localStorage key "lc-consent")
  search-index.ts       Static search index for the header search (built from data/)
data/                   Page content: loan types, guides, FAQs
types/                  Shared content types
tests/                  Unit tests
docs/keyword-map.md     Keyword-to-page map and internal-linking plan
```

### Common tasks

- **Edit page text:** change the files in `data/`. The worked-example tables and guide numbers are computed from `lib/loan-math.ts` at build time, so they always match the calculator.
- **Add a loan-type page:** add an entry to `data/loan-types.ts` (and a preset in `lib/calculator-presets.ts` if it needs different fields). Its route, sitemap entry and homepage card are generated automatically. Add it to `mainNav`/`footerNav` if wanted.
- **Add a guide:** add an entry to `data/guides.ts`, then add a footer link in `site-config.ts`.
- **Add an optional script:** set it in `siteConfig.optionalServices`. `components/optional-scripts.tsx` loads it only after the matching consent.

## Calculation method

Standard fixed-rate amortization with monthly compounding: `M = P·r(1+r)^n / ((1+r)^n − 1)`, where `r` is the annual rate ÷ 12. At 0% the payment is `P / n`. The schedule is built month by month, and extra payments are applied to principal. The APR estimate solves for the monthly rate at which the payments equal the loan amount minus the fee, then multiplies by 12. Lenders' figures can differ slightly because of rounding to the cent and daily interest accrual.
