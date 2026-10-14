import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";

import heroBg from "@/assets/hero-bg.jpg";
import heroBgSmall from "@/assets/hero-bg-sm.jpg";
import { BatMotif } from "@/components/BatMotif";
import { BatSignal } from "@/components/BatSignal";
import { ButtonLink } from "@/components/Button";
import { GlitchText } from "@/components/GlitchText";
import { RainCanvas } from "@/components/RainCanvas";
import { Skyline } from "@/components/Skyline";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { socialIcons } from "@/lib/icons";
import { portfolio } from "@/data/portfolio";

/**
 * Hero / "Briefing".
 *
 * Layers, back to front: photo backdrop → rain canvas → signal beam → skyline
 * (2 parallax bands) → content. Only `transform` / `opacity` animate, and the
 * rain canvas parks itself once it leaves the viewport.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);

  const { profile, hero, ui } = portfolio;

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28 sm:pb-28"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10">
        {/* Two widths keep phones off the 1920px file (the LCP element here). */}
        <img
          src={heroBg}
          srcSet={`${heroBgSmall} 1024w, ${heroBg} 1920w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1200}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gotham-950/70 via-gotham-950/85 to-gotham-950" />
      </div>

      <RainCanvas className="-z-10" />
      <BatSignal progress={scrollYProgress} label={`${profile.name} backdrop emblem`} />
      <Skyline progress={scrollYProgress} />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8"
      >
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.35em] text-signal">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            {profile.title}
          </p>

          <h1
            id="hero-title"
            className="mt-5 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-8xl"
          >
            <GlitchText text={profile.name} />
          </h1>

          <p className="mt-6 font-display text-xl uppercase leading-tight tracking-wide text-ash sm:text-2xl lg:text-3xl">
            {hero.headlineLead}{" "}
            <span className="text-signal text-glow-signal">
              <GlitchText text={hero.headlineAccent} delay={420} />
            </span>{" "}
            {hero.headlineTail}
          </p>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ash sm:text-base">
            {hero.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href={`#${hero.primaryCta.target}`} size="lg">
              <BatMotif className="h-3.5 w-6" />
              {hero.primaryCta.label}
            </ButtonLink>

            <ButtonLink
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="lg"
            >
              <Download className="h-4 w-4" />
              {hero.secondaryCta.label}
            </ButtonLink>

            <ul className="flex items-center gap-2 sm:ml-2">
              {profile.socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gotham-600 text-ash transition-colors hover:border-signal hover:text-signal"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.25em] text-steel">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            {profile.availability}
          </p>
        </div>

        {/* Core technologies.

            This replaces the old scrolling marquee. A 5,500px-wide layer
            animating forever was the single most expensive thing in the hero
            and, being motion-only, also the hardest thing here to read: names
            slid past faster than they could be scanned and the duplicated row
            was hidden from screen readers, so half the list only ever reached
            sighted users mid-animation.

            As a numbered index it is static, page-aligned, fully readable in
            both directions, and costs nothing per frame. It also keeps its own
            dark backing and hairline grid, so steel-blue names never sit on the
            signal-yellow emblem behind them. */}
        <section
          aria-labelledby="tech-manifest-heading"
          className="relative mt-14 overflow-hidden rounded-2xl border border-gotham-700/70 bg-gotham-950/92"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-gotham-700/70 px-4 py-3 sm:px-5">
            <h2
              id="tech-manifest-heading"
              className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-steel sm:gap-2.5 sm:text-[0.64rem] sm:tracking-[0.28em]"
            >
              <BatMotif className="h-2.5 w-4 shrink-0 text-signal" />
              {ui.labels.techManifest}
              {/* The file id is chrome, not information: it only has room to
                  breathe from the small breakpoint up. */}
              <span aria-hidden="true" className="hidden text-gotham-500 sm:inline">
                /
              </span>
              <span className="hidden text-signal sm:inline">
                {ui.labels.techManifestId}
              </span>
            </h2>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ash sm:text-[0.64rem] sm:tracking-[0.25em]">
              {hero.techStack.length} modules
            </p>
          </div>

          <ol className="grid grid-cols-2 gap-px bg-gotham-700/40 sm:grid-cols-3 lg:grid-cols-4">
            {hero.techStack.map((tech, index) => (
              <li key={tech} className="group/tech relative bg-gotham-950/90">
                {/* Signal-yellow tick that fills on hover. Transform only. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-signal transition-transform duration-300 group-hover/tech:scale-y-100"
                />
                <span className="flex items-baseline gap-2.5 px-3.5 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
                  <span className="font-mono text-[0.58rem] tabular-nums text-gotham-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[0.8rem] uppercase tracking-[0.1em] text-ash transition-colors group-hover/tech:text-signal sm:text-sm">
                    {tech}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <a
          href="#about"
          className="mt-10 inline-flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-ash transition-colors hover:text-signal"
        >
          {ui.labels.scroll}
          <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
        </a>
      </motion.div>
    </section>
  );
}
