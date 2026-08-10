export const siteInfo = {
  artistName: "Jonas Aellig",
  alias: "EL HONGO",
  /**
   * Canonical origin. Overridable so preview deployments do not advertise the
   * production URL as their canonical.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://elhongo.ch").replace(/\/$/, ""),
  locale: "de_CH",
  description:
    "EL HONGO ist Jonas Aellig. Illustration, Zeichnung und ausgewählte Arbeiten aus Zürich.",
  occupation: "Illustrator",
  // TODO(content): placeholder until the production address is confirmed.
  email: "jonas.aellig@test.ch",
  instagramHandle: "@elhongo666",
  instagramUrl: "https://www.instagram.com/elhongo666/",
  location: null as string | null,
};

/** Absolute URL for canonical links, sitemap entries and social metadata. */
export const absoluteUrl = (path = "/") =>
  `${siteInfo.url}${path.startsWith("/") ? path : `/${path}`}`;
