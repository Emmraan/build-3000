# Large Repository and Monorepo Management

## Table of Contents
36. Optimize large repository performance
37. Implement monorepo-specific workflows
38. Plan repository migration and splitting strategies

---

## 36. Optimize Large Repository Performance

Optimize large repository performance:
- Use **shallow clones** (`git clone --depth 1`) for CI pipelines that do not need full history.
- Use **partial clones** (`git clone --filter=blob:none`) to defer blob downloads until checkout.
- Use **sparse checkout** (`git sparse-checkout`) to limit the working directory to relevant subdirectories.
- Use **Git LFS (Large File Storage)** for binary assets, media files, datasets, and any file exceeding 1 MB that is not text. Configure `.gitattributes` to track LFS patterns: `*.psd filter=lfs diff=lfs merge=lfs -text`.
- Periodically run `git gc` and `git repack` to optimize the repository pack file.

## 37. Implement Monorepo-Specific Workflows

Implement monorepo-specific workflows:
- Use **path-based CI triggers** so that changes to `/packages/auth/` only trigger the auth service pipeline, not the entire repository.
- Use **CODEOWNERS per directory** to route reviews to the owning team.
- Use **workspace-aware package managers** (npm workspaces, Yarn workspaces, pnpm workspaces, Cargo workspaces, Go modules) for dependency management.
- Use **build orchestration tools** (Nx, Turborepo, Bazel, Pants, Rush) for incremental builds, caching, and affected-target detection.
- Implement **directory-level ownership boundaries** and enforce them with linting rules that prevent unauthorized cross-boundary imports.

## 38. Plan Repository Migration and Splitting Strategies

Plan repository migration and splitting strategies when needed:
- To split a directory out of a monorepo into its own repository: use `git filter-repo --subdirectory-filter <dir>` to preserve history.
- To merge repositories into a monorepo: use `git subtree add` or the merge-unrelated-histories strategy with directory prefixes.
- Document migration plans, communicate to all stakeholders, and update CI/CD configurations, documentation links, and dependency references.
