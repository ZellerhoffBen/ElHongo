# AGENTS.md

# Project: Illustrator Portfolio

## Creative direction
- The artwork is always the main visual element.
- Avoid generic SaaS layouts, gradients and dashboard styling.
- Use asymmetric editorial compositions.
- Treat pages like comic panels or printed spreads.
- Typography should support the illustrations, not compete with them.
- Prefer unusual but readable layouts over standard card grids.

# AGENTS.md

## Goal

Create frontend work that feels specific, authored, and visually distinctive.

Do not default to generic portfolio layouts, standard landing-page patterns, uniform card grids, or component-library aesthetics.

The result should feel connected to the artist, the artwork, and the intended atmosphere.

## Working method

Before writing code:

1. Inspect the available artwork, references, copy, and assets.
2. Identify recurring visual qualities, such as composition, rhythm, colour, texture, line, humour, contrast, or imperfection.
3. Propose at least three clearly different visual directions.
4. Explain what makes each direction specific to this project.
5. Reject directions that could fit any generic portfolio.
6. Choose the strongest direction before implementation.

## Design decisions

Every major design decision should have a reason.

Prefer decisions derived from:

* the artist’s work,
* the artist’s personality,
* the content,
* the intended emotional effect,
* the interaction concept.

Do not add visual effects only because they are fashionable or technically impressive.

Do not solve a generic layout by placing decorative artwork on top of it.

The composition, typography, interaction, and pacing should all contribute to the concept.

## Exploration

Explore unusual solutions before choosing conventional ones.

Consider:

* asymmetric composition,
* unexpected scale,
* layered content,
* editorial pacing,
* custom transitions,
* expressive typography,
* controlled irregularity,
* spatial or narrative interaction.

Unusual does not mean confusing.

The interface must remain readable, navigable, and usable.

## Anti-template check

Before accepting a result, ask:

> Could this design belong to a photographer, agency, startup, or developer portfolio by replacing only the images and text?

If yes, revise it.

Increase specificity through the underlying composition, behaviour, typography, rhythm, or interaction model.

## Implementation process

Build in small visual stages.

1. Establish composition and hierarchy.
2. Test responsive behaviour.
3. Add only the interactions that strengthen the concept.
4. Review the implementation in a real browser.
5. Capture desktop and mobile screenshots.
6. Compare the result against the original direction.
7. Remove anything that feels generic, decorative, repetitive, or unnecessary.

Do not polish weak ideas. Rework the concept first.

## Motion

Use motion selectively.

Motion should:

* clarify relationships,
* reinforce the visual concept,
* support narrative or spatial continuity,
* make interaction feel intentional.

Avoid repetitive entrance animations, excessive parallax, scroll hijacking, and constant movement.

Always support reduced motion.

## Quality standard

A result is successful when it is:

* specific to the artist,
* visually memorable,
* coherent,
* usable,
* responsive,
* technically maintainable,
* restrained enough for the artwork to remain important.

Prefer one strong idea executed consistently over many unrelated effects.

## Review behaviour

After implementation, review the work critically.

Look for:

* generic AI-generated patterns,
* repeated cards or sections,
* weak hierarchy,
* arbitrary effects,
* interactions without purpose,
* desktop ideas that fail on mobile,
* design choices not grounded in the content.

List the problems before making corrections.

Do not describe mediocre output as polished, creative, or finished.


## Commands

```bash
npm run dev            # start Next.js dev server (localhost:3000)
npm run build          # production build
npm test               # Vitest suite (vitest run lib)
npm run test:e2e       # Playwright release matrix (builds, then serves on :3100)

npm run build:hero     # regenerate the hero ladder from assets/hero/
npm run build:fonts    # subset assets/fonts/*.otf into public/fonts/*.woff2
npm run build:brand    # regenerate favicons, touch icons and per-route OG images
npm run check:artwork  # contact sheets for reviewing plates before release
```

There is no lint script configured. TypeScript checking is implicit via `tsc` / the build.

The four asset commands write files that are committed. They are not part of
`npm run build` — run the relevant one when its **source** changes (a master in
`assets/`, a project record, the site name) and commit the output.

`npm run build:fonts` needs `pip install fonttools brotli`; the brand and
artwork scripts need Pillow.

## Stack

Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS · Vitest (no jsdom — all tests are pure logic, no DOM).

## Architecture

### Where things live

```
app/          routes only — every route is a thin shell over a component
components/
  hero/       the interactive artwork
  layout/     site chrome: header, footer, profile dialog
  portfolio/  everything that shows work: archive, gallery, lightbox, rails
  useReturnFocus.ts   the one hook both dialogs share
lib/          pure logic and content records. No DOM, no React — that is what
              lets the whole of lib/ be unit-tested without jsdom
scripts/      asset generation (see Commands). Not part of `npm run build`
assets/       masters that are never served: font OTFs, hero PNGs, source/
public/       served as-is. Generated output (hero/, og/, icons/, fonts/) is
              committed; art/ holds the plates
docs/         the audit this work answers to
tests/e2e/    Playwright. Unit tests sit beside their module in lib/
```

`assets/` and `public/` are the load-bearing distinction: if a file is in
`public/` a visitor can download it, so masters stay out of it.

### Eye-follower feature

The homepage (`app/page.tsx`) renders a single interactive artwork: a comic drawing of a man in barbed wire whose eye follows the cursor.

The effect is achieved by **layering three images** inside `components/hero/EyeFollowerArt.tsx`:

1. **artwork** — the full illustration, responsive AVIF/WebP with a PNG fallback.
2. **pupil** (`/hero/pupil.*.png`, 43×30) — the iris, positioned absolutely and shifted by `eyeOffset` each frame.
3. **socket mask** (`/hero/socket-mask.*.webp`, 160×96) — sits on top of the pupil and clips it back to the drawn eye socket.

The two masters in `assets/hero/` are **pixel-identical outside a 67×38
transparent hole** over the eye, so the second one is not served at full size:
it survives only as the socket crop. That is the whole reason the hero went from
4.12 MB to ~90 KB — one full-size layer instead of two, in AVIF instead of PNG.

**Geometry lives in `lib/heroArtwork.ts`**, not in the component: artwork size,
`EYE_CENTER`, `EYE_SIZE`, `MAX_EYE_OFFSET`, damping, the responsive ladder and
`SOCKET_WINDOW` (the crop box). `scripts/build-hero-assets.mjs` imports the same
module and cuts the mask from it, so the crop cannot drift from the constants.
`lib/heroArtwork.test.ts` asserts the window still contains the pupil's full
travel — **widen `SOCKET_WINDOW` and re-run `npm run build:hero` if you re-tune
`MAX_EYE_OFFSET`**, or the pupil escapes the mask.

`lib/heroAssets.generated.ts` is written by that script and holds the URLs.
Filenames are content-addressed (`artwork-960.<hash>.avif`), which is what makes
the `immutable` cache header in `next.config.mjs` safe.

### Motion pipeline

`components/hero/EyeFollowerArt.tsx` wires two `lib/` modules together inside a `requestAnimationFrame` loop:

- **`lib/eyeMotion.ts`** — manages a rolling pointer history buffer.
  - `getDelayedPointer` interpolates the cursor's position at `now − EYE_POINTER_DELAY_MS` (50 ms), giving a natural reaction lag.
  - `prunePointerHistory` keeps the buffer small by discarding entries older than `delay + 60 ms`.

- **`lib/maskEye.ts`** — pure math that maps a pointer position to a pixel offset for the pupil.
  - `getClampedEyeOffset` constrains the offset inside an asymmetric ellipse (different bounds for left/right/up/down) with optional per-sector damping (`topLeftDamping`, `leftAndTopSectorDamping`) and horizontal pull adjustments (`rightDiagonalPull`, `bottomLeftHorizontalPull`) that reshape the gaze direction before clamping.
  - `smoothPoint` applies exponential smoothing (factor `EYE_POINTER_SMOOTHING = 0.07`) each frame.

### Navigation

`lib/navigation.ts` is the single source of truth for nav items and for which
item counts as active (`/work/*` redirects into the archive, so those paths keep
**Archiv** current). `components/layout/SiteHeader.tsx` renders them in a fixed header
on a solid `paper` ground with a hairline bottom border. Nav hit areas fill the
full header height — the label is 11px, the target is not.

**The wordmark is a link to `/`.** It used to open the profile dialog, which put
an About action on the one element every visitor expects to be Home. `Profil` is
now a named button beside the links; it is not in `navItems` because it opens a
dialog rather than navigating. `isNavItemActive` matches the homepage exactly —
"not the archive" once meant "the Atelier", which told visitors on a 404 they
were somewhere they were not.

### Routing

| Route | What it is |
|---|---|
| `/` | Atelier: identity, selected work, current activity, contact |
| `/archive` | The register. Six entries and a hover preview — **no gallery** |
| `/archive/[slug]` | One project: header, plates, next/previous. Static, own metadata |
| `/work/*`, `/about`, `/service` | Redirects. `resolveLegacyProjectId` maps old ids onto today's slugs |

`components/portfolio/ArchiveView.tsx` renders both archive routes from one
component; `project: null` means the register landing. Rendering the first
project's gallery on `/archive` made it a near-duplicate of `/archive/sine-2000`
and cost every visitor a gallery they had not asked for — hence the `null`.

`/archive#fatguy` links predate project routes and are resolved client-side onto
`/archive/fat-guy`, because fragments never reach the server.

### Metadata and launch assets

`lib/metadata.ts` is the one place that knows how a page announces itself:
`buildMetadata` derives canonical URL, Open Graph and Twitter card from a single
title/description/image, so a route cannot end up canonical-correct but socially
wrong. `personJsonLd` / `projectJsonLd` supply structured data.

Social images are **generated per route** by `npm run build:brand` from the same
archive records the pages render, so `/og/<slug>.png` always matches the project
it belongs to. Icons come from the same script. `app/robots.ts`, `app/sitemap.ts`
and `app/manifest.ts` are code, not static files.

`lib/siteInfo.ts` holds the canonical origin, overridable with
`NEXT_PUBLIC_SITE_URL` so preview deployments do not advertise production as
their canonical.

### Enlarged viewing

`components/portfolio/ArtworkLightbox.tsx` opens any plate full-screen with
next/previous, swipe, a counter and Escape. Both it and the profile dialog are
native `<dialog>` + `showModal`, for the focus trap and inert background.

Two things the platform does not give you, both handled in
`components/useReturnFocus.ts`: **WebKit does not restore focus when a dialog
closes**, and **Safari does not focus a button when it is clicked**. Triggers
call `focusOpener` and the dialogs call `remember`/`restore`. Escape is handled
explicitly rather than left to the engine, so every browser takes one path.

The lightbox stays mounted when closed — unmounting an open `<dialog>` skips
`close()`, and `close()` is what hands focus back.

### Design tokens

`tailwind.config.ts` contains no raw values. Every colour, spacing step and type
size is an alias over a custom property defined in `app/globals.css`:

- **Tone contexts.** `.tone-paper` / `.tone-ink` redefine `--fg`, `--fg-muted`,
  `--fg-faint`, `--surface`, `--rule`, `--rule-soft` and `--wash` for a whole
  subtree. Components never name a colour and never branch on tone — they use
  `text-fg-muted`, `border-rule-soft`, `bg-surface` and let the nearest tone
  ancestor decide. Adding a tone means adding one class, not a ternary.
- **Contrast rule.** `--fg-muted` and `--fg-faint` are the only recessive text
  values and both clear 4.5:1 on their own ground. Nothing on the site sets text
  colour by opacity modifier — Tailwind silently drops values outside its
  opacity scale (`/42`, `/48`, `/52`, `/58` emit no CSS at all).
- **Accent.** `--accent` is sampled from the artwork and has exactly one job:
  marking the selected archive entry. It is 12:1 on ink and 1.5:1 on paper, so
  it is never text on a paper ground.
- **Type ramp.** `display-hero`, `display-xl`, `display-lg`, `display-md`,
  `display-sm`, `lead`, `lead-sm`, `body`, `body-lg`. Display sizes clamp
  against `svh` as well as `vw` so a full-height panel cannot outgrow its own
  box on a short laptop. Small labels are not in this ramp — they are `.kicker`.
- **Utility type.** `--type-utility` (11px) and `--track-utility` (0.14em) are
  the one source for every small label: `.kicker`, `.skip-link` and `.btn` all
  read them. It was 10px at 0.18em, which read as
  texture rather than text on dense screens. The letterforms grew; the gaps
  between them did not. `--track-utility-open` is the nav's hover expansion,
  scaled with the base instead of pinned.
- **Spacing.** `section-xs | section-sm | section | section-lg | section-xl`
  for vertical rhythm; the `.page-x` class owns the horizontal gutter
  everywhere. `section-xs` is the bonding step — the gap between an element and
  the thing it belongs to, not between one section and the next. It is what
  keeps a stacked caption attached to its plate instead of reading as its own
  section.

### Components

Two button roles only: `.btn-primary` (bordered, inverts on hover) and
`.btn-quiet` (underline slide). Both are `.btn`, which guarantees a 44px target.
`.kicker` is the one small-caps label style. Nav hover animations (underline
slide + letter-spacing) live in `app/globals.css` as `.nav-link` / `.nav-mark`.

The site font is **Styrene A**, served as subset WOFF2 from `/fonts/` (51 KB for
both weights, down from 277 KB of OTF). Masters live in `assets/fonts/`; the
Bold weight is preloaded because it sets every display line. **Confirm the
Styrene licence covers webfont use before launch.**

A card that sits on a ground the surrounding tone context does not describe —
a white plate inside a `.tone-ink` section, say — must carry its own
`.tone-paper`. Setting `text-ink` instead leaves `--fg-faint` and `--rule-soft`
resolving to the ink tone's white, and the caption disappears into the card.

### Delivery

`next.config.mjs` sets two cache tiers over `public/`, replacing Next's default
`max-age=0, must-revalidate`. Content-addressed output (`/hero/*`) and the fonts
get a year of `immutable` — their identity is in the filename, so a rebuild
changes the URL. Everything else gets 30 days with revalidation, because those
filenames are stable and a plate can be replaced in place.

### Testing

`npm run test:e2e` runs against a **production build**, not the dev server: dev
recompiles per route and re-optimises every image on demand, which turns a
20-plate gallery into a timeout that says nothing about the build.

Five projects — Chromium desktop and mobile, Firefox, Safari, iOS Safari. The
site leans on native `<dialog>`, `:has()`, container queries, `dvh`/`svh`,
scroll snapping and scripted focus, and every one of the WebKit bugs documented
above was found by adding those engines. Browsers: `npx playwright install`.

`tests/e2e/audit-regressions.spec.ts` carries one test per finding of
`docs/audit-2026-08-08.md`, named by its identifier.
`tests/e2e/content-stress.spec.ts` swaps worst-case German into the live DOM and
asserts the layout still holds — the copy on the site is still placeholder, so
this is what will say whether the real copy fits.
