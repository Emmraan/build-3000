# Phase 5 — Advanced Performance Patterns

Detailed reference backing the "Phase 5" decision point in SKILL.md: advanced caching strategies (Step 25), SSR / hydration optimization (Step 26), animation / visual performance (Step 27), and advanced network optimization (Step 28).

---

### Phase 5 — Advanced Performance Patterns

25. **Implement advanced caching strategies.** Define multi-layer caching for maximum performance:

    **Layer 1 — Browser HTTP cache:**
    - Configured via `Cache-Control` headers (covered in Step 15).
    - Content-hashed filenames for cache busting on deployments.
    - `stale-while-revalidate` directive for API responses that can tolerate brief staleness.

    **Layer 2 — Service Worker cache (for offline and instant repeat visits):**
    ```typescript
    // Service worker caching strategies
    // 1. Cache First (static assets — fonts, images, app shell)
    //    Check cache → if found, return cached → if not, fetch, cache, return
    
    // 2. Stale While Revalidate (frequently updated but not critical freshness)
    //    Return cached immediately → fetch updated version → update cache for next request
    
    // 3. Network First (API calls, user data — freshness critical)
    //    Fetch from network → if fails, fall back to cache → update cache on success
    
    // 4. Network Only (analytics, real-time data)
    //    Always fetch from network. No caching.
    
    // 5. Cache Only (versioned, immutable assets)
    //    Only serve from cache. Assets populated during install.
    ```
    - Use Workbox for service worker caching (abstracts strategies, handles precaching, provides routing).
    - Define the precache manifest: app shell HTML, critical CSS, critical JS, critical fonts.
    - Define runtime caching routes: image CDN → Cache First with 30-day expiration and max 200 entries; API → Stale While Revalidate or Network First depending on endpoint.
    - Define cache storage limits and eviction policies to prevent unbounded storage growth.

    **Layer 3 — Application-level cache (in-memory):**
    - TanStack Query / SWR cache for API responses (covered in frontend-core Step 12).
    - Computed value memoization (`useMemo`, `computed`).
    - Component output memoization (`React.memo`).
    - Module-level singleton caches for expensive computations (with size bounds).

    **Layer 4 — CDN / Edge cache:**
    - Static assets served from CDN edge nodes.
    - SSR responses cached at the edge (Vercel ISR, Cloudflare Cache, CDN cache with `Surrogate-Control` headers).
    - Define cache invalidation strategy: path-based purge, tag-based purge, or deploy-time full purge.

26. **Implement SSR and hydration performance optimizations.** For server-rendered applications, hydration is often the largest performance bottleneck:

    **Hydration cost diagnosis:**
    - Measure time from HTML received to fully interactive (TTI). The gap is primarily hydration cost.
    - In React DevTools Profiler, identify the hydration render and its duration.
    - Check for hydration mismatches (console warnings) — these cause React to discard server-rendered HTML and re-render entirely, negating SSR benefits.

    **Hydration optimization strategies:**
    | Strategy | Framework Support | Description |
    |----------|------------------|-------------|
    | **Streaming SSR** | React 18+, Vue 3, SvelteKit, Remix | Send HTML progressively as data resolves. User sees content before all data is ready |
    | **Selective hydration** | React 18+ (Suspense) | Hydrate components independently. Interactive components hydrate first |
    | **Progressive hydration** | React (custom), Vue (custom) | Defer hydration of below-the-fold or non-interactive components until visible or idle |
    | **Partial hydration (Islands)** | Astro, Fresh (Deno) | Only hydrate interactive "islands." Static content ships zero JS |
    | **Resumability** | Qwik | Serialize component state and event handlers into HTML. No replay of component tree on client. Near-zero hydration cost |
    | **React Server Components** | Next.js App Router, React 19+ | Components that run only on the server. Zero client JS for server components. Client components hydrate normally |

    **Practical SSR optimizations:**
    - Move data fetching to the server (server components, `getServerSideProps`, loader functions) to eliminate client-side fetch waterfalls.
    - Stream the response with `renderToPipeableStream` (React) to send the shell immediately while data-dependent sections stream in.
    - Use `<Suspense>` boundaries to define streaming chunks and progressive hydration units.
    - Avoid importing heavy client-side libraries in server components.
    - Cache server-rendered responses at the CDN/edge level when content is shared across users.

27. **Implement animation and visual performance optimizations.** Define the strategy for smooth, performant animations:

    **Animation performance rules:**
    ```
    SAFE (compositor-only, GPU-accelerated, no layout/paint):
    ✅ transform (translate, scale, rotate, skew)
    ✅ opacity
    ✅ filter (blur, brightness, contrast — GPU in most browsers)
    ✅ clip-path (GPU in most browsers)

    EXPENSIVE (trigger layout and/or paint):
    ❌ width, height, top, left, right, bottom
    ❌ margin, padding, border
    ❌ font-size, line-height
    ❌ display, position
    ❌ box-shadow (triggers paint)
    ❌ background-color (triggers paint — but cheap)
    ```

    **CSS animation (preferred for simple transitions):**
    ```css
    /* Use CSS transitions for state changes */
    .panel {
      transform: translateX(-100%);
      opacity: 0;
      transition: transform 300ms ease-out, opacity 300ms ease-out;
    }
    .panel.open {
      transform: translateX(0);
      opacity: 1;
    }

    /* Respect user preferences */
    @media (prefers-reduced-motion: reduce) {
      .panel {
        transition: none;
      }
    }
    ```

    **JavaScript animation (for complex, orchestrated animations):**
    - Use the Web Animations API (WAAPI) for programmatic control with compositor-accelerated performance.
    - Use `requestAnimationFrame` for custom animation loops (never `setInterval` or `setTimeout`).
    - For complex animation libraries: Framer Motion (React), Motion One (framework-agnostic, lightweight), GSAP (most powerful, larger bundle).
    - Avoid Lottie for performance-critical paths (heavy JSON parsing, canvas rendering).

    **Scroll-driven animations (modern CSS):**
    ```css
    /* CSS Scroll-Driven Animations (Chrome 115+) */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-on-scroll {
      animation: fadeIn linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 100%;
    }
    ```

    **`will-change` usage rules:**
    - Apply `will-change` only to elements that are about to animate (e.g., add on hover, remove after animation completes).
    - Never apply `will-change` to many elements simultaneously (each creates a compositor layer consuming GPU memory).
    - Never use `will-change: transform` as a permanent style. It's a hint, not an optimization.

28. **Implement advanced network optimization patterns.** Beyond basic resource loading:

    **Speculative loading with the Speculation Rules API (Chrome 109+):**
    ```html
    <script type="speculationrules">
    {
      "prerender": [
        {
          "where": {
            "and": [
              { "href_matches": "/*" },
              { "not": { "href_matches": "/logout" } },
              { "not": { "selector_matches": ".no-prerender" } }
            ]
          },
          "eagerness": "moderate"  // prerender on hover
        }
      ],
      "prefetch": [
        {
          "where": { "href_matches": "/*" },
          "eagerness": "conservative"  // prefetch on mouse down
        }
      ]
    }
    </script>
    ```

    **API request optimization:**
    - **Request batching:** Combine multiple related API calls into a single request (GraphQL natural batching, custom batch endpoints, DataLoader pattern).
    - **Request deduplication:** Ensure the same API call made by multiple components simultaneously results in only one network request (TanStack Query handles this automatically).
    - **Partial responses:** Request only needed fields (GraphQL field selection, REST `?fields=` parameter, JSON:API sparse fieldsets).
    - **Conditional requests:** Use `ETag` / `If-None-Match` or `Last-Modified` / `If-Modified-Since` to avoid re-downloading unchanged data (304 Not Modified).
    - **Request prioritization:** Use `fetch()` with `priority: 'high'` for critical data, `priority: 'low'` for non-essential data. Abort low-priority requests when the user navigates away (`AbortController`).
    - **Connection management:** Use `<link rel="preconnect">` for critical API origins. Use HTTP/2 multiplexing (avoid domain sharding, which is an HTTP/1.1 optimization that hurts HTTP/2).

    **Compression:**
    - Enable Brotli compression on the server/CDN for all text resources (HTML, CSS, JS, JSON, SVG). Brotli achieves 10–15% better compression than gzip.
    - For JSON API responses, consider structured data compression (MessagePack, Protocol Buffers) for high-volume endpoints.
    - For static assets, pre-compress at build time (`.br` and `.gz` files) and configure the server to serve the appropriate version based on `Accept-Encoding`.