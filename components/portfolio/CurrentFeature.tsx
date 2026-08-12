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
  const mediaIsLeft = feature.mediaSide === "left";
  // Two details read as a wall label (stacked); three or more as a table row.
  const asWallLabel = feature.details.length <= 2;

  return (
    <article
      id={feature.id}
      className={[
        "grid border-b border-ink bg-surface text-fg lg:min-h-[78svh]",
        feature.tone === "ink" ? "tone-ink" : "tone-paper",
        mediaIsLeft
          ? "lg:grid-cols-[minmax(32rem,1.16fr)_minmax(0,0.84fr)]"
          : "lg:grid-cols-[minmax(0,0.82fr)_minmax(30rem,1.18fr)]",
      ].join(" ")}
    >
      <div
        className={[
          "page-x grid grid-rows-[auto_1fr] pt-section pb-section-xs [container-type:inline-size] sm:pt-section-lg lg:min-h-0 lg:py-section-lg",
          mediaIsLeft ? "lg:order-2" : "lg:order-1",
        ].join(" ")}
      >
        <header className="flex items-start justify-between gap-5">
          <p className="kicker">
            <span className="text-fg">{feature.number}</span>
            <span className="text-fg-faint"> — {feature.eyebrow}</span>
          </p>
          <p className="kicker text-fg-faint">{feature.status}</p>
        </header>

        {/*
          No bottom padding below `lg`. Stacked, this padding and the column's
          own put 136px between the description and the plate it describes —
          the text read as a separate section rather than as the label for the
          picture underneath it. The column's `pb-section-xs` is now the whole
          gap.

          From `lg` the media moves beside the text, and `content-start` is
          what keeps the title with its eyebrow: centring the block in the
          78svh row left the number pinned to the top and the title floating
          115px below it, so the two read as unrelated. Top-aligned, the title
          also starts level with the top of the plate next to it.
        */}
        <div className="grid content-center pt-section-sm lg:content-start lg:py-section">
          <h2 className="max-w-[11ch] text-display-md uppercase [overflow-wrap:anywhere]">
            {feature.title}
          </h2>

          <dl
            className={[
              "mt-section-sm grid border-y border-rule-soft",
              asWallLabel
                ? ""
                : "sm:grid-cols-[repeat(var(--detail-count),minmax(0,1fr))]",
            ].join(" ")}
            style={{ "--detail-count": feature.details.length } as CSSProperties}
          >
            {feature.details.map((detail, index) => (
              <div
                key={detail.label}
                className={[
                  "min-w-0 py-3.5",
                  asWallLabel
                    ? "flex items-baseline gap-4"
                    : "sm:px-4 sm:first:pl-0 sm:last:pr-0",
                  index > 0
                    ? asWallLabel
                      ? "border-t border-rule-soft"
                      : "border-t border-rule-soft sm:border-l sm:border-t-0"
                    : "",
                ].join(" ")}
              >
                <dt
                  className={[
                    "kicker text-fg-faint",
                    asWallLabel ? "w-24 shrink-0" : "",
                  ].join(" ")}
                >
                  {detail.label}
                </dt>
                {/*
                  German compounds — "Kunsthochschulzwischenpräsentationsraum" —
                  have no break opportunity, and in the wall-label row this sits
                  in a flex box that would otherwise refuse to shrink below its
                  longest word and push the value out of the list.
                */}
                <dd
                  className={[
                    "min-w-0 text-[11px] font-bold leading-[1.3] [overflow-wrap:anywhere] sm:text-xs",
                    asWallLabel ? "" : "mt-2",
                  ].join(" ")}
                >
                  {detail.dateTime ? (
                    <time dateTime={detail.dateTime}>{detail.value}</time>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-[34ch] text-body normal-case text-fg-muted">
            {feature.description}
          </p>
        </div>
      </div>

      <figure
        className={[
          "relative overflow-hidden border-t border-ink lg:min-h-0 lg:border-t-0",
          feature.image.aspect === "portrait"
            ? "aspect-[3/4] lg:aspect-auto"
            : "aspect-[4/3] lg:aspect-auto",
          mediaIsLeft ? "lg:order-1 lg:border-r" : "lg:order-2 lg:border-l",
          feature.tone === "ink" && feature.mediaInset ? "bg-ink" : "bg-white",
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
