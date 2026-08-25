# Phase 3 — Optimization Implementation: Prioritization and Resource Loading

Detailed reference backing the "Phase 3" decision point in SKILL.md, part 1: optimization prioritization (Step 14) and resource loading optimization (Step 15).

---

### Phase 3 — Optimization Implementation

14. **Prioritize optimizations by impact and effort.** After diagnosis, compile all identified issues into a prioritized optimization plan:

    **Optimization priority matrix:**
    | Priority | Criteria | Action |
    |----------|----------|--------|
    | **P0 — Critical** | Directly impacts Core Web Vitals (failing "Good" threshold), affects >50% of users, measurable business impact | Implement immediately |
    | **P1 — High** | Significant metric improvement expected (>20% improvement on a key metric), moderate effort | Implement in current sprint/cycle |
    | **P2 — Medium** | Measurable improvement expected, moderate effort, or preparation for future scaling | Plan for next sprint/cycle |
    | **P3 — Low** | Minor improvement, high effort, or theoretical improvement without measured evidence | Backlog, revisit when higher-priority items are resolved |

    **For each optimization, document:**
    ```
    ID: PERF-[number]
    Issue: [Description of the measured problem]
    Metric impacted: [LCP / INP / CLS / Bundle Size / Memory / etc.]
    Current value: [measured baseline]
    Target value: [goal after optimization]
    Root cause: [technical root cause]
    Proposed fix: [specific implementation steps]
    Estimated effort: [hours / story points]
    Expected impact: [quantified improvement estimate]
    Risk: [any risk of regression or side effects]
    Priority: [P0 / P1 / P2 / P3]
    ```

    Present the plan as a ranked table sorted by priority, then by expected impact within each priority level.

15. **Implement resource loading optimizations.** Provide specific, implementable guidance for resource delivery:

    **Critical CSS inlining:**
    - Extract above-the-fold CSS using `critters` (webpack/vite plugin) or `critical` (npm package).
    - Inline critical CSS in the `<head>` within a `<style>` tag.
    - Load the full stylesheet asynchronously: `<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">`.
    - Keep inline CSS under 14KB (fits in the first TCP congestion window).

    **JavaScript loading strategy:**
    ```html
    <!-- Critical, must execute before render (rare — avoid if possible) -->
    <script src="critical.js"></script>
    
    <!-- Important but not render-blocking (most scripts) -->
    <script src="app.js" defer></script>
    
    <!-- Independent, order doesn't matter (analytics, non-critical features) -->
    <script src="analytics.js" async></script>
    
    <!-- Not needed on page load (heavy features) -->
    <!-- Load dynamically via import() on user interaction or visibility -->
    ```

    **Resource hint implementation:**
    ```html
    <head>
      <!-- Preconnect to critical origins (max 2-4) -->
      <link rel="preconnect" href="https://api.example.com">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      
      <!-- Preload critical resources not discoverable in HTML -->
      <link rel="preload" href="/hero-image.avif" as="image" type="image/avif"
            imagesrcset="/hero-400.avif 400w, /hero-800.avif 800w" imagesizes="100vw">
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
      
      <!-- Prefetch likely next navigation -->
      <link rel="prefetch" href="/dashboard">
      
      <!-- DNS prefetch for non-critical third-party origins -->
      <link rel="dns-prefetch" href="https://analytics.example.com">
    </head>
    ```

    **HTTP caching strategy:**
    ```
    # Static assets with content hash in filename (JS, CSS, images, fonts)
    Cache-Control: public, max-age=31536000, immutable
    
    # HTML documents (must revalidate to get latest asset references)
    Cache-Control: no-cache
    # (no-cache means "revalidate before using cached version", NOT "don't cache")
    
    # API responses (varies by endpoint)
    Cache-Control: private, max-age=0, must-revalidate  # User-specific, always fresh
    Cache-Control: public, max-age=300, stale-while-revalidate=60  # Shared, 5-min fresh, serve stale while refreshing
    
    # Fonts (long-lived, cross-origin)
    Cache-Control: public, max-age=31536000, immutable
    Access-Control-Allow-Origin: *
    ```