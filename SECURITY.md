# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability in this project,
please report it **privately** — do not open a public issue.

Ways to report:

1. **GitHub private vulnerability reporting** — use the repository's
   **Security → Advisories → New draft security advisory** flow if available.
2. **Email the maintainers** — if a maintainer contact is listed in the repo
   metadata, use it directly.

Please include in your report:

- The affected version (commit hash, tag, or release).
- A clear description of the vulnerability and its impact.
- Reproduction steps or a minimal proof of concept, if possible.

## Response Timeline

| Step | Timeframe |
|---|---|
| Acknowledgement | within 48 hours |
| Initial triage / assessment | within 7 days |
| Fix released (or mitigation published) | as soon as practical, depending on severity |

We will keep the reporter informed as the issue is triaged and fixed, and we
will credit them in the release notes unless they prefer to stay anonymous.

## Supported Versions

Only the latest release on `main` receives security fixes. Older versions are
not patched; users are strongly encouraged to stay up to date.

## Security Posture

- This is a fully static site: no database, no server, no user accounts.
- Learner progress lives in the browser (`localStorage` only) — nothing
  personal is transmitted or stored server-side.
- This repository keeps no secrets; environment variables are loaded via
  `.env` files (git-ignored) or CI secrets.
- Curriculum data ships as JSON validated by Zod schemas — contributions go
  through `pnpm validate-curriculum` before merge.
- If you discover a leaked secret, treat it as compromised: rotate it and purge
  it from history immediately, then report it as described above.
