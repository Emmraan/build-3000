# build-3000

> The essential concepts for building software with AI coding agents.

An open-source curriculum that takes complete beginners - "vibe coders" - from
zero to shipping secure, production-ready software through AI coding agents.
Inspired by the Oxford 3000: the core vocabulary that carries the English
language, reimagined for software engineering.

**The promise:** complete the live levels and you can take an application idea
from zero to a deployed, verified product using an AI coding agent - without
needing another programming course.

**The principle:** AI writes the code. You stay the director -
specify, delegate, inspect, verify, secure, ship.

## What this is

- **Six-level ladder** from Foundations to AI-Native applications. Levels 0-2
  are fully written; the rest are public roadmap.
- **Eighteen hands-on modules**, each with vocabulary, concepts, examples,
  common mistakes, AI-agent guidance and a real project.
- **A dual-check verification model**: every module ships a Definition of Done
  checklist you verify by hand, plus a generated verification prompt your own
  AI agent audits independently. Where the two disagree is where you learn.
- **A capstone framework**: seventeen production-process steps - requirements
  through readiness review - that you run on your own product idea.
- Fully static, no accounts, no tracking. Learner progress lives in your
  browser's localStorage and never leaves it.

## Tech stack

| Layer    | Choice                              | Notes                                    |
| -------- | ----------------------------------- | ---------------------------------------- |
| Framework| Next.js 16 (App Router, Turbopack)  | Static-first, SSG for all module pages   |
| Language | TypeScript 5.9 (strict, incremental)| `tsc --noEmit`                           |
| Styling  | Tailwind CSS v4                     | Warm "ink & paper" token system          |
| Fonts    | Geist Sans/Mono + Instrument Serif  | Editorial display type                   |
| Data     | JSON + Zod 4                        | `lib/schemas.ts` is the single source of truth |
| Testing  | Vitest 4 + coverage v8              | `lib/` gated at >= 80%                   |
| Release  | semantic-release                    | Conventional Commits drive versions      |
| Deploy   | Vercel                              | Static; env var required (see below)     |

## Quick start

```sh
git clone https://github.com/Emmraan/build-3000.git
cd build-3000
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
pnpm dev                     # http://localhost:3000
```

Prerequisites: Node.js 22+ (`.nvmrc`) and pnpm 11+ (`corepack enable`).

## Curriculum structure

Every module follows the same fifteen-part shape:

objective -> vocabulary -> concepts -> prerequisites -> explanations ->
examples -> common mistakes -> AI-agent guidance -> project brief with agent
context -> grouped Definition of Done -> verification prompt -> review
questions -> capabilities -> next-module link

Levels:

| Level | Name          | Status  | Tagline                                              |
| ----- | ------------- | ------- | ---------------------------------------------------- |
| 0     | Foundations   | Live    | "I have an idea but don't know how to build it."     |
| 1     | First Apps    | Live    | "AI can build a simple app for me."                  |
| 2     | Real Apps     | Live    | "I can give AI structured requirements."             |
| 3     | Production    | Roadmap | "I can make AI build secure production applications."|
| 4     | Scale & Systems | Roadmap | "I can reason about scalability and reliability."  |
| 5     | AI-Native Apps | Roadmap | "I can build serious AI-powered products."         |

## Data model

`data/levels.json`, `data/modules.json` and `data/capstone.json` hold the
curriculum. `lib/schemas.ts` defines the Zod schemas; nothing renders that has
not parsed. `scripts/validate-curriculum.ts` additionally enforces
cross-references (levels resolve, prerequisite chains are acyclic) and the
content-integrity rule: every live module carries a functional Definition of
Done and a verification prompt.

Contributions are JSON PRs - see [CONTRIBUTING.md](CONTRIBUTING.md).

## Scripts

| Command                  | What it does                                  |
| ------------------------ | --------------------------------------------- |
| `pnpm dev`               | Dev server                                     |
| `pnpm build`             | Production build (needs `NEXT_PUBLIC_SITE_URL`)|
| `pnpm lint`              | ESLint over the repo                           |
| `pnpm typecheck`         | TypeScript check                               |
| `pnpm test`              | Vitest suite                                   |
| `pnpm test:coverage`     | Tests + lib/ coverage gate (>= 80%)            |
| `pnpm validate-curriculum` | Zod + cross-reference validation of data     |

## Deploying on Vercel

1. Push the repository to GitHub and import it in Vercel.
2. Set environment variable `NEXT_PUBLIC_SITE_URL`
   (e.g. `https://your-domain.vercel.app`) for Production + Preview.
3. Deploy. The sitemap hard-errors without the URL, so misconfiguration fails
   fast rather than shipping broken canonicals.

No database, no server, no other infrastructure.

## Contributing

Corrections, better examples and new modules are welcome - the contribution
flow and validation gate are described in
[CONTRIBUTING.md](CONTRIBUTING.md). Every change goes through the same
schema checks the site itself runs.

## License

[MIT](LICENSE) - copyright build-3000 contributors.
