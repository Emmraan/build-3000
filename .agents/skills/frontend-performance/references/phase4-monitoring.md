# Phase 4 — Performance Monitoring and Regression Prevention

Detailed reference backing the "Phase 4" decision point in SKILL.md: RUM instrumentation, synthetic monitoring, performance budget enforcement, and the review / continuous improvement process.

---

### Phase 4 — Performance Monitoring and Regression Prevention

21. **Design the Real User Monitoring (RUM) instrumentation.** Define how performance is measured continuously in production:

    **Core metrics to collect:**
    ```typescript
    import { onLCP, onINP, onCLS, onFCP, onTTFB, Metric } from 'web-vitals';

    function sendToAnalytics(metric: Metric) {
      const payload = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        // Attribution (requires /attribution build)
        ...(metric.attribution && { attribution: metric.attribution }),
        // Custom dimensions
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        connectionType: (navigator as any).connection?.effectiveType,
        deviceMemory: (navigator as any).deviceMemory,
        appVersion: __APP_VERSION__,
      };
      
      // Use sendBeacon to ensure data is sent even on page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/vitals', JSON.stringify(payload));
      } else {
        fetch('/api/vitals', { body: JSON.stringify(payload), method: 'POST', keepalive: true });
      }
    }

    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    ```

    **Custom performance metrics to instrument:**
    | Metric | What to Measure | How |
    |--------|----------------|-----|
    | **Time to Interactive (custom)** | When the primary feature of the page is usable | `performance.mark()` at the point the main feature renders and is interactive |
    | **Data fetch duration** | API response times as experienced by the user | Instrument the API client to log request start/end times per endpoint |
    | **Component render time** | Time spent rendering expensive components | React Profiler API, Vue devtools performance tracing, or manual `performance.mark()`/`performance.measure()` |
    | **Client-side navigation time** | Time from route change initiation to new page render | `performance.mark()` at navigation start and first meaningful paint of new page |
    | **Long tasks** | JS tasks blocking the main thread for >50ms | `PerformanceObserver` with `entryTypes: ['longtask']` |
    | **Resource timing** | Load time of critical resources | `PerformanceObserver` with `entryTypes: ['resource']`, filtered to critical assets |
    | **Memory usage** | JS heap size over time | `performance.memory` (Chrome only), sampled at intervals |

    **Segmentation dimensions:**
    - Page type (landing, dashboard, product detail, checkout).
    - Device category (mobile, tablet, desktop).
    - Connection speed (4G, 3G, slow-2G via `navigator.connection.effectiveType`).
    - Geographic region.
    - Browser and browser version.
    - New vs. returning user (cold cache vs. warm cache).
    - App version / deployment (correlate performance with releases).

    **Alerting and SLO monitoring:**
    - Define SLOs for each Core Web Vital at p75:
      - LCP p75 < 2.5s
      - INP p75 < 200ms
      - CLS p75 < 0.1
    - Alert when p75 degrades by more than 20% compared to the previous 7-day window.
    - Alert when the percentage of "poor" ratings exceeds 10% for any Core Web Vital.
    - Alert when a new deployment causes a statistically significant regression (A/B comparison of pre/post deployment metrics).

22. **Design the synthetic monitoring strategy.** Complement RUM with controlled, reproducible lab tests:

    **Lighthouse CI integration:**
    ```yaml
    # lighthouserc.json
    {
      "ci": {
        "collect": {
          "url": [
            "https://example.com/",
            "https://example.com/dashboard",
            "https://example.com/product/example-product",
            "https://example.com/checkout"
          ],
          "numberOfRuns": 3,
          "settings": {
            "preset": "desktop",  // or "mobile" — run both
            "throttling": {
              "cpuSlowdownMultiplier": 4  // Simulate mobile CPU
            }
          }
        },
        "assert": {
          "assertions": {
            "categories:performance": ["error", { "minScore": 0.95 }],
            "categories:accessibility": ["error", { "minScore": 0.95 }],
            "categories:best-practices": ["error", { "minScore": 0.95 }],
            "categories:seo": ["error", { "minScore": 0.95 }],
            "first-contentful-paint": ["error", { "maxNumericValue": 1200 }],
            "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
            "total-blocking-time": ["error", { "maxNumericValue": 150 }],
            "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
            "interactive": ["error", { "maxNumericValue": 3000 }]
          }
        },
        "upload": {
          "target": "lhci",  // or "temporary-public-storage" for quick setup
          "serverBaseUrl": "https://lhci.example.com"
        }
      }
    }
    ```

    **Scheduled synthetic tests:**
    - Run Lighthouse against production pages every hour from multiple geographic locations.
    - Track scores over time. Visualize trends on a dashboard.
    - Run WebPageTest for detailed waterfall analysis on a weekly cadence for critical pages.
    - Set up SpeedCurve or Calibre for automated competitive benchmarking against key competitors.

23. **Design the performance budget enforcement system.** Prevent regressions by making performance a build-time constraint:

    **Bundle size budgets in CI:**
    ```javascript
    // bundlesize configuration (package.json or .bundlesizerc)
    {
      "bundlesize": [
        { "path": "dist/assets/index-*.js", "maxSize": "150 kB", "compression": "gzip" },
        { "path": "dist/assets/vendor-*.js", "maxSize": "100 kB", "compression": "gzip" },
        { "path": "dist/assets/index-*.css", "maxSize": "30 kB", "compression": "gzip" },
        { "path": "dist/assets/*.js", "maxSize": "300 kB", "compression": "gzip" } // total JS
      ]
    }
    ```

    **Alternative: `size-limit` (more flexible):**
    ```json
    // package.json
    {
      "size-limit": [
        { "path": "dist/assets/index-*.js", "limit": "150 kB", "gzip": true },
        { "path": "dist/assets/index-*.js", "limit": "45 kB", "import": "{ render }", "brotli": true },
        { "path": "dist/**/*.js", "limit": "300 kB", "gzip": true }
      ]
    }
    ```

    **Import cost awareness:**
    - Install and configure the `Import Cost` VS Code extension to show inline bundle size impact of imports.
    - Consider `eslint-plugin-import` with custom rules to warn or error on imports from known heavy packages.
    - Use `knip` to detect unused exports and dependencies.

    **Performance regression CI gate (complete pipeline step):**
    ```yaml
    # GitHub Actions example
    performance-check:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
        - run: npm ci
        - run: npm run build
        
        # Bundle size check
        - run: npx size-limit
        
        # Lighthouse CI
        - run: npx @lhci/cli@latest autorun
        
        # Bundle analysis diff (compare against main branch)
        - uses: preactjs/compressed-size-action@v2
          with:
            repo-token: "${{ secrets.GITHUB_TOKEN }}"
            pattern: "dist/**/*.{js,css}"
            # Posts a comment on the PR showing size delta per file
    ```

24. **Design the performance review and continuous improvement process.** Performance is not a one-time fix — it requires ongoing discipline:

    **Weekly performance review (automated):**
    - Generate a weekly performance report from RUM data:
      - Core Web Vitals trends (p50, p75, p95) for each page type.
      - Percentage of page loads meeting "Good" thresholds.
      - Slowest pages ranked by p75 LCP.
      - Worst interactions ranked by p75 INP.
      - Top layout shift sources ranked by frequency and shift score.
    - Compare against the previous week and flag regressions.

    **Per-release performance validation:**
    - Before every production deployment, compare Lighthouse CI scores against the previous release.
    - If any assertion fails, block the deployment and investigate.
    - Track bundle size delta per release. Flag any release that adds >5KB gzipped JS.

    **Quarterly performance audit:**
    - Conduct a full audit using Steps 3–13 of this skill.
    - Re-evaluate third-party scripts (Step 13) — new scripts added? Existing ones still needed?
    - Re-evaluate dependencies — lighter alternatives available? Unused dependencies removable?
    - Re-evaluate performance budgets — should they be tightened based on achieved improvements?
    - Benchmark against competitors and industry standards.
    - Update performance targets based on changing user demographics and device capabilities.

    **Performance culture practices:**
    - Require performance impact assessment for PRs that add new dependencies.
    - Include performance data in feature launch criteria.
    - Make performance dashboards visible to the team (wall display, Slack bot, weekly standup metric).
    - Celebrate performance wins with before/after metrics.