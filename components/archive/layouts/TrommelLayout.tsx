import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

export function TrommelLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-[900px] px-6 pb-24 pt-12">
        <p className="mb-12 text-center font-['Impact','Anton',sans-serif] text-sm tracking-[0.18em] text-white">
          {project.caption}
        </p>
        <div className="flex flex-col items-center gap-20">
          {project.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onImageClick(i)}
              className="relative block w-full max-w-[640px]"
            >
              {/* spotlight halo */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -m-32"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)",
                }}
              />
              <div className="relative aspect-square w-full">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
