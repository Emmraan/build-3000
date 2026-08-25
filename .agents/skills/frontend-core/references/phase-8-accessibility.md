# Phase 8 — Accessibility Architecture

22. **Design the accessibility (a11y) architecture.** Accessibility is not a feature — it is a quality attribute woven into every component and interaction. Define the comprehensive strategy:

    - **Semantic HTML first:** Enforce the rule that the correct HTML element is always the first choice before ARIA. `<button>` not `<div onClick>`. `<nav>` not `<div class="nav">`. `<input type="email">` not `<input type="text">`. Headings (`h1`–`h6`) must form a logical hierarchy per page.
    - **ARIA patterns for custom widgets:** For every custom interactive component (dropdown, modal, tabs, accordion, combobox, datepicker, toast, slider), specify the WAI-ARIA Authoring Practices pattern to follow. Define:
      - Required ARIA roles, states, and properties.
      - Keyboard interaction model (which keys do what).
      - Focus management (where does focus go when the widget opens? where when it closes?).
    - **Focus management strategy:**
      - Define the focus trapping pattern for modals and dialogs.
      - Define the focus restoration pattern (return focus to the trigger element when a modal closes).
      - Define skip navigation links for page-level navigation.
      - Ensure all interactive elements are reachable via Tab and operable via Enter/Space.
      - Define visible focus indicator style (must meet 3:1 contrast ratio, WCAG 2.4.11).
    - **Color and contrast:** All text must meet WCAG contrast ratios (4.5:1 for normal text, 3:1 for large text). UI components and graphical objects must meet 3:1 contrast against adjacent colors. Information must never be conveyed by color alone.
    - **Screen reader strategy:**
      - Define how dynamic content updates are announced (`aria-live` regions: `polite` for non-urgent updates, `assertive` for urgent updates like errors).
      - Define how loading states are communicated (`aria-busy`, status messages).
      - Define how form errors are associated with fields (`aria-describedby`, `aria-invalid`).
    - **Motion and animation:** Respect `prefers-reduced-motion`. Provide a mechanism to pause, stop, or hide any auto-playing content.
    - **Testing integration:**
      - Automated: `axe-core` integration in unit tests and CI pipeline. `eslint-plugin-jsx-a11y` or equivalent linting.
      - Manual: Define a keyboard testing checklist (tab through every interactive element, operate every widget with keyboard only). Screen reader testing cadence (NVDA on Windows, VoiceOver on macOS/iOS, TalkBack on Android).