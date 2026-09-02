import { siteInfo } from "@/lib/siteInfo";
import { ARROW_UP_RIGHT } from "@/lib/glyphs";

const contactChannels = [
  {
    label: "E-Mail",
    value: siteInfo.email,
    href: `mailto:${siteInfo.email}`,
    external: false,
  },
  {
    label: "Instagram",
    value: siteInfo.instagramHandle,
    href: siteInfo.instagramUrl,
    external: true,
  },
];

export function SiteFooter() {
  return (
    <footer
      id="kontakt"
      className="site-footer-snap tone-paper scroll-mt-[var(--site-header-offset)] border-t border-ink bg-paper text-fg"
    >
      <nav
        aria-label="Kontaktmöglichkeiten"
        className="grid border-b border-ink sm:grid-cols-2"
      >
        {contactChannels.map((channel, index) => (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.external ? "_blank" : undefined}
            rel={channel.external ? "noreferrer" : undefined}
            className="page-x group grid min-h-16 grid-cols-[1fr_auto] content-between gap-x-4 border-b border-ink py-3 transition-colors duration-200 ease-edge last:border-b-0 hover:bg-ink hover:text-paper [--focus-offset:-4px] sm:min-h-[5.25rem] sm:gap-x-5 sm:border-b-0 sm:py-4 sm:[&:first-child]:border-r"
          >
            <span className="kicker text-fg-faint transition-colors group-hover:text-paper/70">
              0{index + 1} — {channel.label}
            </span>
            <span className="col-start-1 row-start-2 mt-2 min-w-0 break-words text-[clamp(0.875rem,3.8vw,1.65rem)] font-bold leading-none tracking-[-0.025em] sm:mt-4 sm:text-[clamp(1rem,1.8vw,1.65rem)]">
              {channel.value}
            </span>
            <span
              aria-hidden="true"
              className="col-start-2 row-span-2 row-start-1 text-lg transition-transform duration-200 ease-edge group-hover:-translate-y-1 group-hover:translate-x-1"
            >
              {ARROW_UP_RIGHT}
            </span>
          </a>
        ))}
      </nav>

      <div className="page-x kicker flex flex-wrap justify-between gap-3 py-3 text-fg-faint sm:py-4">
        <span>EL HONGO / Jonas Aellig</span>
        <span className="hidden sm:inline">Illustration · Zeichnung · Objekte</span>
      </div>
    </footer>
  );
}
