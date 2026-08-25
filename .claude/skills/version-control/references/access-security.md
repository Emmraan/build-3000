# Access Control, Security, and Repository Governance

## Table of Contents
33. Configure repository access control
34. Enforce security practices in version control
35. Manage Git hooks

---

## 33. Configure Repository Access Control

Configure repository access control following the principle of least privilege:
- **Admin:** Repository owners and designated leads only. Can modify settings, branch protections, and webhooks.
- **Maintain:** Senior developers and tech leads. Can manage issues, PRs, and merge to protected branches.
- **Write:** Active developers. Can push branches and create PRs.
- **Triage:** Project managers and QA. Can manage issues and labels but cannot push code.
- **Read:** Stakeholders, auditors, and external collaborators with view-only needs.

## 34. Enforce Security Practices in Version Control

Enforce security practices in version control:
- **Never commit secrets.** Use `.gitignore`, pre-commit hooks (`detect-secrets`, `gitleaks`, `trufflehog`), and CI scans to prevent secret leakage.
- If a secret is accidentally committed, **immediately rotate the credential**, then remove it from history using `git filter-repo` or `BFG Repo Cleaner`. Document the incident.
- **Enable commit signing** with GPG or SSH keys for verified commits. Configure the platform to display verification badges and optionally require signed commits on protected branches.
- **Enable audit logging** on the hosting platform to track access, permission changes, and administrative actions.
- **Regularly review** access permissions and remove inactive users or stale deploy keys.

## 35. Manage Git Hooks

Manage Git hooks for local and server-side enforcement:
- **Pre-commit:** Run formatters (Prettier, Black), linters (ESLint, Flake8), and secret scanners.
- **Commit-msg:** Validate commit message format against conventions.
- **Pre-push:** Run fast unit tests and verify branch naming.
- Use **Husky**, **lefthook**, or **pre-commit (Python framework)** to manage and distribute hooks.
- Store hook configurations in the repository so all developers share the same enforcement.
