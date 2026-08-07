"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { SiteFooter } from "@/components/SiteFooter";
import {
  archiveProjects,
  findArchiveProject,
} from "@/lib/archiveProjects";

const defaultProject = archiveProjects[0];

const getPreviewImage = (project: (typeof archiveProjects)[number]) =>
  project.images[project.previewImageIndex ?? 0] ?? project.images[0];

const getScrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

export function ArchiveClient() {
  const [selectedId, setSelectedId] = useState(defaultProject.id);
  const [previewId, setPreviewId] = useState(defaultProject.id);
  const registerRef = useRef<HTMLElement>(null);
  const projectRef = useRef<HTMLElement>(null);

  const selectedProject = useMemo(
    () => findArchiveProject(selectedId) ?? defaultProject,
    [selectedId],
  );
  const previewProject = useMemo(
    () => findArchiveProject(previewId) ?? selectedProject,
    [previewId, selectedProject],
  );
  const previewImage = getPreviewImage(previewProject);
  const hasLongProjectTitle = selectedProject.title.length >= 12;

  const scrollToRegister = useCallback(() => {
    registerRef.current?.scrollIntoView({
      behavior: getScrollBehavior(),
      block: "start",
    });
    registerRef.current?.focus({ preventScroll: true });
  }, []);

  const openProject = useCallback((id: string, scroll = true) => {
    const project = findArchiveProject(id);
    if (!project) return;

    setSelectedId(project.id);
    setPreviewId(project.id);
    window.history.replaceState(null, "", `/archive#${project.id}`);

    if (scroll) {
      window.requestAnimationFrame(() => {
        projectRef.current?.scrollIntoView({
          behavior: getScrollBehavior(),
          block: "start",
        });
        projectRef.current?.focus({ preventScroll: true });
      });
    }
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id || !findArchiveProject(id)) return;

      setSelectedId(id);
      setPreviewId(id);
      window.requestAnimationFrame(() => {
        projectRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
        projectRef.current?.focus({ preventScroll: true });
      });
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <main className="archive-snap-page bg-[var(--paper)] pt-[var(--site-header-offset)] text-black">
      <section
        ref={registerRef}
        tabIndex={-1}
        aria-labelledby="archive-title"
        className="archive-snap-point scroll-mt-[var(--site-header-offset)] border-b border-black focus:outline-none lg:grid lg:min-h-[calc(100svh-var(--site-header-offset))] lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]"
      >
        <div className="lg:border-r lg:border-black">
          <header className="flex min-h-36 items-end border-b border-black px-5 py-8 sm:min-h-40 sm:px-7 lg:px-10">
            <h1
              id="archive-title"
              className="text-[clamp(4rem,9vw,9rem)] font-bold uppercase leading-[0.72] tracking-[-0.07em]"
            >
              Archiv
            </h1>
          </header>

          <div aria-label="Archivregister">
            {archiveProjects.map((project) => {
              const active = project.id === selectedProject.id;
              const cover = getPreviewImage(project);
              const longTitle = project.title.length >= 12;

              return (
                <button
                  key={project.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => openProject(project.id)}
                  onMouseEnter={() => setPreviewId(project.id)}
                  onFocus={() => setPreviewId(project.id)}
                  className={[
                    "group grid min-h-28 w-full grid-cols-[2.25rem_minmax(0,1fr)_4.5rem] items-center gap-3 border-b border-black px-5 py-4 text-left transition-colors last:border-b-0 sm:min-h-32 sm:px-7 lg:grid-cols-[3rem_minmax(0,1fr)_8rem] lg:px-10",
                    active
                      ? "bg-black text-white"
                      : "bg-[var(--paper)] text-black hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white focus-visible:outline-offset-[-4px]",
                  ].join(" ")}
                >
                  <span className="work-number opacity-45">{project.number}</span>
                  <span className="min-w-0">
                    <strong
                      className={[
                        "block font-bold uppercase leading-[0.8] tracking-[-0.055em]",
                        longTitle
                          ? "text-[clamp(1rem,5.5vw,3.25rem)] lg:text-[clamp(2rem,3vw,3.25rem)]"
                          : "text-[clamp(1.75rem,7vw,3.5rem)] lg:text-[clamp(2rem,3.4vw,3.5rem)]",
                      ].join(" ")}
                    >
                      {project.title}
                    </strong>
                    <span className="mt-2 block text-[8px] font-bold uppercase tracking-[0.13em] opacity-45 lg:hidden">
                      {project.kind} · {project.images.length} Bilder
                    </span>
                  </span>
                  <span className="hidden text-right text-[9px] font-bold uppercase tracking-[0.13em] opacity-55 lg:block">
                    {project.kind} · {project.images.length} Bilder
                  </span>
                  <span className="relative h-16 w-[4.5rem] overflow-hidden border border-current bg-white lg:hidden">
                    <Image
                      src={cover.src}
                      alt=""
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => openProject(previewProject.id)}
          aria-label={`${previewProject.title} ansehen`}
          className="relative hidden min-h-[calc(100svh-var(--site-header-offset))] overflow-hidden bg-black text-left text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] lg:block"
        >
          <div className="absolute left-7 top-7 z-10 border border-white px-3 py-2 work-kicker">
            Vorschau / {previewProject.number}
          </div>
          <Image
            key={previewImage.src}
            src={previewImage.src}
            alt={previewImage.alt}
            fill
            priority
            sizes="42vw"
            className="object-contain p-10 pt-20"
          />
          <div className="absolute inset-x-7 bottom-0 z-10 flex items-end justify-between gap-5 border-t border-white/40 bg-black py-5 work-kicker">
            <span>{previewProject.title}</span>
            <span>Öffnen ↘</span>
          </div>
        </button>
      </section>

      <section
        ref={projectRef}
        id="project-view"
        tabIndex={-1}
        aria-labelledby="project-title"
        className="scroll-mt-[var(--site-header-offset)] focus:outline-none"
      >
        <header className="archive-snap-point grid gap-12 border-b border-black px-5 py-10 sm:gap-14 sm:px-7 sm:py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end lg:px-12 lg:py-14">
          <div>
            <button
              type="button"
              onClick={scrollToRegister}
              className="work-open-link"
            >
              ↑ Zum Register
            </button>
            <p className="mt-10 work-kicker text-black/45">
              {selectedProject.number} / {selectedProject.kind}
            </p>
            <h2
              id="project-title"
              className={[
                "project-title mt-5 max-w-full font-bold uppercase leading-[0.74] tracking-[-0.065em]",
                hasLongProjectTitle
                  ? "project-title-long text-[clamp(2.5rem,6vw,7.5rem)]"
                  : "max-w-[11ch] text-[clamp(3.3rem,10vw,11rem)]",
              ].join(" ")}
            >
              {selectedProject.title}
            </h2>
          </div>

          <div className="border-l border-black pl-5">
            <p className="text-[clamp(1.25rem,2.2vw,2.3rem)] font-bold leading-[1.03] tracking-[-0.025em]">
              {selectedProject.summary}
            </p>
            <p className="mt-8 work-kicker text-black/45">
              {selectedProject.medium} · {selectedProject.images.length} Bilder
            </p>
          </div>
        </header>

        <ProjectGallery key={selectedProject.id} project={selectedProject} />

        <div className="flex justify-end border-t border-black px-5 py-4 sm:px-7 lg:px-12">
          <button
            type="button"
            onClick={scrollToRegister}
            className="nav-link min-h-10 work-kicker text-black/55 hover:text-black"
          >
            ↑ Zum Register
          </button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
