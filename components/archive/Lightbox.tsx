"use client";

import { useEffect, useCallback } from "react";

type LightboxProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
};

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const next = useCallback(
    () => onIndexChange((index + 1) % images.length),
    [images.length, index, onIndexChange],
  );
  const prev = useCallback(
    () => onIndexChange((index - 1 + images.length) % images.length),
    [images.length, index, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, prev]);

  if (index < 0 || index >= images.length) return null;
  const src = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute right-5 top-5 text-3xl leading-none text-white/80 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-3xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            ›
          </button>
        </>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="max-h-[90vh] max-w-[92vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="pointer-events-none absolute bottom-5 left-0 right-0 text-center text-[11px] tracking-[0.18em] text-white/60">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
