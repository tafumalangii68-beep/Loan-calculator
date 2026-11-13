import { calculateLoan, calculatePayment, estimateApr } from "@/lib/loan-math";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { GuidePage } from "@/types/content";

// Worked numbers are computed with the calculator's own functions so the
// text can never drift from what the tool shows.
const amort = calculateLoan(20_000, 6, 60);
const [m1, m2] = amort.schedule;
const last = amort.schedule.at(-1)!;

const aprPayment = calculatePayment(10_000, 10, 36);
const aprEstimate = estimateApr(10_000, 10, 36, 500);

const extraBase = calculateLoan(250_000, 6.5, 360);
const extra100 = calculateLoan(250_000, 6.5, 360, 100);

export const guides: GuidePage[] = [
  {
    slug: "how-loan-amortization-works",
    title: "How Loan Amortization Works",
    metaTitle: "How Loan Amortization Works (With a Worked Example)",
    metaDescription:
      "Learn how amortization splits each loan payment between interest and principal, why early payments are mostly interest, and how to read an amortization schedule.",
    intro:
      "Amortization is how a fixed loan payment pays off both interest and the balance on a set schedule. Once you understand it, an amortization schedule is easy to read and it is clear why extra payments help most early on.",
    sections: [
      {
        heading: "The idea in one paragraph",
        paragraphs: [
          "With an amortizing loan you make the same payment every month. Each month the lender first charges interest on the balance you still owe. Whatever is left of your payment reduces the balance. Because the balance shrinks, next month’s interest is a little lower, so a little more of the same payment goes to principal. This repeats until the balance reaches zero on the final scheduled payment.",
        ],
      },
      {
        heading: "A worked example",
        paragraphs: [
          `Take a $20,000 loan at 6% for five years. The monthly rate is 6% ÷ 12 = 0.5%, and the payment works out to ${formatCurrency(amort.scheduledPayment)}.`,
          `Month 1: interest is $20,000 × 0.5% = ${formatCurrency(m1.interest)}, so ${formatCurrency(m1.principal)} of the payment reduces the balance to ${formatCurrency(m1.balance)}.`,
          `Month 2: interest is charged on the lower balance — ${formatCurrency(m2.interest)} — so slightly more, ${formatCurrency(m2.principal)}, goes to principal.`,
          `Month 60: only ${formatCurrency(last.interest)} is interest and ${formatCurrency(last.principal)} is principal. Over the whole loan you pay ${formatCurrency(amort.totalInterest)} in interest.`,
        ],
      },
      {
        heading: "The payment formula",
        paragraphs: [
          "The fixed payment M that pays off a loan of P over n months at monthly rate r is M = P × r(1 + r)ⁿ ÷ ((1 + r)ⁿ − 1). With a 0% rate, the formula reduces to P ÷ n. Our calculators use this formula, then build the schedule month by month as described above.",
          "Real lenders round each payment to the cent, and the last payment is adjusted to clear any remaining cents. Some loans, including many auto and student loans, accrue interest daily, so the exact split depends on when your payment arrives. These differences are usually small.",
        ],
      },
      {
        heading: "Reading an amortization schedule",
        paragraphs: ["Each row of a schedule shows one payment. The columns usually include:"],
        list: [
          "Payment number or date.",
          "Interest — the balance multiplied by the monthly rate.",
          "Principal — the payment minus the interest.",
          "Remaining balance — last month’s balance minus this month’s principal.",
        ],
      },
      {
        heading: "Why early payments matter most",
        paragraphs: [
          "Interest is charged on the outstanding balance, so it is highest at the start. On long loans such as 30-year mortgages, most of each early payment is interest. Any extra principal you pay early removes that balance before it can earn interest for the many months left, which is why early extra payments save the most.",
        ],
      },
      {
        heading: "Loans that don’t amortize this way",
        paragraphs: [
          "Interest-only loans, balloon loans, credit cards and lines of credit do not follow a fixed amortization schedule. Income-driven student loan plans can also leave the balance growing if payments are less than the interest. Our calculators assume a standard fully amortizing loan.",
        ],
      },
    ],
    relatedCalculators: ["/", "/mortgage-loan-calculator"],
    sources: [
      {
        title: "Regulation Z (Truth in Lending), 12 CFR Part 1026",
        publisher: "Consumer Financial Protection Bureau",
        url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/",
      },
      {
        title: "Mortgages: tools and answers",
        publisher: "Consumer Financial Protection Bureau",
        url: "https://www.consumerfinance.gov/consumer-tools/mortgages/",
      },
    ],
    published: "2026-11-13",
    updated: "2026-11-13",
  },
  {
    slug: "apr-vs-interest-rate",
    title: "APR vs. Interest Rate: What’s the Difference?",
    metaTitle: "APR vs. Interest Rate: What’s the Difference?",
    metaDescription:
      "The interest rate sets your payment, while the APR also includes fees. Learn how APR is calculated, when the two differ, and how to compare loan offers.",
    intro:
      "Loan offers show two rates: the interest rate and the APR. They answer different questions, and mixing them up is one of the easiest ways to misjudge a loan.",
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "The interest rate (sometimes called the note rate) is what the lender charges on the money you owe. It determines your monthly payment. The annual percentage rate (APR) expresses the yearly cost of credit, including certain fees as well as interest. In the US, the Truth in Lending Act and its Regulation Z require lenders to disclose the APR so that consumers can compare offers.",
        ],
      },
      {
        heading: "Why the APR is usually higher",
        paragraphs: [
          "Finance charges such as origination fees, discount points and some closing costs reduce the money you effectively receive, while your payments stay the same. The APR is the rate that makes your payments equal to the amount you actually received. More fees mean a higher APR.",
          `Example: you borrow $10,000 at 10% for 36 months. The payment is ${formatCurrency(aprPayment)}. If a $500 origination fee is deducted, you receive $9,500 but still make the same payments. The APR comes out to about ${formatPercent(aprEstimate)}, well above the 10% interest rate.`,
        ],
      },
      {
        heading: "How to use each number",
        paragraphs: [],
        list: [
          "Use the interest rate to calculate your monthly payment and your amortization schedule.",
          "Use the APR to compare the overall cost of loans with the same term and amount.",
          "Use the total of payments to see what you will pay in total if you keep the loan to the end.",
        ],
      },
      {
        heading: "When APR can mislead",
        paragraphs: [
          "APR spreads upfront fees over the full loan term. If you expect to repay or refinance early, upfront fees cost you more per year than the APR suggests, so an offer with low fees and a slightly higher rate may be cheaper for you.",
          "For adjustable-rate loans, the disclosed APR is based on assumptions about future rates, so it says less about what you will actually pay. And APR does not include every cost: for mortgages, items such as homeowners insurance and property taxes are not part of it.",
        ],
      },
      {
        heading: "APR vs. APY",
        paragraphs: [
          "APY (annual percentage yield) includes the effect of compounding and is used mainly for savings accounts. Loan APRs in the US are nominal annual rates: the monthly rate multiplied by 12. That is why a loan at 12% APR charges 1% a month.",
        ],
      },
    ],
    relatedCalculators: ["/personal-loan-calculator", "/"],
    sources: [
      {
        title: "Regulation Z (Truth in Lending), 12 CFR Part 1026",
        publisher: "Consumer Financial Protection Bureau",
        url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/",
      },
      {
        title: "12 CFR Part 1026 — Truth in Lending (Regulation Z)",
        publisher: "Electronic Code of Federal Regulations",
        url: "https://www.ecfr.gov/current/title-12/chapter-X/part-1026",
      },
    ],
    published: "2026-11-13",
    updated: "2026-11-13",
  },
  {
    slug: "extra-loan-payments",
    title: "Paying Extra on a Loan: How Much Can You Save?",
    metaTitle: "Paying Extra on a Loan: How Much Interest You Save",
    metaDescription:
      "See how extra principal payments shorten a loan and reduce interest, what to check with your lender first, and when paying extra may not be the best use of money.",
    intro:
      "Extra payments go straight to principal, so they cut the interest you pay and shorten the loan. Here is how much difference they make and what to check before you start.",
    sections: [
      {
        heading: "What an extra payment does",
        paragraphs: [
          "Your required payment covers each month’s interest plus scheduled principal. Anything extra, applied to principal, lowers the balance immediately. Interest each month is based on that balance, so every later month costs less interest, and the loan ends early.",
          "Your required payment usually doesn’t change on a fixed-rate installment loan. The loan simply finishes sooner.",
        ],
      },
      {
        heading: "An example",
        paragraphs: [
          `On a $250,000, 30-year loan at 6.5%, the required payment is ${formatCurrency(extraBase.scheduledPayment)} and the total interest over 30 years is about ${formatCurrency(extraBase.totalInterest)}.`,
          `Adding $100 a month cuts the total interest to about ${formatCurrency(extra100.totalInterest)}, a saving of ${formatCurrency(extra100.interestSaved)}, and the loan is paid off ${Math.floor(extra100.monthsSaved / 12)} years and ${extra100.monthsSaved % 12} months early.`,
        ],
      },
      {
        heading: "Check these with your lender first",
        paragraphs: [],
        list: [
          "Prepayment penalties: some loans charge a fee for paying early. Your loan agreement will say.",
          "How extra is applied: ask for extra amounts to go to principal, not toward next month’s payment. Many servicers let you choose this online.",
          "Multiple loans: with several loans (for example, student loans), ask to apply extra to the loan with the highest rate.",
        ],
      },
      {
        heading: "When paying extra might not be the best move",
        paragraphs: [
          "Paying extra earns you a guaranteed return equal to the loan’s rate, but the money becomes hard to get back. Before paying extra on a low-rate loan, many people first build an emergency fund, pay off higher-rate debts such as credit cards, and take any employer retirement match. The right order depends on your situation, and a qualified adviser can help you weigh it.",
        ],
      },
      {
        heading: "Other ways to pay down faster",
        paragraphs: [
          "Biweekly payments — half a payment every two weeks — add up to 26 half-payments, or 13 full payments a year, which works like one extra payment a year. Some servicers charge fees for biweekly programs, and you can get the same result by adding one-twelfth of a payment to each monthly payment. Lump sums, such as part of a tax refund, also work well, especially early in the loan.",
        ],
      },
    ],
    relatedCalculators: ["/", "/mortgage-loan-calculator", "/student-loan-calculator"],
    sources: [
      {
        title: "Mortgages: tools and answers",
        publisher: "Consumer Financial Protection Bureau",
        url: "https://www.consumerfinance.gov/consumer-tools/mortgages/",
      },
      {
        title: "Repaying your federal student loans",
        publisher: "Federal Student Aid, U.S. Department of Education",
        url: "https://studentaid.gov/manage-loans/repayment",
      },
    ],
    published: "2026-11-13",
    updated: "2026-11-13",
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
