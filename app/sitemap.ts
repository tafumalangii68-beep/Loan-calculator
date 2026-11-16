import type { MetadataRoute } from "next";
import { loanTypes } from "@/data/loan-types";
import { guides } from "@/data/guides";
import { countries } from "@/data/countries";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified,
    priority,
  });
  const launched = "2026-11-13";
  const europeLaunched = "2026-11-17";

  return [
    page("/", launched, 1),
    ...loanTypes.map((p) => page(`/${p.slug}`, launched, 0.9)),
    page("/countries", europeLaunched, 0.8),
    ...countries.map((c) => page(`/${c.slug}`, europeLaunched, 0.8)),
    page("/guides", launched, 0.6),
    ...guides.map((g) => page(`/guides/${g.slug}`, g.updated, 0.7)),
    page("/faq", launched, 0.5),
    page("/about", launched, 0.4),
    page("/contact", launched, 0.3),
    page("/disclaimer", siteConfig.legalUpdated, 0.2),
    page("/privacy-policy", siteConfig.legalUpdated, 0.2),
    page("/terms-and-conditions", siteConfig.legalUpdated, 0.2),
    page("/cookie-policy", siteConfig.legalUpdated, 0.2),
  ];
}
