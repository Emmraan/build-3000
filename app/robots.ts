import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const hasSite = Boolean(getSiteUrl());
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: hasSite ? absoluteUrl("/sitemap.xml") : undefined,
  };
}
