import { useEffect, useRef } from "react";

import { subscribeCursor, setCursorFollow } from "@/lib/cursor";
import { useIsFinePointer } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Options {
  /**
   * `false` keeps the element exactly on the pointer (used by the reticle, which
   * is the only thing telling the user where the pointer is, so it must never
   * trail). `true` adds the eased searchlight trail (used by the light pool).
   */
  smoothing?: boolean;
  /** Force the cursor off (e.g. while a modal is open). */
  disabled?: boolean;
}

/**
 * Flashlight / spotlight cursor.
 *
 * Binds one element to the shared engine in `@/lib/cursor` and writes its
 * `transform` from a rAF callback. No React state, no CSS custom properties, so
 * moving the mouse never re-renders the tree and never triggers a document-wide
 * style recalculation (see `@/lib/cursor` for the measured cost of the latter).
 *
 * Only activates on devices with a fine pointer (never on touch), and sets
 * `data-custom-cursor="on"` on `<html>` so CSS can hide the native cursor.
 *
 * Under `prefers-reduced-motion` the cursor still tracks — it is a cursor
 * affordance, not decoration — but the trail is dropped so it is rigid.
 *
 * Returns the ref to attach and whether the cursor is active. Render the element
 * carrying the ref only when `enabled`; the effect binds it on mount.
 */
export function useSpotlightCursor<E extends HTMLElement>({
  smoothing = false,
  disabled = false,
}: Options = {}) {
  const finePointer = useIsFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = finePointer && !disabled;

  const ref = useRef<E>(null);

  useEffect(() => {
    if (!enabled) return;

    const node = ref.current;
    if (!node) return;

    setCursorFollow(reduced ? 1 : 0.3);

    const root = document.documentElement;
    root.dataset.customCursor = "on";

    const unsubscribe = subscribeCursor(({ x, y, rawX, rawY }) => {
      const px = smoothing && !reduced ? x : rawX;
      const py = smoothing && !reduced ? y : rawY;
      node.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
    });

    return () => {
      unsubscribe();
      delete root.dataset.customCursor;
      node.style.transform = "";
    };
  }, [enabled, reduced, smoothing]);

  return { enabled, ref };
}
