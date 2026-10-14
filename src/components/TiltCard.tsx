import { useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { useIsFinePointer } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  /** Adds a light sheen that tracks the pointer. */
  glare?: boolean;
}

/**
 * 3D tilt on hover.
 *
 * - Writes `transform` directly to the node from a rAF callback: no React state,
 *   so hovering never re-renders the section (important with card lists).
 * - The follow transform is deliberately **not** transitioned. A CSS transition
 *   on a property that is rewritten every frame restarts a fresh ease each time,
 *   so the card lags behind the pointer and keeps drifting for a moment after it
 *   stops — it reads as the card dodging the cursor. Only the snap-back on
 *   pointer-leave is animated (see `.tilt-card[data-resetting]`), which is what
 *   actually needs smoothing.
 * - Rotation is kept modest (`max` 6°) so the card never slides far enough from
 *   under the pointer for a click to land somewhere unexpected.
 * - Only `transform` / `opacity` animate, so there is no layout shift.
 * - Switched off entirely for touch devices and for `prefers-reduced-motion`
 *   (the card is still fully interactive, it just doesn't tilt).
 */
export function TiltCard({ children, className, max = 6, glare = true }: TiltCardProps) {
  const finePointer = useIsFinePointer();
  const reduced = usePrefersReducedMotion();
  const active = finePointer && !reduced;

  const nodeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const settleRef = useRef(0);

  const clearSettle = useCallback(() => {
    if (settleRef.current) {
      window.clearTimeout(settleRef.current);
      settleRef.current = 0;
    }
    const node = nodeRef.current;
    if (node) delete node.dataset.resetting;
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (settleRef.current) window.clearTimeout(settleRef.current);
    },
    [],
  );

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!active) return;

    const node = nodeRef.current;
    if (!node) return;

    // A new move cancels any in-flight snap-back animation first.
    clearSettle();

    if (frameRef.current) return;

    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;
      node.style.transform = `perspective(1000px) rotateX(${((0.5 - py) * max * 2).toFixed(
        2,
      )}deg) rotateY(${((px - 0.5) * max * 2).toFixed(2)}deg) translateZ(0)`;
      node.style.setProperty("--glare-x", `${px * 100}%`);
      node.style.setProperty("--glare-y", `${py * 100}%`);
    });
  };

  const reset = () => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }

    const node = nodeRef.current;
    if (!node) return;

    // Animate *this* change only, then drop the flag so tracking stays instant.
    node.dataset.resetting = "true";
    node.style.transform = "";
    settleRef.current = window.setTimeout(() => {
      settleRef.current = 0;
      delete node.dataset.resetting;
    }, 480);
  };

  return (
    <div
      ref={nodeRef}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn(
        "tilt-card group relative will-change-transform",
        className,
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}

      {glare && active && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(320px_circle_at_var(--glare-x,50%)_var(--glare-y,50%),color-mix(in_srgb,var(--color-signal)_14%,transparent),transparent_70%)]"
        />
      )}
    </div>
  );
}
