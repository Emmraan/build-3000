# Contributing to build-3000

Thank you for wanting to improve the curriculum! This project treats
**GitHub as the CMS**: the entire curriculum lives in JSON files, validated by
Zod schemas. If you can edit a file and run one command, you can contribute.

## Getting set up

```sh
git clone https://github.com/Emmraan/build-3000.git
cd build-3000
pnpm install
cp .env.example .env.local   # then edit NEXT_PUBLIC_SITE_URL if needed
```

Prerequisites: Node.js 22+ (see `.nvmrc`) and pnpm 11.22+
(`corepack enable` is recommended).

## The tested-PR rule

Before opening a PR, all of these must pass:

```sh
pnpm lint                  # eslint - 0 errors
pnpm typecheck             # tsc --noEmit
pnpm test                  # vitest suite
pnpm validate-curriculum   # zod + cross-reference checks on data/*.json
```

CI (`.github/workflows/validate.yml`) runs exactly these on every PR.
PRs below the `lib/` coverage gate (80%) cannot merge.

## Adding or editing curriculum content

1. Edit `data/modules.json` / `data/levels.json` following the shapes in
   `lib/schemas.ts` (see the example module on the website's Contribute page).
2. Run `pnpm validate-curriculum` - it enforces schemas AND cross-references:
   levels must resolve, prerequisites must exist without cycles, and every
   live module MUST carry a functional Definition of Done plus a verification
   prompt. No validation, no merge.
3. Keep content technically accurate and verifiable. No invented statistics,
   no fake sources.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/) -
`feat:`, `fix:`, `docs:`, `chore:` etc. They feed
[semantic-release](https://semantic-release.gitbook.io/), which generates
`CHANGELOG.md`, versions and GitHub releases automatically.

**Never hand-edit `CHANGELOG.md`.**

## Workflow

- One logical change per PR.
- Branches from latest `main`.
- The commit message describes the why when it is not obvious from the what.

## Reporting issues

Found a factual error in the curriculum? Open an issue with the specific
module slug, the wrong claim, and (if you can) the corrected version with a
source. Security issues follow the process in [SECURITY.md](SECURITY.md).

## Code of Conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
