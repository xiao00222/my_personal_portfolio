import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { useInViewOnce } from "@/hooks/useInViewOnce";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE_SOFT, REVEAL_DURATION } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Direction the element travels in from. */
  from?: "bottom" | "left" | "right";
  className?: string;
  as?: "div" | "li" | "article" | "section" | "header";
}

const offset = {
  bottom: { y: 34, x: 0 },
  left: { y: 0, x: -36 },
  right: { y: 0, x: 36 },
} as const;

/**
 * Reveals children once, when they scroll into view.
 *
 * Tuned to feel unhurried: a long, heavily decelerated ease (`EASE_SOFT`) with a
 * generous travel distance, so elements settle rather than snap. Animates
 * opacity + transform only (no layout shift), and collapses to an instant,
 * static render when the user prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  from = "bottom",
  className,
  as = "div",
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.12 });

  // All supported tags share the same ref shape; narrow the union for TS.
  const Component = motion[as] as typeof motion.div;
  const hidden = reduced ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset[from] };

  return (
    <Component
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : hidden}
      transition={{
        duration: reduced ? 0 : REVEAL_DURATION,
        delay: reduced ? 0 : delay,
        ease: EASE_SOFT,
      }}
    >
      {children}
    </Component>
  );
}
