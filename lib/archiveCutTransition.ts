export const ARCHIVE_CUT_FADE_MS = 60;
export const ARCHIVE_CUT_HOLD_MS = 80;

export type ArchiveCutTransition = {
  nextDisplayedId: string | null;
  fadeMs: number;
  holdMs: number;
  totalMs: number;
};

export function getArchiveCutTransition(
  activeId: string | null,
  displayedId: string | null,
): ArchiveCutTransition | null {
  if (activeId === displayedId) {
    return null;
  }

  return {
    nextDisplayedId: activeId,
    fadeMs: ARCHIVE_CUT_FADE_MS,
    holdMs: ARCHIVE_CUT_HOLD_MS,
    totalMs: ARCHIVE_CUT_FADE_MS + ARCHIVE_CUT_HOLD_MS,
  };
}
