/**
 * Geometry for the layered hero artwork.
 *
 * Single source of truth for `components/hero/EyeFollowerArt.tsx` and
 * `scripts/build-hero-assets.mjs`, which crops the mask from these numbers.
 * Every constant is expressed in the artwork's native pixel space.
 */

/** Native size of the masters in `assets/hero/`. */
export const ARTWORK_SIZE = { width: 2038, height: 2000 } as const;

/** Resting centre of the pupil, as a share of the artwork box. */
export const EYE_CENTER = { xPercent: 54.75, yPercent: 22.85 } as const;

/** Native size of `pupil.png`. */
export const EYE_SIZE = { width: 43, height: 30 } as const;

/** How far the pupil may travel from its resting centre, in artwork pixels. */
export const MAX_EYE_OFFSET = {
  left: 10.64,
  right: 35.7,
  up: 4.725,
  down: 16.85,
} as const;

export const EYE_DAMPING = {
  topLeft: 0.8,
  leftAndTopSector: 0.8,
  rightDiagonalPull: 2.2,
  bottomLeftHorizontalPull: 1.35,
} as const;

/**
 * The window the socket mask has to cover.
 *
 * The two masters are pixel-identical outside a 67x38 transparent hole, so only
 * one of them is served at full size. The other survives as this crop: it sits
 * on top of the pupil and clips it back to the drawn eye socket. The box must
 * contain the pupil's entire travel — `heroArtwork.test.ts` asserts that it
 * does, so re-tuning `MAX_EYE_OFFSET` cannot silently let the pupil escape.
 */
export const SOCKET_WINDOW = {
  left: 1056,
  top: 416,
  width: 160,
  height: 96,
} as const;

/** Extreme corners the pupil's own box can reach, in artwork pixels. */
export function getPupilTravelBounds() {
  const centerX = (EYE_CENTER.xPercent / 100) * ARTWORK_SIZE.width;
  const centerY = (EYE_CENTER.yPercent / 100) * ARTWORK_SIZE.height;

  return {
    left: centerX - EYE_SIZE.width / 2 - MAX_EYE_OFFSET.left,
    right: centerX + EYE_SIZE.width / 2 + MAX_EYE_OFFSET.right,
    top: centerY - EYE_SIZE.height / 2 - MAX_EYE_OFFSET.up,
    bottom: centerY + EYE_SIZE.height / 2 + MAX_EYE_OFFSET.down,
  };
}

/** The same box as CSS percentages of the artwork frame. */
export const socketWindowStyle = {
  left: `${(SOCKET_WINDOW.left / ARTWORK_SIZE.width) * 100}%`,
  top: `${(SOCKET_WINDOW.top / ARTWORK_SIZE.height) * 100}%`,
  width: `${(SOCKET_WINDOW.width / ARTWORK_SIZE.width) * 100}%`,
  height: `${(SOCKET_WINDOW.height / ARTWORK_SIZE.height) * 100}%`,
} as const;

/**
 * Rungs of the responsive ladder, in CSS pixels of rendered width.
 *
 * The artwork renders at 130% of its column — roughly 53vw on desktop and
 * 130vw on phones. 960 covers a 412px viewport at DPR 1.75; 2038 is the master
 * width and there is no detail above it.
 */
export const ARTWORK_WIDTHS = [480, 640, 960, 1280, 1600, 2038] as const;

/** Rung used by the `<img src>` when no `<source>` matched. */
export const FALLBACK_WIDTH = 1280;

/**
 * Width the browser should assume when picking a rung. Mirrors the layout in
 * `app/page.tsx`: 118%-wide below `lg`, one overscaled column above it.
 */
export const ARTWORK_SIZES = "(min-width: 1024px) 54vw, 118vw";
