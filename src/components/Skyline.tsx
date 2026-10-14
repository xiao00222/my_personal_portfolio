import { motion, useTransform, type MotionValue } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { seededRandom } from "@/lib/utils";

interface Building {
  x: number;
  w: number;
  h: number;
  windows: { x: number; y: number; lit: boolean; warm: boolean }[];
  spire: number;
}

const VIEW_W = 1600;
const VIEW_H = 420;

/**
 * Buildings are generated from a fixed seed, so the skyline is byte-identical
 * on every render — no random flicker between mounts and no layout shift.
 */
function buildSkyline(seed: number, count: number, minH: number, maxH: number): Building[] {
  const rand = seededRandom(seed);
  const buildings: Building[] = [];

  let x = -80;
  while (x < VIEW_W + 80 && buildings.length < count) {
    const w = 54 + Math.floor(rand() * 96);
    const h = minH + rand() * (maxH - minH);
    const windows: Building["windows"] = [];

    const cols = Math.max(1, Math.floor((w - 16) / 16));
    const rows = Math.max(1, Math.floor((h - 26) / 20));

    for (let c = 0; c < cols; c += 1) {
      for (let r = 0; r < rows; r += 1) {
        const lit = rand() > 0.62;
        if (!lit) continue;
        windows.push({
          x: 10 + c * 16,
          y: 14 + r * 20,
          lit,
          warm: rand() > 0.55,
        });
      }
    }

    buildings.push({
      x,
      w,
      h,
      windows,
      spire: rand() > 0.72 ? 18 + rand() * 34 : 0,
    });

    x += w + 6 + rand() * 22;
  }

  return buildings;
}

const FAR = buildSkyline(11, 34, 70, 190);
const NEAR = buildSkyline(29, 26, 120, 300);

/**
 * One layer of skyline, drawn as a handful of `<path>`s.
 *
 * Each building, spire and window is folded into a single path string instead of
 * being its own element: the skyline is pure decoration, and ~1200 <rect> nodes
 * were the largest single contributor to the page's DOM size.
 */
function Layer({
  buildings,
  fill,
  windowColor,
  windowOpacity,
  className,
}: {
  buildings: Building[];
  fill: string;
  windowColor: string;
  windowOpacity: number;
  className?: string;
}) {
  const rect = (x: number, y: number, w: number, h: number) =>
    `M${x.toFixed(1)} ${y.toFixed(1)}h${w.toFixed(1)}v${h.toFixed(1)}h-${w.toFixed(1)}Z`;

  let silhouette = "";
  let warmWindows = "";
  let coolWindows = "";

  for (const building of buildings) {
    const y = VIEW_H - building.h;
    silhouette += rect(building.x, y, building.w, building.h);

    if (building.spire > 0) {
      silhouette += rect(building.x + building.w / 2 - 1.5, y - building.spire, 3, building.spire);
    }

    for (const window of building.windows) {
      const geometry = rect(building.x + window.x, y + window.y, 6, 8);
      if (window.warm) warmWindows += geometry;
      else coolWindows += geometry;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={silhouette} fill={fill} />
      {warmWindows && (
        <path d={warmWindows} fill="var(--color-signal)" opacity={windowOpacity} />
      )}
      {coolWindows && (
        <path d={coolWindows} fill={windowColor} opacity={windowOpacity * 0.8} />
      )}
    </svg>
  );
}

interface SkylineProps {
  /** Hero scroll progress (0 → 1 over the hero's own height). */
  progress: MotionValue<number>;
}

/**
 * Three stacked skyline bands. Each drifts at a different rate as the hero
 * scrolls, producing parallax depth. Only `transform` is animated.
 */
export function Skyline({ progress }: SkylineProps) {
  const reduced = usePrefersReducedMotion();

  const farY = useTransform(progress, [0, 1], reduced ? [0, 0] : [0, -30]);
  const nearY = useTransform(progress, [0, 1], reduced ? [0, 0] : [0, -80]);
  const glowY = useTransform(progress, [0, 1], reduced ? [0, 0] : [0, -140]);
  const fade = useTransform(progress, [0, 0.85], [1, reduced ? 1 : 0.25]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] select-none sm:h-[52%]">
      {/* Horizon glow */}
      <motion.div
        style={{ y: glowY }}
        className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_srgb,var(--color-signal)_22%,transparent),transparent_70%)]"
      />

      <motion.div style={{ y: farY, opacity: fade }} className="absolute inset-0">
        <Layer
          buildings={FAR}
          fill="var(--color-gotham-900)"
          windowColor="var(--color-steel)"
          windowOpacity={0.28}
          className="absolute inset-0 h-full w-full"
        />
      </motion.div>

      <motion.div style={{ y: nearY, opacity: fade }} className="absolute inset-0">
        <Layer
          buildings={NEAR}
          fill="var(--color-gotham-950)"
          windowColor="var(--color-steel)"
          windowOpacity={0.45}
          className="absolute inset-0 h-full w-full"
        />
      </motion.div>

      {/* Foreground haze so the skyline dissolves into the page */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gotham-950 to-transparent" />
    </div>
  );
}
