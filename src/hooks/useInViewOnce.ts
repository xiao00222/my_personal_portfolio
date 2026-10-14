import { useRef } from "react";
import { useInView, type UseInViewOptions } from "framer-motion";

interface Options {
  /** Portion of the element that must be visible. */
  amount?: number;
  /** Extra root margin, e.g. "-10% 0px -10% 0px". */
  margin?: UseInViewOptions["margin"];
}

/**
 * One-shot viewport detection used for scroll-triggered reveals.
 * Wraps Framer Motion's `useInView` so every section uses the same config and
 * sections fire exactly once (no re-animating on scroll-up, no layout shift).
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>({
  amount = 0.2,
  margin,
}: Options = {}) {
  const ref = useRef<T>(null);

  const inView = useInView(ref, { once: true, amount, margin });

  return { ref, inView };
}
