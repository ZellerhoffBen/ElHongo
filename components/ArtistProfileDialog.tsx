"use client";

import Image from "next/image";
import { useRef } from "react";

const path = [
  {
    year: "2024",
    stage: "Gymnasium",
    place: "LG Rämibühl, Zürich",
  },
  {
    year: "2025",
    stage: "Propädeutikum",
    place: "ZHdK, Zürich",
  },
  {
    year: "2027",
    stage: "Illustration",
    place: "Hamburg",
  },
];

export function ArtistProfileDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-controls="artist-profile"
        className="nav-mark border-0 bg-transparent p-0 text-left font-bold uppercase tracking-[0.18em]"
        onClick={openDialog}
      >
        EL HONGO
      </button>

      <dialog
        ref={dialogRef}
        id="artist-profile"
        aria-labelledby="artist-profile-title"
        aria-describedby="artist-profile-copy"
        className="profile-dialog text-black"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-[var(--paper)] sm:max-h-[calc(100dvh-3rem)]">
          <div className="flex min-h-11 items-stretch justify-between border-b border-black">
            <div className="flex items-center px-5 sm:px-7">
              <span className="work-kicker text-black/45">
                EL HONGO / Jonas Aellig
              </span>
            </div>
            <button
              type="button"
              aria-label="Profil schliessen"
              className="group flex w-11 shrink-0 items-center justify-center border-l border-black bg-transparent text-xl font-normal leading-none transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-black"
              onClick={closeDialog}
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:rotate-90"
              >
                ×
              </span>
            </button>
          </div>

          <div className="grid md:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-5 border-b border-black p-5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:p-7 md:block md:border-b-0 md:border-r md:p-8">
              <figure className="w-fit">
                <div className="relative aspect-square w-[6.25rem] overflow-hidden rounded-full border border-black bg-[#b5aaa3] sm:w-[7.5rem] md:w-32">
                  <Image
                    src="/jonas_portrait.png"
                    alt="Porträt von Jonas Aellig"
                    fill
                    priority
                    sizes="(min-width: 768px) 128px, (min-width: 640px) 120px, 100px"
                    className="object-cover object-center"
                  />
                </div>
              </figure>

              <div className="md:mt-8">
                <h2
                  id="artist-profile-title"
                  className="text-[clamp(2.35rem,4.4vw,3.2rem)] font-bold uppercase leading-[0.76] tracking-[-0.065em]"
                >
                  <span className="block">Jonas</span>
                  <span className="block">Aellig</span>
                </h2>
                <p className="work-kicker mt-5 text-black/40">aka EL HONGO</p>
              </div>
            </aside>

            <div className="p-5 sm:p-7 md:p-8 lg:p-10">
              <section>
                <p className="work-kicker text-black/40">Notiz zur Person</p>
                <p
                  id="artist-profile-copy"
                  className="mt-4 max-w-[40ch] text-[clamp(1.05rem,1.6vw,1.25rem)] font-normal normal-case leading-[1.35] tracking-[-0.015em]"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sit amet risus eget mauris posuere interdum. Nunc
                  vulputate, neque at viverra tincidunt, justo lacus sodales
                  risus, vitae malesuada libero lorem sed erat.
                </p>
              </section>

              <section
                aria-labelledby="artist-profile-path"
                className="mt-8 border-t border-black pt-4"
              >
                <div className="flex items-baseline justify-between gap-5">
                  <h3 id="artist-profile-path" className="work-kicker">
                    Weg
                  </h3>
                  <span className="work-number text-black/35">
                    Zürich → Hamburg
                  </span>
                </div>

                <ol className="relative mt-4 grid gap-4 before:absolute before:bottom-1 before:left-[2px] before:top-1 before:w-px before:bg-black/25 sm:grid-cols-3 sm:gap-5 sm:before:bottom-auto sm:before:left-0 sm:before:right-0 sm:before:top-[4px] sm:before:h-px sm:before:w-auto sm:before:origin-right sm:before:-rotate-1">
                  {path.map((item, index) => (
                    <li
                      key={item.year}
                      className={[
                        "relative pl-5 before:absolute before:left-0 before:top-1 before:h-1.5 before:w-1.5 before:bg-black sm:pl-0 sm:pt-6",
                        index === 0
                          ? "sm:before:top-[6px]"
                          : index === 1
                            ? "sm:before:top-[4px]"
                            : "sm:before:top-[2px]",
                      ].join(" ")}
                    >
                      <div className="flex items-baseline gap-3 sm:block">
                        <time className="text-base font-bold leading-none tracking-[-0.035em]">
                          {item.year}
                        </time>
                        <p className="work-kicker mt-2 text-black/40">
                          {item.stage}
                        </p>
                      </div>
                      <p className="mt-1 text-[11px] font-bold normal-case leading-tight">
                        {item.place}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
