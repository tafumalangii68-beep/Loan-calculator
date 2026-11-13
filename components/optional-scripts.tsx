"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { parseConsent, readRawConsent, subscribeToConsent } from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

/**
 * Loads optional third-party scripts only after the visitor has opted in.
 * The site ships with no optional services configured, so this renders
 * nothing. To add one, set it in lib/site-config.ts and update the
 * Privacy and Cookie policies.
 */
export function OptionalScripts() {
  const raw = useSyncExternalStore(subscribeToConsent, readRawConsent, () => null);
  const consent = parseConsent(raw);
  const { analytics, marketing } = siteConfig.optionalServices;

  return (
    <>
      {analytics && consent?.analytics && <Script src={analytics.src} strategy="afterInteractive" />}
      {marketing && consent?.marketing && <Script src={marketing.src} strategy="afterInteractive" />}
    </>
  );
}
