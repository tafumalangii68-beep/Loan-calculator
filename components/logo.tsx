import { siteConfig } from "@/lib/site-config";

/** LoanCalm mark: a single leaf on a forest-green tile — calm, steady growth. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={`shrink-0 ${className}`}>
      <rect width="32" height="32" rx="9" fill="#205C40" />
      <path d="M8.5 23.5C8.5 14 14 8.5 23.5 8.5 23.5 18 18 23.5 8.5 23.5Z" fill="#E9F0E4" />
      <path d="M9.5 22.5 18.5 13.5" stroke="#205C40" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13.2 18.8h4.3M15.8 16.2v-3.4" stroke="#205C40" strokeWidth="1.3" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

/** Mark + wordmark, with the tagline underneath where there is room. */
export function Logo({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.35rem] font-semibold tracking-tight text-ink">
          Loan<span className="text-accent">Calm</span>
        </span>
        {showTagline && (
          <span className="mt-1 hidden text-[0.68rem] font-medium tracking-wide text-muted sm:block">
            {siteConfig.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
