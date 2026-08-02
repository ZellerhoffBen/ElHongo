import { describe, expect, test } from "vitest";
import { getArchiveCutTransition } from "./archiveCutTransition";

describe("getArchiveCutTransition", () => {
  test("does not start a cut when the selected project is already displayed", () => {
    expect(getArchiveCutTransition("chinese", "chinese")).toBeNull();
  });

  test("plans the next displayed project and cut timing when selection changes", () => {
    expect(getArchiveCutTransition("chinese", "sine2000")).toEqual({
      nextDisplayedId: "chinese",
      fadeMs: 60,
      holdMs: 80,
      totalMs: 140,
    });
  });
});
