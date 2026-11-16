import { siteConfig } from "@/lib/site-config";

/** LoanCalm mark: three shrinking bars on a green tile — a balance paid down over time. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={`shrink-0 ${className}`}>
      <rect width="32" height="32" rx="9" fill="#205C40" />
      <g fill="#fff">
        <rect x="4" y="8" width="24.5" height="4.2" rx="2.1" />
        <rect x="4" y="14.1" width="17.6" height="4.2" rx="2.1" />
        <rect x="4" y="20.2" width="12.2" height="4.2" rx="2.1" />
      </g>
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
          <span className="mt-1 hidden text-[0.68rem] font-medium tracking-wide text-muted sm:block lg:hidden xl:block">
            {siteConfig.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
