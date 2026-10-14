import { motion, useTransform, type MotionValue } from "framer-motion";

import { BatMotif } from "@/components/BatMotif";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface BatSignalProps {
  /** Hero scroll progress, 0 → 1. */
  progress: MotionValue<number>;
  label: string;
}

/**
 * ★ The standout "wow" moment: a scroll-reactive Bat-Signal.
 *
 * Why this one: the whole site is built on a single metaphor — light in the
 * dark. The custom cursor is a torch, so giving the hero a real projected
 * signal (a cone of light anchored below the fold that sweeps, brightens and
 * lifts as you scroll) ties the interaction language together instead of
 * bolting on an unrelated gimmick. It also doubles as a scroll affordance:
 * the beam climbs as you descend, so it *means* something.
 *
 * Cost: one clipped div plus a scaled emblem — transform/opacity only, no
 * canvas, no three.js, and nothing at all when reduced motion is requested.
 */
export function BatSignal({ progress, label }: BatSignalProps) {
  const reduced = usePrefersReducedMotion();

  const opacity = useTransform(progress, [0, 0.35, 1], [0.55, 0.85, 0]);
  const scaleY = useTransform(progress, [0, 1], reduced ? [1, 1] : [1, 1.35]);
  const y = useTransform(progress, [0, 1], reduced ? [0, 0] : [0, -90]);
  const emblemOpacity = useTransform(progress, [0, 0.6, 1], [0.75, 0.5, 0]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Light cone */}
      <motion.div
        style={{ opacity, scaleY, y }}
        className="absolute bottom-[-35%] left-1/2 h-[135%] w-[min(88vw,42rem)] -translate-x-1/2 origin-bottom"
      >
        <div className="beam-sweep h-full w-full origin-bottom [clip-path:polygon(50%_0%,100%_100%,0%_100%)] [background:linear-gradient(to_top,color-mix(in_srgb,var(--color-signal)_20%,transparent),color-mix(in_srgb,var(--color-signal)_5%,transparent)_45%,transparent_85%)]" />
      </motion.div>

      {/* Emblem inside the beam */}
      <motion.div
        style={{ opacity: emblemOpacity, y }}
        className="absolute bottom-[10%] left-1/2 w-[min(58vw,320px)] -translate-x-1/2 text-signal sm:bottom-[7%]"
      >
        <BatMotif withSignal title={label} className="w-full" />
      </motion.div>
    </div>
  );
}
