import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BatMotif } from "@/components/BatMotif";
import { GlitchText } from "@/components/GlitchText";
import { ProjectModal } from "@/components/ProjectModal";
import { ProjectImage } from "@/components/ProjectImage";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TiltCard } from "@/components/TiltCard";
import { ArrowUpRight, Github, Lock, Plus } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { portfolio, projectCategories, sectionById, type Project } from "@/data/portfolio";

/**
 * Projects.
 *
 * - Category filter with animated layout transitions (`layout` + AnimatePresence).
 * - Each card tilts in 3D on hover (see TiltCard) and expands into an accessible
 *   dialog with the full description, CV highlights, stack, and links.
 * - The live-demo and source links are real anchors sitting **on the card**, so
 *   they are reachable without opening anything. They sit above the card's
 *   full-surface "open details" button in the stack, so they always win the hit
 *   test; the button underneath keeps the rest of the surface clickable.
 */
export function Projects() {
  const reduced = usePrefersReducedMotion();
  const [category, setCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const { projects, ui } = portfolio;
  const section = sectionById.projects;

  const visible = useMemo(
    () =>
      category === "all"
        ? projects
        : projects.filter((project) => project.category === category),
    [category, projects],
  );

  const openProject = projects.find((project) => project.id === openId) ?? null;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          headingId="projects-heading"
          eyebrow={section.eyebrow}
          title={section.title}
          description="Selected builds, grouped by type. Open a project for the full breakdown, or jump straight to the live demo and source."
          actions={
            <div
              role="group"
              aria-label="Filter projects by category"
              className="flex flex-wrap gap-2"
            >
              <FilterChip
                active={category === "all"}
                onClick={() => setCategory("all")}
                label={`${ui.labels.filterAll} (${projects.length})`}
              />
              {projectCategories.map((item) => (
                <FilterChip
                  key={item}
                  active={category === item}
                  onClick={() => setCategory(item)}
                  label={`${item} (${projects.filter((p) => p.category === item).length})`}
                />
              ))}
            </div>
          }
        />

        <motion.ul layout className="mt-14 grid gap-7 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <motion.li
                key={project.id}
                layout
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
                transition={{
                  duration: reduced ? 0 : 0.4,
                  delay: reduced ? 0 : index * 0.06,
                  layout: { duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <TiltCard className="h-full rounded-2xl">
                  <article className="panel shine group relative flex h-full w-full flex-col overflow-hidden rounded-2xl text-left transition-[border-color,box-shadow] duration-500 hover:border-signal/60 hover:shadow-[0_24px_60px_-32px_color-mix(in_srgb,var(--color-signal)_45%,transparent)]">
                    <div className="relative aspect-video w-full overflow-hidden bg-gotham-950">
                      <ProjectImage
                        src={project.images[0].src}
                        alt={project.images[0].alt}
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gotham-900 via-gotham-900/30 to-transparent" />

                      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-signal/40 bg-gotham-950/80 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-signal">
                        <BatMotif className="h-2.5 w-4" />
                        {project.projectNumber}
                      </span>

                      {/* {project.images.length > 1 && (
                        <span className="absolute right-4 top-4 rounded-full border border-gotham-600 bg-gotham-950/80 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash">
                          {project.images.length} screenshots
                        </span>
                      )} */}
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                      <div>
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-steel">
                          {project.category}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-ink transition-colors group-hover:text-signal sm:text-2xl">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm text-steel">{project.subtitle}</p>
                      </div>

                      <p className="line-clamp-4 text-sm leading-relaxed text-ash">
                        {project.description}
                      </p>

                      <ul className="flex flex-wrap gap-2">
                        {project.tech.slice(0, 6).map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full border border-gotham-600 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-ash"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>

                      {/* Direct actions, centred in the card.
                          `z-20` keeps them above the full-surface details
                          button (`z-10`) so they are always the click target. */}
                      <CardActions project={project} labels={ui.labels} />

                      <div className="mt-auto flex items-center justify-between border-t border-gotham-700 pt-4">
                        <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-signal">
                          <Plus className="h-3.5 w-3.5" />
                          {ui.labels.viewCase}
                        </span>
                      </div>
                    </div>

                    {/* Full-surface click target. It deliberately holds no
                        visible text: an aria-label shorter than the card's
                        visible text fails WCAG 2.5.3 (label in name). The
                        card's own copy stays in the tree as readable article
                        content. */}
                    <button
                      type="button"
                      onClick={() => setOpenId(project.id)}
                      aria-label={`${ui.labels.viewCase}: ${project.title} — ${project.subtitle}`}
                      className="absolute inset-0 z-10 rounded-2xl"
                    />
                  </article>
                </TiltCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {visible.length === 0 && (
          <Reveal className="mt-10">
            <p className="font-mono text-sm text-ash">No projects in this category.</p>
          </Reveal>
        )}

        <Reveal className="mt-16 text-center">
          <p className="font-display text-lg uppercase tracking-[0.2em] text-ash sm:text-xl">
            <GlitchText text="More projects on the way." />
          </p>
        </Reveal>
      </div>

      <ProjectModal
        project={openProject}
        onClose={() => setOpenId(null)}
        labels={{
          closeProject: ui.labels.closeProject,
          liveDemo: ui.labels.liveDemo,
          repository: ui.labels.repository,
          repoPrivate: ui.labels.repoPrivate,
          noLiveDemo: ui.labels.noLiveDemo,
        }}
      />
    </section>
  );
}

/**
 * Centred action row on each card.
 *
 * A slot is always rendered so the cards line up, but only becomes a real link
 * when the project actually has that URL. Where the source content had no link
 * (Formoptix), the slot is a muted, non-interactive note rather than a dead link
 * or an invented one.
 */
function CardActions({
  project,
  labels,
}: {
  project: Project;
  labels: typeof portfolio.ui.labels;
}) {
  return (
    <div className="flex items-center justify-center gap-3 pt-1">
      <CardAction
        href={project.liveUrl}
        icon={<ArrowUpRight className="h-4 w-4" />}
        label={labels.liveDemo}
        projectTitle={project.title}
        unavailable={labels.noLiveDemo}
      />
      <CardAction
        href={project.repoUrl}
        icon={<Github className="h-4 w-4" />}
        label={labels.repository}
        projectTitle={project.title}
        unavailable={labels.repoPrivate}
      />
    </div>
  );
}

/**
 * One card action.
 *
 * The accessible name is built from the element's own content — the visible
 * label plus a visually hidden project name — rather than an `aria-label`
 * override. An override that does not contain the visible text fails WCAG 2.5.3
 * (Label in Name): a voice-control user saying "click source code" would find no
 * such control. "Live demo — SyncUp" contains "Live demo"; the reverse is not
 * true, which is exactly what the audit caught on the source links.
 */
function CardAction({
  href,
  icon,
  label,
  projectTitle,
  unavailable,
}: {
  href: string | null;
  icon: React.ReactNode;
  label: string;
  projectTitle: string;
  unavailable: string;
}) {
  if (!href) {
    return (
      <span
        title={unavailable}
        className="inline-flex cursor-default items-center gap-2 rounded-full border border-gotham-700 px-3.5 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gotham-500"
      >
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">{unavailable}</span>
        <span aria-hidden="true">{label}</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/action relative z-20 inline-flex items-center gap-2 overflow-hidden rounded-full border border-gotham-600 px-3.5 py-2",
        "font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ash",
        "transition-[transform,border-color,color,box-shadow] duration-300 ease-out",
        "hover:-translate-y-0.5 hover:border-signal hover:text-signal hover:shadow-[0_0_24px_-6px_color-mix(in_srgb,var(--color-signal)_70%,transparent)]",
        "active:translate-y-0",
      )}
    >
      {/* Signal wipe that slides in from the left on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-signal/10 transition-transform duration-400 ease-out group-hover/action:translate-x-0"
      />
      <span
        aria-hidden="true"
        className="relative transition-transform duration-300 group-hover/action:scale-110"
      >
        {icon}
      </span>
      <span className="relative">{label}</span>
      <span className="sr-only"> — {projectTitle}</span>
    </a>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] transition-[background-color,border-color,color,transform] duration-300",
        "hover:-translate-y-0.5",
        active
          ? "border-signal bg-signal text-gotham-950"
          : "border-gotham-600 text-ash hover:border-signal hover:text-signal",
      )}
    >
      {label}
    </button>
  );
}
