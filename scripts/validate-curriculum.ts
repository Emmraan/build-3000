import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  levelsFileSchema,
  modulesFileSchema,
} from "../lib/schemas";
import { validateCurriculum } from "./validate-curriculum-core";

/**
 * Curriculum validation gate. Run via `pnpm validate-curriculum`.
 * Exit 0 = dataset consistent; exit 1 = fix the printed issues.
 */

const dataDir = join(process.cwd(), "data");

function readJson(fileName: string): unknown {
  const raw = readFileSync(join(dataDir, fileName), "utf8");
  return JSON.parse(raw) as unknown;
}

let failed = false;

// --- schema parse (levels.json) ---
const levelsResult = levelsFileSchema.safeParse(readJson("levels.json"));
if (!levelsResult.success) {
  failed = true;
  console.error("data/levels.json does not match levelSchema:");
  for (const problem of levelsResult.error.issues) {
    console.error(`  - [${problem.path.join(".")}] ${problem.message}`);
  }
} else {
  console.log(
    `data/levels.json schema OK (${levelsResult.data.length} levels)`,
  );
}

// --- schema parse (modules.json) ---
const modulesResult = modulesFileSchema.safeParse(readJson("modules.json"));
if (!modulesResult.success) {
  failed = true;
  console.error("data/modules.json does not match moduleSchema:");
  for (const problem of modulesResult.error.issues) {
    console.error(`  - [${problem.path.join(".")}] ${problem.message}`);
  }
} else {
  console.log(
    `data/modules.json schema OK (${modulesResult.data.length} modules)`,
  );
}

// --- cross-reference checks (only when both parsed) ---
if (levelsResult.success && modulesResult.success) {
  const issues = validateCurriculum(levelsResult.data, modulesResult.data);
  if (issues.length > 0) {
    failed = true;
    console.error(`cross-reference check failed with ${issues.length} issue(s):`);
    for (const issue of issues) {
      console.error(`  - [${issue.file}] ${issue.message}`);
    }
  } else {
    console.log(
      `cross-reference OK (${levelsResult.data.length} levels / ${modulesResult.data.length} modules)`,
    );
  }
}

if (failed) {
  console.error("\nvalidate-curriculum: FAILED");
  process.exit(1);
}

console.log("\nvalidate-curriculum: PASSED");
