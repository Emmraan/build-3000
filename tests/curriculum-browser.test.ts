import { describe, expect, it } from "vitest";
import {
  buildBrowserUrl,
  filterModules,
  parseBrowserState,
  presentDomains,
  sortInCurriculumOrder,
} from "../lib/curriculum-browser";
import { getLevels, getModules } from "../lib/data";

const levels = getLevels();
const modules = getModules();

describe("parseBrowserState", () => {
  it("reads valid level and domain params", () => {
    const state = parseBrowserState(
      { level: "level-1-first-apps", domain: "security" },
      levels,
    );
    expect(state).toEqual({
      level: "level-1-first-apps",
      domain: "security",
    });
  });

  it("drops unknown level slugs instead of rendering them back", () => {
    const state = parseBrowserState({ level: "not-a-level" }, levels);
    expect(state.level).toBeUndefined();
  });

  it("drops unknown domains", () => {
    const state = parseBrowserState({ domain: "blockchain" }, levels);
    expect(state.domain).toBeUndefined();
  });

  it("takes the first value of array params", () => {
    const state = parseBrowserState(
      { level: ["level-0-foundations", "level-2-real-apps"] },
      levels,
    );
    expect(state.level).toBe("level-0-foundations");
  });

  it("returns empty state for empty input", () => {
    expect(parseBrowserState({}, levels)).toEqual({});
  });
});

describe("buildBrowserUrl", () => {
  it("yields bare path for default state", () => {
    expect(buildBrowserUrl({})).toBe("/curriculum");
  });

  it("includes only set filters", () => {
    expect(buildBrowserUrl({ level: "level-0-foundations" })).toBe(
      "/curriculum?level=level-0-foundations",
    );
    expect(
      buildBrowserUrl({
        level: "level-0-foundations",
        domain: "git",
      }),
    ).toBe("/curriculum?level=level-0-foundations&domain=git");
  });
});

describe("sortInCurriculumOrder", () => {
  it("orders by level rank then module order regardless of input order", () => {
    const shuffled = [...modules].reverse();
    const sorted = sortInCurriculumOrder(shuffled, levels);
    expect(sorted.map((m) => m.slug)).toEqual([
      "what-is-software",
      "terminal-basics",
      "projects-and-files",
      "ai-coding-agents",
      "git-with-an-agent",
      "web-app-anatomy",
      "components-and-ui",
      "forms-and-validation",
      "apis-and-json",
      "databases-and-crud",
      "first-deployment",
      "servers-and-backends",
      "relational-data-modeling",
      "server-side-trust",
      "authentication",
      "authorization-and-roles",
      "testing-your-app",
      "ship-team-task-manager",
    ]);
  });
});

describe("filterModules", () => {
  it("filters by level and keeps curriculum order", () => {
    const result = filterModules(
      modules,
      { level: "level-0-foundations" },
      levels,
    );
    expect(result).toHaveLength(5);
    expect(result[0]?.slug).toBe("what-is-software");
  });

  it("filters by domain across levels", () => {
    const result = filterModules(modules, { domain: "security" }, levels);
    expect(result.map((m) => m.slug)).toEqual([
      "authentication",
      "authorization-and-roles",
    ]);
  });

  it("combines level and domain filters", () => {
    const result = filterModules(
      modules,
      { level: "level-2-real-apps", domain: "security" },
      levels,
    );
    expect(result).toHaveLength(2);
  });

  it("returns everything for empty state", () => {
    expect(filterModules(modules, {}, levels)).toHaveLength(18);
  });
});

describe("presentDomains", () => {
  it("lists distinct domains alphabetically", () => {
    const domains = presentDomains(modules);
    expect(domains).toEqual([
      "backend",
      "databases",
      "devops",
      "frontend",
      "fundamentals",
      "git",
      "security",
      "testing",
      "web",
    ]);
  });
});
