import { siteInfo } from "@/lib/siteInfo";

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
      className="scroll-mt-[var(--site-header-offset)] border-t border-black bg-[var(--paper)] text-black"
    >
      <nav
        aria-label="Kontaktmöglichkeiten"
        className="grid border-b border-black sm:grid-cols-2"
      >
        {contactChannels.map((channel, index) => (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.external ? "_blank" : undefined}
            rel={channel.external ? "noreferrer" : undefined}
            className="group grid min-h-24 grid-cols-[1fr_auto] content-between gap-x-5 border-b border-black px-5 py-5 transition-colors last:border-b-0 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white focus-visible:outline-offset-[-4px] sm:min-h-28 sm:border-b-0 sm:px-7 sm:py-6 sm:[&:first-child]:border-r lg:px-12"
          >
            <span className="work-kicker opacity-45">
              0{index + 1} — {channel.label}
            </span>
            <span className="col-start-1 row-start-2 mt-4 min-w-0 break-words text-[clamp(1rem,1.8vw,1.65rem)] font-bold leading-none tracking-[-0.025em]">
              {channel.value}
            </span>
            <span
              aria-hidden="true"
              className="col-start-2 row-span-2 row-start-1 text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </a>
        ))}
      </nav>

      <div className="flex flex-wrap justify-between gap-3 px-5 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-black/45 sm:px-7 lg:px-12">
        <span>EL HONGO / Jonas Aellig</span>
        <span>Illustration · Zeichnung · Objekte</span>
      </div>
    </footer>
  );
}
