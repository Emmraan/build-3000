# Repository Initialization and Structure

## Table of Contents
4. Initialize the repository with a standardized structure
5. Configure `.gitignore` precisely
6. Configure `.gitattributes` for consistency
7. Set the default branch name

---

## 4. Initialize the Repository with a Standardized Structure

When creating a new repository, ensure the following foundational elements are present:

```
/
├── .gitignore                  # Language/framework-specific ignores (use gitignore.io or GitHub templates)
├── .gitattributes              # Line-ending normalization, binary file handling, diff drivers, merge strategies
├── README.md                   # Project name, purpose, quick start, prerequisites, contribution link
├── LICENSE                     # SPDX-identified license file
├── CHANGELOG.md                # Structured changelog (Keep a Changelog format)
├── CONTRIBUTING.md             # Contribution guidelines, coding standards, PR process
├── CODE_OF_CONDUCT.md          # Community standards (if applicable)
├── CODEOWNERS                  # Map directories/files to responsible reviewers
├── .editorconfig               # Consistent formatting across editors
├── .github/ or .gitlab/        # Platform-specific configuration
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── config.yml
│   └── workflows/              # CI/CD pipeline definitions
├── docs/                       # Extended documentation
├── src/ or lib/ or packages/   # Source code
├── tests/                      # Test suites
└── scripts/                    # Build, deployment, and utility scripts
```

## 5. Configure `.gitignore` Precisely

Include patterns for:
- Build artifacts and output directories (`dist/`, `build/`, `out/`, `target/`).
- Dependency directories (`node_modules/`, `vendor/`, `.venv/`, `__pycache__/`).
- IDE and editor files (`.idea/`, `.vscode/` — except shared workspace settings if team-agreed).
- OS-generated files (`.DS_Store`, `Thumbs.db`).
- Secrets and environment files (`.env`, `.env.local`, `*.pem`, `*.key`). **Never commit secrets.**
- Log files, coverage reports, and temporary files.

## 6. Configure `.gitattributes` for Consistency

Set:
- `* text=auto` for automatic line-ending normalization.
- Binary file declarations (`*.png binary`, `*.zip binary`).
- Custom diff drivers for generated files (e.g., `*.lock linguist-generated`).
- Merge strategies for files that should not produce textual conflicts (e.g., `package-lock.json merge=ours` or use regeneration).

## 7. Set the Default Branch Name

Use `main` as the default branch unless organizational convention dictates otherwise. Configure the hosting platform to set this as the default and protect it immediately.
