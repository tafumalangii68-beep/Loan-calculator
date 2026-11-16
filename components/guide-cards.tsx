import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guides } from "@/data/guides";
import { getPageImage, IMAGE_HEIGHT, IMAGE_WIDTH } from "@/lib/images";

function excerpt(text: string, max = 120) {
  return text.length > max ? `${text.slice(0, max - 3).trimEnd()}…` : text;
}

/** Blog post cards with thumbnails. Pass `exclude` to hide the current post, `slugs` to pick posts. */
export function GuideCards({
  exclude,
  slugs,
  headingLevel = "h3",
}: {
  exclude?: string;
  slugs?: string[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const items = guides.filter((g) => g.slug !== exclude && (!slugs || slugs.includes(g.slug)));

  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((guide) => {
        const href = `/guides/${guide.slug}`;
        const image = getPageImage(href);
        return (
          <li key={guide.slug}>
            <Link
              href={href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-accent/50"
            >
              {image && (
                <Image
                  src={image.src}
                  alt=""
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full border-b border-line"
                />
              )}
              <span className="flex flex-1 flex-col p-5">
                <Heading className="font-semibold text-ink group-hover:text-accent-strong">{guide.title}</Heading>
                <span className="mt-1.5 block flex-1 text-sm leading-relaxed text-muted">
                  {excerpt(guide.metaDescription)}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Read article
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
