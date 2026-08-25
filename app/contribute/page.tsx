import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contribute",
  description:
    "build-3000 is GitHub-as-CMS: the curriculum lives in JSON files validated by Zod schemas. Add modules, fix definitions, improve projects - every PR runs the same validation gate.",
  path: "/contribute",
});

const STEPS = [
  {
    title: "1. Find what to change",
    body: "Browse data/modules.json and data/levels.json. Every module is one JSON object; every level is one row of the ladder. Content lives in files, not a CMS.",
  },
  {
    title: "2. Follow the schema",
    body: "lib/schemas.ts is the single source of truth. A module needs all fifteen sections: objective, vocabulary, concepts, prerequisites, explanations, examples, mistakes, agent guidance, project brief with agent context, grouped Definition of Done, verification prompt, review questions, capabilities and next-module link.",
  },
  {
    title: "3. Validate before you commit",
    body: "Run pnpm validate-curriculum. It checks schemas AND cross-references: levels resolve, prerequisites exist, no cycles, and every live module carries a functional DoD plus a verification prompt. No validation, no merge.",
  },
  {
    title: "4. Open a conventional PR",
    body: "One logical change per PR with a Conventional Commit message (feat:, fix:, docs:). CI re-runs lint, typecheck, tests and curriculum validation automatically.",
  },
];

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contribute" }]}
      />

      <h1 className="mt-6 font-display text-4xl tracking-tight text-foreground">
        Contribute
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        build-3000 is fully open source under MIT. The whole curriculum lives
        in version-controlled JSON - GitHub is the CMS. If you can edit a file
        and run one command, you can improve the curriculum.
      </p>

      <ol className="mt-10 space-y-6">
        {STEPS.map((step) => (
          <li key={step.title} className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-xl tracking-tight text-foreground">
              {step.title}
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      <section aria-labelledby="example-heading" className="mt-12">
        <h2
          id="example-heading"
          className="font-display text-2xl tracking-tight text-foreground"
        >
          What a module looks like
        </h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-secondary p-5 font-mono text-xs leading-relaxed text-foreground">
{`{
  "slug": "my-new-module",
  "title": "...",
  "level": "level-0-foundations",
  "domain": "fundamentals",
  "summary": "One line for cards and search.",
  "order": 6,
  "objective": "What the learner will be able to do...",
  "vocabulary": [{ "term": "...", "meaning": "..." }],
  "concepts": [{ "name": "...", "explanation": "..." }],
  "prerequisites": ["an-existing-module-slug"],
  "explanations": [{ "title": "...", "body": "..." }],
  "examples": [{ "title": "...", "description": "..." }],
  "commonMistakes": [{ "mistake": "...", "fix": "..." }],
  "agentGuidance": "How to work with an AI agent here...",
  "project": {
    "slug": "the-project",
    "title": "...",
    "brief": "...",
    "requirements": ["..."],
    "agentContext": "Paste-ready context for the learner's agent."
  },
  "definitionOfDone": {
    "functional": ["..."], "architecture": [], "security": [],
    "testing": [], "production": []
  },
  "verificationPrompt": "The audit prompt for their agent...",
  "reviewQuestions": ["..."],
  "capabilities": ["..."],
  "nextModule": null
}`}
        </pre>
      </section>

      <section
        aria-labelledby="integrity-heading"
        className="mt-12 rounded-lg border-l-4 border-accent bg-card p-6"
      >
        <h2
          id="integrity-heading"
          className="font-display text-xl tracking-tight text-foreground"
        >
          Content integrity rules
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>- Technically accurate and verifiable only - no invented statistics or fake sources.</li>
          <li>- Every live module ships a Definition of Done and a verification prompt. Non-negotiable.</li>
          <li>- Plain language over jargon; define a term before depending on it.</li>
          <li>- Projects stay agent-agnostic: transferable skills, tool-specific tips only where unavoidable.</li>
        </ul>
      </section>

      <p className="mt-10 text-sm text-muted-foreground">
        Found something broken?{" "}
        <a
          href="https://github.com/Emmraan/build-3000/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Open an issue
        </a>{" "}
        or{" "}
        <Link href="/curriculum" className="text-accent hover:underline">
          go back to learning
        </Link>
        .
      </p>
    </div>
  );
}
