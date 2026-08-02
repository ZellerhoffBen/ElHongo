import { describe, expect, test } from "vitest";
import { aboutTimeline, currentPracticeItems } from "./aboutTimeline";

describe("aboutTimeline", () => {
  test("lists timeline entries from newest to oldest for bottom-to-top reading", () => {
    const years = aboutTimeline.map((entry) => entry.year);
    const sortedDescending = [...years].sort((a, b) => b - a);

    expect(years).toEqual(sortedDescending);
  });

  test("keeps every timeline entry display-ready", () => {
    for (const entry of aboutTimeline) {
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.body.length).toBeGreaterThan(0);
      expect(entry.tags.length).toBeGreaterThan(0);
    }
  });

  test("has concise current practice labels", () => {
    expect(currentPracticeItems.length).toBeGreaterThanOrEqual(3);

    for (const item of currentPracticeItems) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.value.length).toBeGreaterThan(0);
    }
  });
});
