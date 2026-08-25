# Documentation and Policy Governance

## Table of Contents
42. Author and maintain governance documents
43. Keep documentation in sync with practices
44. Produce a Repository Health Report

---

## 42. Author and Maintain Governance Documents

Author and maintain the following governance documents within the repository:

| Document | Purpose | Location |
|---|---|---|
| `README.md` | Project overview, quick start, badges, links to other docs | Repository root |
| `CONTRIBUTING.md` | How to contribute: branching, commits, PR process, coding standards | Repository root |
| `CODE_OF_CONDUCT.md` | Community behavior standards | Repository root |
| `CHANGELOG.md` | Version-by-version change log | Repository root |
| `LICENSE` | Legal licensing terms | Repository root |
| `CODEOWNERS` | Automated reviewer assignment | Repository root or `.github/` |
| `BRANCHING_STRATEGY.md` | Branching model documentation with diagrams | `docs/` or repository root |
| `RELEASE.md` | Release process and versioning strategy | `docs/` or repository root |
| `SECURITY.md` | How to report vulnerabilities, supported versions | Repository root |
| `ARCHITECTURE.md` | High-level architecture and repository structure decisions | `docs/` |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR description template | `.github/` |
| `.github/ISSUE_TEMPLATE/` | Issue templates for bugs, features, etc. | `.github/ISSUE_TEMPLATE/` |

## 43. Keep Documentation in Sync with Practices

Keep documentation in sync with practices. Whenever the branching strategy, merge policy, release process, or contribution guidelines change:
- Update the corresponding document in the same PR that implements the change.
- Announce the change to the team through the appropriate communication channel.
- Version governance documents using the same commit history as the codebase.

## 44. Produce a Repository Health Report

Produce a Repository Health Report when auditing an existing repository. Evaluate and report on:
- [ ] Default branch is protected with required reviews and status checks.
- [ ] Branch naming conventions are followed consistently.
- [ ] Commit messages follow the agreed convention.
- [ ] Stale branches (merged or inactive > 30 days) have been cleaned up.
- [ ] No secrets exist in the commit history.
- [ ] `.gitignore` is comprehensive and no generated/binary files are tracked inappropriately.
- [ ] Git LFS is configured for large binary files.
- [ ] CODEOWNERS is configured and up-to-date.
- [ ] PR template is present and used.
- [ ] CI/CD pipelines are triggered on the correct events.
- [ ] Tags follow semantic versioning and are annotated.
- [ ] CHANGELOG.md is maintained and current.
- [ ] CONTRIBUTING.md exists and reflects current practices.
- [ ] Access permissions follow least privilege.
- Provide a summary with a health score, identified issues, and prioritized remediation steps.
