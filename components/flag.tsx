import Image from "next/image";

/**
 * Country flag as a small image. Emoji flags don't render on Windows, so the
 * site uses tiny WebP flags from /public/flags (flag-icons, MIT licence).
 * Decorative by default: the country name is always shown next to it.
 */
export function Flag({ code, className = "h-4 w-auto", alt = "" }: { code: string; className?: string; alt?: string }) {
  return (
    <Image
      src={`/flags/${code.toLowerCase()}.webp`}
      alt={alt}
      width={160}
      height={120}
      unoptimized
      className={`shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(37,37,34,0.12)] ${className}`}
    />
  );
}
