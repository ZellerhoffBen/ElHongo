export type LayoutId =
  | "sine"
  | "chinese"
  | "trommel"
  | "fatguy"
  | "portrait"
  | "bomb"
  | "wimmel"
  | "logos"
  | "misc";

export type ArchiveProject = {
  id: string;
  label: string;
  layout: LayoutId;
  /** Tailwind / inline classes applied to this project's chip in the chip bar. */
  chipClassName: string;
  /** Image paths relative to the site root, e.g. /art/sine2000/sine2000-01.png */
  images: string[];
  caption: string;
};

const range = (prefix: string, n: number, ext = "png"): string[] =>
  Array.from({ length: n }, (_, i) =>
    `${prefix}-${String(i + 1).padStart(2, "0")}.${ext}`,
  );

export const archiveProjects: ArchiveProject[] = [
  {
    id: "sine2000",
    label: "SINE_2000",
    layout: "sine",
    chipClassName: "font-mono tracking-tight",
    images: range("sine2000", 8).map((f) => `/art/sine2000/${f}`),
    caption: "// SCRATCHBOARD · BERLIN, 2000 · 8 WORKS",
  },
  {
    id: "chinese",
    label: "Chinese",
    layout: "chinese",
    chipClassName: "font-serif italic",
    images: range("chineseguys", 2).map((f) => `/art/chinese/${f}`),
    caption: "pen on paper · 2 works",
  },
  {
    id: "trommel",
    label: "TROMMEL",
    layout: "trommel",
    chipClassName: "font-['Impact','Anton',sans-serif] tracking-normal",
    images: range("trommel", 3).map((f) => `/art/trommel/${f}`),
    caption: "TROMMEL · ACRYLIC ON DRUM HEAD · 3 PIECES",
  },
  {
    id: "fatguy",
    label: "FAT GUY",
    layout: "fatguy",
    chipClassName: "font-['Arial_Black',sans-serif] tracking-tight",
    images: range("fatguyfrontback", 2).map((f) => `/art/fatguy/${f}`),
    caption: "FAT GUY · FRONT / BACK",
  },
  {
    id: "portrait",
    label: "portrait",
    layout: "portrait",
    chipClassName: "font-serif font-light italic tracking-wide normal-case",
    images: range("portrait", 2).map((f) => `/art/portrait/${f}`),
    caption: "stippled ink on paper · untitled, untitled.",
  },
  {
    id: "bomb",
    label: "BOMB!",
    layout: "bomb",
    chipClassName: "font-['Impact','Anton',sans-serif] tracking-normal",
    images: range("comicbh", 4).map((f) => `/art/bombcomic/${f}`),
    caption: "BOMB! · 4 PANELS · TIK TIK TIK…",
  },
  {
    id: "wimmelbilder",
    label: "Wimmelbilder",
    layout: "wimmel",
    chipClassName: "font-serif normal-case",
    images: range("wimmelbilder", 7).map((f) => `/art/wimmelbilder/${f}`),
    caption: "WIMMELBILDER · INK + DIGITAL · 7 WORKS",
  },
  {
    id: "logos",
    label: "LOGOS",
    layout: "logos",
    chipClassName: "font-bold tracking-[0.18em]",
    images: range("logos", 2).map((f) => `/art/logos/${f}`),
    caption: "COMMERCIAL WORK · 2 IDENTITIES",
  },
  {
    id: "misc",
    label: "misc.",
    layout: "misc",
    chipClassName: "font-serif italic normal-case",
    images: range("misc", 24).map((f) => `/art/misc/${f}`),
    caption: "misc. — 24 things, in no particular order.",
  },
];

export const findProject = (id: string | null | undefined): ArchiveProject | null =>
  archiveProjects.find((p) => p.id === id) ?? null;
