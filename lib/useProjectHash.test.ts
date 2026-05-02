import { describe, expect, test } from "vitest";
import { parseProjectHash } from "./useProjectHash";

describe("parseProjectHash", () => {
  test("returns null for empty hash", () => {
    expect(parseProjectHash("")).toBeNull();
    expect(parseProjectHash("#")).toBeNull();
  });

  test("strips the leading # and returns the id", () => {
    expect(parseProjectHash("#sine2000")).toBe("sine2000");
    expect(parseProjectHash("#misc")).toBe("misc");
  });

  test("ignores unknown ids and returns null", () => {
    expect(parseProjectHash("#nope")).toBeNull();
    expect(parseProjectHash("#about")).toBeNull();
  });

  test("is case sensitive (project ids are lowercase)", () => {
    expect(parseProjectHash("#SINE2000")).toBeNull();
  });
});
