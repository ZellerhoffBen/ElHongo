import type { Metadata } from "next";
import { ProfileLink } from "@/components/layout/ArtistProfile";
import { EyeFollowerArt } from "@/components/hero/EyeFollowerArt";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FeaturedRail } from "@/components/portfolio/FeaturedRail";
import {
  CurrentFeature,
  type CurrentFeatureData,
} from "@/components/portfolio/CurrentFeature";
import { featuredWorks } from "@/lib/featuredWorks";
import { buildMetadata, personJsonLd } from "@/lib/metadata";
import { siteInfo } from "@/lib/siteInfo";

export const metadata: Metadata = buildMetadata({
  title: `${siteInfo.alias} — ${siteInfo.artistName}`,
  description: siteInfo.description,
  path: "/",
  imageAlt: `${siteInfo.alias} — ${siteInfo.artistName}`,
});

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <main
        id="inhalt"
        className="home-snap-page tone-paper bg-paper pt-[var(--site-header-offset)] text-fg"
      >
        <section
          id="el-hongo"
          className="home-snap-panel home-snap-intro scroll-mt-[var(--site-header-offset)] border-b border-ink lg:grid lg:h-[calc(100svh-var(--site-header-offset))] lg:min-h-[calc(100svh-var(--site-header-offset))] lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:overflow-hidden"
        >
          {/*
            Below `lg` the frame is cropped horizontally and never vertically:
            the wire runs off both edges while both hands and the foot remain
            inside the frame. A fixed height did the opposite — it cut the
            figure vertically on short phones.

            The two numbers are measured off the master, not guessed. Its ink
            spans x 176..2035 of 2038, so 118% gives the drawing a closer,
            more immediate scale. That ink is also not centred — 176px of white on
            the left against 2px on the right — so a plain overscale would
            crop the right-hand wire while still showing white on the left.
            Flex centring already moves the 118%-wide frame 9% of the viewport
            to the left. The remaining 0.9% shift removes the measured white
            margin while retaining a small safety margin around the left hand.

            Height stays free, so it follows the width: near-square artwork on
            a phone is about a viewport-width tall, which leaves the name
            lockup on the first screen. From `lg` the column is fixed to the
            viewport, the bleed is bigger and symmetric cropping is fine.
          */}
          <figure className="flex items-center justify-center overflow-hidden border-b border-ink bg-white lg:h-auto lg:min-h-0 lg:border-b-0 lg:border-r">
            <EyeFollowerArt className="w-[118%] max-w-none shrink-0 -translate-x-[0.9%] lg:w-[130%] lg:translate-x-0" />
            {/* The layers are aria-hidden; this is the composition's one name. */}
            <figcaption className="sr-only">
              Comiczeichnung von EL HONGO: ein Mann, der in Stacheldraht
              festhängt. Sein Auge folgt dem Mauszeiger.
            </figcaption>
          </figure>

          {/*
            Three rows on desktop: the name sits in the middle one, flanked by two
            equal 1fr rows, so it lands on the column's true vertical centre. The
            tagline occupies the last row and is pinned to its bottom edge.
            Below lg the fr rows collapse and the gap does the spacing.
          */}
          <div className="page-x grid gap-8 py-8 sm:gap-[clamp(1.5rem,4.5svh,3.25rem)] sm:py-section-lg lg:min-h-0 lg:grid-rows-[1fr_auto_1fr] lg:gap-0 lg:py-[clamp(1rem,3.5svh,4rem)]">
            {/* Both names deliberately carry the same weight and scale: the
                real name is not secondary to the alias. */}
            <h1
              aria-label={`${siteInfo.alias} aka ${siteInfo.artistName}`}
              className="text-display-hero uppercase leading-[0.86] sm:leading-[0.74] lg:row-start-2"
            >
              <span aria-hidden="true" className="block">
                EL HONGO
              </span>
              <span
                aria-hidden="true"
                className="my-3 block text-[0.6875rem] font-normal normal-case leading-none tracking-[0.14em] text-fg-faint sm:my-4"
              >
                aka
              </span>
              <span aria-hidden="true" className="block">
                Jonas Aellig
              </span>
            </h1>

            <div className="flex flex-col items-start gap-4 sm:gap-6 lg:row-start-3 lg:gap-[clamp(1rem,2.5svh,2rem)] lg:self-end lg:pt-[clamp(0.5rem,2svh,2.5rem)]">
              <p className="max-w-[28ch] text-base font-bold leading-[1.08] tracking-[-0.02em] sm:max-w-[22ch] sm:text-lead">
                Illustrator in Zürich. Student in Hamburg. Whatever du hier
                hinschreiben willst
              </p>
              <ProfileLink />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="auswahl-title"
          className="home-snap-panel tone-ink page-x scroll-mt-[var(--site-header-offset)] bg-surface py-section text-fg sm:py-section-lg lg:grid lg:h-[calc(100svh-var(--site-header-offset))] lg:grid-rows-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:overflow-hidden lg:py-section"
        >
          <h2
            id="auswahl-title"
            className="max-w-[11ch] text-display-lg uppercase lg:self-center"
          >
            Lore Ipsume. Loremit Doloritet.
          </h2>

          <FeaturedRail works={featuredWorks} />
        </section>

        <section id="aktuell" aria-label="Aktuell">
          {currentFeatures.map((feature) => (
            <CurrentFeature key={feature.id} feature={feature} />
          ))}
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
