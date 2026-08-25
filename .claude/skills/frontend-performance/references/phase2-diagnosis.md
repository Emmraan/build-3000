# Phase 2 — Performance Diagnosis and Root Cause Analysis

Detailed reference backing the "Phase 2" decision point in SKILL.md: critical rendering path mapping, Core Web Vitals diagnosis (LCP, INP, CLS), JS bundle analysis, network diagnosis, rendering/paint diagnosis, memory diagnosis, and third-party script impact analysis.

---

### Phase 2 — Performance Diagnosis and Root Cause Analysis

5. **Analyze the critical rendering path.** Map the sequence of events from navigation to first meaningful paint. Identify bottlenecks at each stage:

   ```
   DNS Lookup → TCP Connect → TLS Handshake → TTFB (server response) →
   HTML Download → HTML Parse → CSS Download → CSS Parse (CSSOM) →
   Render Tree Construction → Layout → Paint → Composite →
   JS Download → JS Parse → JS Execute → Hydration (if SSR) →
   Interactive
   ```

   For each stage, check:
   - **DNS/Connection:** Are there unnecessary origins requiring new connections? Missing `preconnect` hints?
   - **TTFB:** Is server response slow? (> 800ms indicates server-side investigation needed — recommend backend optimization or edge rendering).
   - **HTML:** Is the HTML document excessively large? Inlined too much? Server-rendered too much non-critical content?
   - **Render-blocking resources:** List all CSS and synchronous JS files that block first paint. For each, determine: Can it be deferred? Inlined? Loaded asynchronously? Made non-render-blocking?
   - **Resource discovery:** Are critical resources discoverable early? Or are they hidden behind JS execution chains or CSS `@import` chains? Use `<link rel="preload">` for late-discovered critical resources.

6. **Diagnose the Largest Contentful Paint (LCP) element.** LCP is typically the single highest-impact metric. Systematically identify and optimize:

   **Step 6a — Identify the LCP element:**
   - Use Chrome DevTools Performance panel → Timings track → LCP marker to identify the element.
   - Common LCP elements: hero image, above-the-fold heading with web font, background image, video poster image, large SVG.

   **Step 6b — Decompose LCP into sub-parts and identify the bottleneck:**
   ```
   LCP = TTFB + Resource Load Delay + Resource Load Duration + Element Render Delay
   ```
   | Sub-part | What it measures | Common cause of excess time |
   |----------|-----------------|---------------------------|
   | **TTFB** | Server response time | Slow server, no CDN, no edge caching |
   | **Resource Load Delay** | Time between TTFB and when the LCP resource starts downloading | Resource not discoverable in HTML (loaded via JS or CSS), missing preload hint, render-blocking resources queued ahead |
   | **Resource Load Duration** | Time to download the LCP resource | Unoptimized image (wrong format, uncompressed, oversized), slow CDN, no HTTP/2 |
   | **Element Render Delay** | Time between resource loaded and element painted | Render-blocking JS, hydration delay, CSS hiding content until JS runs, `display: none` toggled by JS |

   **Step 6c — Apply targeted LCP optimizations based on the bottleneck:**
   - **TTFB too high:** CDN caching, edge rendering (SSR at the edge), static generation, server optimization.
   - **Resource Load Delay too high:** Add `<link rel="preload" as="image" href="...">` in the `<head>` for the LCP image. Ensure it's in the HTML source, not injected by JS. Remove `loading="lazy"` from LCP image. Use `fetchpriority="high"` on the LCP image element.
   - **Resource Load Duration too high:** Compress and resize image (serve the exact dimensions needed). Use modern formats (AVIF > WebP > JPEG). Use responsive `srcset`. Enable HTTP/2 or HTTP/3. Use a CDN with edge PoPs close to users.
   - **Element Render Delay too high:** Reduce render-blocking CSS. Inline critical CSS. Reduce JS bundle that must execute before render. Avoid CSS `opacity: 0` or `visibility: hidden` patterns that hide content until JS runs. Minimize hydration cost (partial hydration, progressive hydration, streaming SSR).

7. **Diagnose Interaction to Next Paint (INP).** INP measures the responsiveness of all interactions throughout the page lifecycle. Systematically diagnose:

   **Step 7a — Identify the slow interaction:**
   - Use Chrome DevTools Performance panel with "Interactions" track enabled. Record user interactions and identify those exceeding 200ms.
   - Use the `web-vitals` library with `onINP()` and `attribution` build to identify which element and event type caused the worst INP in the field.
   - Common culprits: form submissions, dropdown opens/closes, accordion toggles, search/filter operations, navigation clicks, data table sorting, modal opens.

   **Step 7b — Decompose INP into sub-parts:**
   ```
   INP = Input Delay + Processing Time + Presentation Delay
   ```
   | Sub-part | What it measures | Common cause of excess time |
   |----------|-----------------|---------------------------|
   | **Input Delay** | Time between user interaction and event handler start | Main thread blocked by long task (other JS executing), timer callback, third-party script |
   | **Processing Time** | Time spent in the event handler(s) | Expensive computation in the handler, synchronous state updates causing large re-render trees, layout thrashing in handler |
   | **Presentation Delay** | Time from handler completion to next paint | Expensive re-render, large DOM update, forced layout/reflow, slow style recalculation |

   **Step 7c — Apply targeted INP optimizations:**
   - **Input Delay too high:** Break long tasks using `scheduler.yield()` (with polyfill), `setTimeout(fn, 0)`, or `scheduler.postTask()`. Defer non-critical work to `requestIdleCallback`. Reduce third-party script main thread impact. Load non-critical JS after the page is interactive.
   - **Processing Time too high:** Move expensive computation to a Web Worker. Debounce rapid-fire handlers (search input). Avoid synchronous, cascading state updates — batch them. Avoid reading layout properties (`offsetHeight`, `getBoundingClientRect`) inside event handlers followed by DOM writes (layout thrashing).
   - **Presentation Delay too high:** Reduce the number of DOM nodes re-rendered (memoization, state colocation, finer-grained reactivity). Virtualize long lists. Simplify CSS selectors in frequently-updated areas. Avoid forced synchronous layout (reading layout → writing DOM → reading layout). Use `content-visibility: auto` for off-screen content. Use CSS `contain` property to isolate layout/paint scope.

8. **Diagnose Cumulative Layout Shift (CLS).** CLS measures visual stability — how much content shifts unexpectedly during the page lifecycle:

   **Step 8a — Identify layout shift sources:**
   - Use Chrome DevTools Performance panel → Experience track → Layout Shift entries. Each shift shows the shifted elements and the shift score.
   - Use the `web-vitals` library with `onCLS()` and `attribution` build to identify the largest shift source in the field.
   - Use the Layout Shift debugger (`Layout Shift` regions in DevTools, or the `layout-shift-gif-generator` tool).

   **Step 8b — Common CLS sources and fixes:**
   | Source | Fix |
   |--------|-----|
   | Images without dimensions | Add explicit `width` and `height` attributes or use `aspect-ratio` in CSS |
   | Ads or embeds without reserved space | Use a container with `min-height` matching the expected ad/embed size |
   | Dynamically injected content above viewport | Append content below the viewport, or use `position: fixed`/`sticky` for banners |
   | Web fonts causing text reflow | Use `font-display: swap` with `size-adjust` or `font-display: optional`. Preload critical fonts. Use fallback font metrics matching (`@font-face` `ascent-override`, `descent-override`, `line-gap-override`) |
   | Late-loading CSS causing style recalculation | Inline critical CSS. Ensure CSS loads before the content it styles |
   | Client-side rendering replacing placeholders | Use SSR/SSG to send the final layout from the server. Skeleton screens matching the final layout dimensions |
   | Animations using `top`/`left`/`width`/`height` | Use `transform` for animations — transforms don't cause layout shifts |

9. **Perform a JavaScript bundle diagnosis.** Analyze the JavaScript payload for optimization opportunities:

   **Step 9a — Generate and analyze the bundle visualization:**
   - Run the appropriate bundle analyzer tool and examine the treemap. Identify:
     - **Largest chunks:** Which route or entry point produces the largest JavaScript chunk?
     - **Largest dependencies:** List the top 10 dependencies by parsed size. For each, evaluate:
       - Is it tree-shakeable? (ESM exports vs. CommonJS)
       - Is there a lighter alternative? (e.g., `date-fns` → `dayjs` or `Temporal`, `lodash` → `lodash-es` or native methods, `moment` → `date-fns`, `axios` → native `fetch`)
       - Is the full library loaded when only a subset is used? (e.g., entire icon library vs. individual icon imports)
     - **Duplicate modules:** Are multiple versions of the same library bundled? (common with transitive dependencies)
     - **Dead code:** Are there modules included in the bundle that are never imported? Unused exports that aren't tree-shaken?
     - **Source maps enabled in production:** Source maps should be uploaded to error monitoring services, NOT served to users.

   **Step 9b — Analyze code splitting effectiveness:**
   - Is every route lazily loaded? Check for routes eagerly importing heavy components.
   - Are heavy third-party libraries (chart libraries, rich text editors, PDF renderers, mapping libraries) isolated in their own chunks and loaded on demand?
   - Is there a shared/vendor chunk strategy? Is it too aggressive (one massive vendor chunk) or too granular (too many small chunks causing request overhead)?
   - Check for inadvertent bundle coupling: does importing one small utility from a feature module pull in the entire feature's dependency tree?

   **Step 9c — Analyze JavaScript parse and compile cost:**
   - Check Chrome DevTools Performance panel → "Evaluate Script" events. Long script evaluation (>100ms) on mobile indicates too much JS being parsed/compiled at once.
   - Mobile devices parse JS 2–5x slower than desktop. Always benchmark against a mid-tier mobile device (Moto G Power or similar, 4x CPU throttle in DevTools).

10. **Perform a network and resource loading diagnosis.** Analyze the network waterfall for inefficiencies:

    **Step 10a — Analyze the request waterfall:**
    - **Request count:** Total requests for initial page load. Target: < 50 for initial load. Each request has overhead (DNS, TCP, TLS for new origins).
    - **Request chains (critical path depth):** Identify serial dependency chains where resource B cannot start until resource A completes. Example: HTML → JS → API call → render. Flatten chains with preloading, inlining, or server-side data fetching.
    - **Origin count:** How many distinct origins does the page contact? Each new origin requires DNS + TCP + TLS (300–600ms on slow connections). Use `<link rel="preconnect">` for critical third-party origins (max 2–4, beyond that the benefit diminishes).
    - **Resource prioritization:** Are critical resources loading before non-critical ones? Check the Priority column in DevTools Network panel. High-priority: HTML, critical CSS, LCP image, critical fonts. Low-priority: analytics, ads, below-the-fold images, non-critical JS.

    **Step 10b — Analyze compression and transfer efficiency:**
    - Is Brotli compression enabled? (10–15% smaller than gzip for text resources). Check `Content-Encoding` response header.
    - Are responses properly cached? Check `Cache-Control` headers. Static assets should have immutable, long-lived cache (`Cache-Control: public, max-age=31536000, immutable`) with content-hashed filenames for cache busting.
    - Is HTTP/2 or HTTP/3 enabled? HTTP/2 enables multiplexing (multiple requests over a single connection). HTTP/3 (QUIC) reduces connection overhead further.
    - Are there unnecessarily large responses? (APIs returning full objects when only a subset of fields is needed, HTML documents with excessive inline data).

    **Step 10c — Analyze resource hints and preloading:**
    - Document which resource hints are present and which are missing:
      - `<link rel="preconnect">` — for critical third-party origins (fonts.googleapis.com, CDN, API server).
      - `<link rel="preload">` — for critical resources not discoverable in HTML (LCP image, critical font, above-the-fold data).
      - `<link rel="prefetch">` — for resources needed on the likely next navigation.
      - `<link rel="dns-prefetch">` — lightweight hint for non-critical third-party origins.
      - `<link rel="modulepreload">` — for critical JS modules in the module dependency graph.
    - Check for over-preloading: preloading too many resources wastes bandwidth and can delay critical resources. Only preload resources that are critical for the current page and not already discoverable via HTML/CSS parsing.

11. **Perform a rendering and paint diagnosis.** Analyze the browser's rendering pipeline for inefficiencies:

    **Step 11a — Layout and reflow analysis:**
    - In Chrome DevTools Performance panel, identify Layout events. Long layout events (>10ms) indicate expensive reflows.
    - Check for **layout thrashing** (forced synchronous layout): patterns where JS reads a layout property, then writes to DOM, then reads again in a tight loop. Each read-after-write forces the browser to recalculate layout synchronously.
      ```javascript
      // BAD: Layout thrashing
      elements.forEach(el => {
        const height = el.offsetHeight; // read (forces layout)
        el.style.height = height * 2 + 'px'; // write (invalidates layout)
      });
      
      // GOOD: Batch reads, then batch writes
      const heights = elements.map(el => el.offsetHeight); // batch read
      elements.forEach((el, i) => {
        el.style.height = heights[i] * 2 + 'px'; // batch write
      });
      ```
    - Check DOM size. Pages with > 1,400 DOM elements start showing layout performance degradation. Pages with > 1,800 elements trigger Lighthouse warnings. Virtualize long lists and lazy-render off-screen content.

    **Step 11b — Paint and composite analysis:**
    - Enable "Paint flashing" in DevTools Rendering panel. Green rectangles show areas being repainted. Excessive repainting (especially on scroll or hover) indicates paint performance issues.
    - Check for elements creating unnecessary compositor layers. Use "Layers" panel in DevTools. Excessive layers consume GPU memory. Common causes: overuse of `will-change`, `transform: translateZ(0)` hack, too many animated elements.
    - Ensure animations only use compositor-friendly properties: `transform` and `opacity`. Animating `width`, `height`, `top`, `left`, `margin`, `padding`, `border`, `font-size` triggers layout and is expensive.

    **Step 11c — CSS performance analysis:**
    - Check for excessively complex CSS selectors in frequently updated areas (deeply nested selectors, universal selectors `*`, attribute selectors with wildcard matching).
    - Check total CSS size. Unused CSS should be identified and removed (Chrome DevTools Coverage panel).
    - Check for `@import` chains in CSS files — each `@import` creates a serial request chain. Use bundled CSS or `<link>` elements in HTML instead.

12. **Perform a memory diagnosis (if memory issues are suspected).** Analyze memory consumption and leak patterns:

    **Step 12a — Baseline memory measurement:**
    - Chrome DevTools Memory panel → Take a heap snapshot at different stages: page load, after interaction, after navigation within SPA, after repeated interaction.
    - Chrome DevTools Performance Monitor → Watch JS Heap Size over time during extended use. A steadily increasing heap that never returns to baseline indicates a memory leak.
    - Record: Initial heap size, heap after typical usage session, heap after stress test (repeated navigation, opening/closing modals, etc.).

    **Step 12b — Common frontend memory leak patterns:**
    | Leak Pattern | How to Detect | How to Fix |
    |-------------|--------------|-----------|
    | **Uncleared event listeners** | Heap snapshot → Retainers show event listeners holding references to detached DOM nodes | Clean up listeners in component unmount (`useEffect` cleanup, `onUnmounted`, `onDestroy`) |
    | **Uncleared timers/intervals** | Look for `setInterval`/`setTimeout` in component code without cleanup | Clear in unmount lifecycle. Use framework-aware wrappers |
    | **Detached DOM nodes** | Heap snapshot → Filter by "Detached" → See which JS references hold detached nodes | Ensure component cleanup nullifies references to DOM elements |
    | **Closures capturing large scopes** | Heap snapshot → Retainers show closures holding references to large objects | Minimize closure scope. Set captured references to `null` when no longer needed |
    | **Unbounded caches/stores** | Heap snapshot → Large arrays or maps in global store growing over time | Implement cache eviction (LRU, max size, TTL). Clear stale query cache entries |
    | **Subscription leaks (observables, WebSockets)** | Heap snapshot → Active subscriptions accumulating | Unsubscribe in component unmount. Use `takeUntil` or `AbortController` patterns |
    | **React-specific: state updates on unmounted components** | Console warning (React 17), subtle leaks (React 18+) | Use `AbortController` for fetch in effects. Check mounted state for async callbacks |

    **Step 12c — Memory optimization strategies:**
    - Implement object pooling for frequently created/destroyed objects (particle systems, virtualized list items).
    - Use `WeakRef` and `WeakMap` for caches that should not prevent garbage collection.
    - Implement pagination or windowing instead of loading unbounded datasets into memory.
    - Release references to large data structures (image bitmaps, ArrayBuffers, large API responses) when they are no longer displayed.
    - Monitor and cap the size of in-memory caches (TanStack Query `gcTime`, custom LRU caches).

13. **Diagnose third-party script impact.** Third-party scripts (analytics, ads, chat widgets, A/B testing, tag managers, social embeds) are often the largest uncontrolled performance tax:

    **Step 13a — Inventory third-party scripts:**
    - List every third-party origin contacted during page load (DevTools Network panel, filtered by "Third-party" in WebPageTest).
    - For each third-party script, document:
      - **Purpose:** What business function does it serve?
      - **Load method:** Synchronous `<script>`, async `<script async>`, deferred `<script defer>`, dynamically injected, loaded via tag manager?
      - **Size:** Transfer size (gzipped) and parsed size.
      - **Main thread time:** How much CPU time does it consume during page load? (DevTools Performance panel → Bottom-Up → Group by domain).
      - **Cascading loads:** Does it load additional scripts, stylesheets, fonts, or images? How deep is the chain?
      - **Blocking impact:** Does it delay FCP, LCP, or TTI?

    **Step 13b — Third-party optimization strategies:**
    | Strategy | When to Apply |
    |----------|--------------|
    | **Remove entirely** | Script provides no measurable business value or has a free, lighter alternative |
    | **Delay loading** | Script is not needed for initial page interaction. Load after `load` event, on user interaction, or on visibility (`IntersectionObserver`) |
    | **Self-host** | Script is static and updated infrequently. Eliminates third-party connection overhead and gives caching control |
    | **Use `async` or `defer`** | Script is render-blocking but doesn't need to be. `defer` for ordered execution, `async` for independent scripts |
    | **Facade pattern** | Replace heavy embed (chat widget, video player, map) with a lightweight placeholder that loads the full embed only on user interaction |
    | **Web Worker** | Script performs heavy computation (analytics, A/B testing calculations). Run in worker to avoid main thread blocking |
    | **Tag Manager audit** | Audit all tags in the tag manager. Remove stale tags. Set firing triggers to minimize unnecessary execution |
    | **`loading="lazy"` for embeds** | Social media embeds, video players, maps — load only when scrolled into view |
    | **CSP and Subresource Integrity** | Ensure third-party scripts cannot be tampered with. Use `integrity` attribute and strict CSP |
