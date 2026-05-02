"use client";

import { findProject, type ArchiveProject } from "@/lib/archiveProjects";

type StageProps = {
  projectId: string;
  onImageClick: (project: ArchiveProject, index: number) => void;
};

function PlaceholderLayout({ project }: { project: ArchiveProject }) {
  return (
    <div className="bg-white p-8">
      <p className="mb-4 font-mono text-xs tracking-[0.18em] text-black/60">
        {project.caption}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {project.images.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" className="aspect-square w-full object-cover" />
        ))}
      </div>
    </div>
  );
}

export function Stage({ projectId, onImageClick }: StageProps) {
  const project = findProject(projectId);
  if (!project) return null;
  void onImageClick;
  return <PlaceholderLayout project={project} />;
}
