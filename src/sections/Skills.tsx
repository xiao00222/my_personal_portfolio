import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { skillIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { portfolio, sectionById } from "@/data/portfolio";

/**
 * Skills — a technical skills panel.
 *
 * Interaction: pick a category to filter, then read the technologies it lists.
 * The chips are labels, not controls — there is no per-technology detail to
 * reveal, so nothing pretends to be clickable.
 *
 * IMPORTANT: the source content contains no proficiency levels, so this panel
 * shows none — no invented percentages or progress bars. The only numbers shown
 * are honest counts of the technologies in the source data.
 */
export function Skills() {
  const reduced = usePrefersReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { skills } = portfolio;
  const section = sectionById.skills;

  const visibleCategories = useMemo(
    () =>
      activeCategory === "all"
        ? skills
        : skills.filter((category) => category.id === activeCategory),
    [activeCategory, skills],
  );

  const totalModules = useMemo(
    () => skills.reduce((sum, category) => sum + category.items.length, 0),
    [skills],
  );

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative overflow-hidden border-y border-gotham-800 py-24 sm:py-32"
    >
      <div className="rule-grid pointer-events-none absolute inset-0 opacity-[0.12]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          headingId="skills-heading"
          eyebrow={section.eyebrow}
          title={section.title}
          description={`${totalModules} technologies across ${skills.length} categories — filter by category to narrow the readout.`}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,15rem)_1fr]">
          {/* Category filters */}
          <Reveal from="left">
            <div
              role="group"
              aria-label="Filter skills by category"
              className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap"
            >
              <FilterButton
                active={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
                label={`${portfolio.ui.labels.filterAll} (${totalModules})`}
              />
              {skills.map((category) => {
                const Icon = skillIcons[category.icon];
                return (
                  <FilterButton
                    key={category.id}
                    active={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                    label={`${category.label} (${category.items.length})`}
                    icon={<Icon className="h-4 w-4" />}
                  />
                );
              })}
            </div>
          </Reveal>

          {/* Technologies */}
          <div className="panel h-fit rounded-2xl p-5 sm:p-6">
            <h3 className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-steel">
              Technology readout
            </h3>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0 : 0.28 }}
              >
                {visibleCategories.map((category) => (
                  <div key={category.id} className="mt-5">
                    <p className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.15em] text-signal">
                      {category.label}
                    </p>
                    <p className="mt-1 text-xs text-ash">{category.blurb}</p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {category.items.map((item) => (
                        <li
                          key={item.name}
                          className="rounded-full border border-gotham-600 px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-ash transition-colors hover:border-signal hover:text-signal"
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-left font-mono text-[0.68rem] uppercase tracking-[0.15em] transition-colors lg:w-full",
        active
          ? "border-signal/70 bg-signal/10 text-signal"
          : "border-gotham-700 text-ash hover:border-steel hover:text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
