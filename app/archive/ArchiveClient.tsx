"use client";

import { useState, useEffect, useRef } from "react";
import { ChipBar } from "@/components/archive/ChipBar";
import { Stage } from "@/components/archive/Stage";
import { Landing } from "@/components/archive/Landing";
import { Lightbox } from "@/components/archive/Lightbox";
import { CutOverlay } from "@/components/archive/CutOverlay";
import { useProjectHash } from "@/lib/useProjectHash";
import { findProject, type ArchiveProject } from "@/lib/archiveProjects";
import { getArchiveCutTransition } from "@/lib/archiveCutTransition";

export default function ArchiveClient() {
  const { activeId, setActiveId } = useProjectHash();
  const [displayedId, setDisplayedId] = useState<string | null>(activeId);
  const [cutting, setCutting] = useState(false);
  const displayedIdRef = useRef<string | null>(activeId);

  // Lightbox state — null when closed
  const [lightboxState, setLightboxState] = useState<{
    project: ArchiveProject;
    index: number;
  } | null>(null);

  useEffect(() => {
    displayedIdRef.current = displayedId;
  }, [displayedId]);

  // Drive the cut transition from the selection only; displayedId changes mid-cut.
  useEffect(() => {
    const transition = getArchiveCutTransition(activeId, displayedIdRef.current);
    if (!transition) {
      setCutting(false);
      return;
    }

    setCutting(true);
    const t1 = window.setTimeout(() => {
      setDisplayedId(transition.nextDisplayedId);
    }, transition.fadeMs);
    const t2 = window.setTimeout(() => {
      setCutting(false);
    }, transition.totalMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [activeId]);

  // Sync displayedId for the very first hash read
  useEffect(() => {
    if (displayedId === null && activeId !== null) {
      setDisplayedId(activeId);
    }
  }, [activeId, displayedId]);

  return (
    <main className="min-h-screen bg-white pt-[var(--site-header-offset)]">
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
