/**
 * Cache policy for `public/`.
 *
 * Next serves everything under `public/` with `max-age=0, must-revalidate`,
 * which costs a round trip per asset on every repeat visit. Two tiers replace
 * that:
 *
 * - Content-addressed output (`/hero/*`, built by `npm run build:hero`) and the
 *   fonts carry their identity in the filename, so a year of `immutable` can
 *   never pin a stale file — changing the source changes the URL.
 * - Everything else keeps a long but revalidating window: fast on repeat
 *   visits, still correct if a plate is replaced in place.
 */
const IMMUTABLE = "public, max-age=31536000, immutable";
const LONG_LIVED = "public, max-age=2592000, stale-while-revalidate=86400";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The source artwork is heavyweight PNG line art; serve modern formats.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/hero/:file*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        source: "/fonts/:file*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        source: "/:dir(art|og|icons)/:file*",
        headers: [{ key: "Cache-Control", value: LONG_LIVED }],
      },
    ];
  },
};

export default nextConfig;
