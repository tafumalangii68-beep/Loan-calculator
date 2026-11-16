/**
 * Illustrations in /public/images (1600×900 WebP). One per page, keyed by the
 * page path, so pages, cards and menus can all show the same picture.
 */
export interface SiteImage {
  src: string;
  alt: string;
}

export const IMAGE_WIDTH = 1600;
export const IMAGE_HEIGHT = 900;

export const pageImages: Record<string, SiteImage> = {
  "/": {
    src: "/images/home-hero.webp",
    alt: "Relaxed person at a desk with a laptop showing a falling loan balance chart, a cup of tea and a calculator",
  },
  "/mortgage-loan-calculator": {
    src: "/images/mortgage-loan-calculator.webp",
    alt: "House with green roof, a set of keys and a chart of mortgage balance going down",
  },
  "/auto-loan-calculator": {
    src: "/images/auto-loan-calculator.webp",
    alt: "White car beside a payment calendar with monthly payments checked off and a stack of coins",
  },
  "/personal-loan-calculator": {
    src: "/images/personal-loan-calculator.webp",
    alt: "Wallet with cash, coins and a checklist, with a declining balance chart behind them",
  },
  "/student-loan-calculator": {
    src: "/images/student-loan-calculator.webp",
    alt: "Graduation cap on a stack of books next to a laptop showing a payoff progress bar",
  },
  "/guides": {
    src: "/images/blog.webp",
    alt: "Open notebook with charts and checklists, a magnifying glass and a pencil",
  },
  "/guides/how-loan-amortization-works": {
    src: "/images/how-loan-amortization-works.webp",
    alt: "Stacked bar chart where the principal share of each payment grows and the interest share shrinks over time",
  },
  "/guides/extra-loan-payments": {
    src: "/images/extra-loan-payments.webp",
    alt: "Shortcut arrow with growing coin stacks skipping a long winding road to reach the finish flag sooner",
  },
  "/guides/apr-vs-interest-rate": {
    src: "/images/apr-vs-interest-rate.webp",
    alt: "Balance scale comparing two loan offers, the side with extra fee tags weighing more",
  },
  "/guides/apr-names-in-europe": {
    src: "/images/apr-names-in-europe.webp",
    alt: "Flags of France, Spain, Poland, Germany, Italy and the United Kingdom next to a percent sign",
  },
  "/guides/fixed-vs-variable-rates-europe": {
    src: "/images/fixed-vs-variable-rates-europe.webp",
    alt: "Chart comparing a flat fixed-rate line with a variable rate that rises and falls",
  },
  "/guides/annuity-vs-linear-repayment": {
    src: "/images/annuity-vs-linear-repayment.webp",
    alt: "Two bar charts: equal annuity payments on the left, falling linear payments on the right",
  },
  "/about": {
    src: "/images/about.webp",
    alt: "Three people working together at a table with a laptop, notebook and calculator",
  },
  "/faq": {
    src: "/images/faq.webp",
    alt: "Speech bubbles with a question mark and a check mark",
  },
  "/contact": {
    src: "/images/contact.webp",
    alt: "Envelope flying out of a laptop screen with a paper plane trail",
  },
};

export function getPageImage(path: string): SiteImage | undefined {
  return pageImages[path];
}
