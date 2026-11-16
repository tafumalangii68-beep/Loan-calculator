import Image from "next/image";
import { getPageImage, IMAGE_HEIGHT, IMAGE_WIDTH } from "@/lib/images";

/** The illustration for a page, looked up by its path. Renders nothing if the page has none. */
export function PageImage({
  path,
  priority = false,
  sizes = "(min-width: 1024px) 768px, 100vw",
  className = "",
}: {
  path: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const image = getPageImage(path);
  if (!image) return null;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={IMAGE_WIDTH}
      height={IMAGE_HEIGHT}
      sizes={sizes}
      priority={priority}
      className={`h-auto w-full rounded-3xl border border-line bg-white ${className}`}
    />
  );
}
