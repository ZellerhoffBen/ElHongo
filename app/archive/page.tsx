import type { Metadata } from "next";
import { ArchiveView } from "@/components/portfolio/ArchiveView";
import { buildMetadata } from "@/lib/metadata";
import { siteInfo } from "@/lib/siteInfo";

export const metadata: Metadata = buildMetadata({
  title: `Archiv — ${siteInfo.alias}`,
  description:
    "Das vollständige Register: Serien, Sammlungen, Objekte und freie Arbeiten von EL HONGO.",
  path: "/archive",
  imageAlt: `Archiv von ${siteInfo.artistName}`,
});

export default function ArchivePage() {
  return <ArchiveView project={null} />;
}
