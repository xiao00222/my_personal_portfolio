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
 * Interaction: pick a category to filter, then hover or focus a technology to
 * read its detail. Keyboard users get the same detail via focus (the chips are
 * real buttons inside a labelled panel).
 *
 * IMPORTANT: the source content contains no proficiency levels, so this panel
 * shows none — no invented percentages or progress bars. The only numbers shown
 * are honest counts of the technologies in the source data.
 */
export function Skills() {
  const reduced = usePrefersReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

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

  const selected = useMemo(() => {
    for (const category of skills) {
      const item = category.items.find((entry) => entry.name === selectedSkill);
      if (item) return { category, item };
    }
    return null;
  }, [selectedSkill, skills]);

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
          description={`${totalModules} technologies across ${skills.length} categories. Pick a category to filter, then hover or focus a technology for details.`}
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
          <div className="space-y-6">
            <div className="panel rounded-2xl p-5 sm:p-6">
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
                        {category.items.map((item) => {
                          const isSelected = selectedSkill === item.name;
                          return (
                            <li key={item.name}>
                              <button
                                type="button"
                                onMouseEnter={() => setSelectedSkill(item.name)}
                                onFocus={() => setSelectedSkill(item.name)}
                                onClick={() => setSelectedSkill(item.name)}
                                aria-pressed={isSelected}
                                className={cn(
                                  "rounded-full border px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider transition-colors",
                                  isSelected
                                    ? "border-signal bg-signal text-gotham-950"
                                    : "border-gotham-600 text-ash hover:border-signal hover:text-signal",
                                )}
                              >
                                {item.name}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Detail panel */}
            <div
              className="panel rounded-2xl p-5 sm:p-6"
              aria-live="polite"
              aria-atomic="true"
            >
              <h3 className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-steel">
                Details
              </h3>

              {selected ? (
                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-ash">
                      Technology
                    </dt>
                    <dd className="mt-1 font-display text-base uppercase tracking-wide text-signal">
                      {selected.item.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-ash">
                      Category
                    </dt>
                    <dd className="mt-1 text-sm text-ink">{selected.category.label}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-ash">
                      Note
                    </dt>
                    <dd className="mt-1 text-sm text-ink">
                      {selected.item.note ?? "No additional note recorded."}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 text-sm text-ash">
                  Hover, focus, or select a technology to inspect it.
                </p>
              )}

              <p className="mt-5 border-t border-gotham-700 pt-4 text-xs text-ash">
                Proficiency levels are not shown because the source content does not
                include them.
              </p>
            </div>
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
