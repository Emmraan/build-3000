import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { MobileNav } from "@/components/MobileNav";
import { Reveal } from "@/components/ui/Reveal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  getGlossary,
  getLevelBySlug,
  getLiveLevels,
  getModuleBySlug,
  getModules,
  getProjectForModule,
} from "../lib/data";

// ---------- whole-ladder integrity ----------

describe("curriculum ladder integrity", () => {
  it("chains every one of the 40 modules into a single walkable ladder", () => {
    const modules = getModules();
    expect(modules).toHaveLength(40);

    const visited: string[] = [];
    let cursor: string | null = "what-is-software";
    while (cursor) {
      expect(visited).not.toContain(cursor);
      visited.push(cursor);
      cursor = getModuleBySlug(cursor)?.nextModule ?? null;
    }
    expect(visited).toHaveLength(40);
    expect(visited[39]).toBe("ship-ai-native-product");
  });

  it("keeps every project slug unique across the curriculum", () => {
    const projects = getModules().map((mod) => mod.project.slug);
    expect(new Set(projects).size).toBe(projects.length);
  });

  it("keeps every module title unique", () => {
    const titles = getModules().map((mod) => mod.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("gives every module a substantive verification prompt", () => {
    for (const mod of getModules()) {
      expect(
        mod.verificationPrompt.length,
        `${mod.slug} verification prompt too thin`,
      ).toBeGreaterThan(120);
    }
  });

  it("never references a prerequisite from a later level", () => {
    const levelOrder = new Map(
      getLiveLevels().map((level) => [level.slug, level.order]),
    );
    for (const mod of getModules()) {
      for (const prerequisite of mod.prerequisites) {
        const target = getModuleBySlug(prerequisite);
        expect(target, `${mod.slug} -> ${prerequisite}`).toBeDefined();
        expect(levelOrder.get(target!.level)!).toBeLessThanOrEqual(
          levelOrder.get(mod.level)!,
        );
      }
    }
  });

  it("pins escalation markers in level-defining verification prompts", () => {
    expect(getModuleBySlug("payments-integration")!.verificationPrompt).toContain(
      "webhook",
    );
    expect(
      getModuleBySlug("fault-tolerance-disaster-recovery")!.verificationPrompt,
    ).toContain("runbook");
    const aiSecurity = getModuleBySlug("ai-security-and-evaluation")!;
    expect(aiSecurity.vocabulary.some((entry) =>
      entry.term.toLowerCase().includes("injection"),
    )).toBe(true);
    expect(aiSecurity.project.requirements.join(" ")).toContain("exfiltration");
    expect(getModuleBySlug("ship-ai-native-product")!.verificationPrompt).toMatch(
      /kill (switch|flag)/,
    );
  });

  it("returns undefined lookups for unknown slugs instead of throwing", () => {
    expect(getModuleBySlug("not-a-module")).toBeUndefined();
    expect(getLevelBySlug("not-a-level")).toBeUndefined();
  });

  it("hands back the guaranteed project via the accessor", () => {
    const mod = getModuleBySlug("caching-layers")!;
    expect(getProjectForModule(mod).slug).toBe("fast-path");
  });
});

// ---------- derived artifacts ----------

const ENV_KEY = "NEXT_PUBLIC_SITE_URL";
const originalEnv = process.env[ENV_KEY];

afterEach(() => {
  if (originalEnv === undefined) {
    delete process.env[ENV_KEY];
  } else {
    process.env[ENV_KEY] = originalEnv;
  }
});

describe("llms.txt derives from the full dataset", () => {
  it("lists all six live levels with per-level module counts", async () => {
    process.env[ENV_KEY] = "https://build3000.dev";
    const { GET } = await import("@/app/llms.txt/route");
    const response = GET();
    const body = await response.text();
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(body).toContain("- [Level 3: Production]");
    expect(body).toContain("(8 modules)");
    expect(body).toContain("- [Level 5: AI-Native Apps]");
    expect(body).toContain("(7 modules)");
  });

  it("indexes every shipped module page", async () => {
    process.env[ENV_KEY] = "https://build3000.dev";
    const { GET } = await import("@/app/llms.txt/route");
    const body = await GET().text();
    for (const mod of getModules()) {
      expect(body).toContain(`](https://build3000.dev/curriculum/${mod.slug})`);
    }
  });

  it("keeps glossary entries exactly equal to deduped live vocabulary", () => {
    const liveSlugs = new Set(getLiveLevels().map((level) => level.slug));
    const terms = new Set(
      getModules()
        .filter((mod) => liveSlugs.has(mod.level))
        .flatMap((mod) => mod.vocabulary.map((v) => v.term.toLowerCase())),
    );
    expect(getGlossary().length).toBe(terms.size);
  });
});

describe("sitemap derives from the full dataset", () => {
  it("throws without a site url so broken canonicals never ship", () => {
    delete process.env[ENV_KEY];
    expect(() => sitemap()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("covers static routes plus one route per module", () => {
    process.env[ENV_KEY] = "https://build3000.dev";
    const entries = sitemap();
    expect(entries).toHaveLength(4 + getModules().length);
    const urls = entries.map((entry) => String(entry.url));
    expect(urls).toContain("https://build3000.dev/curriculum/caching-layers");
    expect(urls).toContain(
      "https://build3000.dev/curriculum/ship-ai-native-product",
    );
  });

  it("prioritizes the homepage above section pages above modules", () => {
    process.env[ENV_KEY] = "https://build3000.dev";
    const entries = sitemap() as Array<{ url: string; priority: number }>;
    const home = entries.find((entry) => entry.url.endsWith("/curriculum"))!;
    expect(home.priority).toBe(0.8);
    expect(entries[0]!.priority).toBe(1);
  });
});

// ---------- progressive-enhancement safety ----------

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: unknown;
    children: React.ReactNode;
  }) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  ),
}));

describe("motion components degrade to visible content server-side", () => {
  it("Reveal renders children fully visible with no hidden state", () => {
    const html = renderToString(
      <Reveal>
        <p>Always findable</p>
      </Reveal>,
    );
    expect(html).toContain("Always findable");
    expect(html).not.toContain("opacity-0");
    expect(html).toContain("reveal");
  });

  it("ProgressBar renders its true width inline regardless of JS", () => {
    const html = renderToString(<ProgressBar value={3} max={6} label="Half" />);
    expect(html).toContain("width:50%");
    expect(html).toContain('aria-valuenow="3"');
  });

  it("ProgressBar survives a zero max without NaN widths", () => {
    const html = renderToString(<ProgressBar value={0} max={0} />);
    expect(html).toContain("width:0%");
    expect(html).not.toContain("NaN");
  });

  it("Reveal forwards stagger delays as transition-delay hints", () => {
    const html = renderToString(
      <Reveal delay={160}>
        <span>staggered</span>
      </Reveal>,
    );
    expect(html).toContain("transition-delay:160ms");
  });

  it("MobileNav ships an accessible collapsed menu island", () => {
    const html = renderToString(<MobileNav />);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("aria-controls");
    expect(html).toContain("Curriculum");
    expect(html).toContain("Contribute");
  });
});
