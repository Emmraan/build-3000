import { DOD_GROUPS } from "./checklist";
import type { Module } from "./types";

const GROUP_LABELS: Record<(typeof DOD_GROUPS)[number], string> = {
  functional: "Functional",
  architecture: "Architecture",
  security: "Security",
  testing: "Testing",
  production: "Production",
};

/**
 * Deterministically compose a copy-ready verification prompt from a module's
 * Definition of Done. Unlike the hand-authored narrative prompt stored on the
 * module, this one enumerates EVERY item explicitly so the auditing agent has
 * no room to skim - and it stays in sync with content changes automatically.
 */
export function buildVerificationPrompt(module: Module): string {
  const lines: string[] = [];

  lines.push(
    `You are independently reviewing my completed project "${module.project.title}" (module: ${module.title}).`,
    "I built it by following a brief; your job is to audit it, not to trust me.",
    "",
    "Check my implementation against every item below. For EACH item reply exactly PASS or FAIL plus one line of evidence from my actual files - run the code where you can.",
    "",
  );

  for (const group of DOD_GROUPS) {
    const items = module.definitionOfDone[group];
    if (items.length === 0) continue;
    lines.push(`${GROUP_LABELS[group]}:`);
    for (const item of items) {
      lines.push(`- [ ] ${item}`);
    }
    lines.push("");
  }

  lines.push(
    "After the checklist:",
    "1. List the assumptions you think I made while building this.",
    "2. Name the single biggest risk in what I built.",
    "3. State the smallest fix you would make first.",
    "Do not rewrite any code unless I ask you to.",
  );

  return lines.join("\n");
}
