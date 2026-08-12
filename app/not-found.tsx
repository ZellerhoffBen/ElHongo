import type { Metadata } from "next";
import Link from "next/link";
import { ProfileLink } from "@/components/layout/ArtistProfile";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { archiveProjects } from "@/lib/archiveProjects";

export const metadata: Metadata = {
  title: "Nicht gefunden — EL HONGO",
  robots: { index: false, follow: true },
};

const destinations = [
  { href: "/", label: "Atelier", note: "Name, Auswahl und Aktuelles" },
  { href: "/archive", label: "Archiv", note: `${archiveProjects.length} Einträge` },
];

/**
 * The framework default dropped a stock "404: This page could not be found"
 * into the middle of the site's own shell. This keeps the register's language —
 * number, rule, destination — and does the one thing the default never did:
 * offer a way back into the work.
 */
export default function NotFound() {
  return (
    <main
      id="inhalt"
      className="tone-paper flex min-h-[100svh] flex-col bg-paper pt-[var(--site-header-offset)] text-fg"
    >
      <div className="page-x flex flex-1 flex-col justify-center py-section-lg">
        <p className="kicker text-fg-faint">Fehler 404</p>
        <h1 className="mt-5 max-w-[14ch] text-display-lg uppercase">
          Dieses Blatt fehlt
        </h1>
        <p className="mt-7 max-w-[46ch] text-body-lg text-fg-muted">
          Die Adresse gehört zu keinem Eintrag im Archiv. Vielleicht wurde sie
          umbenannt — das Register führt in jedem Fall weiter.
        </p>

        <nav aria-label="Weiter zu" className="mt-section border-t border-ink">
          {destinations.map((destination, index) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="page-x-bleed page-x group grid min-h-24 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-ink transition-colors duration-200 ease-edge hover:bg-ink hover:text-paper [--focus-offset:-4px]"
            >
              <span className="kicker text-fg-faint transition-colors group-hover:text-paper/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-[clamp(1.5rem,5vw,2.5rem)] font-bold uppercase leading-none tracking-[-0.05em]">
                  {destination.label}
                </span>
                <span className="kicker mt-2 block text-fg-faint transition-colors group-hover:text-paper/70">
                  {destination.note}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-lg transition-transform duration-200 ease-edge group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-section-sm">
          <ProfileLink />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
