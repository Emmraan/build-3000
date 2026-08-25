import type { Level, Module } from "./types";

/**
 * Pure filtering/state logic for the curriculum browser. No IO - takes data,
 * returns data, fully tested. The page owns searchParams IO.
 */

export type BrowserState = {
  /** Level slug filter, or undefined for all levels. */
  level?: string;
  /** Domain filter, or undefined for all domains. */
  domain?: string;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Parse raw searchParams into validated browser state. Unknown or junk
 *  values are dropped (never rendered back into URLs). */
export function parseBrowserState(
  searchParams: RawSearchParams,
  levels: Level[],
): BrowserState {
  const validLevels = new Set(levels.map((l) => l.slug));

  const rawLevel = firstValue(searchParams.level);
  const rawDomain = firstValue(searchParams.domain);

  return {
    level: rawLevel && validLevels.has(rawLevel) ? rawLevel : undefined,
    domain: isValidDomain(rawDomain) ? rawDomain : undefined,
  };
}

function isValidDomain(
  value: string | undefined,
): value is NonNullable<BrowserState["domain"]> {
  if (!value) return false;
  const knownDomains = new Set([
    "fundamentals",
    "web",
    "frontend",
    "backend",
    "databases",
    "security",
    "testing",
    "git",
    "devops",
    "ai",
  ]);
  return knownDomains.has(value);
}

/** Build a clean /curriculum URL from state. Default (empty) state yields
 *  the bare path so canonical URLs stay tidy. */
export function buildBrowserUrl(state: BrowserState): string {
  const params = new URLSearchParams();
  if (state.level) params.set("level", state.level);
  if (state.domain) params.set("domain", state.domain);
  const query = params.toString();
  return query ? `/curriculum?${query}` : "/curriculum";
}

/** Curriculum-order sort: level ladder position first, module order second. */
export function sortInCurriculumOrder(
  modules: Module[],
  levels: Level[],
): Module[] {
  const levelRank = new Map(levels.map((level) => [level.slug, level.order]));
  return [...modules].sort((a, b) => {
    const rankA = levelRank.get(a.level) ?? Number.MAX_SAFE_INTEGER;
    const rankB = levelRank.get(b.level) ?? Number.MAX_SAFE_INTEGER;
    return rankA - rankB || a.order - b.order;
  });
}

/** Apply state filters over the full module set, output in curriculum order. */
export function filterModules(
  modules: Module[],
  state: BrowserState,
  levels: Level[],
): Module[] {
  const filtered = modules.filter(
    (module) =>
      (!state.level || module.level === state.level) &&
      (!state.domain || module.domain === state.domain),
  );
  return sortInCurriculumOrder(filtered, levels);
}

/** Domains that actually occur in the given set, alphabetized. Used for the
 *  filter chips so empty-domain links never render. */
export function presentDomains(modules: Module[]): string[] {
  return [...new Set(modules.map((module) => module.domain))].sort();
}
