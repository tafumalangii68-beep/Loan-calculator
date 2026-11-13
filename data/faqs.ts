import type { Faq } from "@/types/content";

/** Short FAQ shown on the homepage. */
export const homeFaqs: Faq[] = [
  {
    question: "How is the monthly loan payment calculated?",
    answer:
      "It uses the standard amortization formula for fixed-rate loans: Payment = P × r(1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the amount borrowed, r is the annual rate divided by 12 and n is the number of monthly payments. At 0% the payment is simply P ÷ n.",
  },
  {
    question: "Is this loan calculator accurate?",
    answer:
      "For a standard fixed-rate loan with monthly payments, the results match the textbook formula to the cent. Your lender’s figures can differ slightly because of rounding, daily interest accrual, the timing of your first payment, fees or escrow.",
  },
  {
    question: "Should I enter the interest rate or the APR?",
    answer:
      "Enter the interest rate if you have it, because it is what sets your payment. If you only know the APR, use that — the payment will be a slightly conservative estimate when the loan has fees.",
  },
  {
    question: "Are my numbers saved or sent anywhere?",
    answer:
      "No. The calculation happens in your browser using JavaScript. Your loan details are not sent to a server and are not saved, so they disappear when you leave or refresh the page.",
  },
  {
    question: "Does the calculator work for variable-rate loans?",
    answer:
      "It calculates a fixed rate. For a variable-rate loan, enter the current rate to see today’s payment, then try higher rates to see how the payment could change.",
  },
];

/** Extended FAQ for the /faq page. */
export const allFaqs: { heading: string; items: Faq[] }[] = [
  {
    heading: "Using the calculators",
    items: [
      ...homeFaqs.slice(0, 3),
      {
        question: "What does the extra monthly payment field do?",
        answer:
          "It adds the amount you enter to every monthly payment and applies it to principal. The results show how much interest you would save and how much sooner the loan would be paid off, assuming your lender applies extra payments to principal with no penalty.",
      },
      {
        question: "Why does the result change when I switch between years and months?",
        answer:
          "The number in the term field is read in the unit you select. “5 years” and “60 months” are the same loan, but “5 months” is very different. Check that the unit matches your loan offer.",
      },
      {
        question: "Can I calculate a loan with a balloon payment?",
        answer:
          "No. These calculators assume a fully amortizing loan, where equal payments repay the whole balance by the end of the term. A balloon loan leaves a large balance due at the end.",
      },
      {
        question: "Which calculator should I use?",
        answer:
          "Use the main loan calculator for any fixed-rate installment loan. The mortgage and auto calculators add a down payment field, the personal loan calculator estimates APR from an origination fee, and the student loan calculator is set up for standard level-payment plans.",
      },
    ],
  },
  {
    heading: "Privacy and data",
    items: [
      homeFaqs[3],
      {
        question: "Do I need an account?",
        answer: "No. Every calculator is free to use without signing up or giving any personal information.",
      },
      {
        question: "Does this site use cookies?",
        answer:
          "The site uses your browser’s local storage only to remember your cookie choice. We don’t currently run analytics or advertising scripts. You can review or change your choice at any time through “Cookie settings” in the footer.",
      },
    ],
  },
  {
    heading: "Understanding loans",
    items: [
      homeFaqs[4],
      {
        question: "What is the difference between APR and interest rate?",
        answer:
          "The interest rate determines your payment. The APR expresses the yearly cost of the loan including certain fees, which makes it more useful for comparing offers. Our APR vs. interest rate guide explains this in detail.",
      },
      {
        question: "Why is so much of my early payment going to interest?",
        answer:
          "Interest is charged on the remaining balance, which is highest at the start of the loan. As the balance falls, the interest portion shrinks and more of each payment goes to principal. Our amortization guide walks through an example.",
      },
      {
        question: "Is a shorter loan term always better?",
        answer:
          "A shorter term means less total interest, but higher monthly payments. A payment that strains your budget raises the risk of missed payments. Choose a term you can comfortably afford, and consider paying extra when you can.",
      },
    ],
  },
  {
    heading: "About this site",
    items: [
      {
        question: "Is this financial advice?",
        answer:
          "No. The calculators and guides provide general information and estimates. They are not a loan offer, a credit decision or personalized advice. For decisions about your finances, consult your lender or a qualified professional.",
      },
      {
        question: "Are you a lender or a broker?",
        answer:
          "No. We don’t offer loans, collect applications or receive payment from lenders for the results shown. The calculators give the same results no matter which lender you use.",
      },
    ],
  },
];
