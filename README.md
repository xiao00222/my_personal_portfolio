# Farhan Ali — Gotham Portfolio

A Batman/Gotham-themed, heavily animated portfolio site for **Farhan Ali** (Software Engineer · .NET / C#).
Frontend only — **no backend, no database, no auth**.

React 19 + Vite + TypeScript + Tailwind CSS v4 + Framer Motion.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b` (zero-error typecheck) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (flat config, TypeScript + React hooks) |
| `npm run typecheck` | Types only, no emit |

Node 20+ recommended (built and verified on Node 22).

---

## Editing content — one file

**Everything the site renders lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).** Components contain no copy.
Edit that file and the whole site updates — headings, nav, buttons, section eyebrows, boot-sequence lines, SEO tags.

The file is split into typed sections, each with an interface:

| Export | Interface | Feeds |
| --- | --- | --- |
| `seo` | `Seo` | `<title>`, meta description, Open Graph |
| `profile` | `Profile` | Hero identity, nav logo, contact details, socials, CV link |
| `hero` | `Hero` | Hero headline, tagline, CTAs, `techStack` technology index |
| `about` | `About` | Bio, pull-quote, highlight cards, profile metadata |
| `skills` | `SkillCategory[]` | Skill categories and technologies |
| `projects` | `Project[]` | Case-file cards **and** the detail modals |
| `timeline` | `TimelineEntry[]` | Service-record timeline |
| `certifications` | `Certification[]` | Currently empty — renders nothing (see gaps) |
| `contactInfo` | `ContactInfo[]` | Contact channels |
| `ui` | `UIStrings` | All interface chrome (section titles, labels, boot lines) |

### Adding a project

Add an object to `portfolio.projects`. `category` must be a value of `ProjectCategory`
(`"Web Platform"` or `"AI / ML"`) — the filter chips are derived from the data, so a new
category appears automatically.

```ts
{
  id: "my-project",
  caseNumber: "004",
  title: "My Project",
  subtitle: "One-line descriptor",
  description: "Long description shown on the card and in the modal.",
  highlights: ["CV bullet 1", "CV bullet 2"],
  category: "Web Platform",
  images: [{ src: myImage, alt: "Describe the screenshot" }],
  tech: ["C#", "React"],
  liveUrl: "https://…",   // or null → renders a locked "no live demo" chip
  repoUrl: null,          // or null → renders a locked "repo private" chip
  year: null,
}
```

### Adding an image

Drop it in `src/assets/` (or `src/assets/projects/`) and import it at the top of
`portfolio.ts`, exactly as the existing images do. `src/assets/` is for bundled,
hashed, optimised assets; `public/` holds only things that must keep a stable URL
(the CV PDF, favicons, `robots.txt`, the web manifest).

---

## Project structure

```
src/
├─ assets/                 bundled images (hero backdrop + project screenshots)
├─ components/             reusable, content-agnostic pieces
│  ├─ AmbientBackground.tsx drifting light pools + scroll parallax
│  ├─ BatMotif.tsx         original bat silhouette SVG (see "Original artwork")
│  ├─ BatSignal.tsx        ★ the standout scroll-reactive signal beam
│  ├─ BootSequence.tsx     cinematic Batcomputer intro (lazy-loaded)
│  ├─ Button.tsx           Button + ButtonLink (primary / ghost / quiet)
│  ├─ CustomCursor.tsx     reticle cursor (fine-pointer only)
│  ├─ Footer.tsx           minimal footer + signal-flare back-to-top
│  ├─ GlitchText.tsx       scramble-in headings
│  ├─ Navbar.tsx           sticky nav, active section, animated mobile menu
│  ├─ ProjectImage.tsx     screenshot with shimmer placeholder + fade-in
│  ├─ ProjectModal.tsx     accessible project detail dialog
│  ├─ RainCanvas.tsx       lightweight canvas rain
│  ├─ Reveal.tsx           scroll-triggered reveal wrapper
│  ├─ ScrollProgress.tsx   top progress rail with a bat marker
│  ├─ SectionHeading.tsx   shared eyebrow/title/description block
│  ├─ Skyline.tsx          deterministic parallax Gotham skyline
│  ├─ SoundToggle.tsx      optional WebAudio ambience (OFF by default)
│  ├─ Spotlight.tsx        composited flashlight pool (no per-frame repaint)
│  └─ TiltCard.tsx         pointer-driven 3D tilt
├─ data/portfolio.ts       ← SINGLE SOURCE OF TRUTH for all content
├─ hooks/                  reusable behaviour
│  ├─ useActiveSection.ts  IntersectionObserver nav highlighting
│  ├─ useInViewOnce.ts     one-shot in-view detection
│  ├─ useMediaQuery.ts     matchMedia + fine-pointer helper
│  ├─ usePrefersReducedMotion.ts
│  ├─ useScrollProgress.ts rAF-throttled scroll progress
│  ├─ useSessionOnce.ts    sessionStorage "show once per session"
│  └─ useSpotlightCursor.ts binds an element to the shared cursor engine
├─ lib/                    cn(), seeded RNG, icon maps, motion variants, SEO
│  └─ cursor.ts            one shared pointer listener + rAF loop (see below)
├─ sections/               Hero, About, Skills, Projects, Experience, Contact
├─ App.tsx                 composition root (boot gate, nav, sections, layers)
├─ index.css               Tailwind v4 theme tokens, fonts, keyframes
└─ main.tsx                entry point
```

---

## Dependencies (and why each one is here)

Kept deliberately small. Every runtime dependency below is load-bearing.

| Package | Why |
| --- | --- |
| `react`, `react-dom` | The brief. |
| `framer-motion` | The brief's required animation library. Drives scroll reveals, the animated project-grid layout transitions, the mobile menu, the modal, and the scroll-linked signal beam. |
| `tailwindcss`, `@tailwindcss/vite` | The brief. v4 is configured **in CSS** (`@theme` in `src/index.css`) — this is v4's native config mechanism, so there is no `tailwind.config.js`. All colours/fonts/animation names are tokens there; no raw hex values appear in components. |
| `lucide-react` | Small, tree-shakeable icon set. Replaced hand-rolled SVGs for generic UI icons (mail, phone, lock, menu…) and is mapped through `src/lib/icons.ts` so `portfolio.ts` stays icon-library-agnostic. |
| `@fontsource/oswald` | Display face — condensed and bold, the closest neutral fit to a Gotham headline without touching trademarked assets. |
| `@fontsource/inter` | Body face — high legibility at small sizes. |
| `@fontsource/jetbrains-mono` | Mono face for terminal and metadata text. |
| dev: `typescript`, `@types/*`, `vite`, `@vitejs/plugin-react` | TypeScript + build tooling (the brief). |
| dev: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` | The lint gate required by the brief. |

Fontsource over Google Fonts: fonts are **bundled and self-hosted**, so there is no
third-party request at runtime (better privacy and no render-blocking cross-origin
font fetch).

**Deliberately NOT added:**

- **GSAP** — no clear reason. Framer Motion already covers scroll-linked transforms (`useScroll`/`useTransform`), layout animations and gestures. Adding GSAP would have meant two animation engines for one page.
- **Three.js** — the atmosphere (skyline, rain, beams) is achievable with SVG, canvas 2D and CSS at a fraction of the cost. See "The wow moment".
- **`clsx` / `tailwind-merge`** — `cn()` in `src/lib/utils.ts` is ~15 lines and the project has no conditional-class collision problem that would justify `tailwind-merge`.
- **`@emailjs/browser`** — the original site used it. This build is frontend-only per the brief, and the contact section is now just real `mailto:` / `tel:` links with no form at all, so there is nothing to send.

---

## Theme

Defined once as Tailwind v4 tokens in `src/index.css` under `@theme`:

| Token | Value | Role |
| --- | --- | --- |
| `gotham-950…500` | `#05060a` → `#3a4150` | Near-black page, charcoal surfaces, borders |
| `signal` | `#ffc61a` | The single accent — a warm signal yellow |
| `steel` | `#7d9ab8` | Muted steel-blue secondary |
| `ink` / `ash` | `#e9edf3` / `#9aa5b5` | Body text / muted text |
| `font-display` | Oswald | Headings |
| `font-sans` | Inter | Body |
| `font-mono` | JetBrains Mono | Batcomputer elements |

Contrast: `signal` on `gotham-950` ≈ 12:1, `ash` on `gotham-950` ≈ 9:1, `gotham-950` on `signal` ≈ 12:1 — all comfortably AA/AAA.

### Original artwork

`BatMotif` is drawn from scratch: a single half-wing `<path>` mirrored around the centre
line, with an optional halo of signal rings. **No Batman logo, official emblem, or
third-party artwork is used anywhere.** (The user's original folder did contain a
`bats-alpha.webm`; it was intentionally not used, since its provenance is unknown.)

The user's own assets (hero backdrop, project screenshots, CV PDF, favicons) *are* used —
copied into `src/assets/` (bundled images) and `public/` (stable-URL files). Large PNG
screenshots and the JPEG backdrop were re-encoded to WebP/resized (4.7 MB → 118 KB, 1.2 MB
→ 62 KB) with no visible quality loss; the originals in your original folder are untouched.

---

## Interactions & animation

- **Boot sequence** — a terminal types six log lines, then an emblem reveal hands off to the hero. Skippable (button + `Escape`), shown **once per session** (`sessionStorage`), focus-locked, and skipped entirely under reduced motion.
- **Custom cursor** — **two states**. A signal reticle is drawn exactly on the pointer, and over anything interactive (links, buttons, inputs) it swaps to a **pointing-hand glyph whose fingertip is the pointer**, so the hand behaves like a real cursor and the visitor gets the "this is clickable" cue that hiding the native cursor would otherwise remove. Alongside it a **light pool** follows with a slight trailing ease. All of it rides one shared rAF loop in `src/lib/cursor.ts` which writes a `transform` straight onto each node, so **moving the mouse never re-renders React and never repaints the page** — it is a compositor-only translate. The hover flag is React state, but it only flips on `pointerover`, never per frame. Fine-pointer devices only; never on touch.
- **Ambient background** — three very low-opacity pools of light drift behind the whole page (34–56 s loops) and ride the scroll via `useScroll`/`useTransform`. Each is a `radial-gradient` — soft without `filter: blur()` — rasterised once and thereafter only translated. Two nested nodes per pool on purpose: a CSS animation and an inline `transform` on the same element would fight over the same property.
- **Project card actions** — **Live demo** and **Source code** sit on the card itself, centred, as real anchors, so a visitor can reach either without opening anything. The card keeps a full-surface "view details" button underneath, and the links sit above it in the stack so they always win the hit test (verified with real clicks).
- **Hover polish** — cards lift with a signal-tinted shadow, a diagonal light sweep crosses the surface once (`shine`), the screenshot zooms slightly, and the action pills scale, glow and wipe. Buttons, chips and social pills lift on hover.
- **Loading states** — project screenshots show a **shimmering placeholder** while the lazy-loaded file is decoded, then fade in. Animating `transform`/`opacity` only.
- **Scroll reveals** — `Reveal` + `useInViewOnce` fire once per element (no re-animation, no layout shift).
- **Glitch/scramble headings** — `GlitchText`, used sparingly (hero name, hero accent, section titles, one closing line). The scrambling copy is `aria-hidden` with a single `sr-only` twin, so headings are announced exactly once.
- **Sticky nav** — transparent → blurred on scroll, active-section highlighting via a sliding `layoutId` pill driven by an IntersectionObserver band, plus an animated mobile panel.
- **3D tilt** — project cards tilt toward the pointer with a sheen; transform written directly to the node, no state. Only the snap-back on pointer-leave is transitioned — transitioning the follow transform too makes the card chase the cursor (see [Performance notes](#performance-notes)).
- **Sound** — optional and **OFF by default**. Synthesised with the Web Audio API (sub-bass drone + filtered noise rain), so **no audio files are required** and none ship.

### ★ The standout wow moment: the scroll-reactive signal beam

Anchored below the hero, a cone of signal-yellow light sweeps continuously while an
original emblem and halo sit inside it. As you scroll out of the hero it **brightens,
lifts and scales up**, then fades as the skyline parallaxes past.

Why this one: the entire site's interaction language is *light in the dark* — the cursor is
a torch and the background is a set of light pools, so a projected beam ties that together
instead of bolting on an unrelated gimmick. Because it responds to scroll it also works as
a scroll affordance. Cost: one clipped `<div>` plus an SVG emblem, animating only
`transform`/`opacity` — no canvas, no WebGL, and nothing at all when reduced motion is
requested.

### Reduced motion

`usePrefersReducedMotion` gates every heavy effect and `index.css` neutralises CSS
animations/transitions under `@media (prefers-reduced-motion: reduce)`:

| | Normal | Reduced motion |
| --- | --- | --- |
| Boot sequence | Plays | Skipped → hero immediately |
| Rain canvas | Renders | Returns `null` (not mounted at all) |
| Skyline parallax | Parallax | Static, no transform |
| Card tilt | 3D tilt | Off (cards still clickable) |
| Glitch text | Scrambles in | Final text rendered at once |
| Reveals | Fade + slide | Instantly visible |
| Ambient drift + scroll parallax | Animates | Static (pools still render) |
| Shimmer placeholder | Sweeps | Static, image still fades in |
| Card shine sweep / hover lifts | Animate | Off (states still change colour) |
| Pulses / beam sweep | Animate | Static |
| Smooth scrolling | Smooth | Instant (`auto`) |
| Cursor reticle + hand | Both states | Both states (an affordance, not decoration) |
| Cursor trail easing | Eased follow | Rigid, tracks directly |

The result is a **complete, readable static page**, not a broken one.

---

## Accessibility

- Semantic landmarks: `header`/`nav`/`main`/`section`/`article`/`footer`, one `h1`, no heading level skips.
- Keyboard: skip-to-content link, every interactive element focusable with a visible high-contrast focus ring, cards are real buttons with accessible names, the modal traps focus and returns it to the originating card, `Escape` closes the modal and the mobile menu (returning focus to the toggle), and the boot overlay sets focus to Skip.
- No information is conveyed by animation or colour alone — the current timeline entry also reads "Currently", projects without a link say "Source code private for now", and section state is text.
- Accessible names are built from each element's own content, never an `aria-label` override: the card actions read "Live demo — SyncUp" / "Source code — SyncUp". A Lighthouse run caught an earlier version failing **WCAG 2.5.3 (Label in Name)** because its `aria-label` ("Open source repository: SyncUp") did not contain the visible text ("SOURCE CODE") — a voice-control user saying "click source code" would have found no such control. There are now **zero binary accessibility failures**.
- All images have `alt` text (decorative layers are `aria-hidden`).
- Live regions: `aria-live` on the skills detail readout.
- Every `aria-labelledby` on a section points at a real element: `SectionHeading` now takes a `headingId` and puts it on the `<h2>`, which it previously never did — those references were dangling IDREFs.

---

## Performance

- Images are lazy-loaded and `decoding="async"`, and every one has explicit `width`/`height` so there is no layout shift from media.
- The hero backdrop ships a `srcset`/`sizes` pair (1024w/1920w) so phones never download the 1920px file.
- The rain canvas caps DPR at 2, scales particle count to viewport width, and **pauses** when the tab is hidden or the canvas leaves the viewport.
- Everything animates `transform`/`opacity` only. Measured **CLS 0.019 desktop / 0.004 mobile**.
- Code-splitting: the intro overlay (the only chunk that is dead weight after the first view) is `React.lazy`-loaded, and Framer Motion is split into its own chunk.
- The skyline is generated from a fixed seed and drawn as a handful of `<path>`s rather than ~1,200 `<rect>` nodes, which took the DOM from 1438 → 1024 elements.
- The hero's technology list is a **static index**, not a marquee. The old strip was a 5,508 px-wide layer animating forever — the single most expensive element in the hero, and the hardest thing there to read.

### Performance notes (what was measured, not assumed)

The pointer-follow effects were the site's main source of jank, for two reasons that only
showed up under measurement:

| Change | Before | After |
| --- | --- | --- |
| Cursor position published as CSS custom properties on `<html>` | **20.8 ms** median frame while hovering | **6.9 ms** (same as idle) |
| `backdrop-filter` across the page | 13 elements, **3,497,775 px²** of blurred backdrop | 2 elements, **114,029 px²** (nav pill + modal only) |
| Spotlight layer | full-viewport `mask-image` recomputed every frame | one fixed-size disc, `transform` only |
| Hero technology strip | 5,508 px layer animating forever | static index, no continuous animation |

Method: dispatch a `pointermove` every frame for 140 frames and take the median rAF
interval, with an empty `<body>` as the control. The control itself measured 6.9 ms, so the
hovering figure was ~14 ms/frame of real work rather than a frame-rate cap.

The CSS-variable figure is the interesting one. Custom properties are **inherited**, so
writing `--cursor-x` on the document root invalidates style for the entire tree: ~14 ms of
full-document style recalculation *per frame of every hover*, on a 1,000-node page. Writing
an inline `transform` onto the two elements that actually consume the value measured 6.9 ms
— i.e. free — because it is a compositor-only change. `src/lib/cursor.ts` now does that.

For the same reason `.panel` no longer uses `backdrop-filter` (it kept 11 large panels
re-sampling their backdrop whenever anything beneath them changed). Over a near-black page
the blur was barely visible; `.panel-strong` keeps it for the nav pill and the modal, where
it actually reads.

### Measured Lighthouse results

Run against the **production build** (`npm run build && npm run preview`) with Lighthouse 12.8.2 and real Chrome. Raw JSON: [`reports/lighthouse-desktop.json`](reports/lighthouse-desktop.json), [`reports/lighthouse-mobile.json`](reports/lighthouse-mobile.json).

| | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| **Desktop preset** | **100** | **100** | **100** | **100** |
| **Mobile (default throttling)** | **91** | **100** | **100** | **100** |

Desktop metrics: FCP 0.6 s · **LCP 0.7 s** · TBT 0 ms · CLS 0.019 · Speed Index 0.6 s.
Mobile metrics: LCP 2.9 s · TBT 90 ms · CLS 0.004, with **zero binary accessibility failures** on both presets.

Both exceed the brief's targets (Performance 85+, Accessibility 95+).

---

## Content: what was found, what is missing

### Found (all extracted verbatim into `portfolio.ts`)

Name, title, hero headline/tagline, 17-item technology index, 2 bio paragraphs + pull-quote,
4 About highlight cards, grouped skills (7 categories / 33 items from the CV), 3 projects
(descriptions, CV bullet points, tech stacks, live + repo links, 5 screenshots),
3 timeline entries, contact details (email, phone, location), 2 social links, CV PDF,
favicons.

### Gaps — the TODO list

These are marked `TODO` in [`src/data/portfolio.ts`](src/data/portfolio.ts) and nothing was invented to fill them:

1. **No profile photo.** `profile.photo` is `null`. The hero and dossier use a monogram/abstract treatment instead. Drop a photo into `src/assets/` and set `photo` to switch.
2. **No certifications.** `portfolio.certifications` is `[]` — the timeline shows an explicit "Certifications — none listed in the source content" note and renders no fake entries.
3. **No skill proficiency levels.** The source has no levels or percentages anywhere, so **no percentages or progress bars are shown**. The Skills panel states this in plain text.
4. **Formoptix has no live demo and no public repo.** `liveUrl`/`repoUrl` are `null`; the card renders two muted, non-interactive slots reading "No live demo available" / "Source code private for now", and the dialog repeats it. No link was invented.
5. **No project dates.** `year` is `null` for all three projects.
6. **No X/Twitter link.** Your original code imported a `Twitter` icon but never used it; only GitHub and LinkedIn exist, so only those render.
7. **No Open Graph image.** `og:*` tags are populated from your data but no `og:image` was provided.

### Wording normalisations (3)

Two are from the CV: it contains `"Used Ajax and Jquery for…"` and `"achieving upto 90%
accuracy"`, and the site renders **"jQuery"** and **"up to 90%"**. The third is in your own
hero tagline, which read `"…with hands-on experience scalabale applications."` — a typo plus a
missing verb. It now reads **"…with hands-on experience building scalable applications."**

These are the only three textual normalisations made; all three target obvious slips rather
than rewording anything. The phone number uses the web version (`+92 3350460061`) rather
than the CV's hyphenated form (`+92-335-0460061`).

### Interface copy is professional, not themed

All interface wording was rewritten for a professional setting. There is **no character or
franchise wording anywhere in the rendered text** — no "Signal the Bat", "Batcomputer",
"Gotham", "Arsenal", "Case Files", "Utility Belt", "Commissioner's Line" or "Dossier".

The visual theme is unchanged and intentional: the dark surfaces, signal-yellow accent,
original bat-silhouette mark, skyline, rain and light beams are all still there. Only the
words changed. Concretely:

| Was | Now |
| --- | --- |
| Nav: Dossier / Arsenal / Case Files / Timeline | **About / Skills / Projects / Experience** |
| "Signal the Bat" (nav CTA + hero CTA + contact heading) | **"Contact Me"** |
| Section IDs `briefing`, `dossier`, `arsenal`, `case-files`, `timeline`, `signal` | `home`, `about`, `skills`, `projects`, `experience`, `contact` (so the URL hash reads `#projects`, not `#case-files`) |
| "Batcomputer" / "Enter Gotham" / "SIGNAL ACQUIRED." | "portfolio terminal" / "View portfolio" / "WELCOME." |
| "Case ID GC-0001" / "Status ACTIVE" / "Clearance LEVEL 4" | "Profile PROFILE-01" / "Status Open to work" / "Focus Backend · Cloud · Applied AI" |
| "Open case file" / "Field Notes" / "Case File 001" | "View project details" / "Highlights" / "Project 01" |
| "Repository private for now" | "Source code private for now" |

Section anchors changed, so **any link you had pointing at `#dossier`, `#arsenal`,
`#case-files`, `#timeline` or `#signal` must be updated** to `#about`, `#skills`,
`#projects`, `#experience` or `#contact`.

---

## Verification

**Ran and passed**

1. `npm run build` → success, **zero TypeScript errors**. `npm run lint` → **zero errors/warnings**.
2. Dev server (`vite --host 127.0.0.1 --port 5183`) started; page loads with **no console errors** (only Vite's HMR debug lines and the React DevTools notice).
3. Lighthouse against the production build — scores above. Raw JSON written to `reports/` (kept in the workspace; this folder is not a git repo, so nothing here is committed).
4. **Content parity, 28 checks** — every checked string was confirmed present in *both* the original folder (`.jsx` files + `pdftotext` of your CV) *and* `portfolio.ts`: 25 exact, 1 formatting variant, 2 spelling normalisations (listed above). Then **21/24 strings confirmed in the rendered DOM**; the other 3 are modal-only content and were confirmed by opening the SwiftShop project dialog (`"Used Ajax and jQuery…"`, the live-demo URL, and the N-Tier highlight all present).
5. **Responsive layouts measured at 375 / 768 / 1440 px**: no horizontal overflow at any width; project grid 1 col → 2 col; about and contact split at `lg`; desktop nav ⇄ mobile toggle switch at 768; hero `h1` 48 → 72 → 96 px; timeline alternates at `md`; the centred card action row fits inside 375 px (277 px wide) and the technology index reflows 2 → 3 → 4 columns.
6. **Interactions exercised in a real browser**: intro plays and auto-advances; project dialog opens with focus on Close, traps Tab, closes on `Escape` and restores focus to the card; mobile menu opens with `aria-expanded`, locks scroll, closes on `Escape` and returns focus; the sound toggle flips `aria-pressed`.
7. Verified `prefers-reduced-motion: reduce` end-to-end — the boot intro, rain canvas, tilt and reveals all correctly fall back to a static page.
8. **Pointer/clicking regression pass** (after the cursor fix): the visible reticle's centre was measured against the pointer and is now offset by **0 px in both axes** (it was 14 px up-and-left). Real clicks were then driven through the browser on the nav links, the Arsenal category filter, a skill chip, the sound toggle, a case-file card (modal opened, focus landed on Close, `Escape` closed it) and the mobile menu at 375 px (opened, navigated, closed, scroll unlocked). Every one landed on its intended target.
9. **Frame-time measurement**: median rAF interval while dispatching a `pointermove` every frame went from **20.8 ms → 6.9 ms**, which is identical to the idle figure and to an empty `<body>` control. The per-frame hover cost is now zero rather than ~14 ms.
10. **New hero technology index** verified in the live DOM at all three widths: 17 cells, all 17 names present verbatim, 2 columns at 375 px, 3 at 768 px, 4 at 1440 px, no overflow, and the hover utilities confirmed compiled in the stylesheet.
11. **Card action links** — hit-tested with `elementFromPoint` at each link's centre (all four are the topmost element) **and** clicked with real browser input: a real click on "Source code" landed on the anchor, not the card's details button, and did not open the dialog; a real click on the card body did open the dialog. Formoptix renders two muted, non-interactive slots (it has no URLs in the source).
12. **Hand cursor** — dispatching `pointerover` on a card link flips the reticle to `opacity 0` and the hand to `opacity 1`; dispatching it on a heading flips them back. The glyph was rendered at 10× and inspected visually to confirm it reads as a pointing hand rather than a blob.
13. **New CSS animations** — all five new keyframes (`drift-a/b/c`, `shimmer`, `shine-sweep`) were exercised and confirmed to actually change `transform` over time. This required stripping the reduced-motion override **in the page only** (a test-harness change, not a code change) because this host reports `prefers-reduced-motion: reduce` — see the limitation below.
    Note this covers the CSS-driven animations only. The JS-gated Framer Motion paths (boot intro, scroll reveals, card tilt) read `matchMedia` in React, so deleting the stylesheet rule does **not** re-enable them; those are covered by the limitation below instead of by this test.
14. **No Batman wording left** — the rendered page text was scanned for `signal the bat`, `batcomputer`, `gotham`, `arsenal`, `case file`, `utility belt`, `commissioner`, `dossier`, `service record`, `transmission console`, `bat-signal`, `field notes`: **zero matches**. Nav reads About / Skills / Projects / Experience with a "Contact Me" CTA; section IDs are `home`, `about`, `skills`, `projects`, `experience`, `contact`.
15. **Contact form removed** — the rendered contact section contains no `<form>`, and its email link is the topmost element at its own centre (i.e. genuinely clickable).

**Could not fully verify**

- **Nothing outstanding for layout.** Screenshots were captured at **375 px, 768 px and 1440 px** (plus the boot sequence and the intro). The embedded preview compositor drops frames intermittently, so the run had to be retried. Breakpoints were verified **both** visually and by measuring the live DOM (element rects, computed grid columns, overflow) — the measurement pass is what caught that there is no horizontal overflow at any of the three widths. Screenshots are attached in the conversation rather than saved into the workspace.
- **Cross-browser testing.** Everything was verified in Chromium only (Chrome/Electron and headless Chrome for Lighthouse). Firefox and Safari were not tested; the CSS uses `color-mix()`, `mask-image` and `:focus-visible`, which are all supported in current Firefox/Safari, but this is unverified.
- **Reduced motion is the default view on this machine, and it is only half-verifiable here.** This Windows host reports `prefers-reduced-motion: reduce`, so **the boot intro, the scroll reveals, the card tilt, the ambient drift and the shimmer are all invisible by default**. The static fallback itself is verified end-to-end (the page is complete and readable, which is the point of the fallback). Of the animated paths:
    - the **CSS** ones (ambient drift, shimmer, shine sweep) were verified by stripping the stylesheet's reduced-motion rule at runtime and confirming each keyframe changes `transform`;
    - the **Framer Motion** ones (boot intro, scroll reveals, tilt) are gated in React via `matchMedia`, which a stylesheet change cannot affect, so **they could not be exercised on this host at all**. Their duration/easing values were verified by reading them off the built output, not by watching them run.
    **To actually see the animations, turn off Windows' "Animation effects" (Settings → Accessibility → Visual effects).** No product code was changed to work around this.
- **Third-party links were not followed.** The live-demo and repository URLs are shipped exactly as they appear in your source; the clicks above were intercepted before navigation so the external sites were not actually visited.

---

## Assumptions made

1. **Built into the provided workspace root**, not into your original folder — your existing portfolio at `D:\Visual studio code\Portfolio\my_personal_portfolio` was treated as **read-only source material** and is untouched. Copy the new project wherever you like.
2. **The CV PDF is a content source.** It contained the fuller grouped skill list and the per-project bullet points, so those were extracted from it (that is why Skills has 33 items rather than the hero index's 17, all of which are a subset).
3. **Two project categories were derived** for the filter (`Web Platform`, `AI / ML`). The source had no taxonomy; these follow the projects' own descriptions rather than adding new claims.
4. **Interface copy is presentation, not biography.** Section titles ("About", "Skills", "Projects", "Experience", "Contact Me"), boot lines and button labels live in `ui` in the data file. They are clearly separated from your content. This is where you change wording without touching biography.
5. **The "Focus: Backend · Cloud · Applied AI" line is derived, not authored.** It restates the three areas your own bio and CV timeline already name, and replaced a themed "Clearance LEVEL 4" that carried no real information.
6. **Sound is opt-in and synthesised** — no audio assets, off by default.

## Known issues / trade-offs

- Framer Motion (~49 KB gzipped) is the largest dependency and Lighthouse flags unused JS. It is required by the brief; a hand-rolled alternative would shrink the bundle at the cost of the animation quality.
- The DOM is 1,024 elements, which Lighthouse still flags (>800). Most of it is the 33 skill chips and the skyline paths — all intentional content.
- Lighthouse reports a **forced reflow** insight (≈66 ms, credited to Framer Motion's layout measurement at load). It comes from the `layout`/`layoutId` animated transitions the brief requires and is a one-off cost at startup, not a per-interaction one — Performance is still 100/91 with it present.
- The custom cursor hides the native one on hover-capable devices. This is the requested effect, but it is a divisive interaction; remove `<CustomCursor />` from `App.tsx` to restore the native pointer.
- `prefers-reduced-motion` is honoured for all *decorative* motion; the spotlight cursor still tracks under reduced motion because it is a pointing affordance, not decoration. Drop it via the same line in `App.tsx` if you disagree.
