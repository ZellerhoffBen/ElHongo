export function Landing() {
  return (
    <div className="flex min-h-[calc(100vh-112px)] flex-col justify-between overflow-hidden bg-white px-4 pb-10 pt-12 sm:min-h-[calc(100vh-128px)] sm:px-7 sm:pb-14">
      <h1 className="max-w-[10ch] text-[clamp(4.7rem,22vw,15rem)] font-bold leading-[0.78] tracking-normal text-black">
        EL HONGO
      </h1>
      <div className="flex items-end justify-between gap-6 border-t border-black pt-4">
        <p className="text-[11px] font-bold tracking-[0.28em] text-black">
          9 PROJECTS
        </p>
        <p className="text-right text-[11px] tracking-[0.28em] text-black/55">
          PICK ONE
        </p>
      </div>
    </div>
  );
}
