import { useEffect, useState } from "react";

/**
 * Tracks which page section is currently in the "reading band" (vertical middle
 * of the viewport) so the nav can highlight the active link.
 *
 * Uses a single IntersectionObserver with a narrow rootMargin band rather than
 * scroll math, so it stays cheap and never fights smooth scrolling.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size === 0) return;

        // Pick the section closest to the top of the reading band.
        const [topMost] = [...visible.entries()].sort((a, b) => a[1] - b[1]);
        setActive(topMost[0]);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
