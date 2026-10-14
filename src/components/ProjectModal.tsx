import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Github, Lock, X } from "lucide-react";

import { BatMotif } from "@/components/BatMotif";
import { ButtonLink } from "@/components/Button";
import { ProjectImage } from "@/components/ProjectImage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  labels: {
    closeProject: string;
    liveDemo: string;
    repository: string;
    repoPrivate: string;
    noLiveDemo: string;
  };
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Project detail dialog.
 *
 * Accessibility contract:
 *  - `role="dialog"` + `aria-modal`, labelled by the project title.
 *  - Focus moves to the close button on open and returns to the previously
 *    focused card on close; Tab is trapped inside the panel.
 *  - Escape closes; clicking the backdrop closes; body scroll is locked.
 *  - Content is always in the DOM flow of the panel (no animation-only info).
 */
export function ProjectModal({ project, onClose, labels }: ProjectModalProps) {
  const reduced = usePrefersReducedMotion();
  const [imageIndex, setImageIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Reset the gallery whenever a different project is opened.
  useEffect(() => {
    setImageIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      restoreRef.current?.focus?.();
    };
  }, [onClose, project]);

  const active = project;
  const currentImage = active?.images[imageIndex];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="case-file-modal"
          className="fixed inset-0 z-[85] flex items-start justify-center overflow-y-auto p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          {/* Scrim. Deliberately has no `backdrop-blur`: this is a
              full-viewport layer that animates in and out, and blurring ~1.3M
              px² of backdrop is far too much to pay on every modal open. At 90%
              opacity the tint alone already reads as a scrim. */}
          <button
            type="button"
            aria-label={labels.closeProject}
            tabIndex={-1}
            onClick={onClose}
            className="fixed inset-0 cursor-default bg-gotham-950/90"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-title-${active.id}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="panel-strong relative my-4 w-full max-w-3xl overflow-hidden rounded-2xl sm:my-10"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={labels.closeProject}
              className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gotham-600 bg-gotham-900/80 text-ink transition-colors hover:border-signal hover:text-signal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Gallery */}
            <div className="relative border-b border-gotham-700 bg-gotham-950">
              <div className="relative aspect-video w-full overflow-hidden">
                {currentImage && (
                  <ProjectImage
                    src={currentImage.src}
                    alt={currentImage.alt}
                    width={1280}
                    height={720}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {active.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                  {active.images.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      aria-label={image.alt}
                      aria-current={index === imageIndex ? "true" : undefined}
                      className={cn(
                        "h-2 w-6 rounded-full transition-colors",
                        index === imageIndex ? "bg-signal" : "bg-gotham-500 hover:bg-steel",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6 p-5 sm:p-8">
              <header className="space-y-2">
                <p className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-signal">
                  <BatMotif className="h-3 w-5 text-signal" />
                  Project {active.projectNumber} · {active.category}
                </p>
                <h3
                  id={`project-title-${active.id}`}
                  className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl"
                >
                  {active.title}
                </h3>
                <p className="text-sm text-steel">{active.subtitle}</p>
              </header>

              <p className="text-sm leading-relaxed text-ash">{active.description}</p>

              {active.highlights.length > 0 && (
                <section aria-label="Highlights">
                  <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-steel">
                    Highlights
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {active.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm text-ash">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section aria-label="Technology stack">
                <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-steel">
                  Stack
                </h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {active.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-gotham-600 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-ash"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>

              <footer className="flex flex-wrap items-center gap-3 border-t border-gotham-700 pt-5">
                {active.liveUrl ? (
                  <ButtonLink
                    href={active.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                  >
                    {labels.liveDemo}
                    <ArrowUpRight className="h-4 w-4" />
                  </ButtonLink>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-gotham-700 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-ash">
                    <Lock className="h-3.5 w-3.5" />
                    {labels.noLiveDemo}
                  </span>
                )}

                {active.repoUrl ? (
                  <ButtonLink
                    href={active.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    size="sm"
                  >
                    <Github className="h-4 w-4" />
                    {labels.repository}
                  </ButtonLink>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-gotham-700 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-ash">
                    <Lock className="h-3.5 w-3.5" />
                    {labels.repoPrivate}
                  </span>
                )}
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
