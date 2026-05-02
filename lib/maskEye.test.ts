import { describe, expect, test } from "vitest";
import { getClampedEyeOffset, smoothPoint } from "./maskEye";

describe("getClampedEyeOffset", () => {
  const center = { x: 100, y: 100 };

  test("keeps the eye centered before the pointer has been seen", () => {
    expect(
      getClampedEyeOffset(null, center, {
        maxX: 16,
        maxY: 7,
        activationDistance: 120,
      }),
    ).toEqual({ x: 0, y: 0 });
  });

  test("clamps horizontal movement at the visible eye edge", () => {
    expect(
      getClampedEyeOffset({ x: 600, y: 100 }, center, {
        maxX: 16,
        maxY: 7,
        activationDistance: 120,
      }),
    ).toEqual({ x: 16, y: 0 });
  });

  test("keeps diagonal movement inside the configured eye ellipse", () => {
    const offset = getClampedEyeOffset({ x: 600, y: 600 }, center, {
      maxX: 16,
      maxY: 7,
      activationDistance: 120,
    });

    expect((offset.x / 16) ** 2 + (offset.y / 7) ** 2).toBeLessThanOrEqual(
      1.001,
    );
  });

  test("ramps movement near the eye instead of snapping to the edge", () => {
    const offset = getClampedEyeOffset({ x: 130, y: 100 }, center, {
      maxX: 16,
      maxY: 7,
      activationDistance: 120,
    });

    expect(offset.x).toBeGreaterThan(0);
    expect(offset.x).toBeLessThan(16);
    expect(offset.y).toBe(0);
  });

  test("supports a wider right boundary than left for asymmetrical eye openings", () => {
    expect(
      getClampedEyeOffset({ x: 600, y: 100 }, center, {
        maxLeft: 16,
        maxRight: 44,
        maxUp: 7,
        maxDown: 22,
        activationDistance: 120,
      }),
    ).toEqual({ x: 44, y: 0 });

    expect(
      getClampedEyeOffset({ x: -400, y: 100 }, center, {
        maxLeft: 16,
        maxRight: 44,
        maxUp: 7,
        maxDown: 22,
        activationDistance: 120,
      }),
    ).toEqual({ x: -16, y: 0 });
  });

  test("supports a wider bottom boundary than top for asymmetrical eye openings", () => {
    expect(
      getClampedEyeOffset({ x: 100, y: 600 }, center, {
        maxLeft: 16,
        maxRight: 44,
        maxUp: 7,
        maxDown: 22,
        activationDistance: 120,
      }),
    ).toEqual({ x: 0, y: 22 });

    expect(
      getClampedEyeOffset({ x: 100, y: -400 }, center, {
        maxLeft: 16,
        maxRight: 44,
        maxUp: 7,
        maxDown: 22,
        activationDistance: 120,
      }),
    ).toEqual({ x: 0, y: -7 });
  });

  test("can dampen only the top-left corner without changing pure left movement", () => {
    const normalCorner = getClampedEyeOffset({ x: -400, y: -400 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
    });
    const dampenedCorner = getClampedEyeOffset({ x: -400, y: -400 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
      topLeftDamping: 0.8,
    });
    const pureLeft = getClampedEyeOffset({ x: -400, y: 100 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
      topLeftDamping: 0.8,
    });

    expect(dampenedCorner.x).toBeCloseTo(normalCorner.x * 0.8, 3);
    expect(dampenedCorner.y).toBeCloseTo(normalCorner.y * 0.8, 3);
    expect(pureLeft).toEqual({ x: -16, y: 0 });
  });

  test("can dampen top, top-left, left, and bottom-left while keeping the right side unchanged", () => {
    const baseTopLeft = getClampedEyeOffset({ x: -400, y: -400 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
      topLeftDamping: 0.8,
    });
    const dampedTopLeft = getClampedEyeOffset({ x: -400, y: -400 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
      topLeftDamping: 0.8,
      leftAndTopSectorDamping: 0.8,
    });
    const dampedLeft = getClampedEyeOffset({ x: -400, y: 100 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
      leftAndTopSectorDamping: 0.8,
    });
    const dampedTop = getClampedEyeOffset({ x: 100, y: -400 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
      leftAndTopSectorDamping: 0.8,
    });
    const baseBottomLeft = getClampedEyeOffset({ x: -400, y: 600 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
    });
    const dampedBottomLeft = getClampedEyeOffset({ x: -400, y: 600 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
      leftAndTopSectorDamping: 0.8,
    });
    const baseRight = getClampedEyeOffset({ x: 600, y: 100 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
    });
    const dampedRight = getClampedEyeOffset({ x: 600, y: 100 }, center, {
      maxLeft: 16,
      maxRight: 44,
      maxUp: 8,
      maxDown: 22,
      activationDistance: 120,
      leftAndTopSectorDamping: 0.8,
    });

    expect(dampedTopLeft.x).toBeCloseTo(baseTopLeft.x * 0.8, 3);
    expect(dampedTopLeft.y).toBeCloseTo(baseTopLeft.y * 0.8, 3);
    expect(dampedLeft).toEqual({ x: -12.8, y: 0 });
    expect(dampedTop).toEqual({ x: 0, y: -6.4 });
    expect(dampedBottomLeft.x).toBeCloseTo(baseBottomLeft.x * 0.8, 3);
    expect(dampedBottomLeft.y).toBeCloseTo(baseBottomLeft.y * 0.8, 3);
    expect(dampedRight).toEqual(baseRight);
  });

  test("can keep right-side diagonal gaze from collapsing into mostly vertical movement", () => {
    const baseTopRight = getClampedEyeOffset({ x: 600, y: -100 }, center, {
      maxLeft: 12,
      maxRight: 36,
      maxUp: 5,
      maxDown: 17,
      activationDistance: 120,
    });
    const pulledTopRight = getClampedEyeOffset({ x: 600, y: -100 }, center, {
      maxLeft: 12,
      maxRight: 36,
      maxUp: 5,
      maxDown: 17,
      activationDistance: 120,
      rightDiagonalPull: 2.2,
    });
    const baseBottomRight = getClampedEyeOffset({ x: 600, y: 600 }, center, {
      maxLeft: 12,
      maxRight: 36,
      maxUp: 5,
      maxDown: 17,
      activationDistance: 120,
    });
    const pulledBottomRight = getClampedEyeOffset({ x: 600, y: 600 }, center, {
      maxLeft: 12,
      maxRight: 36,
      maxUp: 5,
      maxDown: 17,
      activationDistance: 120,
      rightDiagonalPull: 2.2,
    });

    expect(pulledTopRight.x).toBeGreaterThan(baseTopRight.x * 1.35);
    expect(Math.abs(pulledTopRight.y)).toBeLessThanOrEqual(
      Math.abs(baseTopRight.y),
    );
    expect(pulledBottomRight.x).toBeGreaterThan(baseBottomRight.x * 1.35);
    expect(pulledBottomRight.y).toBeLessThan(baseBottomRight.y);
  });

  test("can make bottom-left read as left-down without changing top-left", () => {
    const baseBottomLeft = getClampedEyeOffset({ x: -400, y: 600 }, center, {
      maxLeft: 12,
      maxRight: 36,
      maxUp: 5,
      maxDown: 17,
      activationDistance: 120,
      leftAndTopSectorDamping: 0.8,
    });
    const pulledBottomLeft = getClampedEyeOffset({ x: -400, y: 600 }, center, {
      maxLeft: 12,
      maxRight: 36,
      maxUp: 5,
      maxDown: 17,
      activationDistance: 120,
      leftAndTopSectorDamping: 0.8,
      bottomLeftHorizontalPull: 1.35,
    });
    const baseTopLeft = getClampedEyeOffset({ x: -400, y: -400 }, center, {
      maxLeft: 12,
      maxRight: 36,
      maxUp: 5,
      maxDown: 17,
      activationDistance: 120,
      topLeftDamping: 0.8,
      leftAndTopSectorDamping: 0.8,
    });
    const pulledTopLeft = getClampedEyeOffset({ x: -400, y: -400 }, center, {
      maxLeft: 12,
      maxRight: 36,
      maxUp: 5,
      maxDown: 17,
      activationDistance: 120,
      topLeftDamping: 0.8,
      leftAndTopSectorDamping: 0.8,
      bottomLeftHorizontalPull: 1.35,
    });

    expect(Math.abs(pulledBottomLeft.x)).toBeGreaterThan(
      Math.abs(baseBottomLeft.x),
    );
    expect(pulledBottomLeft.y).toBeLessThan(baseBottomLeft.y);
    expect(pulledTopLeft).toEqual(baseTopLeft);
  });
});

describe("smoothPoint", () => {
  test("moves the current point toward the target by the smoothing amount", () => {
    expect(smoothPoint({ x: 0, y: 10 }, { x: 10, y: -10 }, 0.25)).toEqual({
      x: 2.5,
      y: 5,
    });
  });
});
