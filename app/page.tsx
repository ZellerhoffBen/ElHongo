import Image from "next/image";
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
    <main className="home-snap-page bg-[var(--paper)] pt-[var(--site-header-offset)] text-black">
      <section
        id="el-hongo"
        className="home-snap-panel home-snap-intro scroll-mt-[var(--site-header-offset)] border-b border-black lg:grid lg:h-[calc(100svh-var(--site-header-offset))] lg:min-h-[calc(100svh-var(--site-header-offset))] lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:overflow-hidden"
      >
        <figure className="flex min-h-[58svh] items-center justify-center overflow-hidden border-b border-black bg-white sm:min-h-[68svh] lg:min-h-0 lg:border-b-0 lg:border-r">
          <EyeFollowerArt className="w-[130%] max-w-none shrink-0" />
        </figure>

        <div className="flex min-h-[76svh] flex-col justify-between px-5 py-10 sm:px-7 sm:py-14 lg:min-h-0 lg:px-12 lg:py-16">
          <div>
            <h1
              aria-label="EL HONGO aka Jonas Aellig"
              className="mt-6 text-[clamp(3.7rem,10.4vw,11rem)] font-bold uppercase leading-[0.74] tracking-[-0.065em]"
            >
              <span aria-hidden="true" className="block">
                EL HONGO
              </span>
              <span
                aria-hidden="true"
                className="my-3 block text-[clamp(0.55rem,0.105em,1.1rem)] font-normal normal-case leading-none tracking-[0.12em] text-black/40 sm:my-4"
              >
                aka
              </span>
              <span aria-hidden="true" className="block">
                Jonas Aellig
              </span>
            </h1>
          </div>

          <p className="mt-20 max-w-[22ch] text-[clamp(1.7rem,3.6vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em]">
            Illustrator in Zürich. Student in Hamburg. Whatever du hier hinschreiben willst
          </p>
        </div>
      </section>

      <section className="home-snap-panel scroll-mt-[var(--site-header-offset)] bg-black px-5 py-12 text-white sm:px-7 sm:py-16 lg:grid lg:h-[calc(100svh-var(--site-header-offset))] lg:grid-rows-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:overflow-hidden lg:px-12 lg:py-10">
        <h2 className="max-w-[11ch] text-[clamp(3.4rem,8.5vw,9rem)] font-bold uppercase leading-[1] tracking-[-0.06em] lg:self-center lg:text-[clamp(3.4rem,6.8vw,7.5rem)] lg:leading-[0.86]">
          Lore Ipsume. Loremit Doloritet.
        </h2>

        <div className="mt-14 grid gap-px bg-white/30 p-px sm:mt-20 md:grid-cols-3 lg:mt-0 lg:min-h-0">
          {studioImages.map((image) => (
            <figure
              key={image.src}
              className="flex min-h-[58vh] items-center justify-center overflow-hidden bg-white p-6 sm:p-10 lg:min-h-0 lg:p-6"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="h-auto max-h-[70vh] w-full object-contain lg:h-full lg:max-h-full"
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
