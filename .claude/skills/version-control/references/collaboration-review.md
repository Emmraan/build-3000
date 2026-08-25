# Collaboration Workflows and Code Review

## Table of Contents
16. Design the pull request (PR) / merge request (MR) workflow
17. Create a PR/MR template
18. Configure branch protection rules
19. Configure CODEOWNERS
20. Guide effective code review practices

---

## 16. Design the Pull Request (PR) / Merge Request (MR) Workflow

Design the pull request (PR) / merge request (MR) workflow. Establish the following lifecycle:

```
Developer creates feature branch
     ↓
Developer pushes branch and opens PR/MR
     ↓
Automated checks run (linting, tests, build, security scan)
     ↓
Code review by designated reviewers (from CODEOWNERS or manual assignment)
     ↓
Reviewer provides feedback → Developer addresses feedback
     ↓
All checks pass + required approvals obtained
     ↓
PR/MR is merged using the agreed merge strategy
     ↓
Feature branch is automatically deleted
```

## 17. Create a PR/MR Template

Create a PR/MR template that enforces structured descriptions:

```markdown
## Summary
<!-- What does this PR do? Why is it needed? -->

## Related Issues
<!-- Link to issue(s): Closes #, Refs # -->

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Chore / Maintenance
- [ ] Breaking change

## Changes Made
<!-- Bullet list of key changes -->

## Testing
<!-- How was this tested? Include test commands, screenshots, or steps to reproduce. -->

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated (if applicable)
- [ ] No secrets or credentials committed
- [ ] Changelog updated (if applicable)
```

## 18. Configure Branch Protection Rules

Configure branch protection rules on the hosting platform for `main` (and `develop` if using GitFlow):
- Require a minimum number of approving reviews (recommended: 1 for small teams, 2 for larger teams).
- Require status checks to pass before merging (CI build, tests, linting, security scans).
- Require branches to be up-to-date with the target branch before merging.
- Require conversation resolution before merging.
- Enforce linear history or specific merge methods as agreed.
- Restrict who can push directly to protected branches.
- Require signed commits if the organization mandates cryptographic verification.

## 19. Configure CODEOWNERS

Configure CODEOWNERS to automate reviewer assignment:

```
# Default owners for everything
* @team-lead @senior-dev

# Frontend
/src/frontend/    @frontend-team
/src/components/  @frontend-team

# Backend API
/src/api/         @backend-team

# Infrastructure
/infra/           @devops-team
/terraform/       @devops-team

# Documentation
/docs/            @tech-writer @team-lead

# CI/CD pipelines
/.github/workflows/ @devops-team @team-lead
```

## 20. Guide Effective Code Review Practices

Guide effective code review practices. When reviewing or advising on reviews:
- Review for correctness, security, performance, readability, and maintainability.
- Provide actionable, specific, and kind feedback. Distinguish between blockers (must fix), suggestions (nice to have), and questions (seeking understanding). Use prefixes: `[blocking]`, `[suggestion]`, `[question]`, `[nit]`.
- Keep PRs small and focused (< 400 lines of meaningful code changes). If a PR is too large, suggest decomposition.
- Review within an agreed SLA (e.g., 24 hours for initial review).
- Use threaded conversations to discuss specific code sections.
- Approve only when all blocking concerns are resolved.
