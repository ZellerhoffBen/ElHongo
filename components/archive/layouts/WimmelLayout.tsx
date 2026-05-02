import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

/**
 * Splits the images into rows of 3 or 4 alternating, full-bleed strips.
 */
function chunkAlternating(images: string[]): string[][] {
  const rows: string[][] = [];
  let i = 0;
  let take = 3;
  while (i < images.length) {
    rows.push(images.slice(i, i + take));
    i += take;
    take = take === 3 ? 4 : 3;
  }
  return rows;
}

export function WimmelLayout({ project, onImageClick }: Props) {
  const rows = chunkAlternating(project.images);
  let runningIndex = 0;

  return (
    <div className="bg-[#f3d77e]">
      <div className="flex flex-col">
        {rows.map((row, rIdx) => {
          const startIndex = runningIndex;
          runningIndex += row.length;
          return (
            <div key={rIdx} className="flex w-full">
              {row.map((src, j) => {
                const idx = startIndex + j;
                return (
                  <button
                    type="button"
                    key={src}
                    onClick={() => onImageClick(idx)}
                    className="relative block flex-1 border-r-2 border-black last:border-r-0"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes={`${100 / row.length}vw`}
                        className="object-cover"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between bg-black px-6 py-3 font-serif text-[12px] tracking-wide text-white">
        <span>{project.caption}</span>
        <span aria-hidden="true">↓ ↓ ↓</span>
      </div>
    </div>
  );
}
