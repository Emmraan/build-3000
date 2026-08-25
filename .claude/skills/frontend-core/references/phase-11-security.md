# Phase 11 — Frontend Security

25. **Design the frontend security architecture.** Define protections against common client-side attack vectors:

    - **Cross-Site Scripting (XSS) prevention:**
      - Use framework-native output encoding (React's JSX auto-escaping, Vue's template auto-escaping). Never use `dangerouslySetInnerHTML` / `v-html` / `{@html}` unless the content is sanitized with DOMPurify or equivalent.
      - Define a Content Security Policy (CSP) header strategy: `script-src 'self'`, restrict `style-src`, disable `eval()`. Document any required exceptions (e.g., analytics scripts) and the justification.
      - Sanitize all user-generated content before rendering, even if received from the backend.
    - **Cross-Site Request Forgery (CSRF) protection:**
      - If using cookie-based authentication: ensure the backend sets `SameSite=Strict` or `SameSite=Lax` cookies and implements CSRF tokens. The frontend must include the CSRF token in state-changing requests.
      - If using token-based authentication (Bearer tokens in headers): CSRF is inherently mitigated. Ensure tokens are never stored in `localStorage` (prefer `httpOnly` cookies or in-memory storage with refresh token rotation).
    - **Authentication token security:**
      - Define the token storage strategy and justify: `httpOnly` cookies (most secure for web), in-memory variable with refresh via `httpOnly` cookie (good balance), `sessionStorage` (acceptable for low-risk apps), `localStorage` (discouraged — vulnerable to XSS).
      - Define the token refresh flow: silent refresh before expiration, retry on 401, redirect to login on refresh failure.
      - Define session timeout behavior: inactivity timeout, absolute session timeout, user notification before logout.
    - **Dependency security:**
      - Enable `npm audit` or `pnpm audit` in CI pipeline. Fail the build on high/critical severity vulnerabilities.
      - Use Dependabot, Renovate, or Socket for automated dependency update PRs.
      - Define the policy for evaluating new dependencies: check bundle size, maintenance status, known vulnerabilities, license compatibility.
    - **Sensitive data handling:**
      - Never log sensitive data (passwords, tokens, PII) to the browser console in production.
      - Mask sensitive fields in error reporting payloads.
      - Clear sensitive in-memory state on logout.
      - Disable autocomplete on sensitive form fields where appropriate.