"use client";

import { openCookieSettings } from "@/lib/consent";

export function CookieSettingsButton({ className, label = "Cookie settings" }: { className?: string; label?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {label}
    </button>
  );
}
