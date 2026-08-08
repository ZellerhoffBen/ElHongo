import Image from "next/image";
import type { WorkImage, WorkProject } from "@/lib/workProjects";

type ProjectGalleryProps = {
  project: WorkProject;
};

function Artwork({
  image,
  sizes,
  index,
  total,
}: {
  image: WorkImage;
  sizes: string;
  index: number;
  total: number;
}) {
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
      {/* Catalogue numbering: the register promises N Bilder, the plates confirm it. */}
      <figcaption className="kicker mt-3 flex items-baseline justify-between gap-4 text-fg-faint">
        <span>
          Bild {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {image.documentation ? <span>Dokumentation</span> : null}
      </figcaption>
    </figure>
  );
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const [lead, ...rest] = project.images;
  const total = project.images.length;
  const pairs: WorkImage[][] = [];

  for (let index = 0; index < rest.length; index += 2) {
    pairs.push(rest.slice(index, index + 2));
  }

  return (
    <div
      className={[
        "bg-surface text-fg",
        project.tone === "ink" ? "tone-ink" : "tone-paper",
      ].join(" ")}
    >
      <div className="page-x py-section-sm sm:py-section lg:py-section-lg">
        <div
          className={[
            "mx-auto",
            lead.width / lead.height < 0.9 ? "max-w-[820px]" : "max-w-[1380px]",
          ].join(" ")}
        >
          <Artwork
            image={lead}
            sizes="(min-width: 1440px) 1380px, 94vw"
            index={1}
            total={total}
          />
        </div>
      </div>

      {pairs.map((pair, pairIndex) => {
        const solo = pair.length === 1;
        const reversed = pairIndex % 2 === 1;

        return (
          <section
            key={`${pair[0].src}-${pairIndex}`}
            className="page-x border-t border-rule-soft py-section sm:py-section-lg lg:py-section-xl"
          >
            <div
              className={[
                "mx-auto grid max-w-[1380px] gap-10 lg:gap-16",
                solo ? "grid-cols-1" : "md:grid-cols-2",
                reversed
                  ? "md:[&>*:first-child]:translate-y-20"
                  : "md:[&>*:last-child]:translate-y-20",
              ].join(" ")}
            >
              {pair.map((item, itemIndex) => (
                <div
                  key={item.src}
                  className={
                    solo
                      ? pairIndex % 2 === 0
                        ? "max-w-[920px]"
                        : "ml-auto max-w-[920px]"
                      : ""
                  }
                >
                  <Artwork
                    image={item}
                    sizes={
                      solo
                        ? "(min-width: 1024px) 920px, 92vw"
                        : "(min-width: 768px) 46vw, 92vw"
                    }
                    index={2 + pairIndex * 2 + itemIndex}
                    total={total}
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
