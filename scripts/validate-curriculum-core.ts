import type { Level, Module } from "../lib/types";

/**
 * Pure cross-reference validation for the curriculum dataset. No IO — takes
 * parsed levels/modules, returns human-readable issues. The CLI wrapper
 * (validate-curriculum.ts) owns reading files and printing.
 *
 * Enforced rules:
 *  - unique slugs (levels and modules)
 *  - level.order unique
 *  - module.level references an existing LIVE level (roadmap levels carry no modules)
 *  - prerequisites reference existing modules, never self, no cycles
 *  - nextModule references an existing module when non-null
 *  - content integrity: every module has >=1 functional DoD item and a
 *    non-empty verification prompt ("AI generated it" is never done)
 */

export type ValidationIssue = {
  file: "levels.json" | "modules.json";
  message: string;
};

export function validateCurriculum(
  levels: Level[],
  modules: Module[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // --- levels ---
  const levelSlugs = new Set<string>();
  const seenOrders = new Set<number>();
  for (const level of levels) {
    if (levelSlugs.has(level.slug)) {
      issues.push({
        file: "levels.json",
        message: `duplicate level slug "${level.slug}"`,
      });
    }
    levelSlugs.add(level.slug);
    if (seenOrders.has(level.order)) {
      issues.push({
        file: "levels.json",
        message: `duplicate level order ${level.order} (on "${level.slug}")`,
      });
    }
    seenOrders.add(level.order);
  }

  const liveLevelSlugs = new Set(
    levels.filter((level) => level.status === "live").map((l) => l.slug),
  );

  // --- modules ---
  const moduleSlugs = new Set<string>();
  for (const entry of modules) {
    if (moduleSlugs.has(entry.slug)) {
      issues.push({
        file: "modules.json",
        message: `duplicate module slug "${entry.slug}"`,
      });
    }
    moduleSlugs.add(entry.slug);

    if (!levelSlugs.has(entry.level)) {
      issues.push({
        file: "modules.json",
        message: `module "${entry.slug}" references unknown level "${entry.level}"`,
      });
    } else if (!liveLevelSlugs.has(entry.level)) {
      issues.push({
        file: "modules.json",
        message: `module "${entry.slug}" belongs to roadmap level "${entry.level}" - only live levels carry modules`,
      });
    }

    for (const prerequisite of entry.prerequisites) {
      if (prerequisite === entry.slug) {
        issues.push({
          file: "modules.json",
          message: `module "${entry.slug}" lists itself as a prerequisite`,
        });
      }
    }

    if (entry.definitionOfDone.functional.length === 0) {
      issues.push({
        file: "modules.json",
        message: `module "${entry.slug}" has no functional Definition of Done items`,
      });
    }

    if (entry.verificationPrompt.trim().length === 0) {
      issues.push({
        file: "modules.json",
        message: `module "${entry.slug}" has an empty verification prompt`,
      });
    }
  }

  // Second pass: references that may point forward in the array, so they can
  // only resolve after every slug is collected.
  for (const entry of modules) {
    for (const prerequisite of entry.prerequisites) {
      if (prerequisite !== entry.slug && !moduleSlugs.has(prerequisite)) {
        issues.push({
          file: "modules.json",
          message: `module "${entry.slug}" has unknown prerequisite "${prerequisite}"`,
        });
      }
    }

    if (entry.nextModule !== null && !moduleSlugs.has(entry.nextModule)) {
      issues.push({
        file: "modules.json",
        message: `module "${entry.slug}" has nextModule "${entry.nextModule}" which does not exist`,
      });
    }
  }

  // --- prerequisite cycle detection (DFS with visit states) ---
  const bySlug = new Map(modules.map((m) => [m.slug, m]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const walk = (slug: string, path: string[]): void => {
    if (visited.has(slug)) return;
    if (visiting.has(slug)) {
      issues.push({
        file: "modules.json",
        message: `prerequisite cycle detected: ${[...path, slug].join(" -> ")}`,
      });
      return;
    }
    visiting.add(slug);
    const node = bySlug.get(slug);
    if (node) {
      for (const prerequisite of node.prerequisites) {
        walk(prerequisite, [...path, slug]);
      }
    }
    visiting.delete(slug);
    visited.add(slug);
  };

  for (const entry of modules) walk(entry.slug, []);

  return issues;
}
