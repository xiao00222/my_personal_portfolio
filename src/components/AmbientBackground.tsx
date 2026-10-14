import { motion, useScroll, useTransform } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Ambient background.
 *
 * Three very low-opacity pools of light that drift slowly behind the whole page
 * and ride the scroll a little, so the background breathes as you move instead
 * of sitting dead flat. It sits at `-z-10`, i.e. still behind every section and
 * every panel.
 *
 * Performance: each pool is a `radial-gradient` (soft by nature, so no
 * `filter: blur()` is needed) that is rasterised once and then only ever
 * *translated* — by a CSS keyframe on the inner node and by a scroll-linked
 * `transform` on the outer one. Two nested nodes on purpose: a CSS animation and
 * an inline `transform` on the same element would fight over the same property.
 *
 * Reduced motion: the pools render statically (no drift, no parallax).
 */
export function AmbientBackground() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const slowY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -80]);
  const fastY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 140]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div style={{ y: slowY }} className="absolute inset-0">
        <div className="absolute -left-[18%] -top-[18%] h-[58vmax] w-[58vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-signal)_8%,transparent),transparent_62%)] motion-safe:animate-drift-a" />
        <div className="absolute -right-[22%] top-[22%] h-[52vmax] w-[52vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-steel)_10%,transparent),transparent_62%)] motion-safe:animate-drift-b" />
      </motion.div>

      <motion.div style={{ y: fastY }} className="absolute inset-0">
        <div className="absolute -bottom-[28%] left-[10%] h-[48vmax] w-[48vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-signal-deep)_14%,transparent),transparent_66%)] motion-safe:animate-drift-c" />
      </motion.div>

      {/* Faint blueprint grid, barely visible, to keep the surfaces from reading
          as flat black. Static — no animation at all. */}
      <div className="rule-grid absolute inset-0 opacity-[0.06]" />
    </div>
  );
}
