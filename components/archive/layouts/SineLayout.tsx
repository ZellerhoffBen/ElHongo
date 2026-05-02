import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function SineLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <p className="mb-6 font-mono text-[11px] tracking-[0.05em] text-white/55">
          {project.caption}
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {project.images.map((src, i) => (
            <button
              type="button"
              key={src}
              onClick={() => onImageClick(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden border border-zinc-800 bg-black"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-opacity group-hover:opacity-90"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
