type CutOverlayProps = { visible: boolean };

export function CutOverlay({ visible }: CutOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-[5] bg-black transition-opacity",
        visible ? "opacity-100 duration-[60ms]" : "opacity-0 duration-[60ms]",
      ].join(" ")}
    />
  );
}
