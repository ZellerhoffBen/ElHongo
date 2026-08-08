"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { SiteFooter } from "@/components/SiteFooter";
import { archiveProjects, findArchiveProject } from "@/lib/archiveProjects";

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

  const scrollToProject = useCallback(() => {
    window.requestAnimationFrame(() => {
      projectRef.current?.scrollIntoView({
        behavior: getScrollBehavior(),
        block: "start",
      });
      projectRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const openProject = useCallback(
    (id: string, scroll = true) => {
      const project = findArchiveProject(id);
      if (!project) return;

      setSelectedId(project.id);
      setPreviewId(project.id);

      // Each entry the visitor opens is a real history step, so Back walks
      // through the archive instead of leaving the site.
      const nextUrl = `/archive#${project.id}`;
      if (window.location.hash.slice(1) === project.id) {
        window.history.replaceState(null, "", nextUrl);
      } else {
        window.history.pushState(null, "", nextUrl);
      }

      if (scroll) scrollToProject();
    },
    [scrollToProject],
  );

  useEffect(() => {
    const syncFromLocation = (scroll: boolean) => {
      const id = decodeURIComponent(window.location.hash.slice(1));

      if (!id || !findArchiveProject(id)) {
        // Walked back past the first opened entry — return to the register.
        setSelectedId(defaultProject.id);
        setPreviewId(defaultProject.id);
        return;
      }

      setSelectedId(id);
      setPreviewId(id);
      if (scroll) {
        window.requestAnimationFrame(() => {
          projectRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
          projectRef.current?.focus({ preventScroll: true });
        });
      }
    };

    syncFromLocation(true);

    const handleHistoryChange = () => syncFromLocation(false);
    window.addEventListener("popstate", handleHistoryChange);
    window.addEventListener("hashchange", handleHistoryChange);
    return () => {
      window.removeEventListener("popstate", handleHistoryChange);
      window.removeEventListener("hashchange", handleHistoryChange);
    };
  }, []);

  return (
    <main
      id="inhalt"
      className="archive-snap-page tone-paper bg-paper pt-[var(--site-header-offset)] text-fg"
    >
      <section
        ref={registerRef}
        tabIndex={-1}
        aria-labelledby="archive-title"
        className="archive-snap-point scroll-mt-[var(--site-header-offset)] border-b border-ink focus:outline-none lg:grid lg:min-h-[calc(100svh-var(--site-header-offset))] lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]"
      >
        <div className="lg:border-r lg:border-ink">
          <header className="page-x flex min-h-36 items-end border-b border-ink py-section-sm sm:min-h-40">
            <h1 id="archive-title" className="text-display-xl uppercase">
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
                    "register-row page-x group grid min-h-28 w-full grid-cols-[2.25rem_minmax(0,1fr)_5rem] items-center gap-3 border-b border-ink py-4 text-left last:border-b-0 [--focus-offset:-4px] sm:min-h-32 lg:grid-cols-[3rem_minmax(0,1fr)_8rem]",
                    active
                      ? "tone-ink bg-surface text-fg"
                      : "tone-paper bg-paper text-fg hover:bg-wash",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "kicker transition-colors",
                      active ? "text-accent" : "text-fg-faint group-hover:text-fg",
                    ].join(" ")}
                  >
                    {project.number}
                  </span>
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
                    <span className="kicker mt-2 block text-fg-faint lg:hidden">
                      {project.kind} · {project.images.length} Bilder
                    </span>
                  </span>
                  <span className="kicker hidden text-right text-fg-faint lg:block">
                    {project.kind} · {project.images.length} Bilder
                  </span>
                  {/* Contained, not cropped — the index must not misrepresent the work. */}
                  <span className="relative h-16 w-20 overflow-hidden border border-rule-soft bg-white lg:hidden">
                    <Image
                      src={cover.src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain p-1"
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
          className="tone-ink group relative hidden min-h-[calc(100svh-var(--site-header-offset))] overflow-hidden bg-surface text-left text-fg [--focus-offset:-6px] lg:block"
        >
          <div className="kicker absolute left-7 top-7 z-10 border border-rule px-3 py-2">
            Vorschau / {previewProject.number}
          </div>
          <Image
            key={previewImage.src}
            src={previewImage.src}
            alt={previewImage.alt}
            fill
            priority
            sizes="42vw"
            className="preview-art object-contain p-10 pt-20"
          />
          <div className="kicker absolute inset-x-7 bottom-0 z-10 flex items-end justify-between gap-5 border-t border-rule-soft bg-surface py-5">
            <span>{previewProject.title}</span>
            <span className="inline-flex items-center gap-2 transition-transform duration-200 ease-edge group-hover:translate-x-1">
              Öffnen <span aria-hidden="true">↘</span>
            </span>
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
        <header className="archive-snap-point page-x grid gap-12 border-b border-ink py-section sm:gap-14 sm:py-section-lg lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end">
          <div>
            <p className="kicker text-fg-faint">
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

          <div className="border-l border-ink pl-5">
            <p className="text-lead-sm">{selectedProject.summary}</p>
            <p className="kicker mt-8 text-fg-faint">
              {selectedProject.medium} · {selectedProject.images.length} Bilder
            </p>
          </div>
        </header>

        {/* Keeps the visitor oriented inside galleries that run to 20 plates. */}
        <div className="page-x sticky top-[var(--site-header-offset)] z-40 flex items-center justify-between gap-4 border-b border-ink bg-paper">
          <p className="kicker min-w-0 truncate text-fg-faint">
            <span className="text-fg">
              {selectedProject.number} {selectedProject.title}
            </span>
            <span className="hidden sm:inline">
              {" "}
              · {selectedProject.images.length} Bilder
            </span>
          </p>
          <button
            type="button"
            onClick={scrollToRegister}
            className="btn btn-quiet shrink-0"
          >
            <span aria-hidden="true">↑</span> Zum Register
          </button>
        </div>

        <ProjectGallery key={selectedProject.id} project={selectedProject} />

        <div className="page-x flex justify-end border-t border-ink py-2">
          <button
            type="button"
            onClick={scrollToRegister}
            className="btn btn-primary"
          >
            <span aria-hidden="true">↑</span> Zum Register
          </button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
