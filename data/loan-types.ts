import type { LoanTypePage, Source } from "@/types/content";

const CFPB_MORTGAGES: Source = {
  title: "Mortgages: tools and answers",
  publisher: "Consumer Financial Protection Bureau",
  url: "https://www.consumerfinance.gov/consumer-tools/mortgages/",
};
const CFPB_HOME: Source = {
  title: "Buying a House: tools and resources for homebuyers",
  publisher: "Consumer Financial Protection Bureau",
  url: "https://www.consumerfinance.gov/owning-a-home/",
};
const CFPB_AUTO: Source = {
  title: "Auto loans: tools and answers",
  publisher: "Consumer Financial Protection Bureau",
  url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/",
};
const CFPB_STUDENT: Source = {
  title: "Student loans: tools and answers",
  publisher: "Consumer Financial Protection Bureau",
  url: "https://www.consumerfinance.gov/consumer-tools/student-loans/",
};
const STUDENTAID_REPAY: Source = {
  title: "Repaying your federal student loans",
  publisher: "Federal Student Aid, U.S. Department of Education",
  url: "https://studentaid.gov/manage-loans/repayment",
};
const REG_Z: Source = {
  title: "Regulation Z (Truth in Lending), 12 CFR Part 1026",
  publisher: "Consumer Financial Protection Bureau",
  url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/",
};
const CFPB_CREDIT: Source = {
  title: "Credit reports and scores",
  publisher: "Consumer Financial Protection Bureau",
  url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/",
};

export const loanTypes: LoanTypePage[] = [
  {
    slug: "mortgage-loan-calculator",
    preset: "mortgage",
    shortName: "Mortgage",
    h1: "Mortgage Loan Calculator",
    metaTitle: "Mortgage Loan Calculator: Principal & Interest",
    metaDescription:
      "Estimate your monthly mortgage principal and interest from home price, down payment, rate and term. See total interest, 15- vs 30-year comparisons and a full schedule.",
    intro:
      "Enter the home price, your down payment, the interest rate and the term to estimate the principal and interest part of a fixed-rate mortgage payment.",
    cardSummary: "Home price, down payment and term. Shows principal and interest and compares 15 and 30 years.",
    sections: [
      {
        heading: "What this mortgage calculator includes — and what it leaves out",
        paragraphs: [
          "The result is the principal and interest payment on a fixed-rate mortgage: the part of your payment that repays the loan and pays the lender’s interest. It is what your loan documents call the monthly principal and interest.",
          "Most homeowners pay more than that each month. Lenders often collect property taxes and homeowners insurance through an escrow account, and the full payment is sometimes called PITI (principal, interest, taxes and insurance). Those amounts depend on where you live and the property itself, so ask for local figures and add them to the result.",
        ],
        list: [
          "Property tax — set by your local taxing authority and usually paid through escrow.",
          "Homeowners insurance — required by lenders. Flood or windstorm cover may also be needed in some areas.",
          "Mortgage insurance — conventional loans with less than 20% down usually require private mortgage insurance (PMI). FHA loans have their own mortgage insurance premiums.",
          "HOA or condo dues — paid separately to the association, not to the lender.",
        ],
      },
      {
        heading: "How the down payment changes your loan",
        paragraphs: [
          "The calculator subtracts your down payment from the home price to get the amount you borrow. A larger down payment lowers the loan amount, the monthly payment and the total interest. On many conventional loans, putting down 20% or more also avoids PMI.",
          "A bigger down payment is not automatically the right choice. Money tied up in a house is hard to get back quickly, so many buyers keep an emergency fund and money for closing costs, moving and repairs rather than putting every dollar down.",
        ],
      },
      {
        heading: "Fixed-rate and adjustable-rate mortgages",
        paragraphs: [
          "This calculator assumes a fixed rate, so the principal and interest payment stays the same for the whole term. An adjustable-rate mortgage (ARM) keeps its starting rate for a set period and then resets at set intervals, so its payment can rise or fall. To see a worst case for an ARM, run the calculator a second time using the highest rate the loan’s caps allow.",
        ],
      },
      {
        heading: "Closing costs and points",
        paragraphs: [
          "Closing costs such as lender fees, the appraisal, title insurance and prepaid items are usually paid at closing and are not part of the monthly payment shown here. If you roll some of them into the loan, add them to the home price or lower your down payment by the same amount.",
          "Discount points are an upfront fee paid to get a lower rate. To judge whether points pay off, compare the monthly saving from the lower rate with what the points cost, and think about how long you expect to keep the loan. Your Loan Estimate shows the rate, points and APR side by side.",
        ],
      },
    ],
    scenarioHeading: "15-year vs. 30-year mortgage: a worked example",
    scenarioIntro:
      "A $320,000 loan (a $400,000 home with 20% down) at the same example rate for both terms. Fifteen-year loans are often offered at lower rates than 30-year loans, which would widen the gap shown here.",
    scenarios: [
      { label: "30-year fixed", principal: 320_000, ratePercent: 6.5, termMonths: 360 },
      { label: "15-year fixed", principal: 320_000, ratePercent: 6.5, termMonths: 180 },
      { label: "30-year + $300/mo extra", principal: 320_000, ratePercent: 6.5, termMonths: 360, extraMonthly: 300 },
    ],
    scenarioTakeaway:
      "The 15-year loan costs much more each month but far less in total. Paying extra on a 30-year loan is a middle path: you keep the lower required payment and can stop paying extra if money gets tight.",
    faqs: [
      {
        question: "Does this mortgage calculator include taxes and insurance?",
        answer:
          "No. It calculates principal and interest only, because property tax, insurance and PMI vary widely by location and lender. Add your local estimates to the result to get the full monthly housing payment.",
      },
      {
        question: "How much should I put down on a house?",
        answer:
          "There is no single right amount. Some loan programs allow 3.5% or even 0% down, while 20% down on a conventional loan usually avoids PMI. Weigh a lower payment against keeping savings for emergencies and closing costs.",
      },
      {
        question: "Why is my lender’s payment slightly different?",
        answer:
          "Lenders round to the cent each month, and the first payment can include part-month interest. The full payment also includes escrow for taxes and insurance. Differences of a few dollars are normal.",
      },
      {
        question: "Can I use this for a refinance?",
        answer:
          "Yes. Enter your current balance as the home price, leave the down payment blank, and enter the new rate and term. Remember that refinancing has closing costs, which this calculator does not include.",
      },
    ],
    sources: [CFPB_HOME, CFPB_MORTGAGES, REG_Z],
  },
  {
    slug: "auto-loan-calculator",
    preset: "auto",
    shortName: "Auto",
    h1: "Auto Loan Calculator",
    metaTitle: "Auto Loan Calculator: Monthly Car Payment Estimate",
    metaDescription:
      "Estimate your monthly car payment from vehicle price, down payment, trade-in, APR and term. Compare 48-, 60- and 72-month loans and see the total interest.",
    intro:
      "Estimate your monthly car payment from the vehicle price, your down payment and trade-in, the APR and the number of months. Compare terms before you visit the dealer.",
    cardSummary: "Vehicle price, trade-in and term in months. Shows how longer terms raise the total interest.",
    sections: [
      {
        heading: "What to enter as the vehicle price",
        paragraphs: [
          "Use the amount you will actually finance before your down payment. That usually means the negotiated price plus any sales tax, title, registration and dealer fees you are rolling into the loan, plus any add-ons such as service contracts or GAP coverage that you agree to finance.",
          "If you are trading in a car that still has a loan on it, subtract what you still owe from its trade-in value before entering it in the down payment field. If you owe more than the car is worth (negative equity), add the difference to the vehicle price instead, because it will be added to your new loan.",
        ],
      },
      {
        heading: "Why the loan term matters so much",
        paragraphs: [
          "Car loans are usually quoted in months, often from 36 to 84. Stretching the term lowers the monthly payment, which can make a more expensive car look affordable. But you pay interest for longer, and longer terms often come with higher rates.",
          "Cars lose value quickly. On a long loan with a small down payment, you can owe more than the car is worth for much of the loan. That matters if the car is totaled or you want to sell or trade it early.",
        ],
      },
      {
        heading: "Shopping for financing before you shop for the car",
        paragraphs: [
          "Dealers can arrange financing through partner lenders, and the rate you are offered may include a dealer markup. Getting a preapproval from a bank or credit union first gives you a rate to compare against. Run both offers through this calculator using the same price and term to compare them fairly.",
          "Focus on the total price and the APR, not only the monthly payment. A lower monthly payment that comes from a longer term or a higher price is not a better deal.",
        ],
        list: [
          "Compare offers by APR and total of payments, not only the monthly figure.",
          "Ask for the price of each add-on separately, and know that most are optional.",
          "Check whether there is a prepayment penalty if you plan to pay the loan off early.",
        ],
      },
    ],
    scenarioHeading: "Comparing 48, 60 and 72 months",
    scenarioIntro:
      "The same $30,000 loan (a $35,000 car with $5,000 down) at the same example rate over three common terms. In practice, lenders often charge higher rates on longer terms, so the real gap is usually larger.",
    scenarios: [
      { label: "48 months", principal: 30_000, ratePercent: 7, termMonths: 48 },
      { label: "60 months", principal: 30_000, ratePercent: 7, termMonths: 60 },
      { label: "72 months", principal: 30_000, ratePercent: 7, termMonths: 72 },
    ],
    scenarioTakeaway:
      "Going from 48 to 72 months cuts the monthly payment noticeably but increases the total interest by roughly half — on a car that keeps losing value the whole time.",
    faqs: [
      {
        question: "Should I enter the APR or the interest rate?",
        answer:
          "Enter the APR from your auto loan offer if that’s all you have. For most car loans with few upfront finance charges, the APR and the note rate are close, and the APR gives a more complete picture of the cost.",
      },
      {
        question: "Does the calculator include sales tax?",
        answer:
          "Only if you include it. Sales tax rules differ by state and some states tax only the difference after a trade-in, so add the tax you will finance to the vehicle price.",
      },
      {
        question: "What does a 0% APR offer cost?",
        answer:
          "Enter 0 as the rate and the payment is simply the amount borrowed divided by the months. Manufacturers sometimes offer either 0% financing or a cash rebate. Compare both by running the rebate scenario at the rate you could get elsewhere.",
      },
      {
        question: "Is it better to lease or buy?",
        answer:
          "This calculator covers buying with a loan. Leases are priced differently, using residual value and a money factor, so lease payments cannot be compared directly with these results.",
      },
    ],
    sources: [CFPB_AUTO, REG_Z],
  },
  {
    slug: "personal-loan-calculator",
    preset: "personal",
    shortName: "Personal",
    h1: "Personal Loan Calculator",
    metaTitle: "Personal Loan Calculator with Origination Fee & APR",
    metaDescription:
      "Calculate your personal loan payment and see how an origination fee raises the APR. Includes total interest, payoff time and an amortization schedule.",
    intro:
      "Calculate the monthly payment on a fixed-rate personal loan and see how an origination fee raises the true cost. The APR estimate shows what the fee does to your rate.",
    cardSummary: "Includes an origination fee field and estimates the APR, so you can compare offers fairly.",
    sections: [
      {
        heading: "Why the origination fee matters",
        paragraphs: [
          "Many personal loans charge an origination fee, usually a percentage of the loan, that is taken out of the money you receive. If you borrow $15,000 with a 3% fee, you receive $14,550 but repay the full $15,000 plus interest.",
          "Because of this, the interest rate alone understates the cost. The annual percentage rate (APR) includes the fee, and US lenders must disclose it under the Truth in Lending Act. This calculator estimates the APR by finding the rate at which your payments equal the cash you actually receive.",
          "If you need a specific amount in hand, divide it by one minus the fee. For example, to receive $10,000 with a 5% fee, you would need to borrow about $10,526.",
        ],
      },
      {
        heading: "Comparing personal loan offers",
        paragraphs: [
          "Offers with different rates, fees and terms are hard to compare by monthly payment alone. Run each offer through the calculator, then compare:",
        ],
        list: [
          "APR — the best single number for comparing the cost of loans with the same term.",
          "Total of payments — what you will pay in total if you keep the loan to the end.",
          "Monthly payment — whether it fits your budget with room to spare.",
          "Prepayment terms — whether you can pay early without a penalty.",
        ],
      },
      {
        heading: "Using a personal loan to consolidate debt",
        paragraphs: [
          "A fixed-rate personal loan can replace higher-rate debts such as credit card balances with one payment and a set payoff date. It saves money only if the new APR is lower and you avoid building up new balances on the cards you paid off.",
          "To check, add up the current balances, enter them as the loan amount, and compare the total interest with what you would pay by keeping the cards and paying the same monthly amount.",
        ],
      },
      {
        heading: "What affects the rate you are offered",
        paragraphs: [
          "Lenders set personal loan rates mainly from your credit history, income, existing debts and the loan term. Many lenders offer prequalification with a soft credit check, which shows likely rates without affecting your credit score. The formal application usually involves a hard inquiry.",
        ],
      },
    ],
    scenarioHeading: "Same rate, different terms",
    scenarioIntro:
      "A $15,000 loan at an example 12% rate repaid over three terms. Personal loans commonly range from one to seven years.",
    scenarios: [
      { label: "24 months", principal: 15_000, ratePercent: 12, termMonths: 24 },
      { label: "36 months", principal: 15_000, ratePercent: 12, termMonths: 36 },
      { label: "60 months", principal: 15_000, ratePercent: 12, termMonths: 60 },
    ],
    scenarioTakeaway:
      "Choosing the shortest term you can comfortably afford keeps the total interest down. A longer term gives more breathing room each month but costs more overall.",
    faqs: [
      {
        question: "Why is my APR higher than my interest rate?",
        answer:
          "The APR includes finance charges such as the origination fee. Because the fee reduces the cash you receive while your payments stay the same, the effective yearly cost is higher than the stated interest rate.",
      },
      {
        question: "Is the origination fee added to the loan or taken out?",
        answer:
          "Most lenders deduct it from the amount you receive, which is what this calculator assumes. Some add it to the balance instead. Check your loan agreement — the Truth in Lending disclosure shows the amount financed.",
      },
      {
        question: "Can I pay off a personal loan early?",
        answer:
          "Many personal loans have no prepayment penalty, but check your agreement. Use the extra payment field to see how much interest paying early could save.",
      },
      {
        question: "Does the APR estimate match my disclosure exactly?",
        answer:
          "It should be close for a standard fixed-rate loan with the fee deducted at the start. Your lender’s disclosure is the official figure and may reflect other finance charges or a different first-payment date.",
      },
    ],
    sources: [REG_Z, CFPB_CREDIT],
  },
  {
    slug: "student-loan-calculator",
    preset: "student",
    shortName: "Student",
    h1: "Student Loan Calculator",
    metaTitle: "Student Loan Calculator: Payment & Payoff Estimate",
    metaDescription:
      "Estimate fixed student loan payments on a standard repayment schedule, see total interest, and find out how extra payments shorten your payoff.",
    intro:
      "Estimate your monthly payment on a fixed-rate student loan with level payments, like a standard 10-year plan, and see how much extra payments could save.",
    cardSummary: "Level-payment plans like the standard 10-year plan, with extra-payment savings.",
    sections: [
      {
        heading: "Which repayment plans this calculator covers",
        paragraphs: [
          "The calculator models a fixed rate with equal monthly payments until the loan is paid off. That matches the federal Standard Repayment Plan and most private student loans once repayment begins.",
          "It does not model income-driven repayment, graduated plans that start low and rise, deferment, forbearance or loan forgiveness. Federal repayment options have changed in recent years, so check StudentAid.gov or your loan servicer for the plans available to you now.",
        ],
      },
      {
        heading: "Enter the balance when repayment starts",
        paragraphs: [
          "On many student loans, including federal unsubsidized loans and most private loans, interest builds up while you are in school and during any grace period. When repayment begins, unpaid interest may be capitalized, which means it is added to your principal and then earns interest itself.",
          "For an accurate estimate, enter your expected balance at the start of repayment, not the amount you originally borrowed. Your servicer’s account page shows the current principal and any accrued interest.",
        ],
      },
      {
        heading: "If you have several loans",
        paragraphs: [
          "Federal borrowers often have a separate loan for each school year, each with its own rate. You can run each loan separately and add up the payments. You can also estimate the combined picture by entering the total balance with a balance-weighted average rate.",
          "A federal Direct Consolidation Loan combines federal loans into one, using the weighted average rate rounded up to the nearest one-eighth of a percent. Refinancing federal loans with a private lender can lower the rate for some borrowers, but you permanently lose federal benefits such as income-driven plans and federal forgiveness programs.",
        ],
      },
      {
        heading: "Paying extra on student loans",
        paragraphs: [
          "Extra payments can shorten your payoff and cut interest, especially on higher-rate loans. Ask your servicer to apply extra amounts to principal on your highest-rate loan. Otherwise, the extra may be applied to accrued interest first or treated as an early payment of your next bill.",
        ],
      },
    ],
    scenarioHeading: "Standard 10-year payments, with and without extra",
    scenarioIntro: "A $30,000 balance at an example 6% fixed rate.",
    scenarios: [
      { label: "10-year standard", principal: 30_000, ratePercent: 6, termMonths: 120 },
      { label: "10-year + $100/mo extra", principal: 30_000, ratePercent: 6, termMonths: 120, extraMonthly: 100 },
      { label: "20-year term", principal: 30_000, ratePercent: 6, termMonths: 240 },
    ],
    scenarioTakeaway:
      "An extra $100 a month takes years off the loan. Stretching the same balance over 20 years lowers the payment but more than doubles the interest.",
    faqs: [
      {
        question: "Does this work for federal student loans?",
        answer:
          "Yes, for fixed-payment plans such as the Standard Repayment Plan. Federal loans have fixed rates set when each loan is disbursed. Income-driven plans base payments on income and family size, which this calculator does not model.",
      },
      {
        question: "What rate should I use if I have several loans?",
        answer:
          "Use a balance-weighted average: multiply each balance by its rate, add the results, and divide by the total balance. Or run each loan separately for more precise results.",
      },
      {
        question: "Does the calculator account for interest during school?",
        answer:
          "Not directly. Enter the balance you expect when repayment starts, including any interest that will be capitalized, to account for it.",
      },
      {
        question: "Can a variable-rate private loan be calculated?",
        answer:
          "Only as a snapshot. Enter today’s rate to see the current payment, then try higher rates to see how the payment could change if the rate rises.",
      },
    ],
    sources: [STUDENTAID_REPAY, CFPB_STUDENT],
  },
];

export function getLoanType(slug: string) {
  return loanTypes.find((page) => page.slug === slug);
}
