"use client";

import { useEffect, useRef, useState } from "react";
import { heroAssets } from "@/lib/heroAssets.generated";
import {
  ARTWORK_SIZE,
  ARTWORK_SIZES,
  EYE_CENTER,
  EYE_DAMPING,
  EYE_SIZE,
  MAX_EYE_OFFSET,
  SOCKET_WINDOW,
  socketWindowStyle,
} from "@/lib/heroArtwork";
import { getClampedEyeOffset, smoothPoint, type Point } from "@/lib/maskEye";
import {
  EYE_POINTER_DELAY_MS,
  EYE_POINTER_SMOOTHING,
  getDelayedPointer,
  prunePointerHistory,
  type TimedPoint,
} from "@/lib/eyeMotion";

const EYE_SIZE_PERCENT = {
  width: `${(EYE_SIZE.width / ARTWORK_SIZE.width) * 100}%`,
  height: `${(EYE_SIZE.height / ARTWORK_SIZE.height) * 100}%`,
};

type EyeFollowerArtProps = {
  className?: string;
};

/**
 * The three-layer hero artwork.
 *
 * Every layer is `aria-hidden` — the composition is one picture, not three, so
 * the accessible description belongs to the `<figure>` that wraps this
 * component (see `app/page.tsx`). Rendering it without a caption leaves the
 * artwork unnamed.
 */
export function EyeFollowerArt({ className }: EyeFollowerArtProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const pointerHistoryRef = { current: [] as TimedPoint[] };
    const smoothPointerRef = { current: null as Point | null };
    let animationFrame = 0;

    function updateEye() {
      const frame = frameRef.current;
      const delayedPointer = getDelayedPointer(
        pointerHistoryRef.current,
        performance.now(),
        EYE_POINTER_DELAY_MS,
      );

      if (frame && delayedPointer) {
        const bounds = frame.getBoundingClientRect();
        const scale = bounds.width / ARTWORK_SIZE.width;
        const eyeCenter = {
          x: bounds.left + bounds.width * (EYE_CENTER.xPercent / 100),
          y: bounds.top + bounds.height * (EYE_CENTER.yPercent / 100),
        };

        smoothPointerRef.current = smoothPointerRef.current
          ? smoothPoint(
              smoothPointerRef.current,
              delayedPointer,
              EYE_POINTER_SMOOTHING,
            )
          : delayedPointer;

        const nextOffset = getClampedEyeOffset(
          smoothPointerRef.current,
          eyeCenter,
          {
            maxLeft: MAX_EYE_OFFSET.left * scale,
            maxRight: MAX_EYE_OFFSET.right * scale,
            maxUp: MAX_EYE_OFFSET.up * scale,
            maxDown: MAX_EYE_OFFSET.down * scale,
            topLeftDamping: EYE_DAMPING.topLeft,
            leftAndTopSectorDamping: EYE_DAMPING.leftAndTopSector,
            rightDiagonalPull: EYE_DAMPING.rightDiagonalPull,
            bottomLeftHorizontalPull: EYE_DAMPING.bottomLeftHorizontalPull,
            activationDistance: bounds.width * 0.2,
          },
        );

        setEyeOffset((currentOffset) => {
          if (
            Math.abs(currentOffset.x - nextOffset.x) < 0.05 &&
            Math.abs(currentOffset.y - nextOffset.y) < 0.05
          ) {
            return currentOffset;
          }

          return nextOffset;
        });
      }

      animationFrame = requestAnimationFrame(updateEye);
    }

    function handlePointerMove(event: PointerEvent) {
      pointerHistoryRef.current = prunePointerHistory(
        [
          ...pointerHistoryRef.current,
          { x: event.clientX, y: event.clientY, time: performance.now() },
        ],
        performance.now(),
        EYE_POINTER_DELAY_MS,
      );
    }

    function handleResize() {
      pointerHistoryRef.current = [];
      smoothPointerRef.current = null;
      setEyeOffset({ x: 0, y: 0 });
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);
    animationFrame = requestAnimationFrame(updateEye);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={["relative select-none", className ?? "w-[min(92vw,940px)]"].join(" ")}
    >
      {/*
        Raw <picture>: the layers must share one pixel box, so next/image's
        wrapper is bypassed and the ladder is declared by hand. Every rung has
        the artwork's aspect ratio, so which one the browser picks cannot move
        the socket relative to the drawing — the mask and pupil are positioned
        in percentages of this frame, not of any particular file.
      */}
      <picture>
        <source type="image/avif" srcSet={heroAssets.avifSrcSet} sizes={ARTWORK_SIZES} />
        <source type="image/webp" srcSet={heroAssets.webpSrcSet} sizes={ARTWORK_SIZES} />
        <img
          src={heroAssets.fallback}
          alt=""
          aria-hidden="true"
          width={ARTWORK_SIZE.width}
          height={ARTWORK_SIZE.height}
          draggable={false}
          fetchPriority="high"
          decoding="async"
          className="block h-auto w-full"
        />
      </picture>

      <img
        src={heroAssets.pupil}
        alt=""
        aria-hidden="true"
        width={EYE_SIZE.width}
        height={EYE_SIZE.height}
        draggable={false}
        className="pointer-events-none absolute block max-w-none select-none"
        style={{
          left: `calc(${EYE_CENTER.xPercent}% + ${eyeOffset.x}px)`,
          top: `calc(${EYE_CENTER.yPercent}% + ${eyeOffset.y}px)`,
          width: EYE_SIZE_PERCENT.width,
          height: EYE_SIZE_PERCENT.height,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/*
        The socket mask is the only surviving piece of the second full-size
        layer: a 160x96 crop that clips the pupil back to the drawn eye. Outside
        its transparent hole it repaints the artwork underneath pixel for pixel,
        so the seam is invisible.
      */}
      <img
        src={heroAssets.socketMask}
        alt=""
        aria-hidden="true"
        width={SOCKET_WINDOW.width}
        height={SOCKET_WINDOW.height}
        draggable={false}
        className="pointer-events-none absolute block max-w-none select-none"
        style={socketWindowStyle}
      />
    </div>
  );
}
