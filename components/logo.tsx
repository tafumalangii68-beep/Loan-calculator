import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

/**
 * LoanCalm logo: calculator, house, car and coins with the wordmark and
 * tagline. Transparent WebP (472×144) shown at up to 48px tall, so it stays
 * sharp on high-density screens. The surrounding link carries the
 * accessible name, so the image itself is decorative.
 */
export function Logo({ className = "h-11 sm:h-12" }: { className?: string }) {
  return (
    <Image
      src="/logo.webp"
      alt=""
      width={472}
      height={144}
      priority
      unoptimized
      className={`w-auto ${className}`}
      title={`${siteConfig.name} — ${siteConfig.tagline}`}
    />
  );
}
