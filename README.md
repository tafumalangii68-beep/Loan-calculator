# LoanCalm

**Loan Calculator & Planning** — a fast, private, SEO-focused loan calculator website built with Next.js (App Router), TypeScript and Tailwind CSS.

LoanCalm has **no environment variables, API keys, database or backend**. Every page is prerendered as static HTML, and all calculations run in the visitor's browser.

## Features

- **Loan calculator** with live results: monthly payment, total interest, total payments, payoff duration and extra-payment savings.
- **Amortization schedule** (monthly or yearly view) with a totals row, in a section you can expand and collapse.
- **Dedicated calculators** for mortgage, auto, personal (origination fee → estimated APR) and student loans.
- **Site search** in the header (Ctrl/⌘ + K), built from the site's own content.
- **Content pages:** three guides, FAQ, About, Contact, Privacy Policy, Terms and Conditions, Cookie Policy, Disclaimer and a custom 404 page.
- **Cookie consent** banner and settings dialog. Optional scripts load only after consent, and none are configured.
- **SEO:** unique metadata, canonical URLs, Open Graph image, sitemap, robots.txt, breadcrumbs and Schema.org structured data.

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
npm test            # unit tests for the loan math and validation
```

## Before launch

1. **Domain:** set `url` in [`lib/site-config.ts`](lib/site-config.ts). It is currently the placeholder `https://www.loancalm.example`, which is used for canonical URLs, the sitemap, robots.txt and structured data.
2. **Contact email:** set `contactEmail` in `lib/site-config.ts`. Until you do, the Contact page shows a "coming soon" notice instead of an email address or form.
3. **Legal review:** have the Privacy Policy, Terms, Cookie Policy and Disclaimer reviewed for your jurisdiction. Optionally set `legal.governingLaw`, and update `legalUpdated` whenever the policies change.
4. **Hosting logs:** the Privacy Policy describes typical host request logs in general terms. Confirm it matches your host's actual practices.
5. **Source links:** the cited consumerfinance.gov and studentaid.gov pages block automated checks (HTTP 403), so open each link in a browser once to confirm it works. They are in `data/loan-types.ts` and `data/guides.ts`.
6. **Search Console:** after deployment, submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console.

If you later add analytics, advertising or affiliate links, also update `optionalServices` in `lib/site-config.ts`, the Privacy and Cookie policies, and the "What we are not" section of the About page.

## Deployment

LoanCalm runs on any host that supports Next.js, such as Vercel, Netlify or a Node server running `npm run build && npm start`. No configuration or secrets are needed. On Vercel, import the repository and deploy with the default settings.

## Project structure

```text
app/                      Routes, layout, sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
  [slug]/page.tsx         The four loan-type calculator pages (from data/loan-types.ts)
  guides/                 Guide index and guide pages (from data/guides.ts)
components/               Calculator, result panel, amortization table, category cards,
                          hero illustration, header, footer, site search, cookie consent,
                          breadcrumbs, FAQ accordion, page layouts
lib/
  site-config.ts          Brand name, domain, contact email, navigation  <- edit this
  loan-math.ts            Amortization math (payment, schedule, APR estimate), unit tested
  loan-validation.ts      Input parsing and validation, unit tested
  calculator-presets.ts   Fields and example values for each calculator
  search-index.ts         Static index for the header search
  seo.ts                  Metadata and JSON-LD helpers
  consent.ts              Consent storage (localStorage key "lc-consent")
data/                     Page content: loan types, guides, FAQs
types/                    Shared content types
tests/                    Unit tests
docs/keyword-map.md       Keyword-to-page map and internal-linking plan
```

`/mortgage-calculator` permanently redirects to `/mortgage-loan-calculator` (see `next.config.ts`).

## Brand

Colors are defined once as Tailwind theme tokens in [`app/globals.css`](app/globals.css):

| Token | Color | Use |
|---|---|---|
| `paper` | `#FAF8F5` | Page background |
| `accent` | `#205C40` | Primary forest green |
| `sage` | `#759879` | Secondary green (decorative only; too light for text) |
| `accent-soft` | `#E9F0E4` | Pale green panels |
| `beige` | `#F3EEE5` | Warm beige sections |
| `line` | `#E5DFD6` | Borders |
| `ink` | `#252522` | Main text |
| `muted` | `#68645E` | Secondary text |

Headings use Newsreader (serif) and body text uses Inter. Both are self-hosted through `next/font`.

## Common tasks

- **Edit page text:** change the files in `data/`. The worked examples are computed from `lib/loan-math.ts` at build time, so they always match the calculator.
- **Add a loan-type page:** add an entry to `data/loan-types.ts` (and a preset in `lib/calculator-presets.ts` if it needs different fields). Its route, sitemap entry and search entry are generated automatically. Add a card in `components/loan-category-cards.tsx` and links in `mainNav`/`footerNav` in `lib/site-config.ts`.
- **Add a guide:** add an entry to `data/guides.ts`, then a footer link in `lib/site-config.ts`.
- **Add an optional script:** set it in `siteConfig.optionalServices`. `components/optional-scripts.tsx` loads it only after the matching consent.

## Calculation method

LoanCalm uses standard fixed-rate amortization with monthly compounding:

```text
M = P × r(1 + r)^n / ((1 + r)^n − 1)
```

where `P` is the amount borrowed, `r` is the annual rate ÷ 12 and `n` is the number of monthly payments. At 0% the payment is `P / n`. The schedule is built month by month, with extra payments applied to principal. The APR estimate finds the monthly rate at which the payments equal the loan amount minus the fee, then multiplies by 12. Lenders' figures can differ slightly because of rounding to the cent and daily interest accrual.
