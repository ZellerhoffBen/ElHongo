import type { Point } from "./maskEye";

export type TimedPoint = Point & {
  time: number;
};

export const EYE_POINTER_SMOOTHING = 0.07;
export const EYE_POINTER_DELAY_MS = 50;

export function getDelayedPointer(
  history: TimedPoint[],
  now: number,
  delayMs: number,
): Point | null {
  if (history.length === 0) {
    return null;
  }

  const targetTime = now - delayMs;

  if (targetTime < history[0].time) {
    return null;
  }

  for (let index = 0; index < history.length - 1; index += 1) {
    const current = history[index];
    const next = history[index + 1];

    if (targetTime >= current.time && targetTime <= next.time) {
      const span = next.time - current.time;
      const progress = span === 0 ? 0 : (targetTime - current.time) / span;

      return roundPoint({
        x: current.x + (next.x - current.x) * progress,
        y: current.y + (next.y - current.y) * progress,
      });
    }
  }

  const latest = history[history.length - 1];
  return { x: latest.x, y: latest.y };
}

export function prunePointerHistory(
  history: TimedPoint[],
  now: number,
  delayMs: number,
) {
  const keepAfter = now - delayMs - 60;
  const firstRecentIndex = history.findIndex((point) => point.time >= keepAfter);

  if (firstRecentIndex <= 0) {
    return history;
  }

  const startIndex =
    history[firstRecentIndex].time > keepAfter
      ? firstRecentIndex - 1
      : firstRecentIndex;

  return history.slice(startIndex);
}

function roundPoint(point: Point): Point {
  return {
    x: Math.round(point.x * 1000) / 1000,
    y: Math.round(point.y * 1000) / 1000,
  };
}
