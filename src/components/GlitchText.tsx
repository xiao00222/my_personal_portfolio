import { useEffect, useRef, useState } from "react";

import { useInViewOnce } from "@/hooks/useInViewOnce";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$*<>/\\";

interface GlitchTextProps {
  text: string;
  className?: string;
  /** Milliseconds between scramble steps. */
  interval?: number;
  /** Delay before the effect starts, in ms. */
  delay?: number;
}

/**
 * Scramble-in heading effect.
 *
 * Accessibility: the animated characters are `aria-hidden`; a visually hidden
 * copy of the real text is always present in the accessibility tree, so the
 * content is never conveyed by animation alone.
 *
 * Reduced motion: renders the finished string immediately, no timers.
 */
export function GlitchText({
  text,
  className,
  interval = 34,
  delay = 0,
}: GlitchTextProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLSpanElement>({ amount: 0.4 });

  const [output, setOutput] = useState(reduced ? text : "");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }
    if (!inView) return;

    let frame = 0;
    let started = false;

    const step = () => {
      if (frame >= text.length) {
        setOutput(text);
        timerRef.current = null;
        return;
      }

      const revealed = text.slice(0, frame);
      const noisy = text
        .slice(frame)
        .split("")
        .map((char) =>
          char === " "
            ? " "
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        )
        .join("");

      setOutput(revealed + noisy);
      frame += 1;
      timerRef.current = window.setTimeout(step, interval);
    };

    const startTimer = window.setTimeout(() => {
      started = true;
      step();
    }, delay);

    return () => {
      window.clearTimeout(startTimer);
      if (started && timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [delay, inView, interval, reduced, text]);

  return (
    <span ref={ref} className={cn("inline-block whitespace-pre-wrap", className)}>
      {/* The scrambling copy is always hidden from AT; the sr-only twin below is
          the single accessible source, so headings are announced exactly once. */}
      <span aria-hidden="true">{output || "\u00A0"}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
