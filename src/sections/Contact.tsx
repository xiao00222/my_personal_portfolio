import { ArrowUpRight, Download } from "lucide-react";

import { BatMotif } from "@/components/BatMotif";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { contactIcons, socialIcons } from "@/lib/icons";
import { portfolio, sectionById } from "@/data/portfolio";

/**
 * Contact.
 *
 * There is deliberately **no form**. The site is frontend-only, so a form could
 * only ever hand off to the visitor's own mail client after validating three
 * fields — more friction than simply clicking the address. The email address,
 * phone number and profiles are therefore exposed as real, immediately usable
 * links.
 */
export function Contact() {
  const { profile, contactInfo, ui } = portfolio;
  const section = sectionById.contact;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-signal)_12%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          headingId="contact-heading"
          eyebrow={section.eyebrow}
          title={ui.contact.heading}
          description={ui.contact.intro}
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* Direct channels */}
          <Reveal from="left">
            <div className="panel h-full rounded-2xl p-5 sm:p-7">
              <h3 className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-steel">
                {ui.contact.channels}
              </h3>

              <ul className="mt-5 divide-y divide-gotham-700">
                {contactInfo.map((item) => {
                  const Icon = contactIcons[item.icon];

                  const body = (
                    <>
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-signal/30 bg-signal/10 text-signal transition-[transform,border-color,box-shadow] duration-300 ease-out group-hover/ch:scale-105 group-hover/ch:border-signal/70 group-hover/ch:shadow-[0_0_22px_-6px_color-mix(in_srgb,var(--color-signal)_75%,transparent)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[0.62rem] uppercase tracking-[0.25em] text-ash">
                          {item.label}
                        </span>
                        <span className="mt-1 block truncate text-sm text-ink transition-colors duration-300 group-hover/ch:text-signal">
                          {item.value}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="group/ch flex items-center gap-4 py-4"
                        >
                          {body}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 -translate-x-1 text-signal opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover/ch:translate-x-0 group-hover/ch:opacity-100"
                          />
                        </a>
                      ) : (
                        <div className="group/ch flex items-center gap-4 py-4">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 border-t border-gotham-700 pt-5 text-sm leading-relaxed text-ash">
                {ui.contact.note}
              </p>
            </div>
          </Reveal>

          {/* Availability, CV and profiles */}
          <Reveal from="right" delay={0.1} className="flex flex-col gap-6">
            <div className="panel rounded-2xl p-5 sm:p-7">
              <p className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-ink">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                </span>
                {profile.availability}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-ash">
                The fastest route is email — the address above opens your mail client
                directly. My CV has the full history if you'd like it up front.
              </p>

              <ButtonLink
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                className="mt-6 w-full sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download CV
              </ButtonLink>
            </div>

            <div className="panel flex flex-1 flex-col justify-between gap-6 rounded-2xl p-5 sm:p-7">
              <div>
                <h3 className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-steel">
                  Elsewhere
                </h3>
                <ul className="mt-5 flex flex-wrap gap-3">
                  {profile.socials.map((social) => {
                    const Icon = socialIcons[social.icon];
                    return (
                      <li key={social.label}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/soc inline-flex items-center gap-2.5 rounded-full border border-gotham-600 px-4 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ash transition-[transform,border-color,color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-signal hover:text-signal hover:shadow-[0_0_22px_-8px_color-mix(in_srgb,var(--color-signal)_75%,transparent)]"
                        >
                          <Icon
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-300 group-hover/soc:scale-110"
                          />
                          <span>{social.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Decorative emblem — no accessible name, purely visual. */}
              <BatMotif className="mx-auto w-36 text-signal opacity-50" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
