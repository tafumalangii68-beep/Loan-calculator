/**
 * Cookie / storage consent, stored in localStorage on the visitor's device.
 * Nothing here is sent to a server.
 */

export const CONSENT_STORAGE_KEY = "lc-consent";
/** Bump this when the categories change so visitors are asked again. */
export const CONSENT_VERSION = 1;
const CHANGE_EVENT = "lc-consent-change";
const OPEN_SETTINGS_EVENT = "lc-open-cookie-settings";

export interface ConsentState {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export type OptionalCategory = "analytics" | "marketing";

export function readRawConsent(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentState>;
    if (value.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: value.analytics === true,
      marketing: value.marketing === true,
      updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }): void {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked (private mode, browser settings). The choice still
    // applies for this page view through the event below.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/** Subscribe for useSyncExternalStore: same-tab saves and other tabs. */
export function subscribeToConsent(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function openCookieSettings(): void {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}

export function onOpenCookieSettings(callback: () => void): () => void {
  window.addEventListener(OPEN_SETTINGS_EVENT, callback);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, callback);
}
