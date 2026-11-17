/**
 * European countries supported by the country calculators. This is the single
 * place to add or edit a country: the selector, the /countries index, the
 * country pages, the sitemap and the search index all read from it.
 *
 * Content rules: describe how loans are quoted and structured in each
 * country, in hedged, durable terms. Never state current market rates.
 *
 * No imports, so it can be unit tested directly with Node.
 */

export type Region =
  | "Western Europe"
  | "Northern Europe"
  | "Southern Europe"
  | "Central and Eastern Europe"
  | "Southeast Europe";

export const REGIONS: Region[] = [
  "Western Europe",
  "Northern Europe",
  "Southern Europe",
  "Central and Eastern Europe",
  "Southeast Europe",
];

export interface LoanTerm {
  term: string;
  meaning: string;
}

export interface Country {
  /** ISO 3166-1 alpha-2 code. Kosovo uses XK, a user-assigned code (see `codeNote`). */
  code: string;
  codeNote?: string;
  /** URL segment: /uk, /de, … (the UK uses "uk" rather than its ISO code "gb") */
  slug: string;
  name: string;
  /** Name inside a sentence, e.g. "the United Kingdom" */
  inSentence?: string;
  /** Name used in the H1, e.g. "UK" */
  h1Name?: string;
  /** Emoji flag (the pages render image flags from /public/flags) */
  flag: string;
  /** ISO 4217 currency code */
  currency: string;
  /** BCP 47 locale for number and currency formatting */
  locale: string;
  region: Region;
  /** Short status line, e.g. "EU member · euro since 2002" */
  status: string;
  /** Local name of the annual percentage rate of charge */
  aprTerm: string;
  /** Short form of `aprTerm`, used in labels, e.g. "TAEG" */
  aprShort: string;
  regulator: string;
  intro: string;
  notes: string[];
  terms: LoanTerm[];
  /** Shown in the "Loan Calculators Across Europe" section on the homepage */
  featured?: boolean;
}

export interface CurrencyInfo {
  name: string;
  /**
   * Fallback size of one euro in this currency, used only to scale the example
   * amounts in the calculators. Country pages use the latest ECB reference
   * rate instead when the ECB publishes one (lib/exchange-rates.ts); this value
   * applies to currencies the ECB doesn't cover, or if no rate is available.
   */
  exampleScale: number;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  EUR: { name: "euro", exampleScale: 1 },
  GBP: { name: "pound sterling", exampleScale: 1 },
  CHF: { name: "Swiss franc", exampleScale: 1 },
  SEK: { name: "Swedish krona", exampleScale: 10 },
  NOK: { name: "Norwegian krone", exampleScale: 10 },
  DKK: { name: "Danish krone", exampleScale: 7.5 },
  ISK: { name: "Icelandic króna", exampleScale: 150 },
  PLN: { name: "Polish złoty", exampleScale: 4 },
  CZK: { name: "Czech koruna", exampleScale: 25 },
  RON: { name: "Romanian leu", exampleScale: 5 },
  HUF: { name: "Hungarian forint", exampleScale: 400 },
  UAH: { name: "Ukrainian hryvnia", exampleScale: 45 },
  RUB: { name: "Russian rouble", exampleScale: 100 },
  BYN: { name: "Belarusian rouble", exampleScale: 3.5 },
  MDL: { name: "Moldovan leu", exampleScale: 20 },
  RSD: { name: "Serbian dinar", exampleScale: 120 },
  MKD: { name: "Macedonian denar", exampleScale: 60 },
  ALL: { name: "Albanian lek", exampleScale: 100 },
  // Fixed to the euro by a currency board.
  BAM: { name: "convertible mark", exampleScale: 1.95583 },
  TRY: { name: "Turkish lira", exampleScale: 45 },
};

export const countries: Country[] = [
  {
    code: "GB",
    slug: "uk",
    name: "United Kingdom",
    inSentence: "the United Kingdom",
    h1Name: "UK",
    flag: "🇬🇧",
    currency: "GBP",
    locale: "en-GB",
    region: "Western Europe",
    status: "Not in the EU · pound sterling",
    aprTerm: "APR (annual percentage rate)",
    aprShort: "APR",
    regulator: "Financial Conduct Authority (FCA)",
    intro:
      "In the UK, loans are priced in pounds sterling and lenders must show an APR, so offers can be compared on the same basis. This page uses UK wording: a deposit rather than a down payment, and repayments rather than payments.",
    notes: [
      "Many UK mortgages start with a fixed or tracker deal, often for two or five years. When the deal ends the rate usually moves to the lender's standard variable rate (SVR) unless you remortgage.",
      "Adverts for personal loans and credit show a representative APR: at least 51% of successful applicants must get that rate or better, so the rate you are offered can be higher.",
      "Student loans from the Student Loans Company are repaid as a share of income above a threshold, not on a fixed schedule. Use the student tab only for private or bank loans with fixed instalments.",
    ],
    terms: [
      { term: "LTV (loan-to-value)", meaning: "The mortgage as a percentage of the property value. A lower LTV usually unlocks better rates." },
      { term: "ERC (early repayment charge)", meaning: "A fee for repaying or switching a mortgage during its initial deal period." },
      { term: "SVR (standard variable rate)", meaning: "The lender's own variable rate that applies after an introductory deal ends." },
    ],
    featured: true,
  },
  {
    code: "DE",
    slug: "de",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    locale: "de-DE",
    region: "Western Europe",
    status: "EU member · euro since 1999",
    aprTerm: "effektiver Jahreszins (effective annual rate)",
    aprShort: "effektiver Jahreszins",
    regulator: "BaFin (Federal Financial Supervisory Authority)",
    intro:
      "German lenders quote the Sollzins, the nominal rate that sets your instalment, and the effektiver Jahreszins, which adds most compulsory costs and is the figure to compare. Home loans are usually Annuitätendarlehen: equal instalments in which the share of Tilgung (repayment) grows over time, exactly as this calculator models.",
    notes: [
      "Fixed-rate periods (Zinsbindung) of ten years or more are common for mortgages. Ten years after full disbursement, borrowers have a statutory right to give notice and repay (§ 489 BGB).",
      "Mortgages are often described by their initial repayment rate (anfängliche Tilgung), for example 2% a year. A higher Tilgung shortens the term; enter the resulting term here to compare.",
      "Repaying early during a fixed-rate period can trigger a Vorfälligkeitsentschädigung (prepayment compensation). Many contracts allow yearly Sondertilgungen (special repayments) up to an agreed amount.",
    ],
    terms: [
      { term: "Sollzins", meaning: "The nominal annual rate used to work out the instalment. Enter this rate in the calculator." },
      { term: "Zinsbindung", meaning: "The period for which the rate is fixed. After it ends, the remaining debt is refinanced at a new rate." },
      { term: "Restschuld", meaning: "The balance still owed at the end of the fixed-rate period, shown in the yearly schedule here." },
    ],
    featured: true,
  },
  {
    code: "FR",
    slug: "fr",
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    locale: "fr-FR",
    region: "Western Europe",
    status: "EU member · euro since 1999",
    aprTerm: "TAEG (taux annuel effectif global)",
    aprShort: "TAEG",
    regulator: "ACPR (Autorité de contrôle prudentiel et de résolution), part of the Banque de France",
    intro:
      "In France the key comparison figure is the TAEG (taux annuel effectif global), which includes interest, fees and compulsory borrower insurance. The taux débiteur, or nominal rate, sets the instalment itself, and that is the rate to enter in the calculator.",
    notes: [
      "Most French home loans (prêts immobiliers) are fixed-rate for the whole term.",
      "Borrower insurance (assurance emprunteur) is usually required for a mortgage and can add noticeably to the cost. It is included in the TAEG, but not in this calculator's repayment unless you add it.",
      "The TAEG cannot exceed the taux d'usure, a legal ceiling published by the Banque de France for each type of loan. Under HCSF rules, lenders generally keep the debt-to-income ratio (taux d'endettement) at or below 35%.",
    ],
    terms: [
      { term: "Taux débiteur", meaning: "The nominal annual rate charged on the balance. It determines the monthly instalment." },
      { term: "Assurance emprunteur", meaning: "Borrower insurance covering death and disability, usually a condition of a home loan." },
      { term: "Frais de dossier", meaning: "The arrangement fee charged by the bank to set up the loan. It is included in the TAEG." },
    ],
    featured: true,
  },
  {
    code: "IT",
    slug: "it",
    name: "Italy",
    flag: "🇮🇹",
    currency: "EUR",
    locale: "it-IT",
    region: "Southern Europe",
    status: "EU member · euro since 1999",
    aprTerm: "TAEG (tasso annuo effettivo globale)",
    aprShort: "TAEG",
    regulator: "Banca d'Italia",
    intro:
      "Italian loan offers show the TAN (tasso annuo nominale), the rate that sets your instalment, and the TAEG (tasso annuo effettivo globale), which adds compulsory costs. Enter the TAN here and compare offers on the TAEG.",
    notes: [
      "Mortgages (mutui) can be fixed (tasso fisso) or variable (tasso variabile). Variable rates are usually Euribor plus a spread.",
      "Individuals can repay a home-purchase mortgage early without a penalty and move it to another bank through surroga (portability) at no cost, under the 2007 Bersani reforms.",
      "Cessione del quinto is a salary- or pension-backed loan: instalments of up to one fifth of net pay are deducted directly by the employer or pension provider.",
    ],
    terms: [
      { term: "TAN", meaning: "Tasso annuo nominale: the nominal annual rate used to calculate the instalment." },
      { term: "Spread", meaning: "The bank's margin added to Euribor on a variable-rate mortgage." },
      { term: "Surroga", meaning: "Moving a mortgage to another bank to get better terms, without extra costs for the borrower." },
    ],
    featured: true,
  },
  {
    code: "ES",
    slug: "es",
    name: "Spain",
    flag: "🇪🇸",
    currency: "EUR",
    locale: "es-ES",
    region: "Southern Europe",
    status: "EU member · euro since 1999",
    aprTerm: "TAE (tasa anual equivalente)",
    aprShort: "TAE",
    regulator: "Banco de España",
    intro:
      "Spanish lenders show the TIN (tipo de interés nominal), which determines the instalment, and the TAE (tasa anual equivalente), which also reflects fees and how often you pay. Enter the TIN here and compare offers using the TAE.",
    notes: [
      "Mortgages (hipotecas) can be fixed (fija), variable or mixed. Variable rates are typically Euribor, usually the 12-month rate, plus a margin called the diferencial.",
      "Under the 2019 mortgage credit law (Ley 5/2019), fees for early repayment or switching are capped, with different limits for fixed and variable rates.",
      "Banks often lower the diferencial in exchange for bonificaciones: linked products such as paying in your salary or taking out insurance. The TAE shows whether the discount is worth the extra cost.",
    ],
    terms: [
      { term: "TIN", meaning: "Tipo de interés nominal: the nominal annual rate used for the instalment." },
      { term: "Diferencial", meaning: "The fixed margin added to Euribor on a variable-rate mortgage." },
      { term: "Amortización anticipada", meaning: "Repaying all or part of the loan early, which may carry a capped fee." },
    ],
    featured: true,
  },
  {
    code: "NL",
    slug: "nl",
    name: "Netherlands",
    inSentence: "the Netherlands",
    flag: "🇳🇱",
    currency: "EUR",
    locale: "nl-NL",
    region: "Western Europe",
    status: "EU member · euro since 1999",
    aprTerm: "JKP (jaarlijks kostenpercentage)",
    aprShort: "JKP",
    regulator: "AFM (Netherlands Authority for the Financial Markets)",
    intro:
      "Dutch lenders must show the JKP (jaarlijks kostenpercentage), the annual cost percentage including fees. For mortgages the main choice is between the annuity mortgage (annuïteitenhypotheek), which this calculator models, and the linear mortgage (lineaire hypotheek), where you repay the same amount of principal each month.",
    notes: [
      "Mortgage interest on an owner-occupied home is generally only tax-deductible (hypotheekrenteaftrek) if the loan is repaid in full within 30 years on an annuity or linear basis.",
      "Rates are fixed for a chosen period (rentevaste periode), commonly ten years or more. When it ends, the lender offers a new rate.",
      "The Nationale Hypotheek Garantie (NHG) is a guarantee available for homes up to a price limit. It can lower the rate and protect against residual debt in some situations.",
    ],
    terms: [
      { term: "Annuïteitenhypotheek", meaning: "A mortgage with equal gross monthly payments; the interest share falls over time." },
      { term: "Rentevaste periode", meaning: "The period for which the mortgage rate is fixed." },
      { term: "Boetevrij aflossen", meaning: "The amount you may repay early each year without a penalty, as agreed in the contract." },
    ],
    featured: true,
  },
  {
    code: "BE",
    slug: "be",
    name: "Belgium",
    flag: "🇧🇪",
    currency: "EUR",
    locale: "nl-BE",
    region: "Western Europe",
    status: "EU member · euro since 1999",
    aprTerm: "JKP (jaarlijks kostenpercentage) / TAEG (taux annuel effectif global)",
    aprShort: "JKP/TAEG",
    regulator: "FSMA and the National Bank of Belgium (NBB)",
    intro:
      "Belgian credit offers show the annual percentage rate of charge as the JKP (jaarlijks kostenpercentage) in Dutch or the TAEG (taux annuel effectif global) in French, and you may see both on the same document.",
    notes: [
      "Belgian law limits how often and how far the rate on a variable-rate mortgage can change. Variable formulas are often written like 10/5/5, describing how long the first rate lasts and how often it can be reviewed.",
      "If you repay a mortgage early, the penalty (wederbeleggingsvergoeding / indemnité de remploi) is limited by law to three months' interest on the amount repaid.",
      "Maximum annual percentage rates for consumer credit are set by regulation, so the cost of consumer loans is capped.",
    ],
    terms: [
      { term: "Woonkrediet / crédit hypothécaire", meaning: "A mortgage loan secured on a home." },
      { term: "Wederbeleggingsvergoeding / indemnité de remploi", meaning: "The capped penalty for repaying a mortgage early." },
      { term: "JKP / TAEG", meaning: "The annual percentage rate of charge, including interest and compulsory costs." },
    ],
  },
  {
    code: "CH",
    slug: "ch",
    name: "Switzerland",
    flag: "🇨🇭",
    currency: "CHF",
    locale: "de-CH",
    region: "Western Europe",
    status: "Not in the EU · Swiss franc",
    aprTerm: "effektiver Jahreszins / taux annuel effectif (effective annual rate)",
    aprShort: "effective annual rate",
    regulator: "FINMA (Swiss Financial Market Supervisory Authority)",
    intro:
      "Swiss loans are in Swiss francs (CHF). Consumer credit offers state the effective annual rate, and the Federal Consumer Credit Act sets a maximum rate that lenders may charge on consumer loans.",
    notes: [
      "Mortgages (Hypotheken) are commonly fixed-rate for several years (Festhypothek) or SARON mortgages that move with the Swiss Average Rate Overnight.",
      "Swiss mortgages are often not repaid in full. Borrowers typically need at least 20% equity and must pay down the portion above two-thirds of the property value, usually within 15 years; some do so indirectly through a pillar 3a pension account.",
      "Because the main part of a mortgage may never be amortized, use this calculator for the part you plan to repay, or for consumer and car loans.",
    ],
    terms: [
      { term: "Festhypothek", meaning: "A mortgage with a rate fixed for an agreed number of years." },
      { term: "SARON-Hypothek", meaning: "A variable mortgage priced at the SARON reference rate plus a margin." },
      { term: "Tragbarkeit", meaning: "The affordability check banks run, using a notional rate higher than current rates." },
    ],
    featured: true,
  },
  {
    code: "AT",
    slug: "at",
    name: "Austria",
    flag: "🇦🇹",
    currency: "EUR",
    locale: "de-AT",
    region: "Western Europe",
    status: "EU member · euro since 1999",
    aprTerm: "effektiver Jahreszins (effective annual rate)",
    aprShort: "effektiver Jahreszins",
    regulator: "FMA (Austrian Financial Market Authority)",
    intro:
      "Austrian banks quote the Sollzinssatz (nominal rate) and the effektiver Jahreszins, which includes fees and charges. Housing loans (Wohnkredite) are typically paid off in equal monthly instalments, as modelled here.",
    notes: [
      "Both variable-rate loans, usually linked to Euribor, and fixed-rate loans are offered. Fixed-rate periods have become more common for housing loans.",
      "Registering a mortgage in the land register (Grundbuch) involves fees on top of the loan. If you finance them, include them in the amount.",
      "Foreign-currency loans, such as Swiss franc loans, were once popular in Austria. They are now generally discouraged for consumers because of exchange-rate risk.",
    ],
    terms: [
      { term: "Sollzinssatz", meaning: "The nominal annual rate used for the instalment." },
      { term: "Fixzinssatz / variabler Zinssatz", meaning: "A rate fixed for an agreed period, or one that moves with a reference rate such as Euribor." },
      { term: "Bearbeitungsgebühr", meaning: "A processing fee charged when the loan is set up. It is included in the effective rate." },
    ],
    featured: true,
  },
  {
    code: "SE",
    slug: "se",
    name: "Sweden",
    flag: "🇸🇪",
    currency: "SEK",
    locale: "sv-SE",
    region: "Northern Europe",
    status: "EU member · Swedish krona",
    aprTerm: "effektiv ränta (effective interest rate)",
    aprShort: "effektiv ränta",
    regulator: "Finansinspektionen",
    intro:
      "In Sweden loans are in Swedish kronor (SEK). Lenders must show the effektiv ränta, the effective annual rate including fees, alongside the nominal rate (nominell ränta).",
    notes: [
      "Many Swedish mortgages (bolån) have a variable rate that is reset every three months, while others are fixed for one to ten years (bindningstid).",
      "An amortization requirement (amorteringskrav) obliges many mortgage borrowers to repay a minimum share of the loan each year, depending on the loan-to-value ratio and the size of the debt relative to income.",
      "Part of the interest you pay can be deducted against tax (ränteavdrag). This calculator shows the cost before any tax deduction.",
    ],
    terms: [
      { term: "Nominell ränta", meaning: "The nominal annual rate. Enter this in the calculator." },
      { term: "Bindningstid", meaning: "How long the mortgage rate is fixed, from three months to several years." },
      { term: "Amorteringskrav", meaning: "The rule requiring minimum yearly repayments on many mortgages." },
    ],
    featured: true,
  },
  {
    code: "NO",
    slug: "no",
    name: "Norway",
    flag: "🇳🇴",
    currency: "NOK",
    locale: "nb-NO",
    region: "Northern Europe",
    status: "EEA member · Norwegian krone",
    aprTerm: "effektiv rente (effective interest rate)",
    aprShort: "effektiv rente",
    regulator: "Finanstilsynet (Financial Supervisory Authority of Norway)",
    intro:
      "Norwegian loans are in kroner (NOK). Offers show the nominal rate (nominell rente) and the effective rate (effektiv rente), which includes fees such as the establishment fee (etableringsgebyr) and the fee charged with each payment (termingebyr).",
    notes: [
      "Most Norwegian mortgages have a floating rate (flytende rente) that the bank can change with notice. Fixed rates are also available.",
      "Loans can be annuity loans (annuitetslån), with equal payments as in this calculator, or serial loans (serielån), where the principal portion is equal and the payment falls over time.",
      "Lending regulations (utlånsforskriften) limit mortgages relative to the property value and the borrower's income.",
    ],
    terms: [
      { term: "Annuitetslån", meaning: "A loan with equal payments throughout, as modelled here." },
      { term: "Serielån", meaning: "A loan with equal principal repayments, so total payments decrease over time." },
      { term: "Termingebyr", meaning: "A fee added to each payment. It is included in the effective rate." },
    ],
  },
  {
    code: "DK",
    slug: "dk",
    name: "Denmark",
    flag: "🇩🇰",
    currency: "DKK",
    locale: "da-DK",
    region: "Northern Europe",
    status: "EU member · Danish krone (pegged to the euro)",
    aprTerm: "ÅOP (årlige omkostninger i procent)",
    aprShort: "ÅOP",
    regulator: "Finanstilsynet (Danish Financial Supervisory Authority)",
    intro:
      "Danish loans are in kroner (DKK), a currency kept stable against the euro through the ERM II exchange rate mechanism. Loan offers include the ÅOP (årlige omkostninger i procent), the annual cost in percent including fees, which is the best figure for comparing loans.",
    notes: [
      "Most home purchases are financed with a realkreditlån from a mortgage-credit institution, funded by covered bonds and typically covering up to 80% of the value, plus a bank loan or your own funds for the rest.",
      "Fixed-rate realkredit loans can be repaid early, and when rates rise you may be able to buy back the underlying bonds below par and reduce the debt.",
      "Besides interest, realkredit borrowers pay a bidrag (administration margin) as a percentage of the debt. Add it to the rate here for a closer estimate.",
    ],
    terms: [
      { term: "Realkreditlån", meaning: "A mortgage-credit loan funded by bonds, the main way homes are financed." },
      { term: "Bidragssats", meaning: "The yearly administration margin charged on a realkredit loan, on top of interest." },
      { term: "Afdragsfrihed", meaning: "An interest-only period during which no principal is repaid." },
    ],
  },
  {
    code: "FI",
    slug: "fi",
    name: "Finland",
    flag: "🇫🇮",
    currency: "EUR",
    locale: "fi-FI",
    region: "Northern Europe",
    status: "EU member · euro since 1999",
    aprTerm: "todellinen vuosikorko (effective annual interest rate)",
    aprShort: "todellinen vuosikorko",
    regulator: "Finanssivalvonta (Financial Supervisory Authority, FIN-FSA)",
    intro:
      "In Finland loans are in euros. Offers state the todellinen vuosikorko, the effective annual rate including fees, and most housing loans are priced as a reference rate (viitekorko) plus a bank margin (marginaali).",
    notes: [
      "Most Finnish mortgages have a variable rate tied to Euribor, commonly the 12-month rate, so payments change when the reference rate is reset.",
      "Common repayment methods are the annuity (annuiteetti), equal principal (tasalyhennys) and fixed instalment (kiinteä tasaerä), where the payment stays the same but the term changes with rates.",
      "A loan-to-value cap (lainakatto) limits how much of a home's price can be borrowed, with a higher limit for first-time buyers.",
    ],
    terms: [
      { term: "Viitekorko", meaning: "The reference rate, usually a Euribor rate, that a variable loan follows." },
      { term: "Marginaali", meaning: "The bank's fixed margin added to the reference rate." },
      { term: "Tasalyhennys", meaning: "Equal principal repayments, so total payments fall over time." },
    ],
  },
  {
    code: "IE",
    slug: "ie",
    name: "Ireland",
    flag: "🇮🇪",
    currency: "EUR",
    locale: "en-IE",
    region: "Western Europe",
    status: "EU member · euro since 1999",
    aprTerm: "APR, and APRC for mortgages",
    aprShort: "APRC",
    regulator: "Central Bank of Ireland",
    intro:
      "Irish loans are in euros. Lenders show an APR, and for mortgages an APRC (annual percentage rate of charge), which reflects the total cost of the credit over the term.",
    notes: [
      "Irish mortgages can be fixed for a set number of years or variable. Some older loans are tracker mortgages that follow the ECB rate plus a margin.",
      "The Central Bank's mortgage measures limit borrowing to a multiple of gross income and set maximum loan-to-value ratios, with different limits for first-time buyers.",
      "Leaving a fixed-rate period early can lead to a break fee; switching from a variable-rate mortgage is usually free.",
    ],
    terms: [
      { term: "APRC", meaning: "The annual percentage rate of charge on a mortgage, including interest and compulsory costs." },
      { term: "Tracker mortgage", meaning: "A variable mortgage that moves with the ECB rate plus a fixed margin." },
      { term: "LTI (loan-to-income)", meaning: "The mortgage as a multiple of gross income, limited by the Central Bank's rules." },
    ],
    featured: true,
  },
  {
    code: "PT",
    slug: "pt",
    name: "Portugal",
    flag: "🇵🇹",
    currency: "EUR",
    locale: "pt-PT",
    region: "Southern Europe",
    status: "EU member · euro since 1999",
    aprTerm: "TAEG (taxa anual de encargos efetiva global)",
    aprShort: "TAEG",
    regulator: "Banco de Portugal",
    intro:
      "Portuguese loan offers show the TAN (taxa anual nominal), which sets the instalment, and the TAEG (taxa anual de encargos efetiva global), which includes fees, insurance and taxes. Enter the TAN here and compare offers on the TAEG.",
    notes: [
      "Housing loans have traditionally been variable, linked to Euribor plus a spread. Mixed-rate loans with an initial fixed period are now widely offered.",
      "Banco de Portugal recommendations limit the share of income that can go to loan repayments and the maximum maturity of new housing and consumer loans.",
      "Early repayment fees are capped by law, with a lower cap for variable-rate loans than for fixed-rate ones.",
    ],
    terms: [
      { term: "TAN", meaning: "Taxa anual nominal: the nominal annual rate used for the instalment." },
      { term: "Spread", meaning: "The bank's margin added to Euribor on a variable-rate loan." },
      { term: "Imposto do selo", meaning: "Stamp duty charged on loans and on interest, part of the TAEG." },
    ],
    featured: true,
  },
  {
    code: "PL",
    slug: "pl",
    name: "Poland",
    flag: "🇵🇱",
    currency: "PLN",
    locale: "pl-PL",
    region: "Central and Eastern Europe",
    status: "EU member · Polish złoty",
    aprTerm: "RRSO (rzeczywista roczna stopa oprocentowania)",
    aprShort: "RRSO",
    regulator: "KNF (Polish Financial Supervision Authority)",
    intro:
      "Polish loans are in złoty (PLN). Lenders must state the RRSO (rzeczywista roczna stopa oprocentowania), the actual annual rate including all costs, which for consumer loans can be much higher than the nominal rate.",
    notes: [
      "Many mortgages have a variable rate made up of a reference rate plus the bank's margin (marża). The market is moving from WIBOR to a new reference index, and rates fixed for five years (okresowo stała stopa) are also common.",
      "You can usually choose equal instalments (raty równe), as modelled here, or decreasing instalments (raty malejące), where the principal part stays the same.",
      "Polish law caps the maximum interest rate and the non-interest costs on consumer credit.",
    ],
    terms: [
      { term: "Oprocentowanie nominalne", meaning: "The nominal annual rate. Enter this in the calculator." },
      { term: "Marża", meaning: "The bank's margin added to the reference rate on a variable loan." },
      { term: "Raty malejące", meaning: "Decreasing instalments with equal principal parts." },
    ],
    featured: true,
  },
  {
    code: "GR",
    slug: "gr",
    name: "Greece",
    flag: "🇬🇷",
    currency: "EUR",
    locale: "el-GR",
    region: "Southern Europe",
    status: "EU member · euro since 2001",
    aprTerm: "ΣΕΠΕ (Συνολικό Ετήσιο Πραγματικό Επιτόκιο)",
    aprShort: "ΣΕΠΕ",
    regulator: "Bank of Greece",
    intro:
      "Greek loans are in euros. Lenders disclose the ΣΕΠΕ (Συνολικό Ετήσιο Πραγματικό Επιτόκιο), the total annual effective rate including costs, alongside the nominal rate.",
    notes: [
      "Mortgages can be fixed (σταθερό επιτόκιο) or floating (κυμαινόμενο), with floating rates usually linked to Euribor plus a margin.",
      "A levy under Law 128/1975 is added to the interest on most loans, at a lower rate for housing loans than for consumer loans. Check whether a quoted rate includes it.",
      "State-supported schemes for young buyers, such as the “Spiti mou” programme, have offered reduced-rate housing loans; the terms depend on the scheme in force.",
    ],
    terms: [
      { term: "Κυμαινόμενο επιτόκιο", meaning: "A floating rate that follows a reference rate such as Euribor." },
      { term: "Σταθερό επιτόκιο", meaning: "A rate fixed for an agreed period or the whole loan." },
      { term: "Εισφορά Ν.128/75", meaning: "A levy charged on loan interest, which raises the effective cost." },
    ],
  },
  {
    code: "CZ",
    slug: "cz",
    name: "Czechia",
    flag: "🇨🇿",
    currency: "CZK",
    locale: "cs-CZ",
    region: "Central and Eastern Europe",
    status: "EU member · Czech koruna",
    aprTerm: "RPSN (roční procentní sazba nákladů)",
    aprShort: "RPSN",
    regulator: "Czech National Bank (ČNB)",
    intro:
      "Czech loans are in koruna (CZK). Lenders must show the RPSN (roční procentní sazba nákladů), the annual percentage rate of charge, which is the figure to compare between offers.",
    notes: [
      "Mortgages (hypotéky) usually have a rate fixed for a fixation period (fixace) of a few years. When it ends the bank offers a new rate, and you can repay or refinance without a fee.",
      "The Czech National Bank sets loan-to-value limits for mortgages, with a higher limit for younger borrowers.",
      "Building savings schemes (stavební spoření) also provide housing loans, sometimes on different terms from bank mortgages.",
    ],
    terms: [
      { term: "Fixace", meaning: "The period during which the mortgage rate is fixed." },
      { term: "Úroková sazba", meaning: "The nominal interest rate. Enter this in the calculator." },
      { term: "Předčasné splacení", meaning: "Early repayment, free of charge at the end of a fixation period." },
    ],
  },
  {
    code: "RO",
    slug: "ro",
    name: "Romania",
    flag: "🇷🇴",
    currency: "RON",
    locale: "ro-RO",
    region: "Central and Eastern Europe",
    status: "EU member · Romanian leu",
    aprTerm: "DAE (dobânda anuală efectivă)",
    aprShort: "DAE",
    regulator: "National Bank of Romania (BNR); consumer protection: ANPC",
    intro:
      "Romanian loans are mostly in lei (RON). Offers must show the DAE (dobânda anuală efectivă), the effective annual rate including costs.",
    notes: [
      "Variable-rate consumer and mortgage loans in lei are linked to the IRCC index, which replaced ROBOR for new consumer loans, plus the bank's margin.",
      "Many banks offer an initial fixed-rate period of several years before the rate becomes variable.",
      "State-guaranteed housing programmes (Noua Casă) have allowed eligible buyers to borrow with a smaller deposit.",
    ],
    terms: [
      { term: "IRCC", meaning: "The consumer credit reference index used for variable-rate loans in lei." },
      { term: "Marjă", meaning: "The bank's fixed margin added to the reference index." },
      { term: "Dobândă fixă", meaning: "A fixed interest rate for an agreed period." },
    ],
  },
  {
    code: "HU",
    slug: "hu",
    name: "Hungary",
    flag: "🇭🇺",
    currency: "HUF",
    locale: "hu-HU",
    region: "Central and Eastern Europe",
    status: "EU member · Hungarian forint",
    aprTerm: "THM (teljes hiteldíj mutató)",
    aprShort: "THM",
    regulator: "Magyar Nemzeti Bank (MNB)",
    intro:
      "Hungarian loans are in forint (HUF). The THM (teljes hiteldíj mutató) expresses the total cost of credit as an annual percentage and is the main figure for comparing offers.",
    notes: [
      "The central bank's certified consumer-friendly housing loans (Minősített Fogyasztóbarát Lakáshitel) have rates fixed for long periods and standardised fees.",
      "Debt-service limits (JTM) cap monthly repayments as a share of the borrower's income.",
      "Temporary interest rate caps (kamatstop) have applied to some variable-rate mortgages. Check whether a cap still applies to your loan.",
    ],
    terms: [
      { term: "Kamatperiódus", meaning: "The period for which the interest rate is fixed." },
      { term: "JTM", meaning: "Jövedelemarányos törlesztőrészlet-mutató: the debt-service-to-income limit." },
      { term: "Fix kamat", meaning: "A fixed interest rate." },
    ],
  },
  {
    code: "UA",
    slug: "ua",
    name: "Ukraine",
    flag: "🇺🇦",
    currency: "UAH",
    locale: "uk-UA",
    region: "Central and Eastern Europe",
    status: "EU candidate · Ukrainian hryvnia",
    aprTerm: "реальна річна процентна ставка (real annual interest rate)",
    aprShort: "real annual rate",
    regulator: "National Bank of Ukraine (NBU)",
    intro:
      "Ukrainian loans are in hryvnia (UAH). Lenders must disclose the real annual interest rate (реальна річна процентна ставка) and the total cost of credit (загальна вартість кредиту), which include fees on top of the nominal rate.",
    notes: [
      "The state-supported єОселя (eOselia) programme offers mortgages at reduced rates to eligible groups; standard bank mortgages are priced separately.",
      "Consumer loans can carry significant fees, so compare the real annual rate and the total cost rather than the advertised rate.",
      "Special rules on penalties and repayments have applied during martial law. Check the current terms with your lender.",
    ],
    terms: [
      { term: "Реальна річна процентна ставка", meaning: "The real annual rate, including fees, used to compare loans." },
      { term: "Загальна вартість кредиту", meaning: "The total cost of credit: everything you repay above the amount borrowed." },
      { term: "єОселя", meaning: "A state programme offering subsidised mortgage rates to eligible borrowers." },
    ],
  },
  {
    code: "RU",
    slug: "ru",
    name: "Russia",
    flag: "🇷🇺",
    currency: "RUB",
    locale: "ru-RU",
    region: "Central and Eastern Europe",
    status: "Russian rouble",
    aprTerm: "ПСК (полная стоимость кредита)",
    aprShort: "ПСК",
    regulator: "Bank of Russia",
    intro:
      "Russian loans are in roubles (RUB). By law, the full cost of credit (ПСК, полная стоимость кредита) must be shown as an annual percentage in a box on the first page of the loan agreement.",
    notes: [
      "The Bank of Russia's key rate (ключевая ставка) drives market rates. Most mortgages are fixed-rate.",
      "State-subsidised programmes such as the family mortgage (семейная ипотека) offer lower rates to eligible borrowers.",
      "Loans are repaid either by annuity payments (аннуитетный платёж), as here, or by differentiated payments (дифференцированный платёж), where the principal part is equal and payments decline.",
    ],
    terms: [
      { term: "ПСК", meaning: "Полная стоимость кредита: the full cost of credit as an annual percentage." },
      { term: "Ключевая ставка", meaning: "The Bank of Russia's key policy rate." },
      { term: "Дифференцированный платёж", meaning: "Differentiated payments with equal principal parts, falling over time." },
    ],
  },
  {
    code: "SK",
    slug: "sk",
    name: "Slovakia",
    flag: "🇸🇰",
    currency: "EUR",
    locale: "sk-SK",
    region: "Central and Eastern Europe",
    status: "EU member · euro since 2009",
    aprTerm: "RPMN (ročná percentuálna miera nákladov)",
    aprShort: "RPMN",
    regulator: "Národná banka Slovenska (NBS)",
    intro:
      "Slovak loans have been in euros since 2009. Lenders state the RPMN (ročná percentuálna miera nákladov), the annual percentage rate of charge including fees.",
    notes: [
      "Housing loans usually have a fixed-rate period (fixácia). At the end of it you can repay the loan or move it to another bank without a fee.",
      "Fees for repaying a housing loan early outside those dates are capped by law.",
      "Národná banka Slovenska sets limits on loan-to-value and debt-to-income for new housing loans.",
    ],
    terms: [
      { term: "Fixácia", meaning: "The period during which the interest rate is fixed." },
      { term: "Úver na bývanie", meaning: "A housing loan, including mortgages (hypotéky)." },
      { term: "RPMN", meaning: "The annual percentage rate of charge, the figure for comparing offers." },
    ],
  },
  {
    code: "HR",
    slug: "hr",
    name: "Croatia",
    flag: "🇭🇷",
    currency: "EUR",
    locale: "hr-HR",
    region: "Southeast Europe",
    status: "EU member · euro since 2023",
    aprTerm: "EKS (efektivna kamatna stopa)",
    aprShort: "EKS",
    regulator: "Croatian National Bank (HNB)",
    intro:
      "Croatia adopted the euro on 1 January 2023, and existing kuna loans were converted at the fixed conversion rate. Lenders must show the EKS (efektivna kamatna stopa), the effective interest rate including costs.",
    notes: [
      "Variable rates are linked to a reference rate, such as Euribor or the national reference rate (NRS), plus a fixed margin.",
      "Many housing loans have an initial fixed-rate period followed by a variable rate.",
      "State housing loan subsidy programmes have been offered to younger buyers in some years.",
    ],
    terms: [
      { term: "NRS", meaning: "Nacionalna referentna stopa: the national reference rate used for some variable loans." },
      { term: "Fiksna kamatna stopa", meaning: "A fixed interest rate." },
      { term: "Stambeni kredit", meaning: "A housing loan." },
    ],
  },
  {
    code: "SI",
    slug: "si",
    name: "Slovenia",
    flag: "🇸🇮",
    currency: "EUR",
    locale: "sl-SI",
    region: "Southeast Europe",
    status: "EU member · euro since 2007",
    aprTerm: "EOM (efektivna obrestna mera)",
    aprShort: "EOM",
    regulator: "Banka Slovenije",
    intro:
      "Slovenian loans have been in euros since 2007. Offers state the EOM (efektivna obrestna mera), the effective interest rate including costs.",
    notes: [
      "Housing loans can be fixed (fiksna obrestna mera) or variable (spremenljiva), with variable rates linked to Euribor.",
      "Banka Slovenije applies limits on loan-to-value and on the share of income going to loan repayments.",
      "Consumer loans often carry an approval fee, which is included in the EOM but not in the nominal rate.",
    ],
    terms: [
      { term: "Spremenljiva obrestna mera", meaning: "A variable rate: Euribor plus a fixed margin." },
      { term: "Stanovanjski kredit", meaning: "A housing loan." },
      { term: "EOM", meaning: "The effective interest rate, the figure for comparing offers." },
    ],
  },
  {
    code: "BG",
    slug: "bg",
    name: "Bulgaria",
    flag: "🇧🇬",
    currency: "EUR",
    locale: "bg-BG",
    region: "Southeast Europe",
    status: "EU member · euro since 2026",
    aprTerm: "ГПР (годишен процент на разходите)",
    aprShort: "ГПР",
    regulator: "Bulgarian National Bank (BNB)",
    intro:
      "Bulgaria adopted the euro on 1 January 2026, replacing the lev at the fixed rate of 1.95583 leva per euro, so loans are now in euros. Lenders show the ГПР (годишен процент на разходите), the annual percentage rate of charge.",
    notes: [
      "Existing lev loans were converted to euros at the fixed rate, so balances and instalments kept the same value.",
      "Variable rates on housing loans are often based on a reference index, such as one derived from deposit rates, plus a margin.",
      "Bulgarian law caps the ГПР on consumer loans relative to the statutory interest rate.",
    ],
    terms: [
      { term: "ГПР", meaning: "The annual percentage rate of charge, including interest and fees." },
      { term: "Ипотечен кредит", meaning: "A mortgage loan secured on property." },
      { term: "Надбавка", meaning: "The bank's margin added to the reference index." },
    ],
  },
  {
    code: "LT",
    slug: "lt",
    name: "Lithuania",
    flag: "🇱🇹",
    currency: "EUR",
    locale: "lt-LT",
    region: "Northern Europe",
    status: "EU member · euro since 2015",
    aprTerm: "BVKKMN (bendros vartojimo kredito kainos metinė norma)",
    aprShort: "BVKKMN",
    regulator: "Bank of Lithuania (Lietuvos bankas)",
    intro:
      "Lithuanian loans have been in euros since 2015. Lenders show the BVKKMN (bendros vartojimo kredito kainos metinė norma), the annual rate of the total cost of credit.",
    notes: [
      "Most housing loans have a variable rate based on 6-month Euribor plus a margin (marža), so payments change when Euribor moves.",
      "Responsible lending rules set limits on loan-to-value and on the share of income spent on repayments.",
      "Borrowers can often choose between annuity repayments (anuitetas), as here, and linear repayments (linijinis grafikas).",
    ],
    terms: [
      { term: "Marža", meaning: "The bank's fixed margin added to Euribor." },
      { term: "Anuitetas", meaning: "Equal repayments throughout the term." },
      { term: "Linijinis grafikas", meaning: "Equal principal repayments, with total payments falling over time." },
    ],
  },
  {
    code: "LV",
    slug: "lv",
    name: "Latvia",
    flag: "🇱🇻",
    currency: "EUR",
    locale: "lv-LV",
    region: "Northern Europe",
    status: "EU member · euro since 2014",
    aprTerm: "GPL (gada procentu likme)",
    aprShort: "GPL",
    regulator: "Latvijas Banka",
    intro:
      "Latvian loans have been in euros since 2014. Offers show the GPL (gada procentu likme), the annual percentage rate including costs.",
    notes: [
      "Housing loans are usually variable-rate, linked to 6-month Euribor plus a fixed margin.",
      "The development institution Altum offers state guarantees that can reduce the deposit needed by families and young specialists.",
      "Latvian law limits the total cost of consumer credit.",
    ],
    terms: [
      { term: "GPL", meaning: "The annual percentage rate, including interest and fees." },
      { term: "Mājokļa kredīts", meaning: "A housing loan." },
      { term: "Mainīgā procentu likme", meaning: "A variable interest rate: Euribor plus a margin." },
    ],
  },
  {
    code: "EE",
    slug: "ee",
    name: "Estonia",
    flag: "🇪🇪",
    currency: "EUR",
    locale: "et-EE",
    region: "Northern Europe",
    status: "EU member · euro since 2011",
    aprTerm: "krediidi kulukuse määr (KKM)",
    aprShort: "KKM",
    regulator: "Finantsinspektsioon",
    intro:
      "Estonian loans have been in euros since 2011. Lenders show the krediidi kulukuse määr (KKM), the annual percentage rate of charge.",
    notes: [
      "Home loans are usually variable, priced as 6-month Euribor plus a margin (marginaal).",
      "You can often choose an annuity schedule (annuiteetgraafik), as here, or an equal-principal schedule.",
      "State-backed guarantees through EIS (formerly KredEx) can lower the required deposit for some buyers.",
    ],
    terms: [
      { term: "Marginaal", meaning: "The bank's fixed margin added to Euribor." },
      { term: "Annuiteetgraafik", meaning: "A repayment schedule with equal payments." },
      { term: "KKM", meaning: "The annual percentage rate of charge, for comparing offers." },
    ],
  },
  {
    code: "IS",
    slug: "is",
    name: "Iceland",
    flag: "🇮🇸",
    currency: "ISK",
    locale: "is-IS",
    region: "Northern Europe",
    status: "EEA member · Icelandic króna",
    aprTerm: "ÁHK (árleg hlutfallstala kostnaðar)",
    aprShort: "ÁHK",
    regulator: "Central Bank of Iceland (Seðlabanki Íslands)",
    intro:
      "Icelandic loans are in krónur (ISK). Lenders disclose the ÁHK (árleg hlutfallstala kostnaðar), the annual percentage rate of charge.",
    notes: [
      "Iceland has both non-indexed loans (óverðtryggð lán) and CPI-indexed loans (verðtryggð lán), where the outstanding principal is adjusted for inflation. This calculator models non-indexed loans; an indexed loan can cost much more in krónur over time.",
      "Payments can be equal (jafnar greiðslur), as here, or have equal principal parts (jafnar afborganir).",
      "Mortgage rates may be fixed for a few years or variable.",
    ],
    terms: [
      { term: "Verðtryggt lán", meaning: "An inflation-indexed loan whose balance rises with the consumer price index." },
      { term: "Óverðtryggt lán", meaning: "A non-indexed loan, as modelled by this calculator." },
      { term: "Jafnar afborganir", meaning: "Equal principal repayments, with payments falling over time." },
    ],
  },
  {
    code: "LU",
    slug: "lu",
    name: "Luxembourg",
    flag: "🇱🇺",
    currency: "EUR",
    locale: "fr-LU",
    region: "Western Europe",
    status: "EU member · euro since 1999",
    aprTerm: "TAEG (taux annuel effectif global)",
    aprShort: "TAEG",
    regulator: "CSSF (Commission de Surveillance du Secteur Financier)",
    intro:
      "Luxembourg loans are in euros. Offers show the TAEG (taux annuel effectif global), which includes interest and compulsory costs.",
    notes: [
      "Mortgages can be fixed, variable or mixed, with variable rates linked to Euribor.",
      "Housing aids such as the Bëllegen Akt, a tax credit on registration duties, can reduce the upfront cost of buying a home.",
      "Borrower insurance (assurance solde restant dû) is often required for a mortgage and adds to the cost.",
    ],
    terms: [
      { term: "Taux fixe / taux variable", meaning: "A fixed rate, or a rate that follows Euribor plus a margin." },
      { term: "Bëllegen Akt", meaning: "A tax credit on registration duties when buying a main residence." },
      { term: "Assurance solde restant dû", meaning: "Insurance that repays the remaining balance if the borrower dies." },
    ],
  },
  {
    code: "MT",
    slug: "mt",
    name: "Malta",
    flag: "🇲🇹",
    currency: "EUR",
    locale: "en-MT",
    region: "Southern Europe",
    status: "EU member · euro since 2008",
    aprTerm: "APR (annual percentage rate)",
    aprShort: "APR",
    regulator: "Malta Financial Services Authority (MFSA) and Central Bank of Malta",
    intro:
      "Maltese loans have been in euros since 2008. Lenders show an APR, and loan documents are commonly in English.",
    notes: [
      "Home loan rates are commonly variable, linked to the bank's own base rate plus a margin.",
      "The Central Bank of Malta's borrower-based measures set limits on loan-to-value and on repayments relative to income for new mortgages.",
      "Many lenders cap the term so that a home loan is repaid by a set age.",
    ],
    terms: [
      { term: "Base rate", meaning: "The bank's own reference rate, to which a margin is added." },
      { term: "LTV (loan-to-value)", meaning: "The loan as a percentage of the property value." },
      { term: "APR", meaning: "The annual percentage rate including interest and charges." },
    ],
  },
  {
    code: "CY",
    slug: "cy",
    name: "Cyprus",
    flag: "🇨🇾",
    currency: "EUR",
    locale: "el-CY",
    region: "Southern Europe",
    status: "EU member · euro since 2008",
    aprTerm: "ΣΕΠΕ / APRC (annual percentage rate of charge)",
    aprShort: "APRC",
    regulator: "Central Bank of Cyprus",
    intro:
      "Cypriot loans have been in euros since 2008. Lenders disclose the ΣΕΠΕ, known in English as the APRC, the total annual cost of credit.",
    notes: [
      "Variable rates are commonly linked to Euribor or to a bank's base rate, plus a margin.",
      "The Central Bank of Cyprus sets maximum loan-to-value ratios for housing loans, with a higher limit for a primary residence.",
      "Delays in issuing title deeds have historically affected property purchases in Cyprus, so check the title deed status before borrowing.",
    ],
    terms: [
      { term: "ΣΕΠΕ / APRC", meaning: "The annual percentage rate of charge, including interest and fees." },
      { term: "Base rate", meaning: "A bank's own reference rate used for some variable loans." },
      { term: "Title deed", meaning: "The document proving ownership, which lenders use as security." },
    ],
  },
  {
    code: "RS",
    slug: "rs",
    name: "Serbia",
    flag: "🇷🇸",
    currency: "RSD",
    locale: "sr-Latn-RS",
    region: "Southeast Europe",
    status: "EU candidate · Serbian dinar",
    aprTerm: "EKS (efektivna kamatna stopa)",
    aprShort: "EKS",
    regulator: "National Bank of Serbia (NBS)",
    intro:
      "Serbian loans are in dinars (RSD), although many housing loans are indexed to the euro: the balance is set in euros and paid in dinars at the exchange rate. Lenders disclose the EKS (efektivna kamatna stopa), the effective interest rate.",
    notes: [
      "With a euro-indexed loan, the dinar payment changes with the exchange rate even if the interest rate is fixed. This calculator works in one currency, so model such a loan in euros if you prefer.",
      "Housing loans can be insured with the National Mortgage Insurance Corporation (NKOSK), which can allow a smaller deposit.",
      "The National Bank of Serbia has at times capped rates on variable housing loans. Check the rules in force.",
    ],
    terms: [
      { term: "EKS", meaning: "The effective interest rate including fees, for comparing offers." },
      { term: "Evro indeksiran kredit", meaning: "A loan with its balance set in euros and paid in dinars." },
      { term: "NKOSK", meaning: "The National Mortgage Insurance Corporation, which insures housing loans." },
    ],
  },
  {
    code: "ME",
    slug: "me",
    name: "Montenegro",
    flag: "🇲🇪",
    currency: "EUR",
    locale: "sr-Latn-ME",
    region: "Southeast Europe",
    status: "EU candidate · uses the euro",
    aprTerm: "EKS (efektivna kamatna stopa)",
    aprShort: "EKS",
    regulator: "Central Bank of Montenegro (CBCG)",
    intro:
      "Montenegro uses the euro as its currency, although it is not a member of the euro area. Lenders disclose the effective interest rate (efektivna kamatna stopa, EKS), which includes fees.",
    notes: [
      "Because loans and most incomes are in euros, borrowers paid in euros carry no exchange-rate risk.",
      "Banks often charge an upfront processing fee and may require life insurance for housing loans; both raise the EKS above the nominal rate.",
      "Rates can be fixed or variable, and variable rates are often linked to Euribor.",
    ],
    terms: [
      { term: "EKS", meaning: "The effective interest rate including fees." },
      { term: "Stambeni kredit", meaning: "A housing loan." },
      { term: "Naknada za obradu kredita", meaning: "The loan processing fee charged at the start." },
    ],
  },
  {
    code: "MK",
    slug: "mk",
    name: "North Macedonia",
    flag: "🇲🇰",
    currency: "MKD",
    locale: "mk-MK",
    region: "Southeast Europe",
    status: "EU candidate · Macedonian denar",
    aprTerm: "annual percentage rate of costs",
    aprShort: "annual percentage rate",
    regulator: "National Bank of the Republic of North Macedonia (NBRM)",
    intro:
      "Loans in North Macedonia are in denars (MKD), although many are linked to the euro through a currency clause (валутна клаузула). The central bank has kept the denar stable against the euro for many years.",
    notes: [
      "Lenders must disclose the annual percentage rate of costs, which adds fees to the nominal rate. Compare offers on that figure.",
      "A euro-linked loan changes in denar terms if the exchange rate moves, so check whether your loan has a currency clause.",
      "Housing loans are often variable, with the rate set as a reference rate plus a margin.",
    ],
    terms: [
      { term: "Валутна клаузула", meaning: "A currency clause linking a denar loan to the euro." },
      { term: "Reference rate", meaning: "The benchmark a variable rate follows, plus the bank's margin." },
      { term: "Annual percentage rate of costs", meaning: "The total yearly cost of credit, including fees." },
    ],
  },
  {
    code: "AL",
    slug: "al",
    name: "Albania",
    flag: "🇦🇱",
    currency: "ALL",
    locale: "sq-AL",
    region: "Southeast Europe",
    status: "EU candidate · Albanian lek",
    aprTerm: "annual percentage rate of charge",
    aprShort: "annual percentage rate",
    regulator: "Bank of Albania",
    intro:
      "Albanian loans are offered in lek (ALL) and also widely in euros. Lenders disclose the cost of credit as an annual percentage rate including fees, which is the figure to compare.",
    notes: [
      "Borrowing in euros while earning in lek adds exchange-rate risk, and the Bank of Albania has encouraged lending in lek.",
      "Variable lek loans are typically priced off a benchmark, such as the central bank's policy rate or Treasury bill yields, plus a margin.",
      "Check whether insurance and processing fees are included in the quoted rate.",
    ],
    terms: [
      { term: "Annual percentage rate", meaning: "The total yearly cost of credit, including fees." },
      { term: "Euro loan", meaning: "A loan in euros, which carries exchange-rate risk if your income is in lek." },
      { term: "Margin", meaning: "The fixed part the bank adds to the benchmark rate." },
    ],
  },
  {
    code: "BA",
    slug: "ba",
    name: "Bosnia and Herzegovina",
    flag: "🇧🇦",
    currency: "BAM",
    locale: "bs-BA",
    region: "Southeast Europe",
    status: "EU candidate · convertible mark (pegged to the euro)",
    aprTerm: "EKS (efektivna kamatna stopa)",
    aprShort: "EKS",
    regulator: "Banking Agency of the Federation of BiH (FBA) and Banking Agency of Republika Srpska (ABRS)",
    intro:
      "Bosnia and Herzegovina uses the convertible mark (BAM, KM), fixed to the euro at 1.95583 marks per euro under a currency board. Lenders disclose the EKS (efektivna kamatna stopa), the effective interest rate.",
    notes: [
      "Because the mark is pegged to the euro, euro-indexed loans carry little exchange-rate risk while the peg holds.",
      "Banking is supervised by two entity agencies: the FBA in the Federation and the ABRS in Republika Srpska. The Central Bank of BiH manages the currency.",
      "Housing loans are often variable, with rates linked to Euribor or a bank's reference rate.",
    ],
    terms: [
      { term: "EKS", meaning: "The effective interest rate including fees." },
      { term: "Konvertibilna marka (KM)", meaning: "The national currency, pegged to the euro." },
      { term: "Referentna stopa", meaning: "The reference rate a variable loan follows." },
    ],
  },
  {
    code: "MD",
    slug: "md",
    name: "Moldova",
    flag: "🇲🇩",
    currency: "MDL",
    locale: "ro-MD",
    region: "Central and Eastern Europe",
    status: "EU candidate · Moldovan leu",
    aprTerm: "DAE (dobânda anuală efectivă)",
    aprShort: "DAE",
    regulator: "National Bank of Moldova (BNM)",
    intro:
      "Moldovan loans are in lei (MDL). Lenders must show the DAE (dobânda anuală efectivă), the effective annual rate including costs.",
    notes: [
      "The state programme Prima Casă has offered guarantees that help eligible buyers get a mortgage with a smaller deposit.",
      "Some loans are offered in euros. Borrowing in a currency other than your income adds exchange-rate risk.",
      "Variable rates are often set as a bank's reference rate plus a margin.",
    ],
    terms: [
      { term: "DAE", meaning: "The effective annual rate, including interest and fees." },
      { term: "Dobândă flotantă", meaning: "A floating interest rate." },
      { term: "Prima Casă", meaning: "A state-guaranteed mortgage programme for eligible buyers." },
    ],
  },
  {
    code: "BY",
    slug: "by",
    name: "Belarus",
    flag: "🇧🇾",
    currency: "BYN",
    locale: "ru-BY",
    region: "Central and Eastern Europe",
    status: "Belarusian rouble",
    aprTerm: "effective interest rate (эффективная процентная ставка)",
    aprShort: "effective rate",
    regulator: "National Bank of the Republic of Belarus",
    intro:
      "Belarusian loans are in Belarusian roubles (BYN). Lenders must disclose the effective interest rate, which reflects fees and other costs, alongside the nominal rate.",
    notes: [
      "New foreign-currency loans to individuals are restricted, so household borrowing is mainly in roubles.",
      "Loan rates are influenced by the National Bank's refinancing rate (ставка рефинансирования).",
      "State-supported housing loans exist for some groups of buyers, on terms set by the government.",
    ],
    terms: [
      { term: "Ставка рефинансирования", meaning: "The National Bank's refinancing rate." },
      { term: "Эффективная процентная ставка", meaning: "The effective rate including fees, for comparing loans." },
      { term: "BYN", meaning: "The Belarusian rouble, the currency of household loans." },
    ],
  },
  {
    code: "XK",
    codeNote:
      "Kosovo has no official ISO 3166-1 code. XK is a user-assigned code used by the European Commission and many international organisations.",
    slug: "xk",
    name: "Kosovo",
    flag: "🇽🇰",
    currency: "EUR",
    locale: "sq-XK",
    region: "Southeast Europe",
    status: "Uses the euro",
    aprTerm: "effective interest rate",
    aprShort: "effective rate",
    regulator: "Central Bank of the Republic of Kosovo (CBK)",
    intro:
      "Kosovo uses the euro, although it is not part of the euro area. Lenders disclose the effective interest rate, which includes fees and is the figure to compare between offers.",
    notes: [
      "Borrowers paid in euros carry no exchange-rate risk on euro loans.",
      "Banks commonly charge an administration fee at the start, which raises the effective rate above the nominal rate.",
      "Housing loans are usually secured by a mortgage registered on the property and may require insurance.",
    ],
    terms: [
      { term: "Effective interest rate", meaning: "The rate including fees, for comparing offers." },
      { term: "Administration fee", meaning: "A one-off fee charged when the loan is granted." },
      { term: "Mortgage (hipotekë)", meaning: "Security registered on a property for a housing loan." },
    ],
  },
  {
    code: "TR",
    slug: "tr",
    name: "Türkiye",
    flag: "🇹🇷",
    currency: "TRY",
    locale: "tr-TR",
    region: "Southeast Europe",
    status: "EU candidate · Turkish lira",
    aprTerm: "yıllık maliyet oranı (annual cost rate)",
    aprShort: "yıllık maliyet oranı",
    regulator: "BDDK (Banking Regulation and Supervision Agency)",
    intro:
      "Loans in Türkiye are in Turkish lira (TRY). Lenders disclose the yıllık maliyet oranı, the annual cost rate including taxes and fees, and interest is usually advertised as a monthly rate rather than an annual one.",
    notes: [
      "Turkish banks usually advertise a monthly interest rate (aylık faiz). Multiply it by 12 to enter it here as an annual nominal rate: for example, 3% a month is 36% a year.",
      "Consumer loans are subject to KKDF and BSMV levies on the interest, while housing loans are generally exempt. These raise the effective cost above the advertised rate.",
      "BDDK sets maximum maturities for consumer and vehicle loans, so long terms may not be available.",
    ],
    terms: [
      { term: "Aylık faiz", meaning: "The monthly interest rate used in loan adverts." },
      { term: "KKDF and BSMV", meaning: "A fund levy and a tax charged on the interest of consumer loans." },
      { term: "Konut kredisi / taşıt kredisi", meaning: "A housing loan / a vehicle loan." },
    ],
  },
  {
    code: "AD",
    slug: "ad",
    name: "Andorra",
    flag: "🇦🇩",
    currency: "EUR",
    locale: "ca-AD",
    region: "Southern Europe",
    status: "Uses the euro (monetary agreement with the EU)",
    aprTerm: "TAE (taxa anual equivalent)",
    aprShort: "TAE",
    regulator: "Andorran Financial Authority (AFA)",
    intro:
      "Andorra uses the euro under a monetary agreement with the EU. Loan offers state the TAE (taxa anual equivalent), the effective annual rate including costs.",
    notes: [
      "Andorra's banking sector is small, with a handful of banking groups, so comparing every available offer is practical.",
      "Property purchases by non-residents may need government authorisation, which can affect the timing of a mortgage.",
      "Variable rates are commonly linked to Euribor plus a margin.",
    ],
    terms: [
      { term: "TAE", meaning: "The effective annual rate including costs." },
      { term: "Hipoteca", meaning: "A mortgage loan secured on property." },
      { term: "Euribor", meaning: "The euro reference rate that variable loans follow." },
    ],
  },
  {
    code: "MC",
    slug: "mc",
    name: "Monaco",
    flag: "🇲🇨",
    currency: "EUR",
    locale: "fr-MC",
    region: "Western Europe",
    status: "Uses the euro (monetary agreement with the EU)",
    aprTerm: "TAEG (taux annuel effectif global)",
    aprShort: "TAEG",
    regulator: "ACPR (French prudential supervisor for Monaco banks) and CCAF",
    intro:
      "Monaco uses the euro under a monetary agreement with the EU. Banks in Monaco are subject to French prudential supervision by the ACPR, and loan offers typically show a TAEG.",
    notes: [
      "Property prices in Monaco are very high, and lenders often tailor financing, sometimes taking investments as security as well as property.",
      "Rates can be fixed or variable; variable rates are usually linked to Euribor.",
      "Many borrowers hold assets or income in several countries, so check which rules and taxes apply to the loan.",
    ],
    terms: [
      { term: "TAEG", meaning: "The annual percentage rate of charge, including interest and costs." },
      { term: "Nantissement", meaning: "A pledge of assets, such as an investment portfolio, as security for a loan." },
      { term: "Euribor", meaning: "The euro reference rate that variable loans follow." },
    ],
  },
  {
    code: "LI",
    slug: "li",
    name: "Liechtenstein",
    flag: "🇱🇮",
    currency: "CHF",
    locale: "de-LI",
    region: "Western Europe",
    status: "EEA member · Swiss franc",
    aprTerm: "effektiver Jahreszins (effective annual rate)",
    aprShort: "effektiver Jahreszins",
    regulator: "Financial Market Authority Liechtenstein (FMA)",
    intro:
      "Liechtenstein uses the Swiss franc (CHF) and, as a member of the European Economic Area, applies EU-based consumer credit rules. Lenders show the effective annual rate (effektiver Jahreszins).",
    notes: [
      "Mortgage products are similar to Switzerland's: fixed-rate mortgages and variable mortgages based on SARON.",
      "Mortgages are often only partly amortized, with the rest carried long-term. Use this calculator for the part you plan to repay.",
      "Loans in euros are available, but borrowing in a currency other than your income adds exchange-rate risk.",
    ],
    terms: [
      { term: "Festhypothek", meaning: "A mortgage with a rate fixed for several years." },
      { term: "SARON", meaning: "The Swiss reference rate used for variable mortgages." },
      { term: "Amortisation", meaning: "Paying down the mortgage principal." },
    ],
  },
  {
    code: "SM",
    slug: "sm",
    name: "San Marino",
    flag: "🇸🇲",
    currency: "EUR",
    locale: "it-SM",
    region: "Southern Europe",
    status: "Uses the euro (monetary agreement with the EU)",
    aprTerm: "TAEG (tasso annuo effettivo globale)",
    aprShort: "TAEG",
    regulator: "Central Bank of the Republic of San Marino",
    intro:
      "San Marino uses the euro under a monetary agreement with the EU. Loan offers use Italian terminology: the TAN for the nominal rate and the TAEG for the total annual cost.",
    notes: [
      "The banking system is small, so comparing the TAEG of a few offers is straightforward.",
      "If you borrow from a bank in Italy, Italian rules apply, including the right to repay a home-purchase mortgage early without a penalty.",
      "Variable rates are commonly linked to Euribor plus a spread.",
    ],
    terms: [
      { term: "TAN", meaning: "The nominal annual rate used for the instalment." },
      { term: "Mutuo", meaning: "A mortgage loan." },
      { term: "Spread", meaning: "The margin added to Euribor on a variable loan." },
    ],
  },
  {
    code: "VA",
    slug: "va",
    name: "Vatican City",
    flag: "🇻🇦",
    currency: "EUR",
    locale: "it-VA",
    region: "Southern Europe",
    status: "Uses the euro (monetary agreement with the EU)",
    aprTerm: "TAEG (tasso annuo effettivo globale), when borrowing from Italian banks",
    aprShort: "TAEG",
    regulator: "Supervisory and Financial Information Authority (ASIF)",
    intro:
      "Vatican City uses the euro under a monetary agreement with the EU. It has very few residents and very limited retail banking, so people who live or work there usually borrow from banks in Italy.",
    notes: [
      "With an Italian bank, Italian terms apply: the TAN is the nominal rate that sets the instalment and the TAEG is the total annual cost.",
      "The Supervisory and Financial Information Authority (ASIF) oversees financial activities in the Vatican.",
      "This calculator works in euros, so it fits loans from Italian or other euro-area lenders.",
    ],
    terms: [
      { term: "TAN", meaning: "The nominal annual rate used for the instalment." },
      { term: "TAEG", meaning: "The total annual cost of the loan, including fees." },
      { term: "Euro", meaning: "The currency used in Vatican City under its agreement with the EU." },
    ],
  },
];

/** Other names people search for, keyed by country code. */
export const COUNTRY_ALIASES: Record<string, string[]> = {
  GB: ["Britain", "Great Britain", "England", "Scotland", "Wales", "Northern Ireland"],
  NL: ["Holland"],
  CZ: ["Czech Republic"],
  TR: ["Turkey"],
  MK: ["Macedonia"],
  BA: ["Bosnia", "Herzegovina"],
  VA: ["Vatican", "Holy See"],
  DE: ["Deutschland"],
  ES: ["España"],
  CH: ["Schweiz", "Suisse", "Svizzera"],
  AT: ["Österreich"],
  GR: ["Hellas", "Ελλάδα"],
};

/** Countries sorted by name, for selectors and indexes. */
export const countriesByName: Country[] = [...countries].sort((a, b) => a.name.localeCompare(b.name, "en"));

export function getCountry(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}

export function countryInSentence(country: Country): string {
  return country.inSentence ?? country.name;
}

export function countryH1Name(country: Country): string {
  return country.h1Name ?? country.name;
}

/** The small, serializable list the client-side country selector needs. */
export function selectorCountries() {
  return countriesByName.map((c) => ({
    slug: c.slug,
    code: c.code,
    name: c.name,
    currency: c.currency,
    aliases: COUNTRY_ALIASES[c.code] ?? [],
  }));
}
