import { describe, expect, test } from "vitest";
import { getNextSiteHeaderState } from "./siteHeaderVisibility";

describe("getNextSiteHeaderState", () => {
  test("keeps the header visible near the top", () => {
    expect(
      getNextSiteHeaderState({ previousY: 0, nextY: 24, hidden: false }),
    ).toEqual({ previousY: 24, hidden: false });
  });

  test("hides the header when scrolling down past the threshold", () => {
    expect(
      getNextSiteHeaderState({ previousY: 20, nextY: 120, hidden: false }),
    ).toEqual({ previousY: 120, hidden: true });
  });

  test("shows the header when scrolling up", () => {
    expect(
      getNextSiteHeaderState({ previousY: 180, nextY: 130, hidden: true }),
    ).toEqual({ previousY: 130, hidden: false });
  });
});
