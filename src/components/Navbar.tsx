import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { BatMotif } from "@/components/BatMotif";
import { ButtonLink } from "@/components/Button";
import { SoundToggle } from "@/components/SoundToggle";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
}

interface NavbarProps {
  name: string;
  initials: string;
  items: NavItem[];
  activeId: string;
  ctaLabel: string;
  ctaId: string;
  soundLabels: { on: string; off: string };
  labels: { menu: string; close: string };
}

export function Navbar({
  name,
  initials,
  items,
  activeId,
  ctaLabel,
  ctaId,
  soundLabels,
  labels,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: Escape closes it and focus returns to the toggle button.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "panel-strong" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 text-ink transition-colors hover:text-signal"
        >
          <BatMotif className="h-5 w-9 shrink-0 text-signal" />
          {/* `sr-only` up to lg, visible from lg: at 768px the wordmark squeezed
              the nav links and the CTA onto two lines each. Kept in the DOM at
              every width (rather than `hidden`) so the link's accessible name
              never depends on the viewport. */}
          <span className="sr-only font-display text-sm font-semibold uppercase tracking-[0.18em] lg:not-sr-only">
            {name}
            <span className="sr-only"> — {initials} — back to top</span>
          </span>
        </a>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 rounded-full border border-gotham-700/80 bg-gotham-900/70 p-1 backdrop-blur md:flex">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative z-10 block rounded-full px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] transition-colors",
                    isActive ? "text-gotham-950" : "text-ash hover:text-ink",
                  )}
                >
                  {item.label}
                </a>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-signal"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <SoundToggle onLabel={soundLabels.on} offLabel={soundLabels.off} />

          <div className="hidden sm:block">
            <ButtonLink href={`#${ctaId}`} size="sm">
              {ctaLabel}
            </ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? labels.close : labels.menu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gotham-600 text-ink transition-colors hover:border-signal hover:text-signal md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="panel-strong border-t border-gotham-700 md:hidden"
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-5 sm:px-8">
              {items.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.3 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={activeId === item.id ? "true" : undefined}
                    className={cn(
                      "block border-l-2 py-3 pl-4 font-display text-lg uppercase tracking-wide transition-colors",
                      activeId === item.id
                        ? "border-signal text-signal"
                        : "border-gotham-600 text-ash hover:border-steel hover:text-ink",
                    )}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}

              <li className="pt-3">
                <ButtonLink
                  href={`#${ctaId}`}
                  onClick={() => setOpen(false)}
                  className="w-full"
                  size="md"
                >
                  {ctaLabel}
                </ButtonLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
