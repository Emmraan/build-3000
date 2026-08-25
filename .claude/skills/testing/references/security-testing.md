# Security Testing

### Phase 9: Security Testing

28. **Design security testing integration.** Security tests must be part of the automated test pipeline, not an annual manual exercise:

    **SAST (Static Application Security Testing)** — run on every commit:
    - Scan source code for vulnerability patterns: SQL injection risks, hardcoded secrets, insecure function usage, path traversal patterns, unsafe deserialization.
    - Tools: Semgrep (recommended for customizable rules), SonarQube, CodeQL, Bandit (Python), Gosec (Go).
    - Configure to fail the CI pipeline on critical/high findings. Warn on medium findings.
    - Customize rules for your codebase: add rules for application-specific security patterns (e.g., "all database queries must use parameterized statements," "all API endpoints must call the authorization middleware").

    **Dependency scanning (SCA)** — run on every commit and daily:
    - Scan all dependencies (direct and transitive) for known vulnerabilities (CVEs).
    - Tools: Snyk, Dependabot, Renovate, OWASP Dependency-Check.
    - Fail CI on critical vulnerabilities with known exploits. Warn on others.

    **DAST (Dynamic Application Security Testing)** — run against staging:
    - Test the running application by sending crafted requests to discover vulnerabilities.
    - Tools: OWASP ZAP (recommended for automation), Nuclei.
    - Run against staging after deployment. Test: injection vulnerabilities, authentication bypass, broken authorization, information disclosure, security header presence.

    **Security-specific test cases** (include in the integration test suite):
    - **Authorization tests**: For every endpoint, test that unauthenticated requests are rejected (401), unauthorized requests are rejected (403), and users cannot access other users' resources (IDOR prevention). These tests are the most valuable security tests and should run on every commit.
    - **Input validation tests**: For every endpoint that accepts input, test with malicious payloads: SQL injection patterns (`' OR 1=1 --`), XSS patterns (`<script>alert('xss')</script>`), path traversal (`../../etc/passwd`), oversized payloads, and malformed data.
    - **Rate limiting tests**: Verify rate limits are enforced by sending N+1 requests and asserting the last is rejected with 429.
