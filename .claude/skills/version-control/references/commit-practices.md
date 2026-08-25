# Commit Practices and History Management

## Table of Contents
11. Define and enforce a commit message convention
12. Enforce commit message format
13. Guide atomic commit practices
14. Maintain clean commit history
15. Never rewrite history on shared/protected branches

---

## 11. Define and Enforce a Commit Message Convention

Define and enforce a commit message convention. Recommend **Conventional Commits** as the default standard:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Scope:** Module, component, or area affected (e.g., `auth`, `api`, `ui`, `db`).
- **Subject:** Imperative mood, lowercase, no period, max 72 characters.
- **Body:** Explain *what* and *why*, not *how*. Wrap at 72 characters.
- **Footer:** Reference issues (`Closes #123`, `Refs JIRA-456`), note breaking changes (`BREAKING CHANGE: description`).

Example:
```
feat(auth): add OAuth2 PKCE flow for mobile clients

Implement the Authorization Code flow with PKCE extension to support
public clients (mobile and SPA) that cannot securely store client
secrets. This replaces the implicit grant flow.

Closes #892
BREAKING CHANGE: implicit grant flow endpoints are removed
```

## 12. Enforce Commit Message Format

Enforce commit message format using:
- **commitlint** with `@commitlint/config-conventional` configured via a `commitlint.config.js` or `.commitlintrc.yml`.
- **Husky** or **lefthook** for Git hooks that run commitlint on `commit-msg`.
- Server-side or CI checks that reject non-conforming commits on pull requests.

## 13. Guide Atomic Commit Practices

Guide atomic commit practices. Instruct developers (and follow when acting as the agent):
- Each commit should represent **one logical change** — a single feature addition, a single bug fix, a single refactor.
- Do not mix formatting changes with functional changes in the same commit.
- Do not commit partial, broken, or work-in-progress code to shared branches. Use `git stash` or WIP branches for incomplete work.
- Use `git add -p` (interactive staging) to stage only related hunks.

## 14. Maintain Clean Commit History

Maintain clean commit history. Apply the following practices:
- **Interactive rebase** (`git rebase -i`) to squash fixup commits, reorder, and reword messages before merging a feature branch.
- **Squash merges** for feature branches where individual commits are not meaningful to the mainline history.
- **Merge commits** (no fast-forward: `git merge --no-ff`) when preserving branch topology is important for auditability.
- **Rebase and merge** when a linear history on `main` is preferred.
- Document the chosen merge strategy in `CONTRIBUTING.md` and enforce it via platform merge settings.

## 15. Never Rewrite History on Shared/Protected Branches

Never rewrite history on shared/protected branches. Enforce `--force-push` protection on `main`, `develop`, and `release/*` branches. Allow force-push only on personal feature branches and only before review is requested.
