import type { Metadata } from "next";
import { ArtistProfileProvider } from "@/components/ArtistProfile";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "EL HONGO",
  description:
    "EL HONGO ist Jonas Aellig. Illustration, Zeichnung und ausgewählte Arbeiten.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        {/* The layered hero artwork is the LCP element and is not served
            through next/image (the mask needs exact pixel alignment). */}
        <link
          rel="preload"
          as="image"
          href="/mask_test/background_white_eye.png"
          fetchPriority="high"
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
