"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { useReturnFocus } from "@/components/useReturnFocus";
import type { WorkImage, WorkProject } from "@/lib/workProjects";
import { ARROW_LEFT, ARROW_RIGHT } from "@/lib/glyphs";

const SWIPE_THRESHOLD = 48;

const pad = (value: number) => String(value).padStart(2, "0");

type ArtworkLightboxProps = {
  project: WorkProject;
  /** Index of the open plate, or `null` when the viewer is closed. */
  openIndex: number | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
};

/**
 * Enlarged viewing for a project's plates.
 *
 * Built on native `<dialog>` for the same reason the profile is: `showModal`
 * gives a real focus trap and an inert background, neither worth
 * reimplementing. Escape and focus return are handled explicitly so every
 * engine takes one path — see `useReturnFocus`.
 *
 * Full-size sources are only requested once a reader asks for one — the gallery
 * behind this renders at column width, and nothing here mounts until `openIndex`
 * stops being null.
 */
export function ArtworkLightbox({
  project,
  openIndex,
  onNavigate,
  onClose,
}: ArtworkLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeOriginRef = useRef<{ x: number; y: number } | null>(null);
  const { remember, restore } = useReturnFocus();
  const total = project.images.length;
  const isOpen = openIndex !== null;

  const step = useCallback(
    (delta: number) => {
      if (openIndex === null) return;
      onNavigate((openIndex + delta + total) % total);
    },
    [onNavigate, openIndex, total],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      remember();
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
      restore();
    }
  }, [isOpen, remember, restore]);

  const image = openIndex === null ? null : project.images[openIndex];
  // A window of three: the plate being read, and the one on either side so
  // next/previous does not start from a blank frame.
  const window =
    openIndex === null
      ? []
      : [-1, 0, 1].map((offset) => ({
          index: (openIndex + offset + total) % total,
          isCurrent: offset === 0,
        }));

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeOriginRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const origin = swipeOriginRef.current;
    swipeOriginRef.current = null;
    if (!origin) return;

    const deltaX = event.clientX - origin.x;
    const deltaY = event.clientY - origin.y;
    // Horizontal intent only, so a vertical drag or a tap is not a page turn.
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    step(deltaX < 0 ? 1 : -1);
  };

  return (
    /*
      The element stays mounted when closed. Unmounting an open <dialog> skips
      `close()`, and `close()` is what hands focus back to the plate the reader
      opened from — the viewer would swallow the caret on every dismissal.
    */
    <dialog
      ref={dialogRef}
      id="artwork-lightbox"
      aria-label={
        openIndex === null
          ? project.title
          : `${project.title} — Bild ${pad(openIndex + 1)} von ${pad(total)}`
      }
      className="lightbox-dialog tone-ink text-fg"
      onClose={onClose}
      onCancel={onClose}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
          return;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      {image === null || openIndex === null ? null : (
      <div className="flex h-full flex-col bg-surface">
        <div className="page-x flex min-h-14 shrink-0 items-stretch justify-between gap-4 border-b border-rule-soft">
          <p className="kicker flex min-w-0 items-center gap-3 truncate">
            <span className="text-fg-faint">{project.number}</span>
            <span className="truncate">{project.title}</span>
            <span className="shrink-0 text-fg-faint">
              {pad(openIndex + 1)} / {pad(total)}
            </span>
          </p>

          <button
            type="button"
            aria-label="Ansicht schliessen"
            onClick={onClose}
            className="group -mr-5 flex w-14 shrink-0 items-center justify-center border-l border-rule-soft text-xl leading-none transition-colors hover:bg-fg hover:text-surface sm:-mr-7 lg:-mr-12"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:rotate-90"
            >
              ×
            </span>
          </button>
        </div>

        <div
          className="relative min-h-0 flex-1 touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {window.map(({ index, isCurrent }) => (
            <LightboxPlate
              key={project.images[index].src}
              image={project.images[index]}
              hidden={!isCurrent}
            />
          ))}
        </div>

        <div className="page-x flex min-h-14 shrink-0 items-stretch justify-between gap-4 border-t border-rule-soft">
          <p className="kicker flex min-w-0 items-center text-fg-faint">
            <span className="truncate">
              {image.documentation ? "Dokumentation" : project.medium}
            </span>
          </p>

          <div className="-mr-5 flex shrink-0 items-stretch sm:-mr-7 lg:-mr-12">
            {[
              { label: "Vorheriges Bild", arrow: ARROW_LEFT, delta: -1 },
              { label: "Nächstes Bild", arrow: ARROW_RIGHT, delta: 1 },
            ].map(({ label, arrow, delta }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => step(delta)}
                disabled={total < 2}
                className="flex w-14 items-center justify-center border-l border-rule-soft text-base transition-colors hover:bg-fg hover:text-surface disabled:pointer-events-none disabled:opacity-35"
              >
                <span aria-hidden="true">{arrow}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}
    </dialog>
  );
}

function LightboxPlate({ image, hidden }: { image: WorkImage; hidden: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className={[
        "absolute inset-0 flex items-center justify-center p-4 sm:p-7",
        hidden ? "pointer-events-none invisible" : "",
      ].join(" ")}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 1024px) 92vw, 100vw"
        priority={!hidden}
        draggable={false}
        className="max-h-full w-auto max-w-full object-contain"
      />
    </figure>
  );
}
