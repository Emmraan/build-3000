# Phase 7 — Performance Architecture

19. **Design the bundle optimization strategy.** Define the approach to minimize JavaScript delivered to the client:
    - **Code splitting:**
      - Route-level splitting (every route is a separate chunk — this should be the default).
      - Component-level splitting (heavy components like rich text editors, charts, maps loaded on demand).
      - Library-level splitting (large third-party libraries isolated into separate chunks).
    - **Tree shaking:** Ensure all imports are ESM-compatible. Audit dependencies for tree-shaking support. Prefer libraries that offer modular imports (e.g., `import { debounce } from 'lodash-es'` not `import _ from 'lodash'`).
    - **Bundle budget:** Define a maximum bundle size per route (e.g., "initial JS < 150KB gzipped for landing page, < 250KB gzipped for app shell"). Configure bundler warnings when budgets are exceeded.
    - **Dependency audit:** Evaluate each dependency for size impact. Use `bundlephobia` or `source-map-explorer` to identify heavy dependencies. Recommend lighter alternatives where available.
    - **Dynamic imports and lazy loading:** Define the lazy loading trigger strategy (viewport intersection via `IntersectionObserver`, user interaction, idle time via `requestIdleCallback`).
    - **Font optimization:** Define the font loading strategy (`font-display: swap`, preloading critical fonts, subsetting, variable fonts vs. multiple weights).

20. **Design the rendering performance strategy.** Define approaches to ensure smooth, responsive UI:
    - **Avoid unnecessary re-renders:**
      - React: `React.memo` for expensive pure components, `useMemo`/`useCallback` only when measured as necessary, proper key usage in lists, state colocation.
      - Vue: Computed properties for derived data, `v-once` for static content, `shallowRef` for large objects.
      - Svelte: Reactive declarations are inherently optimized; avoid unnecessary store subscriptions.
    - **Virtualization:** For long lists or large tables (>100 items), use windowed rendering (`@tanstack/virtual`, `react-window`, `vue-virtual-scroller`). Define the item height estimation strategy (fixed vs. variable).
    - **Debounce and throttle:** Define which user interactions are debounced (search input: 300ms) or throttled (scroll handlers: 16ms, resize: 100ms).
    - **Web Workers:** Identify CPU-intensive operations that should be offloaded (data transformation, complex filtering/sorting, encryption, parsing large files).
    - **Animation performance:** CSS transitions/animations preferred over JS animations. Use `transform` and `opacity` for GPU-accelerated animations. Use `will-change` sparingly. For complex animations, recommend Framer Motion, GSAP, or the Web Animations API.
    - **Image optimization:** Serve modern formats (WebP, AVIF) with fallbacks. Use responsive images (`srcset`). Lazy load below-the-fold images. Define placeholder strategy (blur hash, LQIP, skeleton, dominant color).

21. **Define Core Web Vitals optimization plan.** For each metric, specify the measurement and optimization strategy:
    - **LCP (Largest Contentful Paint) — Target < 2.5s:**
      - Identify the LCP element for each critical page (hero image, main heading, feature graphic).
      - Preload the LCP resource (`<link rel="preload">`).
      - Eliminate render-blocking resources (inline critical CSS, defer non-critical JS).
      - Optimize server response time (TTFB < 800ms).
      - Use `fetchpriority="high"` on the LCP image.
    - **INP (Interaction to Next Paint) — Target < 200ms:**
      - Identify high-frequency interactions (clicks, key presses, form inputs).
      - Break long tasks (>50ms) into smaller chunks using `scheduler.yield()`, `setTimeout`, or `requestIdleCallback`.
      - Minimize main thread blocking during interactions.
      - Use `startTransition` (React) or equivalent for non-urgent updates.
    - **CLS (Cumulative Layout Shift) — Target < 0.1:**
      - Set explicit `width` and `height` (or `aspect-ratio`) on all images and videos.
      - Reserve space for dynamically loaded content (ads, embeds, lazy-loaded components).
      - Use `font-display: optional` or preload fonts to prevent layout shifts from font loading.
      - Avoid inserting content above existing content after initial render.
    - **Measurement:** Define the monitoring strategy (Lighthouse CI in CI/CD pipeline, Real User Monitoring via `web-vitals` library, Chrome UX Report for field data).