import { describe, expect, it } from "vitest";
import { isNavItemActive, navItems } from "./navigation";

const atelier = navItems[0];
const archiv = navItems[1];

describe("navigation", () => {
  it("exposes the two pages the site actually has", () => {
    expect(navItems.map((item) => item.href)).toEqual(["/", "/archive"]);
  });

  it("marks Atelier active on the homepage", () => {
    expect(isNavItemActive(atelier, "/")).toBe(true);
    expect(isNavItemActive(archiv, "/")).toBe(false);
  });

  it("marks Archiv active on the archive and its project views", () => {
    for (const pathname of [
      "/archive",
      "/archive/",
      "/archive/sine-2000",
      "/work",
      "/work/sine2000",
    ]) {
      expect(isNavItemActive(archiv, pathname)).toBe(true);
      expect(isNavItemActive(atelier, pathname)).toBe(false);
    }
  });

  it("marks nothing active on a route the navigation does not own", () => {
    for (const pathname of ["/nicht-vorhanden", "/atelier", "/impressum"]) {
      expect(isNavItemActive(atelier, pathname)).toBe(false);
      expect(isNavItemActive(archiv, pathname)).toBe(false);
    }
  });
});
