import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { guides } from "@/data/guides";
import { getPageImage, IMAGE_HEIGHT, IMAGE_WIDTH } from "@/lib/images";

/**
 * "Blog" item for the desktop header. The link itself goes to the blog index;
 * the panel of posts opens on hover and on keyboard focus, with no JavaScript.
 */
// Newest first; the full list is one click away on the blog page.
const latest = [...guides].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 4);

export function BlogMenu({ label }: { label: string }) {
  return (
    <div className="group relative">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-ink/80 xl:px-3 transition-colors hover:bg-beige hover:text-ink"
      >
        {label}
        <ChevronDown aria-hidden="true" className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </Link>
      <div className="invisible absolute top-full left-1/2 z-40 w-[34rem] -translate-x-1/2 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {/* The header is sticky, so cap the panel at the viewport height and let it scroll inside. */}
        <div className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-white p-3 shadow-lg">
          <p className="px-2 pt-1 pb-2 text-xs font-semibold tracking-wide text-muted uppercase">Latest articles</p>
          <ul>
            {latest.map((guide) => {
              const href = `/guides/${guide.slug}`;
              const image = getPageImage(href);
              return (
                <li key={guide.slug}>
                  <Link href={href} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-beige">
                    {image && (
                      <Image
                        src={image.src}
                        alt=""
                        width={IMAGE_WIDTH}
                        height={IMAGE_HEIGHT}
                        sizes="112px"
                        className="h-auto w-28 shrink-0 rounded-lg border border-line"
                      />
                    )}
                    <span>
                      <span className="block font-semibold text-ink">{guide.title}</span>
                      {/* No `block` here: it would override line-clamp's display and show the full text. */}
                      <span className="mt-0.5 line-clamp-2 text-sm text-muted">{guide.metaDescription}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/guides"
            className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent-soft px-3 py-2.5 text-sm font-semibold text-accent hover:bg-accent-soft/70"
          >
            View all articles
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
