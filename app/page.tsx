import Image from "next/image";
import { ProfileLink } from "@/components/ArtistProfile";
import { EyeFollowerArt } from "@/components/EyeFollowerArt";
import { SiteFooter } from "@/components/SiteFooter";
import {
  CurrentFeature,
  type CurrentFeatureData,
} from "@/components/portfolio/CurrentFeature";

const studioImages = [
  {
    src: "/art/misc/misc-14.png",
    alt: "Gezeichnete Figur, die kopfüber auf den Boden fällt",
    width: 1884,
    height: 2048,
  },
  {
    src: "/art/misc/misc-13.png",
    alt: "Anatomische Kopfzeichnung mit dem Text Lobotomize Everybody",
    width: 1554,
    height: 2068,
  },
  {
    src: "/art/misc/misc-18.png",
    alt: "Groteskes Gesicht mit Stachelhelm",
    width: 1896,
    height: 2058,
  },
];

const currentFeatures: CurrentFeatureData[] = [
  {
    id: "status-tinnitus",
    number: "01",
    eyebrow: "Ausstellung",
    status: "20 Okt 2026",
    title: "Status Tinnitus",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet risus eget mauris posuere interdum.",
    details: [
      {
        label: "Wann",
        value: "20.10.2026 · 18:00",
        dateTime: "2026-10-20T18:00:00+02:00",
      },
      {
        label: "Wo",
        value: "Musterstrasse 6 · 8006 Zürich",
      },
    ],
    image: {
      src: "/art/current/status-tinnitus.png",
      alt: "Ausstellungsplakat Status Tinnitus",
      aspect: "portrait",
    },
    tone: "paper",
    mediaSide: "right",
    mediaInset: true,
  },
  {
    id: "randwelten",
    number: "02",
    eyebrow: "Aktuelles Projekt",
    status: "In Arbeit",
    title: "Randwelten",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae arcu at neque faucibus fermentum.",
    details: [
      {
        label: "Jahr",
        value: "2025",
      },
      {
        label: "Ort",
        value: "ZHdK",
      },
      {
        label: "Format",
        value: "Abschlussprojekt Propädeutikum",
      },
    ],
    image: {
      src: "/art/current/randwelten.png",
      alt: "Präsentation des Projekts Randwelten an der ZHdK",
      aspect: "landscape",
    },
    tone: "ink",
    mediaSide: "left",
    mediaInset: true,
  },
];

export default function Home() {
  return (
    <main
      id="inhalt"
      className="home-snap-page tone-paper bg-paper pt-[var(--site-header-offset)] text-fg"
    >
      <section
        id="el-hongo"
        className="home-snap-panel home-snap-intro scroll-mt-[var(--site-header-offset)] border-b border-ink lg:grid lg:h-[calc(100svh-var(--site-header-offset))] lg:min-h-[calc(100svh-var(--site-header-offset))] lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:overflow-hidden"
      >
        <figure className="flex min-h-[58svh] items-center justify-center overflow-hidden border-b border-ink bg-white sm:min-h-[68svh] lg:min-h-0 lg:border-b-0 lg:border-r">
          <EyeFollowerArt className="w-[130%] max-w-none shrink-0" />
        </figure>

        {/*
          Three rows on desktop: the name sits in the middle one, flanked by two
          equal 1fr rows, so it lands on the column's true vertical centre. The
          tagline occupies the last row and is pinned to its bottom edge.
          Below lg the fr rows collapse and the gap does the spacing.
        */}
        <div className="page-x grid gap-[clamp(1.75rem,5svh,3.25rem)] py-section sm:py-section-lg lg:min-h-0 lg:grid-rows-[1fr_auto_1fr] lg:gap-0 lg:py-[clamp(1rem,3.5svh,4rem)]">
          <h1
            aria-label="EL HONGO aka Jonas Aellig"
            className="text-display-hero uppercase lg:row-start-2"
          >
            <span aria-hidden="true" className="block">
              EL HONGO
            </span>
            <span
              aria-hidden="true"
              className="my-3 block text-[0.6875rem] font-normal normal-case leading-none tracking-[0.18em] text-fg-faint sm:my-4"
            >
              aka
            </span>
            <span aria-hidden="true" className="block">
              Jonas Aellig
            </span>
          </h1>

          <div className="flex flex-col items-start gap-6 lg:row-start-3 lg:gap-[clamp(1rem,2.5svh,2rem)] lg:self-end lg:pt-[clamp(0.5rem,2svh,2.5rem)]">
            <p className="max-w-[22ch] text-lead">
              Illustrator in Zürich. Student in Hamburg. Whatever du hier hinschreiben willst
            </p>
            <ProfileLink />
          </div>
        </div>
      </section>

      <section className="home-snap-panel tone-ink page-x scroll-mt-[var(--site-header-offset)] bg-surface py-section text-fg sm:py-section-lg lg:grid lg:h-[calc(100svh-var(--site-header-offset))] lg:grid-rows-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:overflow-hidden lg:py-section">
        <h2 className="max-w-[11ch] text-display-lg uppercase lg:self-center">
          Lore Ipsume. Loremit Doloritet.
        </h2>

        {/*
          Below lg this is a swipeable rail of panels rather than a stack of
          near-empty boxes — the artwork fills its frame at every width and the
          "spread" pacing of the desktop layout survives on touch devices.
        */}
        <div
          role="region"
          aria-label="Ausgewählte Blätter"
          tabIndex={0}
          className="studio-rail page-x-bleed mt-section-sm flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:mt-section sm:gap-4 sm:px-7 lg:mt-0 lg:grid lg:min-h-0 lg:grid-cols-3 lg:gap-px lg:overflow-visible lg:bg-rule-soft lg:p-px"
        >
          {studioImages.map((image) => (
            <figure
              key={image.src}
              className="flex aspect-[4/5] w-[78%] shrink-0 snap-center items-center justify-center overflow-hidden border border-rule-soft bg-white p-5 sm:w-[58%] sm:p-8 lg:aspect-auto lg:w-auto lg:shrink lg:border-0 lg:p-6"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 33vw, 78vw"
                className="h-full w-full object-contain"
              />
            </figure>
          ))}
        </div>
      </section>

      <section id="aktuell" aria-label="Aktuell">
        {currentFeatures.map((feature) => (
          <CurrentFeature key={feature.id} feature={feature} />
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
