# AGENTS.md — build-3000

Single source of truth for AI agents working in this repository. Read this file
first before touching anything. `CLAUDE.md` is a thin pointer back here.

## Project

**build-3000** — an open-source learning platform that teaches complete beginners
("vibe coders") the essential concepts of software engineering so they can direct
AI coding agents to build secure, production-ready software. Inspired by the
Oxford 3000 core-vocabulary philosophy.

- Tagline: *"The essential concepts for building software with AI coding agents."*
- Stack: Next.js + TypeScript + Tailwind CSS v4. Static, JSON-data-driven, no external DB.
- Data: curriculum in `data/*.json` (levels, modules). Zod schemas are the single source of truth.
- Learner state: browser-only (`localStorage`). No accounts, no backend.
- Deploy: Vercel. Package manager: **pnpm**.
- License: MIT.

## Workflow (non-negotiable)

1. **Research first, always.** Before ANY task/fix: web-fetch/reference check ->
   load the right skill (`.agents/skills/`) -> plan -> only then code. Never implement blindly.
2. **Small branches.** Work in short-lived branches off `main`; squash-merge
   with one Conventional Commit per change.
3. **`pnpm` only.** The agent writes deps into `package.json`; the **user runs
   install/build commands**. Never run heavy installs/builds without the user's
   go-ahead (low-end machine rule).
4. **Fast dev.** Lint/typecheck/build/test run ONLY on new/modified files
   (lint-staged, `tsc incremental`, vitest `--changed`). Never the full suite on
   every change.
5. **No fabrication.** Curriculum content must be technically accurate and
   verifiable. No invented statistics, no fake sources.
6. **Content integrity.** Every shipped module includes a Definition of Done and a
   verification prompt — enforced by `scripts/validate-curriculum.ts`.
7. **Conventional Commits** on every commit; `feat`/`fix` types feed semantic-release.

## Repo layout

| Files | Description |
|---|---|
| `AGENTS.md`, `CLAUDE.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.nvmrc`, `.vscode/settings.json`, `.agents/`, `.claude/`, `.opencode/`, `skills-lock.json` | Project config & agent skills |
| `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css` | Scaffold & design system |
| `lib/schemas.ts`, `lib/types.ts`, `lib/data.ts`, `data/*.json`, `scripts/validate-curriculum.ts` | Curriculum data layer |
| `components/ui/*`, pages, tests, CI | Features & quality gates |

## Commands

| Task | Command | Who runs |
|---|---|---|
| Install deps | `pnpm install` | user (agent writes deps only) |
| Typecheck | `tsc --noEmit` (incremental) | agent, on changed files |
| Lint | lint-staged (staged files) | agent |
| Test | `vitest` (`--changed`) | agent |
| Validate curriculum | `pnpm validate-curriculum` | agent (from P2) |
| Build | `next build` | user (heavy) |

## Skills

Installed skills live in `.agents/skills/` (plus `.claude/skills/` and
`.opencode/skill/` copies); locked versions in `skills-lock.json`.
