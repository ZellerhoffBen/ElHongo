import Image from "next/image";
import Link from "next/link";
import { EyeFollowerArt } from "@/components/EyeFollowerArt";
import { SiteFooter } from "@/components/SiteFooter";
import { workProjects, type WorkProject } from "@/lib/workProjects";

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

type FeaturedProjectProps = {
  project: WorkProject;
  index: number;
  fillsPanel?: boolean;
};

function FeaturedProject({
  project,
  index,
  fillsPanel = false,
}: FeaturedProjectProps) {
  const cover = project.id === "trommel" ? project.images[1] : project.images[0];
  const inverse = project.tone === "ink";
  const imageFirst = index % 2 === 1;

  return (
    <Link
      href={`/archive#${project.id}`}
      className={[
        "group grid border-b border-black md:grid-cols-2",
        fillsPanel
          ? "min-h-[62vh] lg:h-full lg:min-h-0"
          : "min-h-[62vh]",
        inverse ? "bg-black text-white" : "bg-[var(--paper)] text-black",
      ].join(" ")}
    >
      <div
        className={[
          "flex min-h-0 flex-col justify-between gap-12 p-5 sm:p-7 lg:p-10",
          imageFirst ? "md:order-2" : "",
        ].join(" ")}
      >
        <div className="flex justify-between gap-5">
          <span
            className={
              inverse ? "work-number text-white/50" : "work-number text-black/45"
            }
          >
            {project.number}
          </span>
          <span
            className={
              inverse
                ? "work-kicker text-right text-white/50"
                : "work-kicker text-right text-black/50"
            }
          >
            {project.year ? `${project.year} · ` : ""}
            {project.medium}
          </span>
        </div>

        <div>
          <h3 className="max-w-[10ch] text-[clamp(3.3rem,8vw,8.5rem)] font-bold uppercase leading-[0.76] tracking-[-0.06em]">
            {project.title}
          </h3>
          <p
            className={
              inverse
                ? "mt-7 max-w-xl text-sm leading-relaxed text-white/60"
                : "mt-7 max-w-xl text-sm leading-relaxed text-black/60"
            }
          >
            {project.summary}
          </p>
          <span className="work-open-link mt-8">Projekt ansehen ↗</span>
        </div>
      </div>

      <div
        className={[
          "relative min-h-[54vh] overflow-hidden lg:min-h-0",
          inverse ? "bg-black" : "bg-white",
          imageFirst ? "md:order-1" : "",
        ].join(" ")}
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className={[
            "transition-transform duration-500 ease-out group-hover:scale-[1.015]",
            project.id === "trommel"
              ? "object-cover"
              : "object-contain p-5 sm:p-8",
          ].join(" ")}
        />
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="home-snap-page bg-[var(--paper)] pt-[var(--site-header-offset)] text-black">
      <section
        id="el-hongo"
        className="home-snap-panel scroll-mt-[var(--site-header-offset)] border-b border-black lg:grid lg:h-[calc(100svh-var(--site-header-offset))] lg:min-h-[calc(100svh-var(--site-header-offset))] lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:overflow-hidden"
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

      <section
        id="arbeiten"
        className="scroll-mt-[var(--site-header-offset)] border-t border-black"
      >
        <div className="home-snap-panel scroll-mt-[var(--site-header-offset)] lg:grid lg:h-[calc(100svh-var(--site-header-offset))] lg:grid-rows-[auto_minmax(0,1fr)] lg:overflow-hidden">
          <header className="flex items-end justify-between gap-8 border-b border-black px-5 py-8 sm:px-7 sm:py-10 lg:px-12 lg:py-7">
            <div>
              <p className="work-kicker text-black/50">Ausgewählte Arbeiten</p>
              <h2 className="mt-3 text-[clamp(2.2rem,5.8vw,6.4rem)] font-bold uppercase leading-none tracking-[-0.05em]">
                Drei Projekte
              </h2>
            </div>
            <span className="work-number text-black/45">01—03</span>
          </header>

          <FeaturedProject project={workProjects[0]} index={0} fillsPanel />
        </div>

        {workProjects.slice(1).map((project, index) => (
          <FeaturedProject
            key={project.id}
            project={project}
            index={index + 1}
          />
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
