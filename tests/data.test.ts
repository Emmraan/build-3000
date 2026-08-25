import { describe, expect, it, vi } from "vitest";
import {
  getCapstonePhases,
  getGlossary,
  getLevels,
  getLiveLevels,
  getModuleBySlug,
  getModulesForLevel,
  getRoadmapLevels,
} from "../lib/data";
import {
  capstoneFileSchema,
  levelSchema,
  levelsFileSchema,
  moduleSchema,
} from "../lib/schemas";
import { validateCurriculum } from "../scripts/validate-curriculum-core";
import type { Level, Module } from "../lib/types";

// ---------- schema shape ----------

const validLevel: Level = {
  slug: "level-0-foundations",
  order: 0,
  name: "Foundations",
  tagline: "I have an idea but don't know how to build it.",
  description: "The mental model everything else builds on.",
  status: "live",
  outcome: "I can direct an AI coding agent on a real project folder.",
};

const validModule: Module = {
  slug: "what-is-software",
  title: "What Is Software?",
  level: "level-0-foundations",
  domain: "fundamentals",
  summary: "Programs, files and running code - the words behind the magic.",
  order: 1,
  objective: "Explain what a program is and where it lives.",
  vocabulary: [{ term: "program", meaning: "A list of instructions a computer runs." }],
  concepts: [{ name: "source code", explanation: "Text humans edit; computers run it." }],
  prerequisites: [],
  explanations: [{ title: "From text to action", body: "A program is text until it runs." }],
  examples: [
    {
      title: "A to-do script",
      description: "Ten lines that read a file and print unfinished tasks.",
    },
  ],
  commonMistakes: [
    {
      mistake: "Editing the app while the dev server has stale state.",
      fix: "Restart the server after config changes.",
    },
  ],
  agentGuidance: "Ask the agent to explain every file it creates, in one line each.",
  project: {
    slug: "vocabulary-notebook",
    title: "Vocabulary Notebook",
    brief: "A single-page notebook of every term you learn, built by your agent.",
    requirements: ["One page listing terms", "Add/remove entries via the agent"],
    agentContext:
      "Build a single-page static site with an array of term objects and render functions.",
  },
  definitionOfDone: {
    functional: ["Page lists all terms"],
    architecture: ["Single file, no frameworks"],
    security: [],
    testing: [],
    production: [],
  },
  verificationPrompt:
    "Review my project against this Definition of Done and report pass/fail per item.",
  reviewQuestions: ["What happens when you run a program?"],
  capabilities: ["Describe what software is without hand-waving."],
  nextModule: null,
};

describe("levelSchema", () => {
  it("accepts a well-formed level", () => {
    expect(levelSchema.safeParse(validLevel).success).toBe(true);
  });

  it("rejects non-kebab-case slugs", () => {
    const bad = { ...validLevel, slug: "Level Zero" };
    expect(levelSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects unknown status values", () => {
    const bad = { ...validLevel, status: "coming-soon" };
    expect(levelSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects negative or fractional order", () => {
    expect(levelSchema.safeParse({ ...validLevel, order: -1 }).success).toBe(false);
    expect(levelSchema.safeParse({ ...validLevel, order: 1.5 }).success).toBe(false);
  });
});

describe("moduleSchema", () => {
  it("accepts a well-formed module with all 15-field groups present", () => {
    const result = moduleSchema.safeParse(validModule);
    expect(result.success).toBe(true);
  });

  it("allows empty DoD arrays at schema level - the validator enforces live-module integrity", () => {
    const draft = {
      ...validModule,
      definitionOfDone: {
        functional: [],
        architecture: [],
        security: [],
        testing: [],
        production: [],
      },
    };
    expect(moduleSchema.safeParse(draft).success).toBe(true);
  });

  it("rejects empty verification prompt (min length)", () => {
    const bad = { ...validModule, verificationPrompt: "" };
    expect(moduleSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects unknown domains", () => {
    const bad = { ...validModule, domain: "blockchain" };
    expect(moduleSchema.safeParse(bad).success).toBe(false);
  });
});

// ---------- loaders over the real dataset ----------

describe("data loaders (placeholder dataset)", () => {
  it("loads six levels ordered L0..L5", () => {
    const levels = getLevels();
    expect(levels).toHaveLength(6);
    expect(levels.map((l) => l.order)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("splits live vs roadmap levels - all six live", () => {
    expect(getLiveLevels().map((l) => l.slug)).toEqual([
      "level-0-foundations",
      "level-1-first-apps",
      "level-2-real-apps",
      "level-3-production",
      "level-4-scale",
      "level-5-ai-native",
    ]);
    expect(getRoadmapLevels()).toEqual([]);
  });

  it("returns L0 modules in curriculum order", () => {
    const l0 = getModulesForLevel("level-0-foundations");
    expect(l0.map((m) => m.slug)).toEqual([
      "what-is-software",
      "terminal-basics",
      "projects-and-files",
      "ai-coding-agents",
      "git-with-an-agent",
    ]);
  });

  it("returns L1 modules in curriculum order", () => {
    const l1 = getModulesForLevel("level-1-first-apps");
    expect(l1.map((m) => m.slug)).toEqual([
      "web-app-anatomy",
      "components-and-ui",
      "forms-and-validation",
      "apis-and-json",
      "databases-and-crud",
      "first-deployment",
    ]);
  });

  it("returns L2 modules in curriculum order", () => {
    const l2 = getModulesForLevel("level-2-real-apps");
    expect(l2.map((m) => m.slug)).toEqual([
      "servers-and-backends",
      "relational-data-modeling",
      "server-side-trust",
      "authentication",
      "authorization-and-roles",
      "testing-your-app",
      "ship-team-task-manager",
    ]);
  });

  it("returns L3 modules in curriculum order", () => {
    const l3 = getModulesForLevel("level-3-production");
    expect(l3.map((m) => m.slug)).toEqual([
      "caching-layers",
      "rate-limiting-and-abuse",
      "database-indexing-performance",
      "background-jobs-and-queues",
      "payments-integration",
      "observability-foundation",
      "ci-cd-pipelines",
      "failure-handling",
    ]);
  });

  it("returns L4 modules in curriculum order", () => {
    const l4 = getModulesForLevel("level-4-scale");
    expect(l4.map((m) => m.slug)).toEqual([
      "distributed-systems-thinking",
      "event-driven-architecture",
      "idempotency-and-retries",
      "eventual-consistency",
      "replication-and-sharding",
      "load-balancing-horizontal-scaling",
      "fault-tolerance-disaster-recovery",
    ]);
  });

  it("returns L5 modules in curriculum order", () => {
    const l5 = getModulesForLevel("level-5-ai-native");
    expect(l5.map((m) => m.slug)).toEqual([
      "llm-fundamentals",
      "structured-prompts-and-output",
      "embeddings-and-vector-search",
      "rag-applications",
      "tool-calling-and-agents",
      "ai-security-and-evaluation",
      "ship-ai-native-product",
    ]);
  });

  it("resolves module lookups and cross-level chains", () => {
    const first = getModuleBySlug("what-is-software");
    expect(first).toBeDefined();
    expect(getModuleBySlug("git-with-an-agent")?.nextModule).toBe(
      "web-app-anatomy",
    );
    // L1 hands off to L2's first module
    expect(getModuleBySlug("first-deployment")?.nextModule).toBe(
      "servers-and-backends",
    );
    // L2 finale hands off to L3's first module
    expect(getModuleBySlug("ship-team-task-manager")?.nextModule).toBe(
      "caching-layers",
    );
    // L3 finale hands off to L4's first module
    expect(getModuleBySlug("failure-handling")?.nextModule).toBe(
      "distributed-systems-thinking",
    );
    // L4 finale hands off to L5's first module
    expect(getModuleBySlug("fault-tolerance-disaster-recovery")?.nextModule).toBe(
      "llm-fundamentals",
    );
    // The full ladder ends with the AI-native capstone
    expect(getModuleBySlug("ship-ai-native-product")?.nextModule).toBeNull();
  });

  it("keeps roadmap levels free of modules", () => {
    for (const level of getRoadmapLevels()) {
      expect(getModulesForLevel(level.slug)).toEqual([]);
    }
  });

  it("throws a named error when modules.json fails schema validation", async () => {
    vi.resetModules();
    vi.doMock("../data/modules.json", () => ({
      default: [{ slug: "BROKEN SLUG" }],
    }));
    const { getModules } = await import("../lib/data");
    expect(() => getModules()).toThrow(/modules\.json failed schema validation/);
    vi.doUnmock("../data/modules.json");
  });

  it("throws a named error when levels.json fails schema validation", async () => {
    vi.resetModules();
    vi.doMock("../data/levels.json", () => ({
      default: [{ slug: "Bad Level", order: 99 }],
    }));
    const { getLevels } = await import("../lib/data");
    expect(() => getLevels()).toThrow(/levels\.json failed schema validation/);
    vi.doUnmock("../data/levels.json");
  });

  it("throws a named error when capstone.json fails schema validation", async () => {
    vi.resetModules();
    vi.doMock("../data/capstone.json", () => ({
      default: [{ slug: "Bad Phase" }],
    }));
    const { getCapstonePhases } = await import("../lib/data");
    expect(() => getCapstonePhases()).toThrow(
      /capstone\.json failed schema validation/,
    );
    vi.doUnmock("../data/capstone.json");
  });
});

describe("capstone framework", () => {
  it("ships the full 17-step production process in order", () => {
    const phases = getCapstonePhases();
    expect(phases).toHaveLength(17);
    expect(phases.map((p) => p.order)).toEqual(
      Array.from({ length: 17 }, (_, i) => i + 1),
    );
    expect(phases[0].slug).toBe("product-requirements");
    expect(phases[16].slug).toBe("production-readiness-review");
  });

  it("every phase carries deliverables and domain links", () => {
    for (const phase of getCapstonePhases()) {
      expect(phase.deliverables.length).toBeGreaterThan(0);
      expect(phase.drawsOnDomains.length).toBeGreaterThan(0);
    }
  });

  it("round-trips through the file schema", () => {
    expect(capstoneFileSchema.safeParse(getCapstonePhases()).success).toBe(true);
  });
});

describe("glossary aggregation", () => {
  it("collects vocabulary from all live levels - the full ladder", () => {
    const glossary = getGlossary();
    expect(glossary.length).toBeGreaterThan(150);
    const sorted = [...glossary].sort((a, b) =>
      a.term.localeCompare(b.term),
    );
    expect(glossary).toEqual(sorted);
    // roadmap levels have no modules, so nothing can leak from them
    const liveModules = new Set(
      getLiveLevels().flatMap((level) =>
        getModulesForLevel(level.slug).map((m) => m.slug),
      ),
    );
    for (const entry of glossary) {
      expect(liveModules.has(entry.moduleSlug)).toBe(true);
    }
  });

  it("deduplicates terms case-insensitively keeping first introduction", () => {
    const glossary = getGlossary();
    const keys = glossary.map((entry) => entry.term.toLowerCase());
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("levelsFileSchema round-trip", () => {
  it("parses the shipped levels file", () => {
    expect(levelsFileSchema.safeParse(getLevels()).success).toBe(true);
  });
});

// ---------- cross-reference validator ----------

describe("validateCurriculum", () => {
  it("passes on a clean pair", () => {
    const issues = validateCurriculum([validLevel], [validModule]);
    expect(issues).toEqual([]);
  });

  it("flags a module pointing at a roadmap level", () => {
    const roadmapLevel: Level = {
      ...validLevel,
      slug: "level-3-production",
      order: 3,
      status: "roadmap",
    };
    const misplaced: Module = { ...validModule, level: "level-3-production" };
    const issues = validateCurriculum([validLevel, roadmapLevel], [misplaced]);
    expect(issues.some((i) => i.message.includes("roadmap level"))).toBe(true);
  });

  it("flags unknown prerequisites", () => {
    const chained: Module = { ...validModule, prerequisites: ["ghost-module"] };
    const issues = validateCurriculum([validLevel], [chained]);
    expect(issues.some((i) => i.message.includes('unknown prerequisite "ghost-module"'))).toBe(
      true,
    );
  });

  it("flags self-referencing prerequisites", () => {
    const selfRef: Module = { ...validModule, prerequisites: [validModule.slug] };
    const issues = validateCurriculum([validLevel], [selfRef]);
    expect(issues.some((i) => i.message.includes("lists itself"))).toBe(true);
  });

  it("detects prerequisite cycles across modules", () => {
    const b: Module = {
      ...validModule,
      slug: "module-b",
      nextModule: null,
      prerequisites: ["module-c"],
    };
    const c: Module = { ...b, slug: "module-c", prerequisites: ["module-b"] };
    const issues = validateCurriculum([validLevel], [b, c]);
    expect(issues.some((i) => i.message.includes("cycle detected"))).toBe(true);
  });

  it("enforces content integrity: functional DoD item required", () => {
    const hollow: Module = {
      ...validModule,
      definitionOfDone: {
        functional: [],
        architecture: [],
        security: [],
        testing: [],
        production: [],
      },
    };
    const issues = validateCurriculum([validLevel], [hollow]);
    expect(issues.some((i) => i.message.includes("no functional Definition of Done"))).toBe(
      true,
    );
  });

  it("enforces content integrity: non-empty verification prompt", () => {
    const blank: Module = { ...validModule, verificationPrompt: "   " };
    const issues = validateCurriculum([validLevel], [blank]);
    expect(issues.some((i) => i.message.includes("empty verification prompt"))).toBe(true);
  });

  it("flags dangling nextModule references", () => {
    const dangling: Module = { ...validModule, nextModule: "not-a-module" };
    const issues = validateCurriculum([validLevel], [dangling]);
    expect(issues.some((i) => i.message.includes("nextModule"))).toBe(true);
  });

  it("allows nextModule chains when targets exist", () => {
    const second: Module = {
      ...validModule,
      slug: "terminal-basics",
      order: 2,
      nextModule: null,
    };
    const first: Module = { ...validModule, nextModule: "terminal-basics" };
    const issues = validateCurriculum([validLevel], [first, second]);
    expect(issues).toEqual([]);
  });
});
