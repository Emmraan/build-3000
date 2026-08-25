# Phase 5 — Styling and Design System Architecture

14. **Select and justify the styling strategy.** Evaluate against the project requirements:

    | Approach | Strengths | Weaknesses | Best For |
    |----------|-----------|------------|----------|
    | **CSS Modules** | Scoped by default, standard CSS, good performance, no runtime cost | No dynamic styling from props, limited theming | Apps prioritizing performance and standard CSS |
    | **Tailwind CSS** | Rapid prototyping, consistent constraints, small production CSS, no naming decisions | Verbose class strings, learning curve, design system coupling | Teams wanting utility-first with strong conventions |
    | **CSS-in-JS (runtime: styled-components, Emotion)** | Dynamic styling, co-located, TypeScript integration | Runtime cost, SSR complexity, bundle size | Highly dynamic component libraries |
    | **CSS-in-JS (zero-runtime: Vanilla Extract, Panda CSS, StyleX)** | Type-safe, no runtime cost, dynamic via CSS variables | Build step complexity, newer ecosystem | Performance-sensitive apps wanting type-safe styles |
    | **Plain CSS / Sass with BEM** | Universal, no tooling, full control | Manual scoping, naming conventions required, global scope risk | Simple projects, teams with strong CSS skills |

    State the chosen approach and justify against: performance budget, team familiarity, design system needs, SSR compatibility, and dynamic styling requirements.

15. **Design the theming and design token architecture.** Define the design token system:
    - **Token hierarchy:**
      - **Global tokens:** Raw values (colors, font sizes, spacing scale, radii, shadows, z-indices, breakpoints, animation durations).
      - **Semantic tokens:** Intent-mapped tokens referencing global tokens (e.g., `color.text.primary`, `color.bg.surface`, `color.border.error`, `spacing.component.padding`).
      - **Component tokens:** Component-specific overrides (e.g., `button.primary.bg`, `input.border.radius`).
    - **Token format:** CSS custom properties (recommended for runtime theming), or build-time constants for zero-runtime approaches.
    - **Dark mode / theming strategy:** CSS custom properties swapped via `data-theme` attribute or `prefers-color-scheme` media query. Define the theme toggle mechanism and persistence.
    - **Responsive design tokens:** Define breakpoints and the mobile-first vs. desktop-first approach. Specify the breakpoint values and usage pattern (media queries, container queries, or utility classes).
    - **Typography scale:** Define the type scale (sizes, weights, line heights, letter spacing) as tokens. Ensure fluid typography if required (`clamp()`).
    - **Spacing scale:** Define a consistent spacing scale (e.g., 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80).
    - **Token enforcement rules (mandatory):**
      - No raw hex/rgb/hsl colors in component-level code when token variables exist.
      - No ad-hoc spacing/radius/shadow values in component-level code; consume tokenized scales only.
      - Every component variant must map to semantic/component tokens, not hard-coded visual values.
      - Define required token namespaces and naming convention once, then reuse consistently across all features.

16. **Define responsive design strategy.** Specify:
    - **Approach:** Mobile-first (recommended) or desktop-first. Justify.
    - **Breakpoint system:** Define breakpoint values and names (e.g., `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`).
    - **Layout strategy:** CSS Grid for page-level layout, Flexbox for component-level layout. Define the grid system (columns, gutters, margins per breakpoint).
    - **Container queries:** Identify components that should respond to their container size rather than viewport size.
    - **Responsive component patterns:** Define how components adapt (hide/show elements, stack/unstack, resize, simplify). Avoid separate mobile/desktop components — prefer responsive adaptation within a single component.
    - **Touch targets:** Minimum 44×44px for interactive elements on touch devices (WCAG 2.5.8).
    - **Responsive images:** `srcset` and `sizes` strategy, art direction with `<picture>`, lazy loading with `loading="lazy"`.
    - **Strict layout primitives (mandatory):**
      - Define standard container widths per breakpoint and use them consistently.
      - Define default page shells (marketing, dashboard, form-heavy workflow, content detail).
      - Define section spacing rhythm (vertical spacing scale) and enforce it across pages.
      - Define standard grid columns and gutter values per breakpoint.
      - Define reusable empty/loading/error layout blocks to avoid inconsistent state presentation.