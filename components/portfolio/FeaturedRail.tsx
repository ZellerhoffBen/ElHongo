"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FeaturedWork } from "@/lib/featuredWorks";

type FeaturedRailProps = {
  works: FeaturedWork[];
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * "Ausgewählte Blätter".
 *
 * Below `lg` this is a swipeable rail of panels rather than a stack of
 * near-empty boxes; above it, a three-up spread. Either way each panel is a
 * link into the project the plate belongs to, captioned with the title and
 * category — the selection has to be a route into the work, not texture.
 */
export function FeaturedRail({ works }: FeaturedRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Derived from real scroll position rather than click history, so a swipe,
  // a keyboard scroll and a button press all agree on where the reader is.
  const syncActiveIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const panels = [...rail.children] as HTMLElement[];
    const railCentre = rail.scrollLeft + rail.clientWidth / 2;
    let closest = 0;
    let smallestGap = Number.POSITIVE_INFINITY;

    panels.forEach((panel, index) => {
      const gap = Math.abs(panel.offsetLeft + panel.offsetWidth / 2 - railCentre);
      if (gap < smallestGap) {
        smallestGap = gap;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    syncActiveIndex();
    rail.addEventListener("scroll", syncActiveIndex, { passive: true });
    window.addEventListener("resize", syncActiveIndex);
    return () => {
      rail.removeEventListener("scroll", syncActiveIndex);
      window.removeEventListener("resize", syncActiveIndex);
    };
  }, [syncActiveIndex]);

  const scrollToIndex = useCallback((index: number) => {
    const rail = railRef.current;
    const panel = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !panel) return;

    rail.scrollTo({
      left: panel.offsetLeft - (rail.clientWidth - panel.offsetWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  return (
    <div className="mt-section-sm sm:mt-section lg:mt-0 lg:grid lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)]">
      {/*
        Orientation, not chrome: the label says what the rail is, the counter
        says how far through it you are, and the arrows exist so the rail is
        operable without a trackpad. All three disappear at `lg`, where the
        whole selection is visible at once and none of it is true any more.
      */}
      <div className="flex items-center justify-between gap-4 pb-4 lg:hidden">
        <p className="kicker text-fg-faint">
          Ausgewählte Blätter{" "}
          <span className="whitespace-nowrap text-fg">
            {pad(activeIndex + 1)} / {pad(works.length)}
          </span>
        </p>

        <div className="flex items-center gap-1">
          {[
            { label: "Vorheriges Blatt", arrow: "←", step: -1 },
            { label: "Nächstes Blatt", arrow: "→", step: 1 },
          ].map(({ label, arrow, step }) => {
            const target = activeIndex + step;
            const disabled = target < 0 || target >= works.length;

            return (
              <button
                key={label}
                type="button"
                aria-label={label}
                disabled={disabled}
                onClick={() => scrollToIndex(target)}
                className="flex h-11 w-11 items-center justify-center border border-rule-soft text-base transition-colors duration-150 hover:bg-fg hover:text-surface disabled:pointer-events-none disabled:opacity-35"
              >
                <span aria-hidden="true">{arrow}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={railRef}
        role="region"
        aria-label="Ausgewählte Blätter"
        tabIndex={0}
        // `grid-rows-[minmax(0,1fr)]` pins the row to the rail's own height:
        // without it the captions make the row size to content and the
        // fixed-height panel above starts scrolling.
        className="studio-rail page-x-bleed flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:gap-4 sm:px-7 lg:grid lg:min-h-0 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)] lg:gap-px lg:overflow-visible lg:bg-rule-soft lg:p-px"
      >
        {works.map(({ project, image, href }) => (
          <Link
            key={href}
            href={href}
            scroll={false}
            // `tone-paper`, not `text-ink`: the card is a paper island inside an
            // ink section, and its caption/border read `--fg-faint` and
            // `--rule-soft` from the nearest tone context. Without it both
            // resolve to white and disappear on the white ground.
            className="group tone-paper flex w-[78%] shrink-0 snap-center flex-col border border-rule-soft bg-white text-fg [--focus-offset:-4px] sm:w-[58%] lg:w-auto lg:shrink lg:border-0"
          >
            <figure className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-5 sm:p-8 lg:p-6">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 33vw, 78vw"
                // A screen below the fold, and inside the lazy-loading
                // threshold Chrome uses on slow connections, so these are
                // fetched alongside the hero whatever `loading` says. Low
                // priority and a lighter encode keep them out of its way; the
                // plate at full quality is one tap away on the project page.
                fetchPriority="low"
                quality={60}
                className="h-full w-full object-contain transition-transform duration-300 ease-edge group-hover:scale-[1.015]"
              />
            </figure>

            {/*
              The caption is the point of the change: a visitor can now say what
              a plate is and where the rest of it lives.
            */}
            <figcaption className="grid gap-2 border-t border-rule-soft px-5 py-4 sm:px-8 lg:px-6">
              <span className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-sm font-bold uppercase leading-none tracking-[-0.03em] sm:text-base">
                  {project.title}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xs transition-transform duration-200 ease-edge group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </span>
              <span className="kicker text-fg-faint">
                {project.kind}
                {project.year ? ` · ${project.year}` : ""} · {project.medium}
              </span>
            </figcaption>
          </Link>
        ))}
      </div>
    </div>
  );
}
