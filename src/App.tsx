import { Suspense, lazy, useEffect, useState } from "react";

import { AmbientBackground } from "@/components/AmbientBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Spotlight } from "@/components/Spotlight";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useSessionOnce } from "@/hooks/useSessionOnce";
import { applySeo } from "@/lib/seo";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";
import { portfolio } from "@/data/portfolio";

/**
 * The intro overlay is the only code-split chunk: it is never shown again after
 * the first visit in a session, so there is no reason to pay for it on every
 * page load.
 */
const BootSequence = lazy(() =>
  import("@/components/BootSequence").then((module) => ({
    default: module.BootSequence,
  })),
);

const ALL_SECTION_IDS = portfolio.ui.sections.map((section) => section.id);

export default function App() {
  const { seen, markSeen } = useSessionOnce(portfolio.ui.boot.sessionKey);
  const [bootComplete, setBootComplete] = useState(false);

  const showBoot = !seen && !bootComplete;
  const activeSection = useActiveSection(ALL_SECTION_IDS);

  // Keep <title>/meta in lockstep with the data file.
  useEffect(() => {
    applySeo();
  }, []);

  const finishBoot = () => {
    markSeen();
    setBootComplete(true);
  };

  return (
    <>
      {showBoot && (
        <Suspense fallback={null}>
          <BootSequence
            lines={portfolio.ui.boot.lines}
            skipLabel={portfolio.ui.boot.skip}
            continueLabel={portfolio.ui.boot.continue}
            onDone={finishBoot}
          />
        </Suspense>
      )}

      <AmbientBackground />
      <ScrollProgress />
      <CustomCursor />
      <Spotlight />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-signal focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-gotham-950"
      >
        Skip to content
      </a>

      {/* Everything behind the intro overlay is inert while it plays. */}
      <div id="top" inert={showBoot || undefined}>
        <Navbar
          name={portfolio.profile.name}
          initials={portfolio.profile.initials}
          items={portfolio.ui.nav}
          activeId={activeSection}
          ctaLabel={portfolio.hero.primaryCta.label}
          ctaId={portfolio.hero.primaryCta.target}
          soundLabels={{ on: portfolio.ui.labels.soundOn, off: portfolio.ui.labels.soundOff }}
          labels={{ menu: portfolio.ui.labels.menu, close: portfolio.ui.labels.closeMenu }}
        />

        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>

        <Footer
          name={portfolio.profile.name}
          initials={portfolio.profile.initials}
          socials={portfolio.profile.socials}
          links={portfolio.ui.nav}
          backToTopLabel={portfolio.ui.labels.backToTop}
        />
      </div>
    </>
  );
}
