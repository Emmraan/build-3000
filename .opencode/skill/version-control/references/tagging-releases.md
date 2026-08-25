# Tagging, Release Versioning, and Changelog Management

## Table of Contents
24. Implement Semantic Versioning (SemVer 2.0.0)
25. Create and manage Git tags for releases
26. Automate versioning and changelog generation
27. Structure the CHANGELOG.md
28. Define the release process

---

## 24. Implement Semantic Versioning (SemVer 2.0.0)

Implement Semantic Versioning (SemVer 2.0.0) as the default versioning scheme:

```
MAJOR.MINOR.PATCH[-prerelease][+buildmetadata]
```

- **MAJOR:** Incremented for incompatible API changes or breaking changes.
- **MINOR:** Incremented for backward-compatible new functionality.
- **PATCH:** Incremented for backward-compatible bug fixes.
- **Pre-release:** `-alpha.1`, `-beta.2`, `-rc.1` for pre-release versions.
- **Build metadata:** `+build.123`, `+sha.abc1234` for build identification.

If the project is a non-library (e.g., a deployed service), consider **CalVer** (`YYYY.MM.DD` or `YYYY.MM.MICRO`) and document the rationale.

## 25. Create and Manage Git Tags for Releases

Create and manage Git tags for releases:
- Use **annotated tags** for releases: `git tag -a v1.2.0 -m "Release v1.2.0: <summary>"`.
- Never use lightweight tags for releases.
- Push tags explicitly: `git push origin v1.2.0` or `git push origin --tags`.
- Never delete or move published tags. If a release is defective, create a new patch version.
- Protect tags from deletion and force-updates on the hosting platform.

## 26. Automate Versioning and Changelog Generation

Automate versioning and changelog generation:
- Use tools like **standard-version**, **semantic-release**, **release-please**, or **changesets** to automate version bumping based on Conventional Commits.
- Configure the tool to:
  - Analyze commit messages since the last tag.
  - Determine the version bump (major, minor, patch) automatically.
  - Update version references in package manifests (`package.json`, `pyproject.toml`, `build.gradle`, etc.).
  - Generate or update `CHANGELOG.md` in the **Keep a Changelog** format.
  - Create a Git tag and a GitHub/GitLab release with release notes.

## 27. Structure the CHANGELOG.md

Structure the CHANGELOG.md following the Keep a Changelog format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- New OAuth2 PKCE authentication flow (#892)

### Fixed
- Resolved race condition in session management (#901)

## [1.2.0] - 2025-01-15

### Added
- Webhook retry mechanism with exponential backoff (#845)
- Admin dashboard user activity report (#860)

### Changed
- Upgraded PostgreSQL driver to v5.2 (#872)

### Deprecated
- Legacy XML API endpoints (will be removed in v2.0.0)

### Security
- Patched CVE-2024-XXXXX in dependency `libcrypto` (#880)

[Unreleased]: https://github.com/org/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/org/repo/compare/v1.1.3...v1.2.0
```

## 28. Define the Release Process

Define the release process and document it in `RELEASE.md` or `CONTRIBUTING.md`:
- Step-by-step instructions for creating a release (manual or automated).
- Who is authorized to trigger a release.
- How pre-release versions are published and promoted.
- How hotfixes are expedited into a release.
- How release artifacts are generated and distributed.
