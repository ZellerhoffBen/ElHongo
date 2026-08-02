# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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
