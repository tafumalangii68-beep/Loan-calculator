import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site-config";

interface PageSeo {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is instead of appending the site name. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  noindex?: boolean;
}

export function buildMetadata({ title, description, path, absoluteTitle, type = "website", noindex }: PageSeo): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type,
      url: absoluteUrl(path),
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      // Page-level openGraph replaces the root one, so restate the shared image.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function webPageJsonLd({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    inLanguage: siteConfig.language,
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
  };
}
