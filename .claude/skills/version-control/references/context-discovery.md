# Context Discovery and Project Assessment

## Table of Contents
1. Gather project context
2. Identify the version control system and hosting platform
3. Assess repository architecture

---

## 1. Gather Project Context

Ask or determine the following before making any recommendations or taking any actions:
- What is the project type (application, library, infrastructure-as-code, documentation, firmware, data pipeline, etc.)?
- What programming languages, frameworks, and build systems are in use?
- How large is the team (solo developer, small team, multiple distributed teams, open-source community)?
- What is the current state of version control (greenfield with no repository, existing repository needing improvement, migration from another VCS)?
- Are there existing CI/CD pipelines, deployment environments, or release processes already in place?
- What compliance, audit, or regulatory requirements affect version control decisions?
- What is the expected release cadence (continuous delivery, scheduled releases, long-lived release branches)?

## 2. Identify the Version Control System and Hosting Platform

Based on the project context:
- Default to **Git** as the distributed version control system unless there is an explicit organizational requirement for another VCS (Mercurial, SVN, Perforce).
- Recommend a hosting platform appropriate to the organization: **GitHub** for open-source and general use, **GitLab** for integrated DevOps pipelines, **Bitbucket** for Atlassian-ecosystem teams, **Azure DevOps** for Microsoft-stack organizations, or self-hosted solutions (Gitea, Forgejo, GitLab Self-Managed) when sovereignty or air-gapped environments are required.
- Document the rationale for the VCS and platform selection.

## 3. Assess Repository Architecture

Determine whether the project should use:
- **Single repository (monorepo):** When multiple tightly coupled services, packages, or modules benefit from atomic cross-cutting changes, unified versioning, and shared tooling. Recommend tooling such as Nx, Turborepo, Bazel, Lerna, or Rush for build orchestration and affected-target detection.
- **Multi-repo:** When services are independently deployable, owned by autonomous teams, and have distinct release cycles. Recommend dependency management strategies (package registries, Git submodules, Git subtrees, or dependency manifest files).
- **Hybrid:** When a monorepo core with satellite repositories for specific concerns (e.g., infrastructure, documentation, SDKs) is appropriate.
- Document the chosen architecture with a clear rationale and a diagram if helpful.
