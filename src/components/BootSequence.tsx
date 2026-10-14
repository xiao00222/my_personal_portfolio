import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { BatMotif } from "@/components/BatMotif";
import { Button } from "@/components/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface BootSequenceProps {
  lines: string[];
  skipLabel: string;
  continueLabel: string;
  onDone: () => void;
}

const CHAR_MS = 12;
const LINE_PAUSE_MS = 240;
/** How long the finished terminal (and the signal reveal) holds before the hero. */
const AUTO_ADVANCE_MS = 1600;

/**
 * Cinematic intro: a terminal types itself out, then a light beam expands and
 * hands off to the hero.
 *
 * Behaviour + accessibility:
 *  - Rendered only once per browser session (the parent checks sessionStorage).
 *  - `Escape` skips immediately; the Skip control is focused on mount so a
 *    keyboard user can dismiss it in one keystroke.
 *  - The typed characters are decorative, so the terminal block is
 *    `aria-hidden`; a single polite live region announces "Loading portfolio".
 *  - Under `prefers-reduced-motion` it never renders: the hero appears at once.
 */
export function BootSequence({ lines, skipLabel, continueLabel, onDone }: BootSequenceProps) {
  const reduced = usePrefersReducedMotion();
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  // Reduced motion: hand straight over to the hero.
  useEffect(() => {
    if (reduced) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Type the lines out one character at a time.
  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let timer = 0;

    const typeLine = (lineIndex: number, charIndex: number) => {
      if (cancelled) return;

      if (lineIndex >= lines.length) {
        timer = window.setTimeout(() => !cancelled && setReady(true), LINE_PAUSE_MS);
        return;
      }

      const line = lines[lineIndex];
      setVisibleLines((prev) => {
        const next = prev.slice(0, lineIndex);
        next[lineIndex] = line.slice(0, charIndex);
        return next;
      });

      if (charIndex < line.length) {
        timer = window.setTimeout(() => typeLine(lineIndex, charIndex + 1), CHAR_MS);
      } else {
        timer = window.setTimeout(() => typeLine(lineIndex + 1, 0), LINE_PAUSE_MS);
      }
    };

    timer = window.setTimeout(() => typeLine(0, 0), 220);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [lines, reduced]);

  // Once the log has finished printing, hand off to the hero on its own — the
  // intro is cinematic, not a gate. The Skip control stays available throughout.
  useEffect(() => {
    if (!ready || reduced) return;
    const timer = window.setTimeout(finish, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduced]);

  // Lock scrolling while the overlay is on screen, and wire up Escape.
  useEffect(() => {
    if (reduced) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) return null;

  return (
    <motion.div
      className="letterbox fixed inset-0 z-[80] flex items-center justify-center bg-gotham-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      role="dialog"
      aria-modal="true"
      aria-label="Intro sequence"
    >
      <p className="sr-only" role="status" aria-live="polite">
        Loading portfolio
      </p>

      {/* Emblem reveal: the mark is oversized so its wings sweep out past the
          terminal panel, and sits inside a growing pool of projected light. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.55 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <div className="absolute h-[36rem] w-[36rem] max-w-[140vw] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-signal)_26%,transparent),transparent_68%)] blur-2xl" />
        <BatMotif
          withSignal
          className="relative w-[min(135vw,1180px)] text-signal opacity-90 drop-shadow-[0_0_60px_color-mix(in_srgb,var(--color-signal)_45%,transparent)]"
        />
      </motion.div>

      {/* Terminal */}
      <div className="relative z-10 w-[min(92vw,680px)] px-6">
        <div
          aria-hidden="true"
          className="panel-strong rounded-lg p-5 font-mono text-[0.7rem] leading-relaxed text-steel sm:p-7 sm:text-sm"
        >
          <div className="mb-4 flex items-center gap-2 border-b border-gotham-700 pb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-signal" />
            <span className="h-2.5 w-2.5 rounded-full bg-gotham-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-gotham-500" />
            <span className="ml-2 text-[0.65rem] uppercase tracking-[0.3em] text-ash">
              portfolio terminal
            </span>
          </div>

          <div className="min-h-[9.5rem] space-y-1 sm:min-h-[10.5rem]">
            {visibleLines.map((line, index) => (
              <p key={index}>
                <span className="text-signal">{line.slice(0, 1)}</span>
                {line.slice(1)}
              </p>
            ))}
            <span className="inline-block h-4 w-2 animate-pulse bg-signal align-middle" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <button
            ref={skipRef}
            type="button"
            onClick={finish}
            className="font-mono text-xs uppercase tracking-[0.25em] text-ash underline-offset-4 transition-colors hover:text-signal hover:underline"
          >
            {skipLabel}
          </button>

          <motion.div
            initial={false}
            animate={{ opacity: ready ? 1 : 0.25 }}
            className="pointer-events-auto"
          >
            <Button size="sm" onClick={finish} aria-disabled={!ready}>
              {continueLabel}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
