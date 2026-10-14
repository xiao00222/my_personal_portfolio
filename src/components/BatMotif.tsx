import { useId } from "react";

import { cn } from "@/lib/utils";

interface BatMotifProps {
  className?: string;
  /** Draws the halo rings of a bat-signal behind the silhouette. */
  withSignal?: boolean;
  title?: string;
}

/**
 * Original bat-wing mark — drawn from scratch for this project.
 *
 * It is NOT the trademarked Batman emblem: the silhouette is generated from a
 * single half-wing path that is mirrored, giving a geometric, slightly angular
 * shape. No third-party artwork or logo is used anywhere in the site.
 *
 * Notes:
 *  - Every gradient/path id is namespaced with `useId()` so the many instances
 *    on the page don't collide (duplicate ids are invalid HTML and make
 *    `url(#…)` references resolve unpredictably).
 *  - There are deliberately no width/height utilities on the base class: a
 *    `w-full` here used to fight the `h-*`/`w-*` classes callers pass, blowing
 *    the glyph up to fill its parent. Each call site sets its own size.
 */
export function BatMotif({ className, withSignal = false, title }: BatMotifProps) {
  const uid = useId().replace(/:/g, "");
  const fillId = `bat-fill-${uid}`;
  const haloId = `bat-signal-halo-${uid}`;
  const halfId = `bat-half-${uid}`;

  const labelled = Boolean(title);

  return (
    <svg
      viewBox="0 0 200 110"
      className={cn("block", className)}
      role={labelled ? "img" : "presentation"}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.72" />
        </linearGradient>

        <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="var(--color-signal)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>

        {/* Right half of the silhouette; mirrored below to guarantee symmetry. */}
        <path
          id={halfId}
          d="M100 20 L103.5 7 L108 23
             C138 26 172 34 198 52
             C176 55 152 61 132 71
             L124 55
             C118 68 110 84 100 100 Z"
        />
      </defs>

      {withSignal && (
        <>
          <circle cx="100" cy="55" r="52" fill={`url(#${haloId})`} />
          <circle
            cx="100"
            cy="55"
            r="46"
            fill="none"
            stroke="var(--color-signal)"
            strokeOpacity="0.22"
            strokeWidth="0.75"
          />
          <circle
            cx="100"
            cy="55"
            r="38"
            fill="none"
            stroke="var(--color-signal)"
            strokeOpacity="0.14"
            strokeWidth="0.75"
            strokeDasharray="3 5"
          />
        </>
      )}

      <g fill={`url(#${fillId})`}>
        <use href={`#${halfId}`} />
        <use href={`#${halfId}`} transform="translate(200 0) scale(-1 1)" />
      </g>
    </svg>
  );
}
