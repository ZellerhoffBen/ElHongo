import { describe, expect, test } from "vitest";
import {
  EYE_POINTER_DELAY_MS,
  EYE_POINTER_SMOOTHING,
  getDelayedPointer,
  prunePointerHistory,
  type TimedPoint,
} from "./eyeMotion";

describe("EYE_POINTER_SMOOTHING", () => {
  test("keeps the eye movement eased instead of snappy", () => {
    expect(EYE_POINTER_SMOOTHING).toBe(0.07);
    expect(EYE_POINTER_SMOOTHING).toBeLessThan(0.14);
  });
});

describe("EYE_POINTER_DELAY_MS", () => {
  test("adds a short natural reaction delay", () => {
    expect(EYE_POINTER_DELAY_MS).toBe(50);
  });
});

describe("getDelayedPointer", () => {
  const history: TimedPoint[] = [
    { x: 0, y: 0, time: 0 },
    { x: 100, y: 50, time: 100 },
    { x: 200, y: 100, time: 200 },
  ];

  test("returns null before enough delayed history exists", () => {
    expect(getDelayedPointer(history, 40, 50)).toBeNull();
  });

  test("interpolates the pointer position at the delayed timestamp", () => {
    expect(getDelayedPointer(history, 200, 50)).toEqual({ x: 150, y: 75 });
  });

  test("uses the latest point when the delayed timestamp is newer than history", () => {
    expect(getDelayedPointer(history, 300, 50)).toEqual({ x: 200, y: 100 });
  });
});

describe("prunePointerHistory", () => {
  test("keeps recent samples and one older anchor for interpolation", () => {
    const history: TimedPoint[] = [
      { x: 0, y: 0, time: 0 },
      { x: 50, y: 0, time: 50 },
      { x: 100, y: 0, time: 100 },
      { x: 150, y: 0, time: 150 },
    ];

    expect(prunePointerHistory(history, 160, 50)).toEqual([
      { x: 50, y: 0, time: 50 },
      { x: 100, y: 0, time: 100 },
      { x: 150, y: 0, time: 150 },
    ]);
  });
});
