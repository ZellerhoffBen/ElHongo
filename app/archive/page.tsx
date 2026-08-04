import type { Metadata } from "next";
import { ArchiveClient } from "./ArchiveClient";

export const metadata: Metadata = {
  title: "Archiv — EL HONGO",
  description: "Arbeiten, Serien, Figuren und Objekte von EL HONGO.",
};

export default function ArchivePage() {
  return <ArchiveClient />;
}
