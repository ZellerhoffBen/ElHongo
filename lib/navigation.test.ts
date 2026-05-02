import { describe, expect, test } from "vitest";
import { mainNavigation } from "./navigation";

describe("mainNavigation", () => {
  test("contains the portfolio sections in display order", () => {
    expect(mainNavigation).toEqual([
      { label: "ARCHIVE", href: "/archive" },
      { label: "SERVICE", href: "/service" },
      { label: "ABOUT", href: "/about" },
    ]);
  });
});
