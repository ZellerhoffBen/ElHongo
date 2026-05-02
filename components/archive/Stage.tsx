"use client";

import { findProject, type ArchiveProject } from "@/lib/archiveProjects";
import { SineLayout } from "./layouts/SineLayout";
import { ChineseLayout } from "./layouts/ChineseLayout";
import { TrommelLayout } from "./layouts/TrommelLayout";
import { FatGuyLayout } from "./layouts/FatGuyLayout";
import { PortraitLayout } from "./layouts/PortraitLayout";
import { BombLayout } from "./layouts/BombLayout";
import { WimmelLayout } from "./layouts/WimmelLayout";

type StageProps = {
  projectId: string;
  onImageClick: (project: ArchiveProject, index: number) => void;
};

function PlaceholderLayout({
  project,
  onImageClick,
}: {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
}) {
  return (
    <div className="bg-white p-8">
      <p className="mb-4 font-mono text-xs tracking-[0.18em] text-black/60">
        {project.caption}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {project.images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className="aspect-square w-full cursor-pointer object-cover"
            onClick={() => onImageClick(i)}
          />
        ))}
      </div>
    </div>
  );
}

export function Stage({ projectId, onImageClick }: StageProps) {
  const project = findProject(projectId);
  if (!project) return null;
  const handle = (i: number) => onImageClick(project, i);

  switch (project.layout) {
    case "sine":
      return <SineLayout project={project} onImageClick={handle} />;
    case "chinese":
      return <ChineseLayout project={project} onImageClick={handle} />;
    case "trommel":
      return <TrommelLayout project={project} onImageClick={handle} />;
    case "fatguy":
      return <FatGuyLayout project={project} onImageClick={handle} />;
    case "portrait":
      return <PortraitLayout project={project} onImageClick={handle} />;
    case "bomb":
      return <BombLayout project={project} onImageClick={handle} />;
    case "wimmel":
      return <WimmelLayout project={project} onImageClick={handle} />;
    default:
      return <PlaceholderLayout project={project} onImageClick={handle} />;
  }
}
