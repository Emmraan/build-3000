# Phase 6 — Performance Deliverable Assembly

Detailed reference backing the "Phase 6" decision point in SKILL.md: composing the performance report, adapting depth to the user's need, and the empirical, iterative working loop.

---

### Phase 6 — Performance Deliverable Assembly

29. **Compose the performance analysis and optimization report.** Organize all outputs into a structured deliverable:
    1. **Executive Summary** — One-paragraph overview: current performance state, key findings, and expected impact of recommended optimizations.
    2. **Performance Context** — Application type, tech stack, target audience, existing constraints (from Steps 1–2).
    3. **Baseline Measurements** — Full baseline data with lab and field metrics for each critical page (from Step 3).
    4. **Performance Targets** — Defined targets and budgets with justification (from Step 4).
    5. **Diagnosis Findings** — Root cause analysis for each identified performance issue, organized by metric category:
       - LCP findings (from Step 6)
       - INP findings (from Step 7)
       - CLS findings (from Step 8)
       - Bundle analysis findings (from Step 9)
       - Network findings (from Step 10)
       - Rendering findings (from Step 11)
       - Memory findings (from Step 12, if applicable)
       - Third-party script findings (from Step 13)
    6. **Prioritized Optimization Plan** — Ranked table of all recommended optimizations with effort estimates, expected impact, and priority (from Step 14).
    7. **Implementation Guidance** — Specific, code-level implementation instructions for each optimization (from Steps 15–20, 25–28, as applicable).
    8. **Monitoring and Prevention Plan** — RUM instrumentation, synthetic monitoring, performance budgets, CI integration (from Steps 21–24).
    9. **Expected Results** — Projected post-optimization metrics based on the implemented changes. Define a re-measurement plan: re-baseline 1 week after optimizations are deployed and compare.
    10. **Open Questions** — Unresolved items, measurements that need more data, optimizations requiring further investigation.

30. **Adapt the depth and format to the user's need.** Apply these guidelines:
    - **Quick question** (user asks a focused question, e.g., "how do I fix my LCP?"): Jump directly to Step 6, diagnose LCP, and provide targeted optimization guidance. Ask for the LCP element and current TTFB.
    - **Specific metric optimization** (user wants to improve one Core Web Vital): Execute Steps 2–4 for context, then the relevant diagnostic step (6 for LCP, 7 for INP, 8 for CLS), then the relevant optimization steps, then monitoring recommendations.
    - **Bundle optimization** (user wants to reduce bundle size): Execute Steps 2, 9, 14, 18, and 23. Provide a concrete action plan with expected size reductions.
    - **Full performance audit** (user wants a comprehensive assessment): Execute all steps sequentially, producing the full deliverable from Step 29.
    - **Performance infrastructure setup** (user wants monitoring and budgets): Execute Steps 3–4, 21–24. Provide copy-paste configurations.
    - **Code review for performance** (user presents code with performance concerns): Map the code against the relevant optimization patterns (Steps 15–20, 25–28) and provide specific refactoring recommendations with before/after code.

    Always state which depth level you are operating at and why.

    **New build / delivered UI (default depth):** Whenever the agent generates or refactors any frontend (showcase, marketing, or SaaS), it must self-verify against the Non-Negotiable Lighthouse Default in the instructions: run Lighthouse (or Lighthouse CI) on each delivered page, confirm Performance, Accessibility, Best Practices, and SEO each score ≥ 95/100 at the stricter 95-grade thresholds, apply Steps 6–8 / 14–20 / 23 for any shortfall, re-measure, and report the four category scores plus Core Web Vitals in the output as proof the UI is consistently smooth and 95+.

31. **Maintain an empirical, iterative approach.** Performance optimization is a cycle: measure → hypothesize → optimize → verify. After delivering the initial analysis:
    - Never recommend optimizations without measured evidence of a problem. Premature optimization adds complexity without proven benefit.
    - After each optimization is implemented, re-measure the affected metrics to verify improvement and detect regressions in other metrics.
    - Invite the user to share updated measurements so recommendations can be refined.
    - When multiple optimizations are planned, implement and measure them one at a time (or in small, related batches) to attribute impact accurately.
    - Performance characteristics change as the application evolves — recommend periodic re-auditing (quarterly for active products).
    - Stay current with browser capabilities: new APIs (`Speculation Rules`, `scheduler.yield()`, `Popover`, `View Transitions`, CSS `content-visibility`, `@scope`, `@layer`) can obsolete older optimization techniques. Recommend modern approaches when browser support meets the user's support matrix.