import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

// Seeded PRNG (mulberry32) — deterministic across renders.
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const cellsPerRow = 4;
const cellHeight = 300; // px

export function MiscLayout({ project, onImageClick }: Props) {
  const rng = mulberry32(424242);
  const items = project.images.map((src, i) => {
    const rotate = (rng() * 8 - 4).toFixed(2); // ±4°
    const widthPct = 60 + Math.floor(rng() * 35); // 60–95%
    const offsetX = (rng() * 30 - 15).toFixed(1); // ±15%
    const offsetY = (rng() * 30 - 15).toFixed(1); // ±15%
    return { src, i, rotate, widthPct, offsetX, offsetY };
  });

  const rows = Math.ceil(items.length / cellsPerRow);

  return (
    <div className="bg-[#efeae0]">
      <div className="px-4 py-10">
        <p className="mb-6 text-center font-serif text-[12px] italic text-black/55">
          {project.caption}
        </p>
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${cellsPerRow}, 1fr)`,
            gridAutoRows: `${cellHeight}px`,
            minHeight: rows * cellHeight,
          }}
        >
          {items.map((it) => (
            <div
              key={it.src}
              className="relative flex items-center justify-center"
              style={{ transform: `translate(${it.offsetX}%, ${it.offsetY}%)` }}
            >
              <button
                type="button"
                onClick={() => onImageClick(it.i)}
                className="block shadow-[0_4px_18px_rgba(0,0,0,0.12)]"
                style={{
                  width: `${it.widthPct}%`,
                  transform: `rotate(${it.rotate}deg)`,
                }}
              >
                <div className="relative aspect-square w-full bg-white">
                  <Image
                    src={it.src}
                    alt=""
                    fill
                    sizes="25vw"
                    className="object-contain"
                  />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
