# Phase 12 — Build, Tooling, and Developer Experience

26. **Design the build and development tooling architecture.** Define the complete frontend toolchain:

    - **Build tool:** Recommend and justify (Vite, Turbopack, Webpack, esbuild, Rspack). Vite is the default recommendation for most new projects due to fast dev server (native ESM) and optimized production builds (Rollup).
    - **TypeScript configuration:** Strict mode enabled. Define path aliases. Define `tsconfig.json` structure for monorepos if applicable.
    - **Linting and formatting:** ESLint flat config with framework-specific rules. Prettier with project-wide config. Define the rule severity philosophy: errors for bugs and accessibility issues, warnings for style preferences.
    - **Git hooks:** Husky + lint-staged for pre-commit (lint + format staged files). Commitlint for conventional commits if enforcing semantic versioning.
    - **Environment configuration:** Define how environment variables are managed (`.env` files per environment, validated at build time with Zod or `@t3-oss/env`). List required and optional variables.
    - **Development server:** Hot Module Replacement (HMR) must work reliably. Define proxy configuration for API requests during development.
    - **Storybook or component playground:** Recommend for design system and component development. Define the story structure (one story file per component, stories for each variant and state).
    - **Monorepo tooling (if applicable):** Nx, Turborepo, or pnpm workspaces. Define the package boundary strategy (shared UI library, shared types, shared utilities, app packages).

27. **Design the CI/CD pipeline for frontend.** Define the complete pipeline:

    - **On every PR:**
      1. Install dependencies (cached).
      2. Type check (`tsc --noEmit`).
      3. Lint (`eslint`).
      4. Unit and integration tests (`vitest run`).
      5. Build (`vite build` or equivalent) — verify the build succeeds.
      6. Bundle size check — compare against budget, fail or warn on regression.
      7. Accessibility audit on critical pages (Lighthouse CI).
      8. Visual regression tests (if configured).
      9. Preview deployment (Vercel preview, Netlify deploy preview, or equivalent) with a link in the PR.

    - **On merge to main:**
      1. All PR checks.
      2. E2E tests against the preview or staging deployment.
      3. Deploy to staging automatically.
      4. Smoke tests against staging.

    - **Production deployment:**
      1. Promote staging to production (blue/green or canary).
      2. Source map upload to error monitoring service.
      3. Cache invalidation on CDN.
      4. Post-deployment smoke tests.
      5. Rollback procedure: revert to previous deployment within 5 minutes.

    - **Performance monitoring:**
      - Real User Monitoring (RUM) via `web-vitals` library reporting to analytics.
      - Synthetic monitoring via scheduled Lighthouse runs against production.
      - Bundle size tracking over time (graph trend in CI dashboard).