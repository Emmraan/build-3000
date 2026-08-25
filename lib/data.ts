import capstoneJson from "../data/capstone.json";
import modulesJson from "../data/modules.json";
import levelsJson from "../data/levels.json";
import {
  capstoneFileSchema,
  levelSchema,
  levelsFileSchema,
  moduleSchema,
  modulesFileSchema,
  type CapstonePhase,
  type Level,
  type Module,
} from "./schemas";

/**
 * Curriculum loaders. JSON is parsed through the Zod schemas on every load so
 * invalid data fails fast at the call site instead of leaking into pages.
 * Cross-reference rules (prerequisites, nextModule, level refs, DoD
 * non-emptiness) live in scripts/validate-curriculum-core.ts and run as a
 * separate gate — see pnpm validate-curriculum.
 */

function parseLevels(): Level[] {
  const result = levelsFileSchema.safeParse(levelsJson);
  if (!result.success) {
    throw new Error(
      `data/levels.json failed schema validation: ${result.error.message}`,
    );
  }
  return result.data;
}

function parseModules(): Module[] {
  const result = modulesFileSchema.safeParse(modulesJson);
  if (!result.success) {
    throw new Error(
      `data/modules.json failed schema validation: ${result.error.message}`,
    );
  }
  return result.data;
}

function parseCapstone(): CapstonePhase[] {
  const result = capstoneFileSchema.safeParse(capstoneJson);
  if (!result.success) {
    throw new Error(
      `data/capstone.json failed schema validation: ${result.error.message}`,
    );
  }
  return result.data;
}

let cachedLevels: Level[] | null = null;
let cachedModules: Module[] | null = null;
let cachedCapstone: CapstonePhase[] | null = null;

export function getLevels(): Level[] {
  cachedLevels ??= parseLevels();
  return [...cachedLevels].sort((a, b) => a.order - b.order);
}

export function getModules(): Module[] {
  cachedModules ??= parseModules();
  return [...cachedModules].sort(
    (a, b) => a.level.localeCompare(b.level) || a.order - b.order,
  );
}

export function getLevelBySlug(slug: string): Level | undefined {
  return getLevels().find((level) => level.slug === slug);
}

export function getModuleBySlug(slug: string): Module | undefined {
  return getModules().find((module) => module.slug === slug);
}

export function getLiveLevels(): Level[] {
  return getLevels().filter((level) => level.status === "live");
}

export function getRoadmapLevels(): Level[] {
  return getLevels().filter((level) => level.status === "roadmap");
}

/** Modules belonging to a level, in curriculum order. */
export function getModulesForLevel(levelSlug: string): Module[] {
  return getModules()
    .filter((module) => module.level === levelSlug)
    .sort((a, b) => a.order - b.order);
}

/** Convenience accessor for a module's project (guaranteed by schema). */
export function getProjectForModule(module: Module): Module["project"] {
  return module.project;
}

export function getCapstonePhases(): CapstonePhase[] {
  cachedCapstone ??= parseCapstone();
  return [...cachedCapstone].sort((a, b) => a.order - b.order);
}

export type GlossaryEntry = {
  term: string;
  meaning: string;
  /** Slug of the module that introduced the term. */
  moduleSlug: string;
};

/**
 * Aggregate glossary over all live modules' vocabulary. First introduction of
 * a term wins; entries sorted alphabetically for dictionary-style reading.
 */
export function getGlossary(): GlossaryEntry[] {
  const byTerm = new Map<string, GlossaryEntry>();
  const liveSlugs = new Set(getLiveLevels().map((level) => level.slug));
  for (const entry of getModules()) {
    if (!liveSlugs.has(entry.level)) continue;
    for (const item of entry.vocabulary) {
      const key = item.term.toLowerCase();
      if (!byTerm.has(key)) {
        byTerm.set(key, {
          term: item.term,
          meaning: item.meaning,
          moduleSlug: entry.slug,
        });
      }
    }
  }
  return [...byTerm.values()].sort((a, b) =>
    a.term.localeCompare(b.term),
  );
}

// Re-exported for consumers that want the raw schemas (tests, validator CLI).
export { levelSchema, moduleSchema };
