export type WorkImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  documentation?: boolean;
};

export type WorkProject = {
  /** Stable data key. Also the legacy `/archive#<id>` fragment. */
  id: string;
  /** URL segment under `/archive/`. The canonical identity of a project. */
  slug: string;
  number: string;
  title: string;
  year?: string;
  medium: string;
  kind: "Freie Arbeit" | "Objekt" | "Serie" | "Sammlung";
  summary: string;
  tone: "paper" | "ink" | "color";
  previewImageIndex?: number;
  images: WorkImage[];
};

const image = (
  src: string,
  width: number,
  height: number,
  alt: string,
  documentation = false,
): WorkImage => ({ src, width, height, alt, documentation });

export const workProjects: WorkProject[] = [
  {
    id: "sine2000",
    slug: "sine-2000",
    number: "01",
    title: "SINE 2000",
    year: "2000",
    medium: "Scratchboard / Zeichnung",
    kind: "Serie",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sitLorem ipsum dolor sit amet.", 
    tone: "ink",
    images: [
      image("/art/sine2000/sine2000-01.png", 2066, 1580, "Schwarz-weisse Stadtlandschaft mit einer riesigen Figur"),
      image("/art/sine2000/sine2000-02.png", 2056, 1552, "Schwarz-weisses Porträt in der Serie SINE 2000"),
      image("/art/sine2000/sine2000-03.png", 2060, 1584, "Urbane Szene aus der Serie SINE 2000"),
      image("/art/sine2000/sine2000-04.png", 2066, 1584, "Figuren in einer dunklen gezeichneten Stadtszene"),
      image("/art/sine2000/sine2000-05.png", 2066, 1572, "Scratchboard-Zeichnung aus SINE 2000"),
      image("/art/sine2000/sine2000-06.png", 2068, 1566, "Dunkle Stadtzeichnung aus SINE 2000"),
      image("/art/sine2000/sine2000-07.png", 2074, 1578, "Schwarz-weisse Figurenszene aus SINE 2000"),
      image("/art/sine2000/sine2000-08.png", 2064, 1526, "Letzte Zeichnung der Serie SINE 2000"),
    ],
  },
  {
    id: "fatguy",
    slug: "fat-guy",
    number: "02",
    title: "FAT GUY",
    medium: "Zeichnung / Farbe",
    kind: "Freie Arbeit",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur.",
    tone: "color",
    images: [
      image("/art/fatguy/fatguyfrontback-01.png", 1816, 1974, "Groteske farbige Figur von vorne"),
      image("/art/fatguy/fatguyfrontback-02.png", 1866, 1890, "Groteske farbige Figur von hinten"),
    ],
  },
  {
    id: "trommel",
    slug: "trommel",
    number: "03",
    title: "TROMMEL",
    medium: "Acryl auf Trommelfell",
    kind: "Objekt",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tone: "ink",
    previewImageIndex: 1,
    images: [
      image("/art/trommel/trommel-01.png", 2066, 2070, "Bemaltes Trommelfell auf schwarzem Hintergrund"),
      image("/art/trommel/trommel-02.png", 1934, 1380, "Trommel mit zwei Sticks während des Spielens", true),
      image("/art/trommel/trommel-03.png", 1980, 1354, "Dokumentation der bemalten Trommel", true),
    ],
  },
];
