import { useEffect, useState } from "react";

import { useSpotlightCursor } from "@/hooks/useSpotlightCursor";

/**
 * Custom cursor.
 *
 * Two states:
 *   idle    — a signal ring centred exactly on the pointer;
 *   hover   — a pointing-hand glyph whose fingertip sits exactly on the pointer,
 *             shown over anything interactive.
 *
 * The hand matters more than it looks: the native cursor is hidden while this is
 * mounted, so a visitor gets no OS feedback that something is clickable unless we
 * provide it ourselves. The hover test is a single delegated `pointerover` on the
 * document (via `closest()`), not listeners on every element.
 *
 * Geometry is the other half of the contract. The pointer must land exactly where
 * the reticle is drawn, so the structure is three explicit layers:
 *
 *   anchor  — zero-size, translated to the pointer by the shared rAF engine;
 *   centre  — a 28px box pulled back by half its own size, so its centre is the
 *             pointer (the ring lives here and may scale freely);
 *   hand    — offset so its *fingertip* — not its centre — is the pointer, which
 *             is how a real hand cursor behaves.
 *
 * The hover flag is React state, but it only flips on `pointerover`/`pointerout`,
 * never per frame, so it cannot re-render during movement. Position is written
 * imperatively to the anchor and React never renders a `style` there.
 */
export function CustomCursor({ disabled = false }: { disabled?: boolean }) {
  const { enabled, ref: anchorRef } = useSpotlightCursor<HTMLDivElement>({
    smoothing: false,
    disabled,
  });
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const interactiveSelector =
      'a[href], button, [role="button"], input, textarea, select, summary, [data-cursor="hover"]';

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      setInteractive(Boolean(target?.closest?.(interactiveSelector)));
    };

    // Clear the hand if the pointer leaves the document entirely.
    const onLeave = () => setInteractive(false);

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={anchorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] h-0 w-0 will-change-transform"
    >
      {/* Idle: ring, centred on the pointer. */}
      <div
        className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out"
        style={{ opacity: interactive ? 0 : 1 }}
      >
        <div className="h-full w-full rounded-full border border-signal/80">
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
        </div>
      </div>

      {/* Hover: pointing hand. Offset so the fingertip — the pixel a real hand
          cursor would click with — lands on the pointer, not the glyph centre. */}
      <div
        className="absolute transition-opacity duration-200 ease-out"
        style={{
          opacity: interactive ? 1 : 0,
          left: "-8.5px",
          top: "-2.5px",
        }}
      >
        <HandPointer className="h-[22px] w-[22px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]" />
      </div>
    </div>
  );
}

/**
 * Pointing-hand glyph, drawn in the same line style as the rest of the icon set.
 * `fill` is the near-black page colour so the hand keeps its shape over any
 * background it passes across.
 */
function HandPointer({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="var(--color-gotham-950)"
      stroke="var(--color-signal)"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {/* Extended index finger */}
      <path d="M10.5 12.5V5.1a1.65 1.65 0 0 1 3.3 0v7.4" />
      {/* Middle finger */}
      <path d="M13.8 12.5V9.6a1.55 1.55 0 0 1 3.1 0v2.9" />
      {/* Ring finger, palm and curled thumb */}
      <path d="M16.9 12.5v-1.7a1.55 1.55 0 0 1 3.1 0v4.7a5.6 5.6 0 0 1-5.6 5.6h-1.9a5.1 5.1 0 0 1-3.6-1.5l-3.6-3.7a1.65 1.65 0 0 1 2.4-2.3l2.8 2.9" />
    </svg>
  );
}
