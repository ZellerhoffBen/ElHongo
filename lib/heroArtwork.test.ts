import { describe, expect, it } from "vitest";
import { heroAssets } from "./heroAssets.generated";
import {
  ARTWORK_SIZE,
  ARTWORK_WIDTHS,
  FALLBACK_WIDTH,
  SOCKET_WINDOW,
  getPupilTravelBounds,
  socketWindowStyle,
} from "./heroArtwork";

describe("socket window", () => {
  const travel = getPupilTravelBounds();

  it("contains the pupil's entire travel", () => {
    // If this fails the pupil escapes the mask and floats over the drawing.
    // Widen SOCKET_WINDOW and re-run `npm run build:hero`.
    expect(travel.left).toBeGreaterThanOrEqual(SOCKET_WINDOW.left);
    expect(travel.top).toBeGreaterThanOrEqual(SOCKET_WINDOW.top);
    expect(travel.right).toBeLessThanOrEqual(
      SOCKET_WINDOW.left + SOCKET_WINDOW.width,
    );
    expect(travel.bottom).toBeLessThanOrEqual(
      SOCKET_WINDOW.top + SOCKET_WINDOW.height,
    );
  });

  it("stays inside the artwork", () => {
    expect(SOCKET_WINDOW.left + SOCKET_WINDOW.width).toBeLessThanOrEqual(
      ARTWORK_SIZE.width,
    );
    expect(SOCKET_WINDOW.top + SOCKET_WINDOW.height).toBeLessThanOrEqual(
      ARTWORK_SIZE.height,
    );
  });

  it("positions the crop at the same fraction of the frame it was cut from", () => {
    expect(socketWindowStyle).toEqual({
      left: `${(SOCKET_WINDOW.left / ARTWORK_SIZE.width) * 100}%`,
      top: `${(SOCKET_WINDOW.top / ARTWORK_SIZE.height) * 100}%`,
      width: `${(SOCKET_WINDOW.width / ARTWORK_SIZE.width) * 100}%`,
      height: `${(SOCKET_WINDOW.height / ARTWORK_SIZE.height) * 100}%`,
    });
  });
});

describe("responsive ladder", () => {
  it("never asks for more pixels than the master holds", () => {
    for (const width of ARTWORK_WIDTHS) {
      expect(width).toBeLessThanOrEqual(ARTWORK_SIZE.width);
    }
  });

  it("ascends, so the browser can pick by width descriptor", () => {
    const sorted = [...ARTWORK_WIDTHS].sort((a, b) => a - b);
    expect([...ARTWORK_WIDTHS]).toEqual(sorted);
    expect(new Set(ARTWORK_WIDTHS).size).toBe(ARTWORK_WIDTHS.length);
  });

  it("includes the fallback width, so the <img src> is a real rung", () => {
    expect(ARTWORK_WIDTHS).toContain(FALLBACK_WIDTH);
  });
});

describe("generated asset manifest", () => {
  // Guards against a stale `heroAssets.generated.ts`: if the ladder changes and
  // `npm run build:hero` is not re-run, the component ships URLs for files that
  // no longer exist.
  const parse = (srcSet: string) =>
    srcSet.split(", ").map((candidate) => {
      const [url, descriptor] = candidate.split(" ");
      return { url, width: Number.parseInt(descriptor, 10) };
    });

  it.each(["avifSrcSet", "webpSrcSet"] as const)(
    "%s covers exactly the declared ladder",
    (key) => {
      const candidates = parse(heroAssets[key]);
      expect(candidates.map((candidate) => candidate.width)).toEqual([
        ...ARTWORK_WIDTHS,
      ]);
    },
  );

  it("content-addresses every file, so /hero/* is safe to cache immutably", () => {
    const urls = [
      ...parse(heroAssets.avifSrcSet).map((candidate) => candidate.url),
      ...parse(heroAssets.webpSrcSet).map((candidate) => candidate.url),
      heroAssets.fallback,
      heroAssets.socketMask,
      heroAssets.pupil,
    ];

    for (const url of urls) {
      expect(url).toMatch(/^\/hero\/[a-z-]+(?:-\d+)?\.[0-9a-f]{8}\.(?:avif|webp|png)$/);
    }
    expect(new Set(urls).size).toBe(urls.length);
  });
});
