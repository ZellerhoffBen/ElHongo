"use client";

import { useEffect, useState, useCallback } from "react";
import { archiveProjects } from "./archiveProjects";

const validIds = new Set(archiveProjects.map((p) => p.id));

export function parseProjectHash(hash: string): string | null {
  if (!hash || hash === "#") return null;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  return validIds.has(id) ? id : null;
}

export function useProjectHash(): {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
} {
  const [activeId, setActiveIdState] = useState<string | null>(null);

  // Initial read + subscribe to hashchange
  useEffect(() => {
    const sync = () => setActiveIdState(parseProjectHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const setActiveId = useCallback((id: string | null) => {
    const nextHash = id ? `#${id}` : "";
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    if (nextUrl !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.pushState(null, "", nextUrl);
    }
    setActiveIdState(id);
  }, []);

  return { activeId, setActiveId };
}
