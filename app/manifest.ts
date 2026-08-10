import type { MetadataRoute } from "next";
import { siteInfo } from "@/lib/siteInfo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteInfo.alias} — ${siteInfo.artistName}`,
    short_name: siteInfo.alias,
    description: siteInfo.description,
    lang: "de",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f1",
    theme_color: "#f7f6f1",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
