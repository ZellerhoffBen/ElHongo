import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveView } from "@/components/portfolio/ArchiveView";
import { archiveProjects, findArchiveProject } from "@/lib/archiveProjects";
import { buildProjectMetadata, projectJsonLd } from "@/lib/metadata";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/** Every project is known at build time, so every project route is static. */
export function generateStaticParams() {
  return archiveProjects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findArchiveProject(slug);
  if (!project) return {};

  return buildProjectMetadata(project);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findArchiveProject(slug);
  if (!project) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from typed project data, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
      <ArchiveView project={project} />
    </>
  );
}
