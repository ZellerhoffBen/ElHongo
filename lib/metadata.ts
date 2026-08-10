import type { Metadata } from "next";
import { absoluteUrl, siteInfo } from "./siteInfo";
import type { WorkProject } from "./workProjects";

const OG_SIZE = { width: 1200, height: 630 };

/** Every route's social image lives at a path derived from its own slug. */
export const ogImagePath = (slug?: string) =>
  slug ? `/og/${slug}.png` : "/og/default.png";

/**
 * One place that knows how a page announces itself: canonical URL, Open Graph
 * and Twitter card all derived from the same title/description/image, so a
 * route can never end up canonical-correct but socially wrong.
 */
export function buildMetadata({
  title,
  description,
  path,
  imageSlug,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  imageSlug?: string;
  imageAlt: string;
}): Metadata {
  const url = absoluteUrl(path);
  const images = [{ url: ogImagePath(imageSlug), ...OG_SIZE, alt: imageAlt }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteInfo.alias,
      locale: siteInfo.locale,
      title,
      description,
      url,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export const projectDescription = (project: WorkProject) =>
  `${project.title} — ${project.kind}, ${project.medium}. ${project.images.length} Blätter im Archiv von ${siteInfo.alias}.`;

export function buildProjectMetadata(project: WorkProject): Metadata {
  return buildMetadata({
    title: `${project.title} — Archiv — ${siteInfo.alias}`,
    description: projectDescription(project),
    path: `/archive/${project.slug}`,
    imageSlug: project.slug,
    imageAlt: `${project.title} von ${siteInfo.artistName}`,
  });
}

/**
 * Structured data. `Person` on the homepage establishes who the site is about;
 * each project is a `VisualArtwork` collection so a plate can be attributed
 * rather than floating as an unowned image.
 */
export const personJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteInfo.artistName,
  alternateName: siteInfo.alias,
  url: absoluteUrl("/"),
  jobTitle: siteInfo.occupation,
  description: siteInfo.description,
  image: absoluteUrl("/jonas_portrait.png"),
  sameAs: [siteInfo.instagramUrl],
});

export const projectJsonLd = (project: WorkProject) => ({
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  name: project.title,
  url: absoluteUrl(`/archive/${project.slug}`),
  artform: project.kind,
  artMedium: project.medium,
  ...(project.year ? { dateCreated: project.year } : {}),
  creator: {
    "@type": "Person",
    name: siteInfo.artistName,
    alternateName: siteInfo.alias,
    url: absoluteUrl("/"),
  },
  image: project.images.map((image) => absoluteUrl(image.src)),
});
