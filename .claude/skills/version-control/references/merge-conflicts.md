# Merge Conflict Resolution and Repository Synchronization

## Table of Contents
21. Prevent merge conflicts proactively
22. Resolve merge conflicts systematically
23. Handle repository synchronization for distributed teams

---

## 21. Prevent Merge Conflicts Proactively

Prevent merge conflicts proactively:
- Keep feature branches short-lived (merge within 1-3 days).
- Regularly synchronize feature branches with the target branch (`git pull --rebase origin main` or `git merge origin/main`).
- Avoid multiple developers modifying the same files simultaneously; use CODEOWNERS and task assignment to minimize overlap.
- Break large changes into smaller, sequential PRs.

## 22. Resolve Merge Conflicts Systematically

Resolve merge conflicts systematically when they occur:
- **Step 1:** Identify conflicting files using `git status` or the hosting platform's conflict indicator.
- **Step 2:** Understand both sides of the conflict by reviewing the incoming changes and the current branch changes in context.
- **Step 3:** Choose a resolution strategy:
  - **Manual resolution:** Edit the conflicting file, remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), and combine changes logically.
  - **Accept theirs/ours:** When one side's changes are entirely correct (`git checkout --theirs <file>` or `git checkout --ours <file>`).
  - **Use a merge tool:** Configure `git mergetool` with a visual tool (VS Code, IntelliJ, Beyond Compare, Meld).
- **Step 4:** After resolving, stage the resolved files (`git add <file>`), run the full test suite to verify correctness, and complete the merge/rebase.
- **Step 5:** Document the conflict resolution rationale in the commit message body if the resolution involved non-obvious decisions.

## 23. Handle Repository Synchronization for Distributed Teams

Handle repository synchronization for distributed teams:
- Define upstream/downstream relationships for forked repositories.
- Establish a cadence for syncing forks with upstream (`git fetch upstream && git rebase upstream/main`).
- For multi-repo architectures, use dependency pinning with exact versions and automated dependency update tools (Dependabot, Renovate).
