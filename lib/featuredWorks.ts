import { archiveProjects } from "./archiveProjects";
import type { WorkImage, WorkProject } from "./workProjects";

/**
 * The homepage rail — "Ausgewählte Blätter".
 *
 * Each entry names a project and a plate inside it rather than a loose file
 * path, so the caption and the destination are read from the same record the
 * archive uses. Three different projects, so the rail is a way *into* the work
 * and not three doors onto one room.
 */
type FeaturedRef = {
  projectSlug: string;
  imageIndex: number;
};

const featuredRefs: FeaturedRef[] = [
  { projectSlug: "figuren", imageIndex: 13 },
  { projectSlug: "sine-2000", imageIndex: 0 },
  { projectSlug: "fat-guy", imageIndex: 0 },
];

export type FeaturedWork = {
  project: WorkProject;
  image: WorkImage;
  href: string;
};

export const featuredWorks: FeaturedWork[] = featuredRefs.map(
  ({ projectSlug, imageIndex }) => {
    const project = archiveProjects.find((entry) => entry.slug === projectSlug);
    if (!project) {
      throw new Error(`Featured work references unknown project "${projectSlug}"`);
    }

    const image = project.images[imageIndex];
    if (!image) {
      throw new Error(
        `Featured work "${projectSlug}" has no plate at index ${imageIndex}`,
      );
    }

    return { project, image, href: `/archive/${project.slug}` };
  },
);
