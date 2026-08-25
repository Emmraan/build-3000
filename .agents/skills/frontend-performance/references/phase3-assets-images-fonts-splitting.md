# Phase 3 — Optimization Implementation: Images, Fonts, and Code Splitting

Detailed reference backing the "Phase 3" decision point in SKILL.md, part 2: image optimization (Step 16), font optimization (Step 17), and code splitting / lazy loading (Step 18).

---

16. **Implement image optimization.** Images are typically the largest payload on web pages. Define a comprehensive image strategy:

    **Format selection decision tree:**
    ```
    Is it a photograph or complex image?
    ├── Yes → AVIF (best compression) with WebP fallback, JPEG fallback
    └── No → Is it a simple graphic, icon, or illustration?
        ├── Yes → SVG (if possible, vector-based)
        │   └── If raster needed → WebP with PNG fallback
        └── Is it animated?
            ├── Yes → Animated WebP or AVIF. For short clips: <video> with MP4/WebM
            └── Use WebP with appropriate fallback
    ```

    **Responsive image implementation:**
    ```html
    <!-- Art direction (different crops for different screen sizes) -->
    <picture>
      <source media="(min-width: 1024px)" 
              srcset="/hero-desktop.avif 1x, /hero-desktop-2x.avif 2x" type="image/avif">
      <source media="(min-width: 1024px)" 
              srcset="/hero-desktop.webp 1x, /hero-desktop-2x.webp 2x" type="image/webp">
      <source media="(max-width: 1023px)" 
              srcset="/hero-mobile.avif 1x, /hero-mobile-2x.avif 2x" type="image/avif">
      <source media="(max-width: 1023px)" 
              srcset="/hero-mobile.webp 1x, /hero-mobile-2x.webp 2x" type="image/webp">
      <img src="/hero-desktop.jpg" alt="Descriptive alt text" width="1200" height="600"
           fetchpriority="high" decoding="async">
    </picture>
    
    <!-- Resolution switching (same crop, different sizes) -->
    <img src="/product-400.jpg"
         srcset="/product-400.avif 400w, /product-800.avif 800w, /product-1200.avif 1200w"
         sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
         alt="Product name" width="400" height="400"
         loading="lazy" decoding="async">
    ```

    **Image loading strategy:**
    - LCP image: `fetchpriority="high"`, NO `loading="lazy"`, preload in `<head>`.
    - Above-the-fold images: `decoding="async"`, NO `loading="lazy"`.
    - Below-the-fold images: `loading="lazy"`, `decoding="async"`.
    - Background images: Use `<img>` instead when possible (better browser optimization). If CSS background is necessary, consider `image-set()` for format switching.

    **Image CDN / transformation service:**
    - Recommend an image CDN (Cloudinary, imgix, Cloudflare Images, Vercel Image Optimization, Next.js `<Image>`) for automatic format negotiation, resizing, and optimization.
    - Define the quality settings: 75–85 for JPEG/WebP (visually lossless), 60–75 for AVIF (better compression at lower quality values).

17. **Implement font optimization.** Web fonts are a common source of LCP delays and CLS:

    **Font loading strategy:**
    ```css
    /* Define font-face with fallback metrics to minimize CLS */
    @font-face {
      font-family: 'Inter';
      src: url('/fonts/inter-var.woff2') format('woff2');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap; /* Use 'optional' for non-critical fonts */
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                     U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                     U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      /* Fallback metrics to match system font and reduce CLS */
      ascent-override: 90%;
      descent-override: 22%;
      line-gap-override: 0%;
    }
    ```

    **Optimization checklist:**
    - [ ] Self-host fonts (eliminates third-party connection overhead).
    - [ ] Use WOFF2 format only (best compression, 95%+ browser support).
    - [ ] Use variable fonts instead of multiple weight/style files.
    - [ ] Subset fonts to include only needed character ranges (`glyphhanger`, `subfont`, Google Fonts `&text=` parameter).
    - [ ] Preload the most critical font file: `<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>`.
    - [ ] Use `font-display: swap` for critical text or `font-display: optional` for non-critical text (prevents invisible text AND layout shift — font is used only if it loads fast enough).
    - [ ] Define fallback font stack that closely matches the web font metrics: `font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;`.
    - [ ] Use `@font-face` `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` to match fallback font metrics to web font, minimizing CLS during font swap.

18. **Implement code splitting and lazy loading patterns.** Provide framework-specific, copy-paste-ready patterns:

    **React (with React.lazy and Suspense):**
    ```typescript
    // Route-level code splitting
    import { lazy, Suspense } from 'react';

    const Dashboard = lazy(() => import('./features/dashboard/DashboardPage'));
    const Settings = lazy(() => import('./features/settings/SettingsPage'));

    // With named exports (requires intermediate module or wrapper)
    const AnalyticsChart = lazy(() =>
      import('./components/AnalyticsChart').then(m => ({ default: m.AnalyticsChart }))
    );

    // Usage with proper loading fallback
    <Suspense fallback={<PageSkeleton />}>
      <Dashboard />
    </Suspense>

    // Interaction-triggered lazy loading
    const HeavyEditor = lazy(() => import('./components/RichTextEditor'));

    function EditorWrapper() {
      const [showEditor, setShowEditor] = useState(false);
      return showEditor ? (
        <Suspense fallback={<EditorSkeleton />}>
          <HeavyEditor />
        </Suspense>
      ) : (
        <button onClick={() => setShowEditor(true)}>Open Editor</button>
      );
    }

    // Prefetch on hover (load chunk before user clicks)
    function NavLink({ to, children }) {
      const prefetch = () => {
        if (to === '/dashboard') import('./features/dashboard/DashboardPage');
        if (to === '/settings') import('./features/settings/SettingsPage');
      };
      return <Link to={to} onMouseEnter={prefetch}>{children}</Link>;
    }
    ```

    **Visibility-triggered lazy loading (any framework):**
    ```typescript
    // Generic IntersectionObserver-based lazy loading
    function useLazyLoad(ref: RefObject<Element>, options?: IntersectionObserverInit) {
      const [isVisible, setIsVisible] = useState(false);
      
      useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        }, { rootMargin: '200px', ...options }); // 200px rootMargin = start loading before visible

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
      }, [ref]);

      return isVisible;
    }
    ```

    **Dynamic import for heavy libraries:**
    ```typescript
    // Load chart library only when chart component mounts
    async function renderChart(container: HTMLElement, data: ChartData) {
      const { Chart } = await import('chart.js/auto');
      new Chart(container, { type: 'line', data });
    }

    // Load PDF renderer only when user clicks "Export PDF"
    async function exportToPDF(data: ReportData) {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      // ... generate PDF
      doc.save('report.pdf');
    }
    ```