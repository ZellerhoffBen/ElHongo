"use client";

import { useEffect, useRef, useState } from "react";
import {
  getClampedEyeOffset,
  smoothPoint,
  type Point,
} from "@/lib/maskEye";
import {
  EYE_POINTER_DELAY_MS,
  EYE_POINTER_SMOOTHING,
  getDelayedPointer,
  prunePointerHistory,
  type TimedPoint,
} from "@/lib/eyeMotion";

const IMAGE_SIZE = {
  width: 2038,
  height: 2000,
};

const EYE_CENTER = {
  xPercent: 54.75,
  yPercent: 22.85,
};

const EYE_SIZE = {
  widthPercent: (43 / IMAGE_SIZE.width) * 100,
  heightPercent: (30 / IMAGE_SIZE.height) * 100,
};

const MAX_EYE_OFFSET = {
  left: 10.64,
  right: 35.7,
  up: 4.725,
  down: 16.85,
};

const TOP_LEFT_DAMPING = 0.8;
const LEFT_AND_TOP_SECTOR_DAMPING = 0.8;
const RIGHT_DIAGONAL_PULL = 2.2;
const BOTTOM_LEFT_HORIZONTAL_PULL = 1.35;

type EyeFollowerArtProps = {
  className?: string;
};

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
        const scale = bounds.width / IMAGE_SIZE.width;
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
            topLeftDamping: TOP_LEFT_DAMPING,
            leftAndTopSectorDamping: LEFT_AND_TOP_SECTOR_DAMPING,
            rightDiagonalPull: RIGHT_DIAGONAL_PULL,
            bottomLeftHorizontalPull: BOTTOM_LEFT_HORIZONTAL_PULL,
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
      className={[
        "relative select-none",
        className ?? "w-[min(92vw,940px)]",
      ].join(" ")}
      role="img"
      aria-label="Comiczeichnung eines Mannes, der in Stacheldraht festhängt"
    >
      <img
        src="/mask_test/background_white_eye.png"
        alt=""
        draggable={false}
        className="block h-auto w-full"
      />
      <img
        src="/mask_test/only_eye.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute block select-none"
        style={{
          left: `calc(${EYE_CENTER.xPercent}% + ${eyeOffset.x}px)`,
          top: `calc(${EYE_CENTER.yPercent}% + ${eyeOffset.y}px)`,
          width: `${EYE_SIZE.widthPercent}%`,
          height: `${EYE_SIZE.heightPercent}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
      <img
        src="/mask_test/vordergrund_mask.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 block h-auto w-full select-none"
      />
    </div>
  );
}
