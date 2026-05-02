import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

const grainSvg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
       <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter>
       <rect width='100%' height='100%' filter='url(#n)' opacity='0.6'/>
     </svg>`,
  );

export function BombLayout({ project, onImageClick }: Props) {
  return (
    <div className="relative bg-[#f0e7d4]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${grainSvg}")`,
          backgroundSize: "160px 160px",
          opacity: 0.06,
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative mx-auto max-w-[720px] px-6 py-12">
        <div className="flex flex-col gap-1">
          {project.images.map((src, i) => (
            <button
              type="button"
              key={src}
              onClick={() => onImageClick(i)}
              className="relative block w-full border-4 border-black"
            >
              <div className="relative aspect-[3/4] w-full bg-black">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="720px"
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-right font-['Impact','Anton',sans-serif] text-sm italic tracking-wider">
          {project.caption}
        </p>
      </div>
    </div>
  );
}
