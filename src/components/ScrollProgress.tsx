import { motion } from "framer-motion";

import { BatMotif } from "@/components/BatMotif";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * Thin signal-yellow rail along the very top of the viewport with a small bat
 * that tracks reading progress. Decorative only (`aria-hidden`), so no
 * information is conveyed by it alone.
 */
export function ScrollProgress() {
  const progress = useScrollProgress();
  const percent = Math.min(100, Math.max(0, progress * 100));

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px">
      <div className="absolute inset-0 bg-gotham-700/60" />
      <motion.div
        className="absolute inset-y-0 left-0 bg-signal shadow-[0_0_12px_var(--color-signal)]"
        style={{ width: `${percent}%` }}
      />
      <div
        className="absolute top-0 -translate-x-1/2 text-signal"
        style={{ left: `${percent}%` }}
      >
        <BatMotif className="h-3 w-5 opacity-80" />
      </div>
    </div>
  );
}
