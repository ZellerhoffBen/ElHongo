"use client";

import { findProject, type ArchiveProject } from "@/lib/archiveProjects";
import { SineLayout } from "./layouts/SineLayout";
import { ChineseLayout } from "./layouts/ChineseLayout";
import { TrommelLayout } from "./layouts/TrommelLayout";
import { FatGuyLayout } from "./layouts/FatGuyLayout";
import { PortraitLayout } from "./layouts/PortraitLayout";
import { BombLayout } from "./layouts/BombLayout";
import { WimmelLayout } from "./layouts/WimmelLayout";
import { LogosLayout } from "./layouts/LogosLayout";
import { MiscLayout } from "./layouts/MiscLayout";

type StageProps = {
  projectId: string;
  onImageClick: (project: ArchiveProject, index: number) => void;
};


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
    case "logos":
      return <LogosLayout project={project} onImageClick={handle} />;
    case "misc":
      return <MiscLayout project={project} onImageClick={handle} />;
    default:
      return null;
  }
}
