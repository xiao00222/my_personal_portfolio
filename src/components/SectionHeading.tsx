import type { ReactNode } from "react";

import { BatMotif } from "@/components/BatMotif";
import { GlitchText } from "@/components/GlitchText";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /**
   * `id` for the `<h2>`, so the section's `aria-labelledby` resolves to it.
   * Without this the sections pointed at IDs that did not exist.
   */
  headingId?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** Right-hand slot, e.g. a category filter. */
  actions?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  headingId,
  description,
  align = "left",
  className,
  actions,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered && "items-center text-center",
        actions ? "lg:flex-row lg:items-end lg:justify-between" : "",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        <Reveal from="left">
          <p
            className={cn(
              "flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.35em] text-signal",
              centered && "justify-center",
            )}
          >
            <BatMotif className="h-3 w-5 text-signal" />
            {eyebrow}
          </p>
        </Reveal>

        <h2
          id={headingId}
          className="mt-4 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          <GlitchText text={title} />
        </h2>

        {description && (
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ash sm:text-base">
              {description}
            </p>
          </Reveal>
        )}
      </div>

      {actions && (
        <Reveal delay={0.15} className="w-full lg:w-auto">
          {actions}
        </Reveal>
      )}
    </div>
  );
}
