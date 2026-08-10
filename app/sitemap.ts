import type { MetadataRoute } from "next";
import { archiveProjects } from "@/lib/archiveProjects";
import { absoluteUrl } from "@/lib/siteInfo";

/**
 * Every crawlable URL the site has. The legacy `/work/*` and `/about`
 * redirects are deliberately absent — they are signposts, not destinations.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl("/archive"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...archiveProjects.map((project) => ({
      url: absoluteUrl(`/archive/${project.slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
