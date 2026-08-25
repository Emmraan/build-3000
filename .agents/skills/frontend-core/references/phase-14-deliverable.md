# Phase 14 — Frontend Deliverable Assembly

29. **Compose the frontend architecture document.** Organize all outputs into a structured deliverable:
    1. **Executive Summary** — One-paragraph overview of the frontend application, its purpose, and the architectural approach.
    2. **Requirements Summary** — Product type, target users, device/browser support, performance targets, accessibility requirements (from Steps 1–3).
    3. **Technology Decisions** — Rendering strategy, framework, key library selections with justifications (from Steps 4–5).
    4. **Project Structure** — Directory layout, organizational principles, naming conventions (from Step 6).
    5. **Routing Architecture** — Route map, layout hierarchy, auth guards, code splitting, data loading (from Step 7).
    6. **Component Architecture** — Component hierarchy, design principles, critical component specifications (from Steps 8–10).
    7. **State Management Architecture** — State categorization, server state strategy, global state strategy, form handling (from Steps 11–13).
    8. **Styling and Design System** — Styling approach, design tokens, theming, responsive strategy (from Steps 14–16).
    9. **API Integration Layer** — HTTP client setup, API module organization, type safety, error handling, form/validation strategy (from Steps 17–18).
    10. **Performance Plan** — Bundle optimization, rendering performance, Core Web Vitals targets and strategies (from Steps 19–21).
    11. **Accessibility Plan** — Semantic HTML rules, ARIA patterns, focus management, testing plan (from Step 22).
    12. **Error Handling and Resilience** — Error boundary strategy, API error handling, monitoring integration (from Step 23).
    13. **Testing Strategy** — Test layers, tools, coverage targets, CI integration (from Step 24).
    14. **Security Plan** — XSS, CSRF, token management, dependency security, CSP (from Step 25).
    15. **Build and CI/CD** — Toolchain, pipeline stages, deployment strategy (from Steps 26–27).
    16. **Internationalization** — i18n architecture if applicable (from Step 28).
    17. **Open Questions and Next Steps** — Unresolved decisions, deferred optimizations, recommended spikes.

30. **Adapt the depth and format to the user's need.** Not every request requires all preceding steps at full depth. Apply these guidelines:
    - **Quick consultation** (user asks a focused question, e.g., "should I use Zustand or Redux?"): Jump to the relevant step (Step 13 for state management), provide a concise tradeoff analysis considering the user's context, and give a clear recommendation.
    - **Component design** (user asks about a specific component): Execute Steps 8–10 for that component, with attention to accessibility (Step 22) and testing (Step 24).
    - **Performance issue** (user reports a performance problem): Execute Steps 19–21 as a diagnostic and optimization workflow. Ask for Lighthouse scores, bundle analysis output, or specific symptoms.
    - **Full frontend architecture** (user asks for a complete frontend design): Execute all steps sequentially, producing the full deliverable from Step 29.
    - **Code review / architecture review** (user presents existing code or architecture): Map the existing implementation against the framework, identify gaps against each step, and provide a prioritized list of improvements with effort estimates.
    - **Direct UI code implementation** (user asks to build frontend code now): Use fast-path implementation mode with the Default UI Generation Profile unless the user has explicitly specified alternatives. Ask questions only for critical blockers.

    Always state which depth level you are operating at and why.
    For direct UI code tasks, also follow the mandatory LLM Output Contract defined at the top of this section.

31. **Maintain an iterative, collaborative approach.** Frontend architecture evolves as the product evolves. After delivering the initial architecture:
    - Invite the user to challenge any decision with their specific constraints.
    - Be prepared to re-enter any phase when new information emerges (e.g., a new performance requirement may change the rendering strategy in Step 4, which cascades to framework choice in Step 5, routing in Step 7, and build optimization in Step 19).
    - When revising, trace the impact through all dependent steps and flag any inconsistencies.
    - Provide code examples, configuration snippets, and concrete file structures — not just abstract guidance. The output should be directly actionable by a developer.