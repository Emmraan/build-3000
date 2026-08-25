import { afterEach, describe, expect, it } from "vitest";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  buildWebSiteJsonLd,
  getSiteUrl,
  pageMetadata,
} from "../lib/seo";

const ENV_KEY = "NEXT_PUBLIC_SITE_URL";
const original = process.env[ENV_KEY];

afterEach(() => {
  if (original === undefined) {
    delete process.env[ENV_KEY];
  } else {
    process.env[ENV_KEY] = original;
  }
});

describe("getSiteUrl", () => {
  it("returns empty string when env is unset", () => {
    delete process.env[ENV_KEY];
    expect(getSiteUrl()).toBe("");
  });

  it("strips trailing slashes", () => {
    process.env[ENV_KEY] = "https://build3000.dev///";
    expect(getSiteUrl()).toBe("https://build3000.dev");
  });
});

describe("absoluteUrl", () => {
  it("joins site url and path", () => {
    process.env[ENV_KEY] = "https://build3000.dev";
    expect(absoluteUrl("/curriculum")).toBe(
      "https://build3000.dev/curriculum",
    );
  });
});

describe("pageMetadata", () => {
  it("sets canonical and OG from the path", () => {
    process.env[ENV_KEY] = "https://build3000.dev";
    const meta = pageMetadata({
      title: "Curriculum",
      description: "All modules.",
      path: "/curriculum",
    });
    expect(meta.title).toBe("Curriculum");
    expect(meta.alternates?.canonical).toBe(
      "https://build3000.dev/curriculum",
    );
    const og = meta.openGraph as { url: string; siteName: string };
    expect(og.url).toBe("https://build3000.dev/curriculum");
    expect(og.siteName).toBe(SITE_NAME);
  });
});

describe("buildWebSiteJsonLd", () => {
  it("emits schema.org WebSite shape with name and description", () => {
    delete process.env[ENV_KEY];
    const jsonLd = buildWebSiteJsonLd();
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.name).toBe(SITE_NAME);
    expect(jsonLd.description).toBe(SITE_DESCRIPTION);
    expect(jsonLd.url).toBeUndefined();
  });
});
