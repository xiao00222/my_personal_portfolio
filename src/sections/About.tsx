import { BatMotif } from "@/components/BatMotif";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { highlightIcons } from "@/lib/icons";
import { portfolio, sectionById } from "@/data/portfolio";

/**
 * About.
 *
 * Presented as a record card: a header strip with profile metadata, the bio in
 * the body, and an angled stamp as a decorative layer. The stamp is
 * `aria-hidden` — the visual motif never carries information on its own.
 */
export function About() {
  const { about, profile } = portfolio;
  const section = sectionById.about;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          headingId="about-heading"
          eyebrow={section.eyebrow}
          title={section.title}
          description={`A quick introduction to ${profile.name} — ${profile.location}.`}
        />

        <Reveal className="mt-14">
          <article className="panel relative overflow-hidden rounded-2xl">
            {/* File header */}
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gotham-700 px-5 py-4 sm:px-8">
              <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[0.66rem] uppercase tracking-[0.25em]">
                <div className="flex items-center gap-2">
                  <BatMotif className="h-3 w-5 text-signal" />
                  <dt className="text-ash">Profile</dt>
                  <dd className="text-signal">{about.dossier.fileId}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-ash">Status</dt>
                  <dd className="text-signal">{about.dossier.status}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="text-ash">Focus</dt>
                  <dd className="text-signal">{about.dossier.focus}</dd>
                </div>
              </dl>
            </header>

            <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
              <div>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-steel">
                  Profile
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
                  {profile.name}
                </h3>
                <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-signal">
                  {profile.title}
                </p>

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-ash sm:text-base">
                  {about.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>

                {about.quote && (
                  <blockquote className="mt-8 border-l-2 border-signal pl-5">
                    <p className="font-display text-lg italic leading-snug text-ink sm:text-xl">
                      {about.quote}
                    </p>
                  </blockquote>
                )}
              </div>

              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {about.highlights.map((highlight, index) => {
                  const Icon = highlightIcons[highlight.icon];
                  return (
                    <li key={highlight.title}>
                      <Reveal
                        delay={index * 0.08}
                        from="right"
                        className="h-full rounded-xl border border-gotham-700 bg-gotham-850/60 p-5 transition-colors hover:border-signal/60"
                      >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-signal/40 bg-signal/10 text-signal">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h4 className="mt-3 font-display text-sm uppercase tracking-[0.12em] text-ink">
                          {highlight.title}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-ash">
                          {highlight.description}
                        </p>
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Decorative stamp */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 bottom-4 hidden rotate-[-12deg] select-none border-4 border-signal/55 px-4 py-1.5 font-display text-3xl font-bold uppercase tracking-[0.2em] text-signal/55 sm:block"
            >
              {about.dossier.stamp}
            </span>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
