import { EyeFollowerArt } from "@/components/EyeFollowerArt";

type HomeProps = {
  searchParams?: Promise<{
    classic?: string | string[];
  }>;
};

function ClassicHome() {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-white p-4 pt-20">
      <EyeFollowerArt />
    </main>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const classic = Array.isArray(params?.classic)
    ? params.classic.includes("1")
    : params?.classic === "1";

  if (classic) {
    return <ClassicHome />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white pt-[var(--site-header-offset)]">
      <div className="pointer-events-none absolute bottom-6 left-27 top-[calc(var(--site-header-offset)+1rem)] z-0 flex items-center sm:left-54 lg:left-72">
        <h1
          aria-label="ELHONGO"
          className="flex flex-col font-bold leading-[0.75] tracking-normal text-black"
        >
          {"ELHONGO".split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="block text-[clamp(3.8rem,10.5vh,7.8rem)]"
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      <section className="relative z-[1] flex min-h-[calc(100vh-var(--site-header-offset))] items-center justify-end px-2 py-8 sm:px-6">
        <EyeFollowerArt className="w-[min(72vw,860px)] sm:w-[min(64vw,860px)] sm:-translate-x-[12vw]" />
      </section>
    </main>
  );
}