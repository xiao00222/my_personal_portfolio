import { motion } from "framer-motion";

import { BatMotif } from "@/components/BatMotif";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { portfolio, sectionById } from "@/data/portfolio";

/**
 * Experience & education timeline.
 *
 * A single vertical rail with alternating entries on desktop. Each entry
 * reveals on scroll and the current entry pulses — but the pulse is decorative;
 * the "current" state is also written out in text ("Currently"), so nothing is
 * conveyed by animation alone.
 */
export function Experience() {
  const reduced = usePrefersReducedMotion();
  const { timeline } = portfolio;
  const section = sectionById.experience;

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden border-y border-gotham-800 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          headingId="experience-heading"
          eyebrow={section.eyebrow}
          title={section.title}
          description="From formal education to self-directed skill-building — how I got here, and what I'm working on right now."
        />

        <ol className="relative mt-16 space-y-10">
          {/* Rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-signal/70 via-steel/40 to-transparent md:left-1/2 md:-translate-x-1/2"
          />

          {timeline.map((entry, index) => {
            const isLeft = index % 2 === 0;

            return (
              <li key={entry.id} className="relative">
                <div className="grid md:grid-cols-2 md:gap-10">
                  {/* Node */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2 z-10 flex h-[15px] w-[15px] items-center justify-center md:left-1/2 md:-translate-x-1/2"
                  >
                    <span className="relative flex h-3 w-3 items-center justify-center">
                      {entry.current && !reduced && (
                        <motion.span
                          className="absolute inline-flex h-full w-full rounded-full bg-signal"
                          animate={{ scale: [1, 2.1], opacity: [0.7, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      <span
                        className={cn(
                          "relative inline-flex h-3 w-3 rounded-full border",
                          entry.current
                            ? "border-signal bg-signal"
                            : "border-steel bg-gotham-950",
                        )}
                      />
                    </span>
                  </span>

                  <Reveal
                    from={isLeft ? "left" : "right"}
                    className={cn(
                      "pl-8 md:pl-0",
                      isLeft ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10",
                    )}
                  >
                    <article
                      className={cn(
                        "panel rounded-2xl p-5 transition-colors sm:p-6",
                        entry.current ? "border-signal/50" : "hover:border-steel/60",
                      )}
                    >
                      <p className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.25em] text-signal md:justify-start">
                        <BatMotif className="h-2.5 w-4" />
                        {entry.period}
                      </p>

                      <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-tight text-ink sm:text-xl">
                        {entry.role}
                      </h3>
                      <p className="mt-1 text-sm text-steel">{entry.organisation}</p>
                      <p className="mt-3 text-sm leading-relaxed text-ash">
                        {entry.description}
                      </p>

                      <ul
                        className={cn(
                          "mt-4 flex flex-wrap gap-2",
                          isLeft && "md:justify-end",
                        )}
                      >
                        {entry.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-gotham-600 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-ash"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
