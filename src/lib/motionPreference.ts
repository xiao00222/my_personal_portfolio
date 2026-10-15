/**
 * Motion preference.
 *
 * Decides whether decorative animation runs, from two inputs:
 *
 *   1. `prefers-reduced-motion`, which is honored by default, and
 *   2. an explicit, remembered choice made on this site.
 *
 * The second exists because the first is often a side effect the visitor did
 * not aim at this page: Windows reports `reduce` whenever "Animation effects"
 * is switched off in Settings, and macOS or an accessibility tool may do the
 * same. A media query can never be overridden from inside the document, so the
 * navbar offers a way out — this module is the single source of truth every
 * animation reads.
 *
 * The resolved answer is mirrored onto `<html data-motion="full|reduced">` so
 * `index.css` can gate its keyframe animations on the same value: CSS alone
 * cannot see a choice made in the page, and the attribute is the bridge.
 *
 * State is module-level (one store, many readers) so the navbar control and
 * every animation agree, and so the attribute is correct before React renders
 * anything.
 */

export type MotionChoice = "system" | "full" | "reduced";

const STORAGE_KEY = "gc-motion-choice";
const SYSTEM_QUERY = "(prefers-reduced-motion: reduce)";

type Listener = () => void;

const listeners = new Set<Listener>();

function readSystemReduced(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(SYSTEM_QUERY).matches;
}

function readStoredChoice(): MotionChoice {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "full" || stored === "reduced" ? stored : "system";
  } catch {
    // Storage can throw outright (private mode, blocked cookies). Losing the
    // memory of the choice is acceptable; breaking the page is not.
    return "system";
  }
}

let choice: MotionChoice = readStoredChoice();
let systemReduced = readSystemReduced();

/** Should decorative motion be suppressed right now? */
export function prefersReducedMotion(): boolean {
  if (choice === "full") return false;
  if (choice === "reduced") return true;
  return systemReduced;
}

/** The visitor's explicit choice; `"system"` means "follow the OS setting". */
export function getMotionChoice(): MotionChoice {
  return choice;
}

function publish(): void {
  document.documentElement.dataset.motion = prefersReducedMotion() ? "reduced" : "full";
}

function emit(): void {
  publish();
  listeners.forEach((listener) => listener());
}

/** Subscribe to any change in the resolved preference. Returns an unsubscribe. */
export function subscribeMotionPreference(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setMotionChoice(next: MotionChoice): void {
  choice = next;

  try {
    if (next === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Best-effort persistence: the choice still applies to this page view.
  }

  emit();
}

/**
 * Runs the opposite of whatever is happening now. Following the system counts
 * as the current state, so a visitor who is seeing no motion and clicks is
 * asking for motion — the first click always produces a visible change.
 */
export function toggleMotionPreference(): void {
  setMotionChoice(prefersReducedMotion() ? "full" : "reduced");
}

if (typeof window !== "undefined") {
  // Track the OS setting while it remains the deciding voice.
  window.matchMedia?.(SYSTEM_QUERY).addEventListener("change", (event) => {
    systemReduced = event.matches;
    emit();
  });

  // And follow an explicit choice made in another tab.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    choice = readStoredChoice();
    emit();
  });

  publish();
}
