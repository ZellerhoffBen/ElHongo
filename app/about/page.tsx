import { aboutTimeline, currentPracticeItems } from "@/lib/aboutTimeline";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white pt-[var(--site-header-offset)] text-black">
      <section className="grid min-h-[calc(100vh-var(--site-header-offset))] border-b border-black lg:grid-cols-[minmax(320px,42vw)_1fr]">
        <div className="relative min-h-[58vh] border-b border-black bg-black lg:min-h-0 lg:border-b-0 lg:border-r">
          <div className="absolute inset-5 border border-white/35" />
          <div className="absolute inset-x-8 bottom-8 top-14 bg-white p-3 shadow-[12px_12px_0_rgba(255,255,255,0.18)] sm:inset-x-12 sm:bottom-12">
            <div className="flex h-full items-center justify-center border border-black bg-[repeating-linear-gradient(135deg,#fff_0,#fff_12px,#f1f1f1_12px,#f1f1f1_24px)]">
              <div className="-rotate-6 text-center">
                <p className="text-[10px] font-bold tracking-[0.32em]">
                  ARTIST PHOTO
                </p>
                <p className="mt-3 max-w-[18ch] text-xs leading-tight text-black/55">
                  drop portrait here
                </p>
              </div>
            </div>
          </div>
          <p className="absolute left-5 top-5 text-[10px] font-bold tracking-[0.28em] text-white">
            FIG. 01 / PERSON
          </p>
          <p className="absolute bottom-5 right-5 rotate-90 origin-bottom-right text-[10px] font-bold tracking-[0.28em] text-white/70">
            EL HONGO
          </p>
        </div>

        <div className="relative flex flex-col justify-between px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div>
            <p className="mb-6 text-[10px] font-bold tracking-[0.32em] text-black/50">
              ABOUT / DOSSIER
            </p>
            <h1 className="max-w-[10ch] text-[clamp(4.6rem,11vw,9.8rem)] font-bold leading-[0.78] tracking-normal">
              EL HONGO
            </h1>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_220px] lg:items-end">
            <p className="max-w-3xl text-[clamp(1.55rem,3.55vw,4.2rem)] font-bold leading-[0.96] tracking-normal">
              Draws bodies, crowds, monsters, jokes, logos, faces, city panic,
              and other small disasters.
            </p>
            <div className="border-l border-black pl-5 text-sm leading-relaxed">
              <p>
                A compact biography can live here: where the artist is based,
                what he makes, what kind of jobs he takes, and what keeps
                appearing in the work.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black bg-[#f4f4f0] px-5 py-5 sm:px-8">
        <div className="grid gap-px border border-black bg-black md:grid-cols-4">
          {currentPracticeItems.map((item) => (
            <div key={item.label} className="bg-[#f4f4f0] p-4">
              <p className="mb-5 text-[10px] font-bold tracking-[0.26em] text-black/45">
                {item.label}
              </p>
              <p className="text-sm font-bold uppercase leading-tight tracking-[0.08em]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-white px-5 py-14 sm:px-8 lg:px-12">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.32em] text-black/45">
              TIMELINE
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-none sm:text-6xl">
              newest at the top
            </h2>
          </div>
          <p className="hidden max-w-[18ch] text-right font-serif text-sm italic leading-tight text-black/55 sm:block">
            read downward to go backward
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl pb-8 pt-2">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[2.15rem] top-0 w-px bg-black sm:left-1/2"
          />
          <div className="flex flex-col gap-10">
            {aboutTimeline.map((entry, index) => {
              const isLeft = index % 2 === 0;
              return (
                <article
                  key={`${entry.year}-${entry.title}`}
                  className={[
                    "relative grid gap-5 pl-16 sm:grid-cols-2 sm:pl-0",
                    isLeft ? "sm:text-right" : "sm:[&>*]:col-start-2",
                  ].join(" ")}
                >
                  <div
                    aria-hidden="true"
                    className="absolute left-[1.75rem] top-3 h-3 w-3 -translate-x-1/2 rotate-45 border border-black bg-white sm:left-1/2"
                  />
                  <div
                    className={[
                      "timeline-entry group max-w-xl border-t border-black pt-4",
                      isLeft ? "sm:pr-10" : "sm:pl-10",
                    ].join(" ")}
                  >
                    <p className="text-[clamp(3.2rem,8vw,7.5rem)] font-bold leading-[0.8] tracking-normal">
                      {entry.year}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl italic leading-none">
                      {entry.title}
                    </h3>
                    <p className="mt-5 text-sm leading-relaxed text-black/70">
                      {entry.body}
                    </p>
                    <div
                      className={[
                        "mt-5 flex flex-wrap gap-1.5",
                        isLeft ? "sm:justify-end" : "",
                      ].join(" ")}
                    >
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-black px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid border-t border-black bg-black text-white md:grid-cols-[1fr_auto]">
        <p className="px-5 py-6 text-[11px] font-bold uppercase tracking-[0.24em] sm:px-8">
          portrait, text, dates and real entries can be swapped in later
        </p>
        <a
          href="/archive"
          className="border-t border-white px-5 py-6 text-[11px] font-bold uppercase tracking-[0.24em] hover:bg-white hover:text-black md:border-l md:border-t-0 sm:px-8"
        >
          enter archive
        </a>
      </section>
    </main>
  );
}
