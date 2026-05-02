import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function ChineseLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-[#f4efe6] py-16">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-8 md:grid-cols-2 md:gap-16">
        {project.images.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => onImageClick(i)}
            className="block w-full"
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </button>
        ))}
      </div>
      <p className="mt-12 text-center font-serif text-[11px] italic text-black/55">
        {project.caption}
      </p>
    </div>
  );
}
