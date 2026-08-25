# Phase 2 — Frontend Architecture Design

4. **Select the rendering strategy with justification.** Evaluate and choose the appropriate rendering approach. Assess each candidate against the product requirements:

   | Strategy | Best For | SEO | Initial Load | Interactivity | Infrastructure |
   |----------|----------|-----|-------------|---------------|----------------|
   | **CSR (Client-Side Rendering)** | Highly interactive apps behind auth | Poor | Slower | Excellent | Static hosting |
   | **SSR (Server-Side Rendering)** | Dynamic content, personalization + SEO | Excellent | Fast TTFB | Good (after hydration) | Node server required |
   | **SSG (Static Site Generation)** | Content sites, marketing pages | Excellent | Fastest | Limited without JS | Static hosting / CDN |
   | **ISR (Incremental Static Regeneration)** | Content sites with frequent updates | Excellent | Fast | Limited without JS | Platform-specific (Vercel, etc.) |
   | **Streaming SSR** | Large pages, progressive loading | Good | Progressive | Good | Node server required |
   | **Islands Architecture** | Content-heavy with interactive widgets | Excellent | Fast | Selective | Framework-specific (Astro) |
   | **Hybrid / Per-route** | Apps with mixed needs | Per-route | Per-route | Per-route | Framework-dependent |

   State the chosen strategy, the top three reasons it fits, and the two biggest risks. If a hybrid per-route approach is chosen, specify which routes use which strategy.

5. **Select the framework and meta-framework with justification.** Based on the rendering strategy, requirements, and team context, evaluate:
   - **React ecosystem:** React + Next.js (App Router or Pages Router), React + Remix, React + Vite SPA.
   - **Vue ecosystem:** Vue + Nuxt, Vue + Vite SPA.
   - **Svelte ecosystem:** Svelte + SvelteKit.
   - **Angular ecosystem:** Angular + Angular Universal.
   - **Multi-page / lightweight:** Astro, Eleventy, vanilla JS.
   - **Other:** Solid, Qwik (resumability model), HTMX (hypermedia-driven).

   For the recommendation, address: rendering model fit, ecosystem maturity, hiring pool, learning curve, performance characteristics, and long-term maintenance trajectory. Acknowledge the top risk of the chosen framework.

6. **Design the project structure and code organization.** Define the directory structure and organizational principles. Provide a concrete file tree. Choose and justify the organizational pattern:

   **Option A — Feature-based (recommended for most apps):**
   ```
   src/
   ├── features/
   │   ├── auth/
   │   │   ├── components/
   │   │   ├── hooks/
   │   │   ├── services/
   │   │   ├── stores/
   │   │   ├── types/
   │   │   └── utils/
   │   ├── dashboard/
   │   └── settings/
   ├── shared/
   │   ├── components/
   │   ├── hooks/
   │   ├── services/
   │   ├── types/
   │   └── utils/
   ├── layouts/
   ├── pages/ (or app/ for Next.js App Router)
   ├── styles/
   └── config/
   ```

   **Option B — Layer-based (simpler apps or small teams):**
   ```
   src/
   ├── components/
   ├── hooks/
   ├── services/
   ├── stores/
   ├── pages/
   ├── types/
   ├── utils/
   └── styles/
   ```

   Define clear rules for each directory: what belongs, what doesn't, naming conventions, and maximum file size guidelines. Specify the import alias strategy (e.g., `@/features/auth`).

7. **Design the routing architecture.** Define:
   - **Route hierarchy:** List all top-level and nested routes with their URL patterns.
   - **Route grouping and layouts:** Which routes share layouts? Define the layout nesting structure.
   - **Protected routes:** Which routes require authentication? Define the auth guard pattern (redirect-based, wrapper component, middleware).
   - **Dynamic routes and parameters:** Which routes have dynamic segments? Define parameter validation.
   - **Code splitting at route level:** All routes should be lazy-loaded by default. Specify which routes, if any, should be eagerly loaded and why.
   - **Navigation patterns:** Client-side navigation with prefetching strategy. Define prefetch triggers (hover, viewport intersection, explicit).
   - **Route-level data loading:** Define data fetching strategy per route (loader functions, server components, `getServerSideProps`, `useEffect`, etc.).
   - **Error and 404 handling:** Define route-level error boundaries and the not-found page strategy.