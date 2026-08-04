import { describe, expect, it } from "vitest";
import { archiveProjects, findArchiveProject } from "./archiveProjects";

describe("archiveProjects", () => {
  it("keeps archive ids unique", () => {
    const ids = archiveProjects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains the three selected projects and three archive collections", () => {
    expect(archiveProjects.map((project) => project.id)).toEqual([
      "sine2000",
      "fatguy",
      "trommel",
      "wimmelbilder",
      "figuren",
      "beobachtungen",
    ]);
  });

  it("contains only usable image metadata", () => {
    for (const project of archiveProjects) {
      expect(project.images.length).toBeGreaterThan(0);
      for (const artwork of project.images) {
        expect(artwork.src).toMatch(/^\/art\//);
        expect(artwork.alt.length).toBeGreaterThan(3);
        expect(artwork.width).toBeGreaterThan(0);
        expect(artwork.height).toBeGreaterThan(0);
      }
    }
  });

  it("resolves known entries and rejects removed projects", () => {
    expect(findArchiveProject("wimmelbilder")?.title).toBe("WIMMELBILDER");
    expect(findArchiveProject("portrait")).toBeUndefined();
  });
});
