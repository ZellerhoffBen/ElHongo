import Image from "next/image";
import type { CSSProperties } from "react";

type FeatureDetail = {
  label: string;
  value: string;
  dateTime?: string;
};

export type CurrentFeatureData = {
  id: string;
  number: string;
  eyebrow: string;
  status: string;
  title: string;
  description: string;
  details: FeatureDetail[];
  image: {
    src: string;
    alt: string;
    aspect: "portrait" | "landscape";
  };
  tone: "paper" | "ink";
  mediaSide: "left" | "right";
  mediaInset?: boolean;
};

type CurrentFeatureProps = {
  feature: CurrentFeatureData;
};

export function CurrentFeature({ feature }: CurrentFeatureProps) {
  const inverse = feature.tone === "ink";
  const mediaIsLeft = feature.mediaSide === "left";

  return (
    <article
      id={feature.id}
      className={[
        "grid border-b border-black lg:min-h-[78svh]",
        mediaIsLeft
          ? "lg:grid-cols-[minmax(32rem,1.16fr)_minmax(0,0.84fr)]"
          : "lg:grid-cols-[minmax(0,0.82fr)_minmax(30rem,1.18fr)]",
        inverse ? "bg-black text-white" : "bg-[var(--paper)] text-black",
      ].join(" ")}
    >
      <div
        className={[
          "grid grid-rows-[auto_1fr] px-5 py-9 [container-type:inline-size] sm:px-7 sm:py-11 lg:min-h-0 lg:px-12 lg:py-12",
          mediaIsLeft ? "lg:order-2" : "lg:order-1",
        ].join(" ")}
      >
        <header className="flex items-start justify-between gap-5">
          <p className={inverse ? "work-kicker text-white/52" : "work-kicker text-black/48"}>
            {feature.number} — {feature.eyebrow}
          </p>
          <p className={inverse ? "work-kicker text-white/52" : "work-kicker text-black/48"}>
            {feature.status}
          </p>
        </header>

        <div className="grid content-center py-12 sm:py-16 lg:py-12">
          <h2
            className={[
              "font-bold uppercase leading-[0.83] tracking-[-0.05em]",
              inverse
                ? "whitespace-nowrap text-[clamp(2.65rem,9.2cqw,5.6rem)]"
                : "max-w-[10ch] text-[clamp(3rem,10.8cqw,6.8rem)] [overflow-wrap:anywhere]",
            ].join(" ")}
          >
            {feature.title}
          </h2>

          <dl
            className={[
              "mt-9 grid border-y sm:grid-cols-[repeat(var(--detail-count),minmax(0,1fr))]",
              inverse ? "border-white/35" : "border-black/55",
            ].join(" ")}
            style={{ "--detail-count": feature.details.length } as CSSProperties}
          >
            {feature.details.map((detail, index) => (
              <div
                key={detail.label}
                className={[
                  "min-w-0 py-3.5 sm:px-4 sm:first:pl-0 sm:last:pr-0",
                  index > 0
                    ? inverse
                      ? "border-t border-white/35 sm:border-l sm:border-t-0"
                      : "border-t border-black/55 sm:border-l sm:border-t-0"
                    : "",
                ].join(" ")}
              >
                <dt className={inverse ? "work-kicker text-white/42" : "work-kicker text-black/42"}>
                  {detail.label}
                </dt>
                <dd className="mt-2 text-[11px] font-bold leading-[1.3] sm:text-xs">
                  {detail.dateTime ? (
                    <time dateTime={detail.dateTime}>{detail.value}</time>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p
            className={[
              "mt-7 max-w-[34ch] text-[13px] normal-case leading-[1.6] sm:text-sm",
              inverse ? "text-white/58" : "text-black/58",
            ].join(" ")}
          >
            {feature.description}
          </p>
        </div>
      </div>

      <figure
        className={[
          "relative overflow-hidden border-t border-black lg:min-h-0 lg:border-t-0",
          feature.image.aspect === "portrait"
            ? "aspect-[3/4] lg:aspect-auto"
            : "aspect-[4/3] lg:aspect-auto",
          mediaIsLeft
            ? "lg:order-1 lg:border-r"
            : "lg:order-2 lg:border-l",
          inverse && feature.mediaInset ? "bg-black" : "bg-white",
        ].join(" ")}
      >
        <Image
          src={feature.image.src}
          alt={feature.image.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className={[
            "object-contain",
            feature.mediaInset ? "p-4 sm:p-7 lg:p-9" : "",
          ].join(" ")}
        />
      </figure>
    </article>
  );
}
