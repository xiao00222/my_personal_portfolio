import { useSpotlightCursor } from "@/hooks/useSpotlightCursor";
import { cn } from "@/lib/utils";

/**
 * The flashlight.
 *
 * A single fixed-size disc that follows the pointer. It is anchored with a
 * `transform` written straight onto the node (see `@/lib/cursor`) and nothing
 * else, so moving it is a compositor-only change: the layer is rasterised once
 * and then just translated. No repaint, no mask recompute, no layout, no
 * document-wide style invalidation.
 *
 * This replaced an earlier two-layer version that re-applied a
 * `radial-gradient` mask to a full-viewport element on every frame. That forced
 * the browser to repaint the whole viewport (and re-sample every
 * `backdrop-filter` panel inside it) for every mouse move. The page-relative
 * blueprint grid it revealed is gone with it: a texture welded to the page
 * cannot follow the pointer without repainting, and the same grid already
 * appears statically behind the Skills section.
 *
 * The light only ever *adds* luminance at low alpha, so text contrast is never
 * reduced by the effect.
 */
export function Spotlight({ className }: { className?: string }) {
  // Nothing to reveal on touch devices — the torch only exists with a pointer.
  const { enabled, ref } = useSpotlightCursor<HTMLDivElement>({ smoothing: true });

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-30 h-0 w-0 will-change-transform",
        className,
      )}
    >
      <div className="torch absolute h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  );
}
