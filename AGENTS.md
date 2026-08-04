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
npm run dev      # start Next.js dev server (localhost:3000)
npm run build    # production build
npm test         # run Vitest test suite (vitest run)
```

There is no lint script configured. TypeScript checking is implicit via `tsc` / the build.

## Stack

Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS · Vitest (no jsdom — all tests are pure logic, no DOM).

## Architecture

### Eye-follower feature

The homepage (`app/page.tsx`) renders a single interactive artwork: a comic drawing of a man in barbed wire whose eye follows the cursor.

The effect is achieved by **layering three images** inside `components/EyeFollowerArt.tsx`:

1. **background** (`/mask_test/background_white_eye.png`) — the full illustration with the eye socket drawn as solid white.
2. **pupil** (`/mask_test/only_eye.png`) — just the iris/pupil, positioned absolutely and shifted by `eyeOffset` each frame.
3. **foreground mask** (`/mask_test/vordergrund_mask.png`) — sits on top, masking the pupil so it only shows through the drawn eye socket.

The pupil image is anchored to `EYE_CENTER` (percentage of image dimensions) and offset by pixels derived from the pointer position. All constants in `EyeFollowerArt.tsx` (`EYE_CENTER`, `EYE_SIZE`, `MAX_EYE_OFFSET`, damping values) are calibrated to the artwork's native size of **2038×2000 px** and must be re-tuned if the artwork changes.

### Motion pipeline

`components/EyeFollowerArt.tsx` wires two `lib/` modules together inside a `requestAnimationFrame` loop:

- **`lib/eyeMotion.ts`** — manages a rolling pointer history buffer.
  - `getDelayedPointer` interpolates the cursor's position at `now − EYE_POINTER_DELAY_MS` (50 ms), giving a natural reaction lag.
  - `prunePointerHistory` keeps the buffer small by discarding entries older than `delay + 60 ms`.

- **`lib/maskEye.ts`** — pure math that maps a pointer position to a pixel offset for the pupil.
  - `getClampedEyeOffset` constrains the offset inside an asymmetric ellipse (different bounds for left/right/up/down) with optional per-sector damping (`topLeftDamping`, `leftAndTopSectorDamping`) and horizontal pull adjustments (`rightDiagonalPull`, `bottomLeftHorizontalPull`) that reshape the gaze direction before clamping.
  - `smoothPoint` applies exponential smoothing (factor `EYE_POINTER_SMOOTHING = 0.07`) each frame.

### Navigation

`lib/navigation.ts` is the single source of truth for nav items. `components/SiteHeader.tsx` renders them as a fixed overlay header using `mix-blend-multiply` so it reads over any background.

### Styling

Custom nav hover animations (underline slide + letter-spacing) are defined as `.nav-link` / `.nav-mark` classes in `app/globals.css` rather than Tailwind utilities. The site font is **Styrene A** loaded via `@font-face` from `/fonts/`.
