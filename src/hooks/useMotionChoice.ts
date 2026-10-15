import { useSyncExternalStore } from "react";

import { getMotionChoice, subscribeMotionPreference, type MotionChoice } from "@/lib/motionPreference";

/**
 * The visitor's stored motion choice, where `"system"` means they have not
 * overridden anything. Read alongside `usePrefersReducedMotion` to explain to
 * the visitor *why* motion is off rather than only offering to change it.
 */
export function useMotionChoice(): MotionChoice {
  return useSyncExternalStore(
    subscribeMotionPreference,
    getMotionChoice,
    () => "system" as const,
  );
}
