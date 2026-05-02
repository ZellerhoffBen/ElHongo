"use client";

import { useState, useEffect, useRef } from "react";
import { ChipBar } from "@/components/archive/ChipBar";
import { Stage } from "@/components/archive/Stage";
import { Landing } from "@/components/archive/Landing";
import { Lightbox } from "@/components/archive/Lightbox";
import { CutOverlay } from "@/components/archive/CutOverlay";
import { useProjectHash } from "@/lib/useProjectHash";
import { findProject, type ArchiveProject } from "@/lib/archiveProjects";

const CUT_HOLD_MS = 80;
const CUT_FADE_MS = 60;

export default function ArchiveClient() {
  const { activeId, setActiveId } = useProjectHash();
  const [displayedId, setDisplayedId] = useState<string | null>(activeId);
  const [cutting, setCutting] = useState(false);

  // Lightbox state — null when closed
  const [lightboxState, setLightboxState] = useState<{
    project: ArchiveProject;
    index: number;
  } | null>(null);

  const cutTimers = useRef<number[]>([]);

  // Drive the cut transition whenever activeId changes from displayedId
  useEffect(() => {
    if (activeId === displayedId) return;
    setCutting(true);
    const t1 = window.setTimeout(() => {
      setDisplayedId(activeId);
    }, CUT_FADE_MS);
    const t2 = window.setTimeout(() => {
      setCutting(false);
    }, CUT_FADE_MS + CUT_HOLD_MS);
    cutTimers.current.push(t1, t2);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [activeId, displayedId]);

  // Sync displayedId for the very first hash read
  useEffect(() => {
    if (displayedId === null && activeId !== null) {
      setDisplayedId(activeId);
    }
  }, [activeId, displayedId]);

  return (
    <main className="min-h-screen bg-white pt-12 sm:pt-16">
      <ChipBar activeId={activeId} onSelect={setActiveId} />
      <div className="relative">
        {displayedId && findProject(displayedId) ? (
          <Stage
            projectId={displayedId}
            onImageClick={(project, index) => setLightboxState({ project, index })}
          />
        ) : (
          <Landing />
        )}
        <CutOverlay visible={cutting} />
      </div>
      {lightboxState && (
        <Lightbox
          images={lightboxState.project.images}
          index={lightboxState.index}
          onClose={() => setLightboxState(null)}
          onIndexChange={(i) =>
            setLightboxState((s) => (s ? { ...s, index: i } : s))
          }
        />
      )}
    </main>
  );
}
