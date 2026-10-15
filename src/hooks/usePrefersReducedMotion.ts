import { useSyncExternalStore } from "react";

import { prefersReducedMotion, subscribeMotionPreference } from "@/lib/motionPreference";

/**
 * Whether decorative motion should be skipped right now.
 *
 * Every animation in the site reads this, so the decision itself lives in
 * `@/lib/motionPreference`: the OS setting plus any explicit choice the visitor
 * made on this site (see `MotionToggle` in the navbar). The store is external
 * to React, so the subscription here is what keeps components in step when
 * either input changes.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotionPreference,
    prefersReducedMotion,
    // No server here, but a render without a window (tests, tooling) should
    // assume motion is allowed rather than force the static layout.
    () => false,
  );
}
