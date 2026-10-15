import { Zap, ZapOff } from "lucide-react";

import { useMotionChoice } from "@/hooks/useMotionChoice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { toggleMotionPreference } from "@/lib/motionPreference";

interface MotionToggleProps {
  onLabel: string;
  offLabel: string;
  followsSystemHint: string;
  chosenHereHint: string;
  hint: string;
  className?: string;
}

/**
 * Turns decorative animation on or off for this site, and remembers the choice.
 *
 * The portfolio follows `prefers-reduced-motion` by default, which is the right
 * call for someone who genuinely wants a still page — but the setting is often
 * inherited from an operating-system option the visitor never connected to
 * this site (Windows reports `reduce` whenever "Animation effects" is off), and
 * a media query gives them no way to say "not here". This is that way out.
 *
 * It is a deliberate override of an accessibility preference, so it only ever
 * runs the other direction when the visitor clicks it, it says which of the two
 * inputs is deciding, and it is a real toggle rather than something automatic.
 */
export function MotionToggle({
  onLabel,
  offLabel,
  followsSystemHint,
  chosenHereHint,
  hint,
  className,
}: MotionToggleProps) {
  const reduced = usePrefersReducedMotion();
  const choice = useMotionChoice();

  const label = reduced ? offLabel : onLabel;
  const source = choice === "system" ? followsSystemHint : chosenHereHint;

  return (
    <button
      type="button"
      onClick={toggleMotionPreference}
      aria-pressed={!reduced}
      aria-label={label}
      title={`${label} — ${source}. ${hint}`}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-gotham-600 text-ash transition-colors hover:border-signal hover:text-signal " +
        (className ?? "")
      }
    >
      {reduced ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4 text-signal" />}
    </button>
  );
}
