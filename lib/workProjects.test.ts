import { describe, expect, it } from "vitest";
import { workProjects } from "./workProjects";

describe("workProjects", () => {
  it("keeps project ids unique", () => {
    const ids = workProjects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains valid image metadata", () => {
    for (const project of workProjects) {
      expect(project.images.length).toBeGreaterThan(0);
      for (const image of project.images) {
        expect(image.src).toMatch(/^\/art\//);
        expect(image.alt.length).toBeGreaterThan(3);
        expect(image.width).toBeGreaterThan(0);
        expect(image.height).toBeGreaterThan(0);
      }
    }
  });

  it("contains only the three selected projects", () => {
    expect(workProjects.map((project) => project.id)).toEqual([
      "sine2000",
      "fatguy",
      "trommel",
    ]);
  });
});
