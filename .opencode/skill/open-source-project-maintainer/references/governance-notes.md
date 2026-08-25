# Governance Reference Notes (condensed)

Condensed from `docs/reference/omniroute-notes.md` (pure-OSS MIT npm monorepo) and `docs/reference/dokploy-notes.md` (open-core pnpm monorepo). Optional supplement to `SKILL.md` — it is fully usable without this file.

## OmniRoute (pure OSS)

- Changelog: fragments in `changelog.d/{features|fixes|maintenance}/<PR>-<slug>.md`; aggregated into `CHANGELOG.md` at release; integrity gate fails any PR touching `CHANGELOG.md` directly.
- Quality ratchets: metrics vs `quality-baseline.json`, CI enforces no-regression; budget check runs as pre-commit gate.
- Git hooks (husky): pre-commit = lint-staged + docs-sync + budget check + tracked-artifacts check; pre-push intentionally light, heavy gates in CI.
- Merge queue: `.mergify.yml` queue on `main`; the `queue` label IS the merge approval (no manual merge button).
- Publish: staged npm publish — version, then publish with 2FA + SBOM + provenance, then boot-smoke of the installed artifact.
- Docker publish: multi-arch; Trivy gate on CRITICAL.
- Security: gitleaks in pre-commit + CI; codeql, semgrep, scorecard, dast-smoke.
- Nightly (outside PR path): compat, mutation, property, schemathesis, resilience, release-green, llm-security.
- AI context: `AGENTS.md` single source of truth; `CLAUDE.md`/`GEMINI.md` are thin pointers.
- Contributor docs: `CONTRIBUTING.md` redirects to a maintained golden path in `docs/`; `SECURITY.md` (Security Advisories, response timeline, supported versions); `CODEOWNERS`, `FUNDING.yml`, `pull_request_template.md`, `ROADMAP.md`.
- Dependabot: grouped updates; `ignore-major` for peer-range-blocked deps.

## Dokploy (open-core dual-license)

- Licensing: `LICENSE.MD` (OSS core) + `LICENSE_PROPRIETARY.md` (DSAL v1.0, applies only to `/proprietary` code; free to modify/patch, production use needs commercial agreement, dev/testing exempt) + `TERMS_AND_CONDITIONS.md` (no commercial resale as a service without consent, no data collection, AS-IS, terms may change).
- Branching: `canary` = dev source of truth, PRs merge to canary; `create-pr.yml` auto-opens a version-gated `canary → main` release PR (labelled `release`/`automated pr`); `main` = latest stable.
- Hotfix: `hotfix-cherry-pick.yml` cherry-picks merged `hotfix`-tagged PRs onto `main`, then back-syncs `main` into `canary` (conflict detection); `hotfix-release.yml` manually bumps patch on `main`.
- Release: multi-arch buildx (`docker-amd`/`docker-arm`, arm on arm runners) + `imagetools create` combine into `latest`/`canary`/`feature`/versioned tags; `generate-release` attaches an `install.sh` pinned and re-pinned to the exact `DOKPLOY_VERSION`; `sync-version` regenerates OpenAPI and syncs version + spec to `mcp`/`cli`/`sdk` via `DOCS_SYNC_TOKEN`.
- Contributor docs: `CONTRIBUTING.md` (Conventional Commits, clone from `canary`, Node pinned via nvm, Docker required, Biome note, tested-PR rule "Untested PRs will be rejected", single-purpose PRs, large features need an issue first); `SECURITY.md` (email, no public disclosure before investigation); issue templates (`bug_report.yml`, `feature-request.yml`, `config.yml`); `CODEOWNERS`, `FUNDING.yml` + `sponsors/`; `.devcontainer/`.
- Stack: pnpm workspaces, `packageManager` pinned, `.nvmrc`, Biome + lint-staged, Drizzle migrations tracked, OpenAPI generated and synced downstream.

## Reusable patterns

1. Changelog fragments + aggregation + integrity gate = conflict-free changelogs.
2. Merge queue (label = approval) beats merge-button discipline.
3. Fast gates on PR, heavy gates nightly — never block contributors on slow jobs.
4. Quality ratchets prevent regression mechanically.
5. canary→main with version-gated auto-PR + hotfix cherry-pick/back-sync = stable main, unreleased canary.
6. Release = coordinated propagation: version bump → tag → staged publish (2FA/SBOM/provenance/boot-smoke) → multi-arch images (Trivy CRITICAL gate) → pinned install script → downstream CLI/SDK/MCP sync.
7. Open-core dual license: OSS core + per-folder source-available license + terms file, boundary enforced in CI.
8. Contributor docs: `CONTRIBUTING.md` redirect to maintained golden path; structured issue templates; explicit tested-PR rule.
