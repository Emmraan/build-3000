# Phase 10 — Testing Strategy

24. **Design the frontend testing architecture.** Define a comprehensive, pragmatic testing strategy using the testing trophy model (or testing pyramid adapted for frontend):

    - **Static Analysis (base layer — runs on every save):**
      - TypeScript in strict mode (`"strict": true`) — the most cost-effective bug prevention.
      - ESLint with framework-specific plugin, accessibility plugin, and import-order plugin.
      - Prettier for formatting (remove style debates from code reviews).
      - Husky + lint-staged for pre-commit enforcement.

    - **Unit Tests (for complex logic, not trivial components):**
      - **What to unit test:** Custom hooks, utility functions, state management logic, data transformation functions, validation schemas, complex conditional logic.
      - **What NOT to unit test:** Simple presentational components, trivial getters/setters, framework internals.
      - **Tools:** Vitest (recommended for Vite-based projects) or Jest.
      - **Coverage target:** 80%+ for utility and logic modules. Do not mandate coverage for component files.

    - **Component/Integration Tests (highest value layer):**
      - **What to test:** Component behavior as the user experiences it. Render the component, simulate user interactions (click, type, select), and assert on visible outcomes (text appears, element is hidden, callback is called with correct args).
      - **Tools:** Testing Library (`@testing-library/react`, `@testing-library/vue`, `@testing-library/svelte`) + Vitest or Jest. Use `msw` (Mock Service Worker) for API mocking.
      - **Principles:** Test behavior, not implementation. Query by accessible role, label, or text — never by CSS class or test ID unless no accessible alternative exists. Each test should read like a user scenario.
      - **Coverage target:** Every critical user interaction from Step 3 must have at least one integration test covering the happy path and one covering the primary error path.

    - **End-to-End Tests (critical paths only):**
      - **What to test:** The 3–5 critical user journeys identified in Step 3, run against a staging environment with real (or realistic) backend services.
      - **Tools:** Playwright (recommended) or Cypress.
      - **Strategy:** Keep E2E tests minimal and focused on high-value flows. Each test should validate a complete user journey, not a single component. Use Page Object Model or equivalent abstraction for maintainability.
      - **Execution:** Run in CI on every PR merge to main. Parallelize across browsers (Chromium, Firefox, WebKit).

    - **Visual Regression Tests (for design system and critical UI):**
      - **What to test:** Design system components in all variant states, critical page layouts.
      - **Tools:** Playwright visual comparisons, Chromatic (for Storybook), or Percy.
      - **Strategy:** Snapshot each component variant. Review visual diffs on PRs.

    - **Accessibility Tests (automated layer):**
      - Integrate `axe-core` into component tests: every component test should include an accessibility assertion (`expect(await axe(container)).toHaveNoViolations()`).
      - Run Lighthouse accessibility audit in CI against critical pages.