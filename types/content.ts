import type { PresetKey } from "@/lib/calculator-presets";

export interface Faq {
  question: string;
  answer: string;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface Source {
  title: string;
  publisher: string;
  url: string;
}

/** A scenario computed at build time with the same math as the calculator. */
export interface Scenario {
  label: string;
  principal: number;
  ratePercent: number;
  termMonths: number;
  extraMonthly?: number;
}

export interface LoanTypePage {
  slug: string;
  preset: PresetKey;
  /** Short name used in navigation and cards, e.g. "Mortgage" */
  shortName: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  cardSummary: string;
  sections: ContentSection[];
  scenarioHeading: string;
  scenarioIntro: string;
  scenarios: Scenario[];
  scenarioTakeaway: string;
  faqs: Faq[];
  sources: Source[];
}

export interface GuidePage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: ContentSection[];
  scenarios?: { heading: string; intro: string; items: Scenario[]; takeaway: string };
  relatedCalculators: string[];
  sources: Source[];
  published: string;
  updated: string;
}
