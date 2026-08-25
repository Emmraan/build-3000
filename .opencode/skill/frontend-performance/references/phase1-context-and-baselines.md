# Phase 1 — Performance Context and Baseline Assessment

Detailed reference backing the "Phase 1" decision point in SKILL.md: engagement classification, context gathering, baseline measurement methodology, and target/budget definition.

---

### Phase 1 — Performance Context and Baseline Assessment

1. **Classify the performance engagement type.** Before any analysis, determine what the user needs and state it explicitly:
   - **Reactive diagnosis:** The user has a specific, observed performance problem ("my page loads slowly," "scrolling is janky," "the app freezes when I click submit"). Proceed with targeted root cause analysis.
   - **Proactive audit:** The user wants a general performance assessment of an application or page without a specific complaint. Proceed with a comprehensive audit.
   - **Optimization planning:** The user wants to implement a performance improvement strategy for an application under development or recently launched. Proceed with architectural performance planning.
   - **Performance infrastructure:** The user wants to set up performance monitoring, budgets, or CI integration. Proceed with instrumentation and process design.
   - **Focused technique question:** The user asks about a specific optimization technique (e.g., "how do I implement code splitting?"). Provide targeted guidance with context.

   The classification determines the depth and sequence of subsequent steps.

2. **Gather the performance context.** Extract or establish the following. Ask clarifying questions for critical gaps:
   - **Application type:** Marketing/content site, SaaS dashboard, e-commerce storefront, media-heavy platform, real-time collaborative app, data visualization tool, internal enterprise tool? This determines which metrics matter most.
   - **Tech stack:** Framework (React, Vue, Svelte, Angular, vanilla), meta-framework (Next.js, Nuxt, SvelteKit, Remix, Astro), rendering strategy (CSR, SSR, SSG, ISR, hybrid), state management, styling approach, build tool.
   - **Current performance data (if available):** Lighthouse scores, Core Web Vitals field data (CrUX, RUM), bundle size, specific timing measurements. If unavailable, instruct the user on how to obtain baseline data (Step 3).
   - **Target audience and devices:** Geographic distribution (affects CDN and edge strategy), device distribution (desktop vs. mobile percentage, low-end device prevalence), network conditions (3G, 4G, broadband).
   - **Hosting and delivery infrastructure:** Hosting platform (Vercel, Netlify, AWS, GCP, self-hosted), CDN provider, edge computing capabilities.
   - **Traffic patterns:** Average and peak concurrent users, request volume, traffic spikes (events, launches, promotions).
   - **Performance targets:** Existing SLOs or business-driven targets. If none exist, propose targets based on industry benchmarks in Step 4.
   - **Known constraints:** Budget limitations, team size, legacy code that cannot be modified, third-party dependencies that cannot be removed.

3. **Establish performance baselines with proper measurement methodology.** Performance optimization without baselines is guesswork. Guide the user through obtaining reliable measurements:

   **Lab data (controlled, reproducible, diagnostic):**
   - **Lighthouse:** Run via Chrome DevTools, CLI (`npx lighthouse <url>`), or PageSpeed Insights. Record: Performance score, LCP, TBT (lab proxy for INP), CLS, FCP, Speed Index, TTFB. Use consistent settings: mobile emulation, simulated throttling (Slow 4G, 4x CPU slowdown) for worst-case analysis.
   - **Chrome DevTools Performance Panel:** Record a trace of the specific problematic interaction. Capture: main thread flame chart, long tasks, layout/paint/composite events, scripting vs. rendering vs. painting breakdown.
   - **Chrome DevTools Network Panel:** Capture the full waterfall for initial page load. Record: total requests, total transfer size, total resource size, critical path request chain, time to last critical resource.
   - **WebPageTest:** For advanced waterfall analysis, filmstrip comparison, and multi-location testing. Use the `?lighthouse=1` parameter for combined results. Record: Start Render, Visually Complete, fully loaded time, request waterfall, connection view.
   - **Bundle analysis:** Run the framework/bundler's bundle analyzer (`npx vite-bundle-visualizer`, `@next/bundle-analyzer`, `webpack-bundle-analyzer`, `source-map-explorer`). Record: total JS size (parsed and gzipped), per-chunk sizes, largest dependencies, duplicate modules.

   **Field data (real users, actual conditions, truth):**
   - **Chrome UX Report (CrUX):** Via PageSpeed Insights or BigQuery. Provides real-user Core Web Vitals at origin and URL level. Record: LCP p75, INP p75, CLS p75, TTFB p75, and the pass/fail assessment at each threshold.
   - **Real User Monitoring (RUM):** If instrumented (web-vitals library, Datadog RUM, SpeedCurve, Vercel Analytics), pull the p50, p75, p95 for all Core Web Vitals and custom metrics. Segment by device type, connection speed, geography, and page type.
   - **Business metrics correlation:** If available, correlate performance metrics with business outcomes (conversion rate, bounce rate, session duration, revenue per session). This justifies optimization investment.

   **Baseline documentation format:**
   ```
   Page/Interaction: [name]
   Date measured: [date]

   Lab (Lighthouse mobile, simulated throttling):
   - Performance Score: [X]/100
   - LCP: [X]s (target: <2.5s)
   - TBT: [X]ms (target: <200ms)
   - CLS: [X] (target: <0.1)
   - FCP: [X]s
   - TTFB: [X]s
   - Speed Index: [X]s
   - Total JS: [X]KB (gzipped) / [X]KB (parsed)
   - Total Requests: [X]

   Field (CrUX / RUM, p75):
   - LCP: [X]s
   - INP: [X]ms
   - CLS: [X]

   Bundle:
   - Total JS (gzipped): [X]KB
   - Largest chunk: [name] [X]KB
   - Largest dependency: [name] [X]KB
   ```

   If the user cannot provide this data, guide them step by step to obtain it. Do not proceed with optimization recommendations without at least Lighthouse lab data for the target page.

4. **Define performance targets and budgets.** Establish measurable goals. If the user has not defined targets, propose targets based on these thresholds:

   **Core Web Vitals targets — 95-grade (default for all delivered UI, stricter than "Good"):**
   | Metric | 95-Grade Target | Good (min) |
   |--------|-----------------|------------|
   | **LCP** | ≤ 2.0s | ≤ 2.5s |
   | **INP** | ≤ 150ms | ≤ 200ms |
   | **CLS** | ≤ 0.05 | ≤ 0.1 |
   | **TTFB** | ≤ 600ms | ≤ 800ms |
   | **FCP** | ≤ 1.2s | ≤ 1.8s |
   | **TBT** | ≤ 150ms | ≤ 200ms |

   These stricter budgets are the default so Lighthouse Performance lands at ≥ 95/100. Only relax for documented infrastructure constraints.

   **Bundle size budgets (per route, gzipped) — 95-grade default:**
   | Page Type | JS Budget | CSS Budget | Total Budget |
   |-----------|-----------|------------|-------------|
   | Landing / marketing page | < 60KB | < 20KB | < 120KB |
   | App shell (authenticated) | < 140KB | < 40KB | < 250KB |
   | Feature page within app | < 100KB (incremental) | < 20KB (incremental) | < 180KB (incremental) |
   | Data-heavy dashboard | < 250KB | < 40KB | < 400KB |

   **Interaction responsiveness budget:**
   | Interaction Type | Target Response Time |
   |-----------------|---------------------|
   | Click / tap feedback | < 100ms visual response |
   | Page navigation (client-side) | < 300ms to meaningful content |
   | Form submission | < 500ms to completion or optimistic UI |
   | Search / filter | < 200ms to results update |
   | Scroll | 60fps (16.7ms per frame) |
   | Animation | 60fps, no dropped frames |

   Present targets to the user for validation. Adjust based on their business context (e.g., an internal enterprise tool may relax LCP targets but tighten interaction responsiveness).
