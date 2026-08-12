"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  archiveProjects,
  getProjectCover,
  getProjectNeighbours,
  resolveLegacyProjectId,
} from "@/lib/archiveProjects";
import type { WorkProject } from "@/lib/workProjects";

const projectHref = (project: WorkProject) => `/archive/${project.slug}`;

const getScrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

type ArchiveViewProps = {
  /**
   * The open project, or `null` on `/archive` — which is the register itself,
   * not a project view. Rendering the first project's gallery there made the
   * index a near-duplicate of `/archive/sine-2000` and cost every visitor a
   * gallery they had not asked for.
   */
  project: WorkProject | null;
};

export function ArchiveView({ project }: ArchiveViewProps) {
  const router = useRouter();
  const [previewSlug, setPreviewSlug] = useState(
    project?.slug ?? archiveProjects[0].slug,
  );
  const registerRef = useRef<HTMLElement>(null);
  const projectRef = useRef<HTMLElement>(null);
  const hasRenderedRef = useRef(false);

  const previewProject =
    archiveProjects.find((entry) => entry.slug === previewSlug) ??
    archiveProjects[0];
  const previewImage = getProjectCover(previewProject);
  const neighbours = project ? getProjectNeighbours(project.slug) : null;

  const scrollToRegister = useCallback(() => {
    registerRef.current?.scrollIntoView({
      behavior: getScrollBehavior(),
      block: "start",
    });
    registerRef.current?.focus({ preventScroll: true });
  }, []);

  // The register keeps its hover preview pointed at whatever is open when the
  // route changes underneath it.
  useEffect(() => {
    if (project) setPreviewSlug(project.slug);
  }, [project]);

  useEffect(() => {
    if (!project) {
      hasRenderedRef.current = true;
      return;
    }

    // A shared `/archive/<slug>` link means "show me this project", so the first
    // paint jumps rather than animates; later moves within the register glide.
    const behavior = hasRenderedRef.current ? getScrollBehavior() : "auto";
    hasRenderedRef.current = true;

    const frame = window.requestAnimationFrame(() => {
      projectRef.current?.scrollIntoView({ behavior, block: "start" });
      projectRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [project]);

  // `/archive#fatguy` was how projects were addressed before they had routes.
  // Those links are in the wild, so they are resolved and rewritten rather than
  // silently dropping the visitor on the register.
  useEffect(() => {
    if (project) return;

    const legacy = window.location.hash.slice(1);
    if (!legacy) return;

    const target = resolveLegacyProjectId(decodeURIComponent(legacy));
    if (target) router.replace(projectHref(target));
  }, [project, router]);

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

          <nav aria-label="Archivregister">
            {archiveProjects.map((entry) => {
              const active = entry.slug === project?.slug;
              const cover = getProjectCover(entry);
              const longTitle = entry.title.length >= 12;

              return (
                <Link
                  key={entry.slug}
                  href={projectHref(entry)}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setPreviewSlug(entry.slug)}
                  onFocus={() => setPreviewSlug(entry.slug)}
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
                    {entry.number}
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
                      {entry.title}
                    </strong>
                    <span className="kicker mt-2 block text-fg-faint lg:hidden">
                      {entry.kind} · {entry.images.length} Bilder
                    </span>
                  </span>
                  <span className="kicker hidden text-right text-fg-faint lg:block">
                    {entry.kind} · {entry.images.length} Bilder
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
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          href={projectHref(previewProject)}
          scroll={false}
          aria-label={`${previewProject.title} ansehen`}
          className="tone-ink group relative hidden min-h-[calc(100svh-var(--site-header-offset))] overflow-hidden bg-surface text-left text-fg [--focus-offset:-6px] lg:block"
        >
          <div className="kicker absolute left-7 top-7 z-10 border border-rule px-3 py-2">
            Vorschau / {previewProject.number}
          </div>
          {/*
            The panel is `hidden` below `lg`, but `display: none` does not stop
            an <img> from loading — phones were fetching a preview they never
            render. `sizes` states where it is actually painted, so narrow
            viewports resolve to the smallest candidate instead of a real one.
          */}
          <Image
            key={previewImage.src}
            src={previewImage.src}
            alt={previewImage.alt}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 1px"
            className="preview-art object-contain p-10 pt-20"
          />
          <div className="kicker absolute inset-x-7 bottom-0 z-10 flex items-end justify-between gap-5 border-t border-rule-soft bg-surface py-5">
            <span>{previewProject.title}</span>
            <span className="inline-flex items-center gap-2 transition-transform duration-200 ease-edge group-hover:translate-x-1">
              Öffnen <span aria-hidden="true">↘</span>
            </span>
          </div>
        </Link>
      </section>

      {project ? (
        <>
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
                {project.number} / {project.kind}
                {project.year ? ` / ${project.year}` : ""}
              </p>
              <h2
                id="project-title"
                className={[
                  "project-title mt-5 max-w-full font-bold uppercase leading-[0.74] tracking-[-0.065em]",
                  project.title.length >= 12
                    ? "project-title-long text-[clamp(2.5rem,6vw,7.5rem)]"
                    : "max-w-[11ch] text-[clamp(3.3rem,10vw,11rem)]",
                ].join(" ")}
              >
                {project.title}
              </h2>
            </div>

            <div className="border-l border-ink pl-5">
              <p className="text-lead-sm">{project.summary}</p>
              <p className="kicker mt-8 text-fg-faint">
                {project.medium} · {project.images.length} Bilder
              </p>
            </div>
          </header>

          {/* Keeps the visitor oriented inside galleries that run to 20 plates. */}
          <div className="page-x sticky top-[var(--site-header-offset)] z-40 flex items-center justify-between gap-4 border-b border-ink bg-paper">
            <p className="kicker min-w-0 truncate text-fg-faint">
              <span className="text-fg">
                {project.number} {project.title}
              </span>
              <span className="hidden sm:inline">
                {" "}
                · {project.images.length} Bilder
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

          <ProjectGallery key={project.slug} project={project} eagerLead />
        </section>

        {/* The register is one scroll away, but the reader who has just finished a
            gallery wants the next body of work, not an index. */}
        <nav
          aria-label="Weitere Projekte"
          className="grid border-t border-ink sm:grid-cols-2"
        >
          {[
            { project: neighbours?.previous, label: "Vorheriges Projekt", arrow: "←" },
            { project: neighbours?.next, label: "Nächstes Projekt", arrow: "→" },
          ].map(({ project: neighbour, label, arrow }, index) =>
            neighbour ? (
              <Link
                key={label}
                href={projectHref(neighbour)}
                scroll={false}
                className={[
                  "page-x group grid min-h-28 content-between gap-x-5 border-b border-ink py-5 transition-colors duration-200 ease-edge hover:bg-ink hover:text-paper [--focus-offset:-4px] sm:min-h-32 sm:border-b-0 sm:py-6",
                  index === 0
                    ? "sm:border-r sm:border-ink"
                    : "sm:text-right",
                ].join(" ")}
              >
                <span className="kicker text-fg-faint transition-colors group-hover:text-paper/70">
                  {index === 0 ? (
                    <>
                      <span aria-hidden="true">{arrow}</span> {label}
                    </>
                  ) : (
                    <>
                      {label} <span aria-hidden="true">{arrow}</span>
                    </>
                  )}
                </span>
                <span className="mt-4 min-w-0 break-words text-[clamp(1.5rem,4vw,2.75rem)] font-bold uppercase leading-[0.85] tracking-[-0.045em]">
                  {neighbour.title}
                </span>
              </Link>
            ) : null,
          )}
        </nav>

        <div className="page-x flex justify-end border-t border-ink py-2">
          <button type="button" onClick={scrollToRegister} className="btn btn-primary">
            <span aria-hidden="true">↑</span> Zum Register
          </button>
        </div>
        </>
      ) : null}

      <SiteFooter />
    </main>
  );
}
