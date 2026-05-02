import Image from "next/image";
import type { ArchiveProject } from "@/lib/archiveProjects";

type Props = {
  project: ArchiveProject;
  onImageClick: (index: number) => void;
};

const meta = [
  { client: "HOOP DREAMS BASKETBALL CAMP", year: "2023" },
  { client: "—", year: "—" },
];

export function LogosLayout({ project, onImageClick }: Props) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1100px] px-8 py-16">
        <p className="mb-12 text-[11px] tracking-[0.18em] text-black/55">
          {project.caption}
        </p>
        <div className="flex flex-col gap-16">
          {project.images.map((src, i) => (
            <div
              key={src}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-[2fr_1fr]"
            >
              <button
                type="button"
                onClick={() => onImageClick(i)}
                className="relative block w-full bg-zinc-50 p-12"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-contain"
                  />
                </div>
              </button>
              <dl className="text-[11px] tracking-[0.12em] text-black/70">
                <dt className="text-black/40">CLIENT</dt>
                <dd className="mb-4 font-bold text-black">
                  {meta[i]?.client ?? "—"}
                </dd>
                <dt className="text-black/40">YEAR</dt>
                <dd className="text-black">{meta[i]?.year ?? "—"}</dd>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
