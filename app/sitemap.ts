import type { MetadataRoute } from "next";
import { getModules } from "@/lib/data";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set (even for local builds) so the sitemap never ships broken canonicals. See .env.example.",
    );
  }

  const now = new Date();

  const staticRoutes = ["", "/curriculum", "/progress", "/contribute"].map(
    (path) => ({
      url: absoluteUrl(path || "/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const moduleRoutes = getModules().map((module) => ({
    url: absoluteUrl(`/curriculum/${module.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...moduleRoutes];
}
