import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function PortraitLayout({ project, onImageClick }: Props) {
  return (
    <div className="min-h-[80vh] bg-white">
      <div className="mx-auto max-w-[1100px] px-8 pt-32">
        <h2 className="mb-24 text-center font-serif text-3xl font-light italic tracking-tight">
          portrait, untitled.
        </h2>
        <div className="flex flex-wrap justify-center gap-32">
          {project.images.map((src, i) => (
            <button
              type="button"
              key={src}
              onClick={() => onImageClick(i)}
              className="block"
              style={{
                marginTop: i % 2 === 0 ? "0px" : "120px",
              }}
            >
              <div className="relative h-[240px] w-[180px]">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
        <p className="mt-32 text-center font-serif text-[11px] italic text-black/45">
          {project.caption}
        </p>
      </div>
    </div>
  );
}
