"use client";

import { archiveProjects } from "@/lib/archiveProjects";

type ChipBarProps = {
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function ChipBar({ activeId, onSelect }: ChipBarProps) {
  return (
    <nav
      aria-label="Archive projects"
      className="sticky top-12 z-10 flex flex-wrap gap-1.5 border-b border-black bg-white px-4 py-3 sm:top-16 sm:px-6"
    >
      {archiveProjects.map((p) => {
        const isActive = p.id === activeId;
        return (
          <button
            type="button"
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={[
              "border border-black px-2.5 py-1 text-[11px] uppercase tracking-[0.05em] transition-colors",
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
