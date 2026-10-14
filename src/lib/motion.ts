import type { Transition } from "framer-motion";

/**
 * Scroll-reveal easing.
 *
 * A slower, more heavily decelerated curve than a standard ease-out. It spends
 * more of its duration in the tail, which is what makes a reveal read as
 * "settling into place" rather than arriving.
 *
 * Used by `Reveal`, which is the single reveal mechanism for the whole page —
 * every section goes through it, so tuning this one value retunes the feel of
 * scrolling everywhere at once.
 */
export const EASE_SOFT: Transition["ease"] = [0.16, 1, 0.3, 1];

/** Default duration for a reveal, in seconds. */
export const REVEAL_DURATION = 0.9;
