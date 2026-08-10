import type { Metadata, Viewport } from "next";
import { ArtistProfileProvider } from "@/components/ArtistProfile";
import { SiteHeader } from "@/components/SiteHeader";
import { buildMetadata } from "@/lib/metadata";
import { siteInfo } from "@/lib/siteInfo";
import "./globals.css";

/**
 * Route-level metadata overrides title, description, canonical and images; what
 * stays here is what is true of every page.
 *
 * There is deliberately no hero preload in this head. It used to live here and
 * cost `/archive` a 2 MB download of an image it never renders — the homepage
 * artwork is server-rendered into the markup, so the preload scanner finds it
 * on the one route that has it.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  ...buildMetadata({
    title: `${siteInfo.alias} — ${siteInfo.artistName}`,
    description: siteInfo.description,
    path: "/",
    imageAlt: `${siteInfo.alias} — ${siteInfo.artistName}`,
  }),
  applicationName: siteInfo.alias,
  authors: [{ name: siteInfo.artistName, url: siteInfo.url }],
  creator: siteInfo.artistName,
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f1",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        {/* Bold sets every display line on every route and is what a visitor
            watches swap in. Regular carries body copy further down the page and
            can wait for the stylesheet to ask for it. */}
        <link
          rel="preload"
          href="/fonts/StyreneA-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#inhalt" className="skip-link">
          Zum Inhalt springen
        </a>
        <ArtistProfileProvider>
          <SiteHeader />
          {children}
        </ArtistProfileProvider>
      </body>
    </html>
  );
}
