import type { Metadata } from "next";
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
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
