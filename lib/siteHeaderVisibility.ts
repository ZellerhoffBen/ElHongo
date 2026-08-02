export const SITE_HEADER_HIDE_THRESHOLD = 64;
export const SITE_HEADER_SCROLL_DELTA = 4;

type SiteHeaderStateInput = {
  previousY: number;
  nextY: number;
  hidden: boolean;
};

type SiteHeaderState = {
  previousY: number;
  hidden: boolean;
};

export function getNextSiteHeaderState({
  previousY,
  nextY,
  hidden,
}: SiteHeaderStateInput): SiteHeaderState {
  const clampedNextY = Math.max(nextY, 0);
  const delta = clampedNextY - previousY;

  if (clampedNextY < SITE_HEADER_HIDE_THRESHOLD) {
    return { previousY: clampedNextY, hidden: false };
  }

  if (delta > SITE_HEADER_SCROLL_DELTA) {
    return { previousY: clampedNextY, hidden: true };
  }

  if (delta < -SITE_HEADER_SCROLL_DELTA) {
    return { previousY: clampedNextY, hidden: false };
  }

  return { previousY: clampedNextY, hidden };
}
