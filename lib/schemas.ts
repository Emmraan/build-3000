import { z } from "zod";

/**
 * Curriculum data schemas — the single source of truth for build-3000.
 *
 * Two files drive the platform:
 *   data/levels.json   — the level ladder (L0-L2 live in v1, L3+ roadmap)
 *   data/modules.json  — one module per entry, following the 15-field
 *                        structure from the product spec (section 6).
 *
 * Content-integrity rule (spec section 9): a module may only ship with a
 * Definition of Done and a verification prompt. The schema keeps the shape;
 * scripts/validate-curriculum-core.ts enforces the non-empty rule for live
 * modules.
 */

export const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Canonical knowledge domains a module can belong to. */
export const domainSchema = z.enum([
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

const slugField = z.string().regex(kebabCaseRegex, {
  message: "slug must be kebab-case (lowercase letters, digits, hyphens)",
});

export const levelStatusSchema = z.enum(["live", "roadmap"]);

export const levelSchema = z.object({
  slug: slugField,
  /** Sort position in the ladder. Unique across levels, ascending. */
  order: z.number().int().min(0),
  name: z.string().min(1),
  /** The learner's before-state, e.g. "I have an idea but don't know how to build it." */
  tagline: z.string().min(1),
  description: z.string().min(1),
  status: levelStatusSchema,
  /** The learner's after-state once the level is complete. */
  outcome: z.string().min(1),
});

export const vocabularyItemSchema = z.object({
  term: z.string().min(1),
  meaning: z.string().min(1),
});

export const conceptItemSchema = z.object({
  name: z.string().min(1),
  explanation: z.string().min(1),
});

export const explanationItemSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const exampleItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const mistakeItemSchema = z.object({
  mistake: z.string().min(1),
  fix: z.string().min(1),
});

/** Grouped Definition of Done (spec section 9). Live modules must have at
 *  least one functional item — enforced by the validator, not the schema,
 *  so roadmap-time drafts can stay partial. */
export const definitionOfDoneSchema = z.object({
  functional: z.array(z.string()),
  architecture: z.array(z.string()),
  security: z.array(z.string()),
  testing: z.array(z.string()),
  production: z.array(z.string()),
});

export const projectSchema = z.object({
  slug: slugField,
  title: z.string().min(1),
  brief: z.string().min(1),
  requirements: z.array(z.string()).min(1),
  /** Ready-to-use context/instructions block the learner pastes into their
   *  AI coding agent when building this module's project. */
  agentContext: z.string().min(1),
});

/**
 * One curriculum module — all 15 fields from the product spec (section 6):
 * objective, vocabulary, concepts, prerequisites, explanations, examples,
 * common mistakes, AI-agent guidance, project brief, agent instructions,
 * Definition of Done, verification prompt, review questions, capabilities,
 * recommended next module.
 */
export const moduleSchema = z.object({
  slug: slugField,
  title: z.string().min(1),
  /** Owning level slug — must reference a LIVE level. */
  level: slugField,
  domain: domainSchema,
  summary: z.string().min(1),
  /** Position within the level (1-based). */
  order: z.number().int().min(1),
  objective: z.string().min(1),
  vocabulary: z.array(vocabularyItemSchema).min(1),
  concepts: z.array(conceptItemSchema).min(1),
  /** Module slugs that should be completed first. */
  prerequisites: z.array(slugField),
  explanations: z.array(explanationItemSchema).min(1),
  examples: z.array(exampleItemSchema).min(1),
  commonMistakes: z.array(mistakeItemSchema).min(1),
  /** How to work with an AI coding agent while learning this module. */
  agentGuidance: z.string().min(1),
  project: projectSchema,
  definitionOfDone: definitionOfDoneSchema,
  /** Ready-to-paste prompt the learner gives their AI agent so the agent
   *  independently reviews the built project against the DoD (the dual-check). */
  verificationPrompt: z.string().min(1),
  reviewQuestions: z.array(z.string()).min(1),
  /** What the learner is now capable of after completing the module. */
  capabilities: z.array(z.string()).min(1),
  /** Recommended next module slug, or null at the end of a chain. */
  nextModule: slugField.nullable(),
});

export const levelsFileSchema = z.array(levelSchema);
export const modulesFileSchema = z.array(moduleSchema);

/**
 * The capstone framework - the production-style process a learner runs on
 * their OWN product idea at the end of the curriculum (spec section 8).
 */
export const capstonePhaseSchema = z.object({
  slug: slugField,
  /** Position in the capstone sequence, 1-based, unique, ascending. */
  order: z.number().int().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Concrete artifacts the learner must produce before moving on. */
  deliverables: z.array(z.string()).min(1),
  /** Which earlier modules' skills this phase exercises. */
  drawsOnDomains: z.array(domainSchema).min(1),
});

export const capstoneFileSchema = z.array(capstonePhaseSchema);

export type LevelStatus = z.infer<typeof levelStatusSchema>;
export type Domain = z.infer<typeof domainSchema>;
export type Level = z.infer<typeof levelSchema>;
export type VocabularyItem = z.infer<typeof vocabularyItemSchema>;
export type ConceptItem = z.infer<typeof conceptItemSchema>;
export type ExplanationItem = z.infer<typeof explanationItemSchema>;
export type ExampleItem = z.infer<typeof exampleItemSchema>;
export type MistakeItem = z.infer<typeof mistakeItemSchema>;
export type DefinitionOfDone = z.infer<typeof definitionOfDoneSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type CapstonePhase = z.infer<typeof capstonePhaseSchema>;
