import { permanentRedirect } from "next/navigation";
import { resolveLegacyProjectId } from "@/lib/archiveProjects";

type LegacyProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * `/work/<id>` predates project routes. Resolve the old identifier onto today's
 * slug so shared links keep landing on the project they named; anything
 * unrecognised falls back to the register rather than a 404.
 */
export default async function LegacyProjectPage({ params }: LegacyProjectPageProps) {
  const { slug } = await params;
  const project = resolveLegacyProjectId(slug);

  permanentRedirect(project ? `/archive/${project.slug}` : "/archive");
}
