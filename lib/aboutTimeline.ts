export type AboutTimelineEntry = {
  year: number;
  title: string;
  body: string;
  tags: string[];
};

export type CurrentPracticeItem = {
  label: string;
  value: string;
};

export const currentPracticeItems: CurrentPracticeItem[] = [
  { label: "BASED", value: "studio / street / screen" },
  { label: "WORKING ON", value: "drawings, characters, identity systems" },
  { label: "AVAILABLE FOR", value: "commissions, murals, logos, print work" },
  { label: "METHOD", value: "ink first, polish later" },
];

export const aboutTimeline: AboutTimelineEntry[] = [
  {
    year: 2026,
    title: "current studio orbit",
    body: "New characters, dense crowd scenes, client marks, and a growing archive of black-line drawings.",
    tags: ["now", "studio", "archive"],
  },
  {
    year: 2024,
    title: "commercial marks without losing the hand",
    body: "Logo and identity work moves into the same world as the drawings: sharp, legible, a little unstable.",
    tags: ["logos", "service", "identity"],
  },
  {
    year: 2020,
    title: "crowds, jokes, pressure",
    body: "The pictures get busier: city scenes, packed rooms, little disasters, people doing too much at once.",
    tags: ["wimmelbilder", "comic", "color"],
  },
  {
    year: 2000,
    title: "scratchboard city panic",
    body: "High-contrast city drawings, strange faces, and scratched night architecture form an early visual vocabulary.",
    tags: ["sine_2000", "black", "white"],
  },
  {
    year: 1997,
    title: "the first monster pile",
    body: "Old sketchbooks, handmade creatures, and private jokes become the raw material everything else keeps returning to.",
    tags: ["oldest", "ink", "paper"],
  },
];
