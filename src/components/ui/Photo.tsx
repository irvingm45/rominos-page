import { photoManifest, type PhotoId } from "@/data/photos.generated";
import type { CSSProperties } from "react";
import { asset } from "@/lib/asset";

interface PhotoProps {
  id: PhotoId;
  /** Spanish description of what the photograph shows; "" only for decorative copies. */
  alt: string;
  /** The rendered width, so the browser picks the right file (e.g. "(min-width: 1024px) 50vw, 100vw"). */
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
}

/** Responsive AVIF/WebP photo built from the files scripts/optimize-images.mjs writes. */
export function Photo({ id, alt, sizes, priority, className, imgClassName, imgStyle }: PhotoProps) {
  const p = photoManifest[id];
  const set = (fmt: "avif" | "webp") => p.widths.map((w) => `${asset(`/img/${id}-${w}.${fmt}`)} ${w}w`).join(", ");
  const fallbackWidth = p.widths.find((w) => w >= 1080) ?? p.widths[p.widths.length - 1];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={asset(`/img/${id}-${fallbackWidth}.webp`)}
        alt={alt}
        width={p.width}
        height={p.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={imgClassName}
        style={{ backgroundImage: `url(${p.blur})`, backgroundSize: "cover", backgroundPosition: "center", ...imgStyle }}
      />
    </picture>
  );
}
