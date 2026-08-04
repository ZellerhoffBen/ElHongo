import Image from "next/image";
import type { WorkImage, WorkProject } from "@/lib/workProjects";

type ProjectGalleryProps = {
  project: WorkProject;
};

function Artwork({ image, sizes }: { image: WorkImage; sizes: string }) {
  return (
    <figure className="relative">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-auto w-full"
      />
      {image.documentation ? (
        <figcaption className="work-kicker mt-3 text-current opacity-50">
          Dokumentation
        </figcaption>
      ) : null}
    </figure>
  );
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const [lead, ...rest] = project.images;
  const inverse = project.tone === "ink";
  const pairs: WorkImage[][] = [];

  for (let index = 0; index < rest.length; index += 2) {
    pairs.push(rest.slice(index, index + 2));
  }

  return (
    <div className={inverse ? "bg-black text-white" : "bg-[var(--paper)] text-black"}>
      <div className="px-5 py-8 sm:px-7 sm:py-12 lg:px-12 lg:py-16">
        <div
          className={[
            "mx-auto",
            lead.width / lead.height < 0.9 ? "max-w-[820px]" : "max-w-[1380px]",
          ].join(" ")}
        >
          <Artwork image={lead} sizes="(min-width: 1440px) 1380px, 94vw" />
        </div>
      </div>

      {pairs.map((pair, pairIndex) => {
        const solo = pair.length === 1;
        const reversed = pairIndex % 2 === 1;

        return (
          <section
            key={`${pair[0].src}-${pairIndex}`}
            className="border-t border-current px-5 py-12 sm:px-7 sm:py-20 lg:px-12 lg:py-28"
          >
            <div
              className={[
                "mx-auto grid max-w-[1380px] gap-10 lg:gap-16",
                solo ? "grid-cols-1" : "md:grid-cols-2",
                reversed ? "md:[&>*:first-child]:translate-y-20" : "md:[&>*:last-child]:translate-y-20",
              ].join(" ")}
            >
              {pair.map((item) => (
                <div
                  key={item.src}
                  className={solo ? (pairIndex % 2 === 0 ? "max-w-[920px]" : "ml-auto max-w-[920px]") : ""}
                >
                  <Artwork
                    image={item}
                    sizes={solo ? "(min-width: 1024px) 920px, 92vw" : "(min-width: 768px) 46vw, 92vw"}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
