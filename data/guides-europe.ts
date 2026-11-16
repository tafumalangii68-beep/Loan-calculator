import { calculateLoan, calculatePayment } from "@/lib/loan-math";
import { makeMoney } from "@/lib/money";
import { formatPercent } from "@/lib/format";
import type { GuidePage } from "@/types/content";
import { countriesByName } from "./countries";

// Worked numbers come from the calculator's own functions, in euros written
// the English way (en-IE), so the text always matches the tool.
const eur = makeMoney({ code: "EUR", locale: "en-IE" });

// APR guide: compounding alone lifts a 6% nominal rate above 6%.
const effective6 = (Math.pow(1 + 0.06 / 12, 12) - 1) * 100;

// Group countries by the local name of the APR, for the list in the APR guide.
const aprGroups = new Map<string, string[]>();
for (const country of countriesByName) {
  const names = aprGroups.get(country.aprTerm) ?? [];
  names.push(country.name);
  aprGroups.set(country.aprTerm, names);
}
const aprList = [...aprGroups.entries()].map(([term, names]) => `${names.join(", ")}: ${term}`);

// Fixed vs variable: the same €200,000 over 25 years at three reference-rate levels.
const variableAt = (rate: number) => calculatePayment(200_000, rate, 300);
const v3 = variableAt(3);
const v4 = variableAt(4);
const v5 = variableAt(5);

// Annuity vs linear: €200,000 at 4% over 25 years (300 monthly payments).
const P = 200_000;
const n = 300;
const r = 0.04 / 12;
const annuity = calculateLoan(P, 4, n);
const principalPart = P / n;
const linearFirst = principalPart + P * r;
const linearLast = principalPart * (1 + r);
// Interest on a linear loan: r × (sum of opening balances) = r × P × (n + 1) / 2.
const linearInterest = (r * P * (n + 1)) / 2;
const linearSaving = annuity.totalInterest - linearInterest;

const CCD_2008 = {
  title: "Directive 2008/48/EC on credit agreements for consumers",
  publisher: "EUR-Lex, European Union",
  url: "https://eur-lex.europa.eu/eli/dir/2008/48/oj",
};
const CCD_2023 = {
  title: "Directive (EU) 2023/2225 on credit agreements for consumers",
  publisher: "EUR-Lex, European Union",
  url: "https://eur-lex.europa.eu/eli/dir/2023/2225/oj",
};
const MCD = {
  title: "Directive 2014/17/EU on credit agreements for consumers relating to residential immovable property",
  publisher: "EUR-Lex, European Union",
  url: "https://eur-lex.europa.eu/eli/dir/2014/17/oj",
};

export const europeGuides: GuidePage[] = [
  {
    slug: "apr-names-in-europe",
    title: "APR in Europe: TAEG, TAE, RRSO and Other Local Names",
    metaTitle: "APR Names in Europe: TAEG, TAE, RRSO, Effektiver Jahreszins",
    metaDescription:
      "Every European lender shows an annual percentage rate of charge, under a different name in each language. See the local name in 47 countries and how to use it to compare loans.",
    intro:
      "Lenders across the EU must show the annual percentage rate of charge (APRC) on consumer loans and mortgages, but each language has its own name for it: TAEG in France, TAE in Spain, RRSO in Poland, effektiver Jahreszins in Germany. This guide lists the local names, explains what the figure includes and how to use it with a loan calculator.",
    sections: [
      {
        heading: "What the APRC is",
        paragraphs: [
          "The APRC is the total cost of a loan expressed as a yearly percentage. Under the EU Consumer Credit Directive and the Mortgage Credit Directive, lenders must show it in adverts and in the standard pre-contract information, so that offers can be compared on the same basis. A revised Consumer Credit Directive, (EU) 2023/2225, applies from 20 November 2026 and keeps the APRC at the centre of loan comparisons.",
          "It includes the interest and most compulsory costs, such as arrangement fees and insurance you must take out to get the loan. It is calculated as an effective annual rate, which means compounding is included.",
          `That is why the APRC is higher than the nominal rate even when there are no fees. A loan at 6% nominal, repaid monthly, has an APRC of about ${formatPercent(effective6)}, because each month's interest is charged on a balance that already reflects earlier months.`,
        ],
      },
      {
        heading: "The local name in each country",
        paragraphs: [
          "Here is what the annual percentage rate is called in each of the European countries covered by LoanCalm. Countries that share a name are grouped together.",
        ],
        list: aprList,
      },
      {
        heading: "Nominal rate vs APRC",
        paragraphs: [
          "Loan offers usually show two rates. The nominal rate sets your instalment: the TAN in Italy and Portugal, the TIN in Spain, the Sollzins in Germany, the taux débiteur in France, the nominell ränta in Sweden and the oprocentowanie nominalne in Poland. The APRC adds fees and compounding.",
          "Use the nominal rate in a loan calculator to see your repayment, and use the APRC to decide which offer is cheaper overall. If an offer has an upfront fee, the LoanCalm country calculators also estimate the APRC for you.",
        ],
      },
      {
        heading: "Outside the EU",
        paragraphs: [
          "Countries outside the EU have their own rules. In the UK, lenders show an APR and adverts use a representative APR that at least 51% of successful applicants must receive. Switzerland requires the effective annual rate and sets a legal maximum for consumer credit. Russian lenders must print the full cost of credit (ПСК) in a box on the first page of the agreement, and Turkish banks usually advertise a monthly rather than an annual rate.",
        ],
      },
      {
        heading: "How to compare two offers",
        paragraphs: [],
        list: [
          "Make sure both offers are for the same amount and the same term, because the APRC depends on both.",
          "Compare the APRCs: the lower one is cheaper overall, fees included.",
          "Check the repayment from the nominal rate in the calculator to make sure it fits your budget.",
          "For variable-rate loans, remember that the APRC assumes today's reference rate stays the same for the whole term.",
          "Look for costs the APRC may leave out, such as optional insurance or fees for early repayment.",
        ],
      },
    ],
    relatedCalculators: ["/countries", "/fr", "/es", "/pl", "/de", "/it", "/uk"],
    sources: [CCD_2008, CCD_2023, MCD],
    published: "2026-11-17",
    updated: "2026-11-17",
  },
  {
    slug: "fixed-vs-variable-rates-europe",
    title: "Fixed vs Variable Rate Loans in Europe: Euribor Explained",
    metaTitle: "Fixed vs Variable Rate Loans in Europe: How Euribor Works",
    metaDescription:
      "How variable loan rates are built from Euribor and other reference rates, how a rate change affects your repayment, and how fixed-rate habits differ across Europe.",
    intro:
      "Whether your rate is fixed or follows a reference rate such as Euribor decides who carries the risk of rates rising. Habits differ a lot across Europe: full-term fixed rates are the norm in some countries, while in others most mortgages move with Euribor.",
    sections: [
      {
        heading: "How a variable rate is built",
        paragraphs: [
          "A variable rate has two parts: a reference rate that moves with the market, and a margin that the lender adds and that usually stays fixed for the life of the loan. If the reference rate is 2.5% and the margin is 1%, you pay 3.5% until the next reset date.",
          "In the euro area the most common reference is Euribor, a set of rates published each business day by the European Money Markets Institute for periods of one week to twelve months. A loan linked to 12-month Euribor usually has its rate reset once a year, and one linked to 3-month Euribor every three months.",
          "Other currencies have their own references: SARON for Swiss franc mortgages, the Bank of England's Bank Rate for many UK tracker mortgages, and national indices such as IRCC in Romania or the NRS in Croatia. In Poland, the market is moving from WIBOR to a new reference index.",
        ],
      },
      {
        heading: "What a change in rates does to your repayment",
        paragraphs: [
          `Take a ${eur.formatWhole(200_000)} loan over 25 years. At 3% the monthly repayment is ${eur.format(v3)}. If the reference rate rises by one point, so the rate becomes 4%, the repayment goes up to ${eur.format(v4)}, and at 5% it is ${eur.format(v5)}.`,
          `That is ${eur.format(v5 - v3)} more each month for a two-point rise, before any change in your income. Running your own loan through the calculator at a higher rate is a simple way to test whether you could cope.`,
        ],
      },
      {
        heading: "Fixed rates and fixed periods",
        paragraphs: [
          "A fixed rate stays the same for an agreed period. Some countries fix for the whole term: most French home loans are fixed until the end. Others fix for a period and then set a new rate: German mortgages often have a fixed-rate period (Zinsbindung) of ten years or more, Dutch borrowers choose a rentevaste periode, Czech and Slovak mortgages have a fixation period of a few years, and UK mortgages commonly start with a two- or five-year fixed deal.",
          "Mixed loans combine the two, with an initial fixed period followed by a variable rate. They are widely offered in Spain, Portugal, Romania and Croatia.",
        ],
      },
      {
        heading: "Where variable rates are most common",
        paragraphs: [
          "In Finland most mortgages follow Euribor, commonly the 12-month rate. In the Baltic states housing loans are usually linked to 6-month Euribor. Many Swedish mortgages reset every three months, and most Norwegian mortgages have a floating rate that the bank can change with notice. Spain and Portugal have long used Euribor-linked mortgages, although fixed and mixed loans have become more common.",
        ],
      },
      {
        heading: "Things to weigh up",
        paragraphs: [
          "Which type suits you depends on your budget, how long you plan to keep the loan and how much risk you can take. These questions help you compare offers; they are not advice for your situation.",
        ],
        list: [
          "Could you afford the repayment if the rate rose by two or three points? Test it in the calculator.",
          "How long is the fixed period, and what rate applies after it ends?",
          "What does it cost to repay or switch early? Many countries cap these fees, and the cap is often lower for variable rates.",
          "Does the lender offer a cap on a variable rate, and what does the cap cost?",
          "Compare offers on the APRC, but remember that for a variable loan it assumes today's reference rate stays the same.",
        ],
      },
    ],
    relatedCalculators: ["/countries", "/fi", "/es", "/pt", "/de", "/fr", "/se"],
    sources: [
      { title: "Euribor®", publisher: "European Money Markets Institute (EMMI)", url: "https://www.emmi-benchmarks.eu/" },
      {
        title: "Key ECB interest rates",
        publisher: "European Central Bank",
        url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html",
      },
      MCD,
    ],
    published: "2026-11-17",
    updated: "2026-11-17",
  },
  {
    slug: "annuity-vs-linear-repayment",
    title: "Annuity vs Linear Repayment: Equal Payments or Equal Principal?",
    metaTitle: "Annuity vs Linear Repayment: Which Loan Costs Less?",
    metaDescription:
      "Compare annuity loans (equal payments) with linear loans (equal principal) using a worked example, and see what each is called in the Netherlands, Norway, Finland, Poland and more.",
    intro:
      "Most loan calculators, including ours, assume an annuity: the same repayment every month. In several European countries you can also choose linear repayment, where you pay off the same amount of principal each month and the repayment falls over time. Here is how the two compare.",
    sections: [
      {
        heading: "Annuity repayment: the same amount every month",
        paragraphs: [
          "With an annuity, every repayment is the same. Early on most of it is interest; as the balance falls, more of each repayment goes to principal. It is the standard method for most mortgages and consumer loans, and it is what the LoanCalm calculators model.",
          "Local names include Annuitätendarlehen (Germany), annuïteitenhypotheek (Netherlands), annuitetslån (Norway), annuiteetti (Finland), raty równe (Poland), anuitetas (Lithuania) and аннуитетный платёж (Russia).",
        ],
      },
      {
        heading: "Linear repayment: the same principal every month",
        paragraphs: [
          "With a linear loan you repay an equal slice of the principal each month, plus interest on the remaining balance. The repayment is highest at the start and falls a little every month.",
          "It is called a lineaire hypotheek in the Netherlands, serielån in Norway, tasalyhennys in Finland, raty malejące in Poland, linijinis grafikas in Lithuania, jafnar afborganir in Iceland and дифференцированный платёж in Russia.",
        ],
      },
      {
        heading: "A worked example",
        paragraphs: [
          `Take ${eur.formatWhole(P)} at 4% over 25 years (300 monthly repayments). As an annuity, the repayment is ${eur.format(annuity.scheduledPayment)} every month and the total interest is ${eur.formatWhole(annuity.totalInterest)}.`,
          `As a linear loan, the principal part is ${eur.format(principalPart)} each month. The first repayment is ${eur.format(linearFirst)} and the last is ${eur.format(linearLast)}. The total interest is ${eur.formatWhole(linearInterest)}, which is ${eur.formatWhole(linearSaving)} less than the annuity.`,
        ],
      },
      {
        heading: "Which costs less, and which suits you",
        paragraphs: [
          "A linear loan costs less in total because the balance falls faster, so less interest builds up. The trade-off is a higher repayment in the early years, exactly when many borrowers' budgets are tightest, so lenders may approve a smaller linear loan for the same income.",
          "An annuity keeps repayments level and easier to plan. If you can afford more, you can get part of the linear saving by making extra payments on an annuity loan, if your contract allows them without a fee.",
        ],
        list: [
          "Choose by the repayment you can afford in the first years, not only by the total interest.",
          "Check whether tax rules depend on the repayment type. In the Netherlands, for example, mortgage interest is generally deductible only for annuity or linear loans repaid within 30 years.",
          "Ask the lender for the repayment schedule of both types; under EU rules the pre-contract information sheet must describe the repayment type.",
        ],
      },
      {
        heading: "Working out a linear loan yourself",
        paragraphs: [
          "The LoanCalm calculator shows annuity repayments. For a linear loan, the first repayment is the amount borrowed divided by the number of repayments, plus one month's interest on the full amount: P ÷ n + P × r, where r is the annual rate divided by 12. Each later repayment is lower by the principal part multiplied by r.",
        ],
      },
    ],
    relatedCalculators: ["/countries", "/nl", "/no", "/fi", "/pl", "/de"],
    sources: [MCD],
    published: "2026-11-17",
    updated: "2026-11-17",
  },
];
