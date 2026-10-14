import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BatMotif } from "@/components/BatMotif";
import { socialIcons } from "@/lib/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { SocialLink } from "@/data/portfolio";

interface FooterProps {
  name: string;
  initials: string;
  socials: SocialLink[];
  links: { id: string; label: string }[];
  backToTopLabel: string;
}

/**
 * Minimal footer. The back-to-top control fires a light flare (a beam that
 * expands and fades) before scrolling up — a small, on-theme flourish that is
 * skipped entirely when the user prefers reduced motion.
 */
export function Footer({ name, initials, socials, links, backToTopLabel }: FooterProps) {
  const reduced = usePrefersReducedMotion();
  const [flaring, setFlaring] = useState(false);

  const backToTop = () => {
    if (!reduced) {
      setFlaring(true);
      window.setTimeout(() => setFlaring(false), 900);
    }
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-gotham-700 py-12">
      {/* Light flare */}
      <AnimatePresence>
        {flaring && (
          <motion.div
            aria-hidden="true"
            key="flare"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 0.85, scale: 1.6 }}
            exit={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-signal)_45%,transparent),transparent_70%)]"
          />
        )}
      </AnimatePresence>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 sm:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <a
            href="#top"
            className="flex items-center gap-3 font-display text-sm uppercase tracking-[0.2em] text-ink transition-colors hover:text-signal"
          >
            <BatMotif className="h-4 w-7 text-signal" />
            {name}
          </a>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash transition-colors hover:text-signal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-3">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gotham-600 text-ash transition-colors hover:border-signal hover:text-signal"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col-reverse items-center gap-4 border-t border-gotham-800 pt-6 sm:flex-row sm:justify-between">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash">
            © {year} {name} · {initials}
          </p>

          <button
            type="button"
            onClick={backToTop}
            className="group inline-flex items-center gap-2 rounded-full border border-gotham-600 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash transition-colors hover:border-signal hover:text-signal"
          >
            <BatMotif className="h-3 w-5 text-signal transition-transform duration-500 group-hover:-translate-y-0.5" />
            {backToTopLabel}
          </button>
        </div>
      </div>
    </footer>
  );
}
