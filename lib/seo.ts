import type { Metadata } from "next";

/**
 * Site URL + shared metadata helpers.
 * NEXT_PUBLIC_SITE_URL drives canonicals, sitemap and OG absolute URLs.
 * Empty locally (handled gracefully); sitemap hard-errors without it so a
 * misconfigured deploy fails fast instead of shipping a broken sitemap.
 */

export const SITE_NAME = "build-3000";
export const SITE_DESCRIPTION =
  "The essential concepts for building software with AI coding agents. An open-source curriculum inspired by the Oxford 3000.";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  /** Path starting with "/" - no trailing slash needed. */
  path: string;
};

export function pageMetadata({
  title,
  description,
  path,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl() || undefined,
    description: SITE_DESCRIPTION,
  };
}
