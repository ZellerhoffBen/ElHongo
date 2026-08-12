/**
 * Prints the archive as JSON so `build-brand-assets.py` can render social
 * images from the same records the site renders pages from.
 *
 * Run via `node --import ./scripts/register-ts-resolve.mjs scripts/export-project-manifest.mjs`.
 */
import { archiveProjects, getProjectCover } from "../lib/archiveProjects.ts";
import { siteInfo } from "../lib/siteInfo.ts";

const manifest = {
  site: {
    alias: siteInfo.alias,
    artistName: siteInfo.artistName,
    occupation: siteInfo.occupation,
  },
  projects: archiveProjects.map((project) => ({
    slug: project.slug,
    number: project.number,
    title: project.title,
    kind: project.kind,
    medium: project.medium,
    year: project.year ?? null,
    imageCount: project.images.length,
    cover: getProjectCover(project).src,
  })),
};

process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
