import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
}

interface RainCanvasProps {
  className?: string;
  /** Multiplier on the drop count. */
  intensity?: number;
}

/**
 * Lightweight canvas rain.
 *
 * Performance choices:
 *  - Device pixel ratio is capped at 2 (retina-sharp but bounded fill cost).
 *  - Drop count scales with viewport width, so phones paint far less.
 *  - The render loop is paused when the tab is hidden OR the canvas scrolls out
 *    of view (IntersectionObserver), so the hero costs nothing while reading.
 *  - `prefers-reduced-motion` renders nothing at all (the CSS rain-free hero
 *    still reads correctly — rain is pure atmosphere, never information).
 */
export function RainCanvas({ className, intensity = 1 }: RainCanvasProps) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    let frame = 0;
    let visible = true;

    const build = () => {
      const area = width * height;
      const count = Math.round(
        Math.min(150, Math.max(28, (area / 24000) * intensity)),
      );

      drops = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 8 + Math.random() * 22,
        speed: 260 + Math.random() * 420,
        alpha: 0.08 + Math.random() * 0.22,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    let last = performance.now();

    const render = (now: number) => {
      frame = 0;
      if (!visible) return;

      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      for (const drop of drops) {
        ctx.strokeStyle = `rgba(125, 154, 184, ${drop.alpha})`;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.16, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed * delta;
        drop.x -= drop.speed * delta * 0.16;

        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * (width + 40);
        }
      }

      frame = window.requestAnimationFrame(render);
    };

    const schedule = () => {
      if (!frame && visible) {
        last = performance.now();
        frame = window.requestAnimationFrame(render);
      }
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else schedule();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) schedule();
        else stop();
      },
      { threshold: 0 },
    );

    resize();
    schedule();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intensity, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
