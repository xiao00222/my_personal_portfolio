import { useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface ProjectImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Classes for the `<img>` itself (layout + hover transforms). */
  className?: string;
}

/**
 * Project screenshot with a loading placeholder.
 *
 * Two things happen while the (lazy-loaded) file is in flight: a shimmering
 * sweep crosses a dark placeholder, and the image itself fades in once decoded.
 * Both are `transform`/`opacity` only.
 *
 * The parent must be positioned — the placeholder is absolutely positioned over
 * the frame.
 */
export function ProjectImage({ src, alt, width, height, className }: ProjectImageProps) {
  const [loaded, setLoaded] = useState(false);
  const reduced = usePrefersReducedMotion();

  return (
    <>
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden bg-gotham-900"
        >
          <span
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-gotham-700/70 to-transparent",
              !reduced && "animate-shimmer",
            )}
          />
        </span>
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  );
}
