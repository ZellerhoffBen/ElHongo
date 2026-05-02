import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function FatGuyLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-[#0e2a1c]">
      <h2 className="px-6 pt-8 font-['Arial_Black',sans-serif] text-3xl tracking-tight text-white sm:text-5xl">
        {project.caption}
      </h2>
      <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
        {project.images.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => onImageClick(i)}
            className="relative block aspect-[3/4] w-full overflow-hidden"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
