"use client";

import Image from "next/image";
import { useState } from "react";
import { ArtworkLightbox } from "@/components/portfolio/ArtworkLightbox";
import { focusOpener } from "@/components/useReturnFocus";
import type { WorkImage, WorkProject } from "@/lib/workProjects";
import { ARROW_UP_RIGHT } from "@/lib/glyphs";

type ProjectGalleryProps = {
  project: WorkProject;
  /**
   * True only where the gallery is what the route is for. `/archive` renders
   * the register with the first project below it, and eagerly fetching that
   * lead plate cost the register 112 KiB of image nobody had scrolled to.
   */
  eagerLead?: boolean;
};

function Artwork({
  image,
  sizes,
  index,
  total,
  onOpen,
  eager = false,
}: {
  image: WorkImage;
  sizes: string;
  index: number;
  total: number;
  onOpen: () => void;
  /** The lead plate is what a `/archive/<slug>` link renders first. */
  eager?: boolean;
}) {
  const plate = `Bild ${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <figure className="relative">
      {/*
        The plate is the control. A drawing this dense is unreadable at column
        width, so the whole image opens the enlarged view rather than hanging a
        magnifier icon off the corner.
      */}
      <button
        type="button"
        onClick={(event) => {
          // Safari does not focus a button on click, and the viewer has to know
          // where to put the caret back.
          focusOpener(event);
          onOpen();
        }}
        aria-label={`${image.alt} — vergrössern (${plate})`}
        className="group block w-full cursor-zoom-in [--focus-offset:4px]"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={eager}
          className="h-auto w-full"
        />
      </button>

      {/* Catalogue numbering: the register promises N Bilder, the plates confirm it. */}
      <figcaption className="kicker mt-3 flex items-baseline justify-between gap-4 text-fg-faint">
        <span>{plate}</span>
        <span className="flex items-baseline gap-4">
          {image.documentation ? <span>Dokumentation</span> : null}
          <span aria-hidden="true" className="opacity-0 transition-opacity group-focus-visible:opacity-100 sm:opacity-100">
            Vergrössern {ARROW_UP_RIGHT}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function ProjectGallery({ project, eagerLead = false }: ProjectGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lead, ...rest] = project.images;
  const total = project.images.length;
  const pairs: WorkImage[][] = [];

  for (let index = 0; index < rest.length; index += 2) {
    pairs.push(rest.slice(index, index + 2));
  }

  return (
    <div
      className={[
        "bg-surface text-fg",
        project.tone === "ink" ? "tone-ink" : "tone-paper",
      ].join(" ")}
    >
      <div className="page-x py-section-sm sm:py-section lg:py-section-lg">
        <div
          className={[
            "mx-auto",
            lead.width / lead.height < 0.9 ? "max-w-[820px]" : "max-w-[1380px]",
          ].join(" ")}
        >
          <Artwork
            image={lead}
            sizes="(min-width: 1440px) 1380px, 94vw"
            index={1}
            total={total}
            onOpen={() => setOpenIndex(0)}
            eager={eagerLead}
          />
        </div>
      </div>

      {pairs.map((pair, pairIndex) => {
        const solo = pair.length === 1;
        const reversed = pairIndex % 2 === 1;

        return (
          <section
            key={`${pair[0].src}-${pairIndex}`}
            className="page-x border-t border-rule-soft py-section sm:py-section-lg lg:py-section-xl"
          >
            <div
              className={[
                "mx-auto grid max-w-[1380px] gap-10 lg:gap-16",
                solo ? "grid-cols-1" : "md:grid-cols-2",
                reversed
                  ? "md:[&>*:first-child]:translate-y-20"
                  : "md:[&>*:last-child]:translate-y-20",
              ].join(" ")}
            >
              {pair.map((item, itemIndex) => {
                const index = 2 + pairIndex * 2 + itemIndex;

                return (
                  <div
                    key={item.src}
                    className={
                      solo
                        ? pairIndex % 2 === 0
                          ? "max-w-[920px]"
                          : "ml-auto max-w-[920px]"
                        : ""
                    }
                  >
                    <Artwork
                      image={item}
                      sizes={
                        solo
                          ? "(min-width: 1024px) 920px, 92vw"
                          : "(min-width: 768px) 46vw, 92vw"
                      }
                      index={index}
                      total={total}
                      onOpen={() => setOpenIndex(index - 1)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <ArtworkLightbox
        project={project}
        openIndex={openIndex}
        onNavigate={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  );
}
