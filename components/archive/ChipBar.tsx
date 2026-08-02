"use client";

import { useEffect, useRef } from "react";
import { archiveProjects } from "@/lib/archiveProjects";

type ChipBarProps = {
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function ChipBar({ activeId, onSelect }: ChipBarProps) {
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeButtonRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  return (
    <nav
      aria-label="Archive projects"
      className="archive-chipbar sticky top-[var(--site-header-offset)] z-20 flex gap-1.5 overflow-x-auto border-b border-black bg-white px-4 py-3 sm:flex-wrap sm:px-6"
    >
      {archiveProjects.map((p) => {
        const isActive = p.id === activeId;
        return (
          <button
            type="button"
            key={p.id}
            ref={isActive ? activeButtonRef : undefined}
            onClick={() => onSelect(p.id)}
            className={[
              "shrink-0 border border-black px-2.5 py-1 text-[11px] uppercase tracking-[0.05em] transition-colors",
              isActive ? "bg-black text-white" : "bg-white text-black hover:bg-black/5",
              p.chipClassName,
            ].join(" ")}
            aria-pressed={isActive}
          >
            {p.label}
          </button>
        );
      })}
    </nav>
  );
}
