export type Point = {
  x: number;
  y: number;
};

type EyeOffsetOptions = {
  maxX?: number;
  maxY?: number;
  maxLeft?: number;
  maxRight?: number;
  maxUp?: number;
  maxDown?: number;
  topLeftDamping?: number;
  leftAndTopSectorDamping?: number;
  rightDiagonalPull?: number;
  bottomLeftHorizontalPull?: number;
  activationDistance?: number;
};

const DEFAULT_ACTIVATION_DISTANCE = 180;

export function getClampedEyeOffset(
  pointer: Point | null,
  eyeCenter: Point,
  options: EyeOffsetOptions,
): Point {
  const bounds = getDirectionalBounds(options);

  if (
    !pointer ||
    bounds.maxLeft <= 0 ||
    bounds.maxRight <= 0 ||
    bounds.maxUp <= 0 ||
    bounds.maxDown <= 0
  ) {
    return { x: 0, y: 0 };
  }

  const dx = pointer.x - eyeCenter.x;
  const dy = pointer.y - eyeCenter.y;
  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  const gazeDirection = getGazeDirection(dx, dy, options);
  const unitX = gazeDirection.x;
  const unitY = gazeDirection.y;
  const maxX = unitX >= 0 ? bounds.maxRight : bounds.maxLeft;
  const maxY = unitY >= 0 ? bounds.maxDown : bounds.maxUp;
  const maxOnRay =
    1 /
    Math.sqrt(
      (unitX * unitX) / (maxX * maxX) +
        (unitY * unitY) / (maxY * maxY),
    );
  const activationDistance =
    options.activationDistance ?? DEFAULT_ACTIVATION_DISTANCE;
  const strength = Math.min(distance / activationDistance, 1);
  const damping =
    getLeftAndTopSectorDamping(unitX, unitY, options) *
    (unitX < 0 && unitY < 0 ? options.topLeftDamping ?? 1 : 1);

  return roundPoint({
    x: unitX * maxOnRay * strength * damping,
    y: unitY * maxOnRay * strength * damping,
  });
}

function getGazeDirection(
  dx: number,
  dy: number,
  options: EyeOffsetOptions,
): Point {
  const horizontalPull = getHorizontalPull(dx, dy, options);
  const shapedDx = dx * horizontalPull;
  const shapedDistance = Math.hypot(shapedDx, dy);

  if (shapedDistance === 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: shapedDx / shapedDistance,
    y: dy / shapedDistance,
  };
}

function getHorizontalPull(dx: number, dy: number, options: EyeOffsetOptions) {
  if (dx > 0 && dy !== 0) {
    return options.rightDiagonalPull ?? 1;
  }

  if (dx < 0 && dy > 0) {
    return options.bottomLeftHorizontalPull ?? 1;
  }

  return 1;
}

function getDirectionalBounds(options: EyeOffsetOptions) {
  return {
    maxLeft: options.maxLeft ?? options.maxX ?? 0,
    maxRight: options.maxRight ?? options.maxX ?? 0,
    maxUp: options.maxUp ?? options.maxY ?? 0,
    maxDown: options.maxDown ?? options.maxY ?? 0,
  };
}

function getLeftAndTopSectorDamping(
  unitX: number,
  unitY: number,
  options: EyeOffsetOptions,
) {
  const damping = options.leftAndTopSectorDamping ?? 1;
  const isLeftSide = unitX < 0;
  const isTopSector = unitY < 0 && Math.abs(unitX) <= 0.45;

  return isLeftSide || isTopSector ? damping : 1;
}

export function smoothPoint(
  current: Point,
  target: Point,
  smoothingAmount: number,
): Point {
  return {
    x: current.x + (target.x - current.x) * smoothingAmount,
    y: current.y + (target.y - current.y) * smoothingAmount,
  };
}

function roundPoint(point: Point): Point {
  return {
    x: Math.round(point.x * 1000) / 1000,
    y: Math.round(point.y * 1000) / 1000,
  };
}
