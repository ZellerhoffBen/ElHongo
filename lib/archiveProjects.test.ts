import { describe, expect, test } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { archiveProjects } from "./archiveProjects";

describe("archiveProjects", () => {
  test("contains exactly 9 projects in the spec'd order", () => {
    const ids = archiveProjects.map((p) => p.id);
    expect(ids).toEqual([
      "sine2000",
      "chinese",
      "trommel",
      "fatguy",
      "portrait",
      "bomb",
      "wimmelbilder",
      "logos",
      "misc",
    ]);
  });

  test("project ids are unique", () => {
    const ids = archiveProjects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every image path resolves to a real file under public/", () => {
    const publicDir = join(process.cwd(), "public");
    for (const project of archiveProjects) {
      expect(project.images.length).toBeGreaterThan(0);
      for (const img of project.images) {
        const path = join(publicDir, img.replace(/^\//, ""));
        expect(existsSync(path), `missing: ${img}`).toBe(true);
      }
    }
  });

  test("every project has a non-empty label and caption", () => {
    for (const p of archiveProjects) {
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.caption.length).toBeGreaterThan(0);
    }
  });
});
