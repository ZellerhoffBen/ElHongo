import { image, workProjects, type WorkProject } from "./workProjects";

const archiveCollections: WorkProject[] = [
  {
    id: "wimmelbilder",
    slug: "wimmelbilder",
    number: "04",
    title: "WIMMELBILDER",
    medium: "Tinte / Digital",
    kind: "Serie",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tone: "color",
    previewImageIndex: 2,
    images: [
      image("/art/wimmelbilder/wimmelbilder-01.png", 2070, 1422, "Dicht bevölkerte farbige Stadtszene"),
      image("/art/wimmelbilder/wimmelbilder-02.png", 2070, 1422, "Detailreiches farbiges Wimmelbild"),
      image("/art/wimmelbilder/wimmelbilder-03.png", 2064, 1422, "Farbige Stadt mit zahlreichen Figuren"),
      image("/art/wimmelbilder/wimmelbilder-04.png", 2070, 1422, "Breite Illustration voller kleiner Szenen"),
      image("/art/wimmelbilder/wimmelbilder-05.png", 2074, 1416, "Detailreiches Panorama von EL HONGO"),
      image("/art/wimmelbilder/wimmelbilder-06.png", 2066, 1416, "Farbige Menschenmenge in einer breiten Szene"),
      image("/art/wimmelbilder/wimmelbilder-07.png", 2066, 1390, "Wimmelbild mit zahlreichen Figuren"),
    ],
  },
  {
    id: "figuren",
    slug: "figuren",
    number: "05",
    title: "FIGUREN",
    medium: "Zeichnung / Farbe",
    kind: "Sammlung",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tone: "paper",
    images: [
      image("/art/misc/misc-01.png", 1924, 2074, "Zwei farbige Figuren in weiter Kleidung"),
      image("/art/misc/misc-02.png", 2068, 2052, "Farbige Charakterillustration"),
      image("/art/misc/misc-03.png", 2062, 1506, "Groteske farbige Szene"),
      image("/art/misc/misc-04.png", 2054, 1628, "Illustration aus dem offenen Archiv"),
      image("/art/misc/misc-05.png", 1938, 2068, "Gezeichnete Figur von EL HONGO"),
      image("/art/misc/misc-06.png", 1716, 2066, "Farbige Figur aus dem offenen Archiv"),
      image("/art/misc/misc-07.png", 2064, 1996, "Menschliche Figur in einer Glasflasche"),
      image("/art/misc/misc-08.png", 2060, 2070, "Groteske Charakterzeichnung"),
      image("/art/misc/misc-09.png", 1638, 2070, "Illustration einer Figur"),
      image("/art/misc/misc-10.png", 2060, 1936, "Farbige Zeichnung aus dem Archiv"),
      image("/art/misc/misc-11.png", 1952, 2058, "Charakterillustration von EL HONGO"),
      image("/art/misc/misc-12.png", 2038, 2000, "Mann, der in Stacheldraht gefangen ist"),
      image("/art/misc/misc-13.png", 1554, 2068, "Anatomische Kopfzeichnung mit Schrift"),
      image("/art/misc/misc-14.png", 1884, 2048, "Stürzende gezeichnete Figur"),
      image("/art/misc/misc-16.png", 2074, 2060, "Illustration aus dem offenen Archiv"),
      image("/art/misc/misc-17.png", 2072, 1560, "Breite farbige Illustration"),
      image("/art/misc/misc-18.png", 1896, 2058, "Groteskes Gesicht mit Stachelhelm"),
      image("/art/misc/misc-19.png", 1892, 2060, "Zwei Figuren an einem Fenster"),
      image("/art/misc/misc-21.png", 1650, 2054, "Charakterzeichnung von EL HONGO"),
      image("/art/misc/misc-23.png", 2066, 2030, "Farbige Figurenzeichnung"),
    ],
  },
  {
    id: "beobachtungen",
    slug: "beobachtungen",
    number: "06",
    title: "BEOBACHTUNGEN",
    medium: "Stift / Dokumentation",
    kind: "Sammlung",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tone: "paper",
    images: [
      image("/art/chinese/chineseguys-01.png", 1604, 2062, "Zeichnung zweier älterer Männer"),
      { ...image("/art/chinese/chineseguys-02.png", 1622, 2066, "Fotografische Referenz mit zwei älteren Männern"), documentation: true },
    ],
  },
];

export const archiveProjects: WorkProject[] = [
  ...workProjects,
  ...archiveCollections,
];

export const findArchiveProject = (slug: string): WorkProject | undefined =>
  archiveProjects.find((project) => project.slug === slug);

/**
 * Resolves the pre-route identifiers — `/archive#fatguy` and `/work/fatguy` —
 * onto today's canonical slug, so old links and shares keep landing on the
 * project they named.
 */
export const resolveLegacyProjectId = (id: string): WorkProject | undefined => {
  const decoded = id.trim().toLowerCase();
  return archiveProjects.find(
    (project) => project.id === decoded || project.slug === decoded,
  );
};

/** Register order is the browse order, so next/previous follow it. */
export const getProjectNeighbours = (slug: string) => {
  const index = archiveProjects.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };

  return {
    previous:
      archiveProjects[(index - 1 + archiveProjects.length) % archiveProjects.length],
    next: archiveProjects[(index + 1) % archiveProjects.length],
  };
};

export const getProjectCover = (project: WorkProject) =>
  project.images[project.previewImageIndex ?? 0] ?? project.images[0];
