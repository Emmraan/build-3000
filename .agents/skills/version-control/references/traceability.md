# Issue Tracking, Traceability, and Change Management

## Table of Contents
39. Establish traceability between issues, commits, branches, and releases
40. Use labels and milestones
41. Integrate version control with project management tools

---

## 39. Establish Traceability Between Issues, Commits, Branches, and Releases

Establish traceability between issues, commits, branches, and releases:
- Every feature branch name includes the issue/ticket ID (e.g., `feature/PROJ-123-add-login`).
- Every commit message references the issue/ticket ID in the footer (`Refs PROJ-123`).
- Every PR description links to the issue(s) it addresses (`Closes #123`).
- Every release tag and changelog entry references the issues/PRs included.
- This chain enables full traceability: **Issue → Branch → Commits → PR → Merge → Tag → Release → Deployment**.

## 40. Use Labels and Milestones

Use labels and milestones for project tracking:
- Define a standard label taxonomy: `bug`, `feature`, `enhancement`, `documentation`, `tech-debt`, `security`, `breaking-change`, `good-first-issue`, `help-wanted`, `wontfix`, `duplicate`, `priority:critical`, `priority:high`, `priority:medium`, `priority:low`.
- Use milestones to group issues and PRs targeted for a specific release version.
- Automate label assignment based on file paths or PR content using GitHub Actions or GitLab triage bots.

## 41. Integrate Version Control with Project Management Tools

Integrate version control with project management tools:
- Connect GitHub/GitLab to Jira, Linear, Asana, or Azure Boards using native integrations or webhooks.
- Ensure that branch creation, PR status, and merge events automatically update issue statuses in the project management tool.
- Use smart commit syntax where supported (e.g., Jira Smart Commits: `PROJ-123 #done Fixed null pointer in auth module`).
