/**
 * Public site configuration. Edit this file — there are no environment
 * variables in this project.
 *
 * BEFORE LAUNCH:
 *   1. Replace `url` with your real domain (no trailing slash).
 *   2. Set `contactEmail` to a real, monitored address.
 *   3. Review `legal.governingLaw` and the legal pages with a qualified adviser.
 */

export const siteConfig = {
  name: "Loan Calculator",
  /** Canonical origin used for canonical URLs, the sitemap and structured data. */
  url: "https://www.loancalculator.example",
  tagline: "Monthly payments, total interest and a full amortization schedule",
  description:
    "Free loan calculator that shows your monthly payment, total interest and a month-by-month amortization schedule. Runs entirely in your browser — no sign-up.",
  locale: "en_US",
  language: "en-US",
  country: "United States",
  /** Set to a real address before launch, e.g. "hello@yourdomain.com". */
  contactEmail: null as string | null,
  /** Date the current versions of the legal pages took effect (ISO format). */
  legalUpdated: "2026-11-13",
  legal: {
    /** Jurisdiction for the Terms. Confirm with a qualified adviser before launch. */
    governingLaw: null as string | null,
  },
  /**
   * Optional third-party services. The site ships with none. If you add one,
   * set it here, load it through components/optional-scripts.tsx (which waits
   * for consent) and update the Privacy and Cookie policies.
   */
  optionalServices: {
    analytics: null as { name: string; src: string } | null,
    marketing: null as { name: string; src: string } | null,
  },
} as const;

export interface NavLink {
  href: string;
  label: string;
  /** Longer label for the mobile menu, where there is room */
  mobileLabel?: string;
}

export const mainNav: NavLink[] = [
  { href: "/mortgage-calculator", label: "Mortgage", mobileLabel: "Mortgage calculator" },
  { href: "/auto-loan-calculator", label: "Auto", mobileLabel: "Auto loan calculator" },
  { href: "/personal-loan-calculator", label: "Personal", mobileLabel: "Personal loan calculator" },
  { href: "/student-loan-calculator", label: "Student", mobileLabel: "Student loan calculator" },
  { href: "/guides", label: "Guides" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Calculators",
    links: [
      { href: "/", label: "Loan calculator" },
      { href: "/mortgage-calculator", label: "Mortgage calculator" },
      { href: "/auto-loan-calculator", label: "Auto loan calculator" },
      { href: "/personal-loan-calculator", label: "Personal loan calculator" },
      { href: "/student-loan-calculator", label: "Student loan calculator" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/guides", label: "All guides" },
      { href: "/guides/how-loan-amortization-works", label: "How amortization works" },
      { href: "/guides/apr-vs-interest-rate", label: "APR vs. interest rate" },
      { href: "/guides/extra-loan-payments", label: "Paying extra on a loan" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms-and-conditions", label: "Terms and conditions" },
      { href: "/cookie-policy", label: "Cookie policy" },
    ],
  },
];

export function absoluteUrl(path = "/"): string {
  if (path === "/") return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
