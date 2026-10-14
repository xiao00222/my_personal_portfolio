/**
 * Minimal `cn` helper — joins truthy class names.
 * Deliberately dependency-free: a full `clsx`/`tailwind-merge` pair isn't
 * justified for a single-page portfolio, and the project keeps dependencies
 * minimal on purpose (see README).
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  const walk = (value: ClassValue): void => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };

  values.forEach(walk);
  return out.join(" ");
}

/** Zero-pads a number, for the numbered index/label motifs. */
export function pad(value: number, length = 3): string {
  return String(value).padStart(length, "0");
}

/**
 * Fixed-seed pseudo random number generator.
 * Used so decorative layouts (skyline buildings, star fields) are identical on
 * every render — avoids hydration/scroll jitter and layout shift.
 */
export function seededRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
