# Phase 1 — Frontend Context and Requirements Assessment

1. **Clarify the frontend challenge type.** Before producing any guidance, determine what the user needs. Classify the request into one of these categories and state it explicitly:
   - **Greenfield architecture:** Designing a new frontend application from scratch.
   - **Feature implementation:** Building a specific feature or UI within an existing application.
   - **Component design:** Designing or refining a specific UI component or component system.
   - **Refactoring/migration:** Improving, restructuring, or migrating existing frontend code.
   - **Performance optimization:** Diagnosing and fixing performance problems.
   - **Accessibility remediation:** Identifying and fixing accessibility gaps.
   - **Infrastructure/tooling:** Build system, CI/CD, developer experience improvements.
   - **Review/critique:** Evaluating existing frontend code or architecture.

   The classification determines which subsequent steps to execute at full depth versus which to summarize.

2. **Gather frontend-specific requirements.** Extract or establish the following. Ask clarifying questions for any critical gaps:

   - **Product type and interaction model:** Marketing site, content platform, SaaS dashboard, e-commerce storefront, data-heavy internal tool, real-time collaborative app, media/streaming app? This drives rendering strategy, state complexity, and performance priorities.
   - **Target users and devices:** Desktop-primary, mobile-first, or universal? Touch-heavy interactions? Offline requirements? Low-bandwidth environments?
   - **Browser and platform support matrix:** Define minimum supported browsers and versions. State whether legacy support (IE, older Safari) is required.
   - **Existing tech stack (if any):** Framework, language (TypeScript or JavaScript), styling approach, state management, build tools, testing tools, deployment platform. If greenfield, note that stack selection is required.
   - **Team context:** Team size, frontend experience level, familiarity with specific frameworks, existing conventions.
   - **Design assets:** Is there a design system, Figma files, brand guidelines, or component library? Or is the agent advising on design system creation?
   - **Performance targets:** Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1), bundle size budget, time-to-interactive target.
   - **Accessibility requirements:** WCAG conformance level (A, AA, AAA), legal requirements (ADA, EAA, Section 508).
   - **SEO requirements:** Is search engine discoverability critical? This drives rendering strategy decisions.
   - **Internationalization requirements:** Number of languages, RTL support, locale-specific formatting.
   - **Integration points:** Backend APIs (REST, GraphQL, gRPC-Web), third-party SDKs, analytics, auth providers, CMS, payment gateways.
   - **Real-time requirements:** WebSockets, Server-Sent Events, polling? What data must update in real time?
   - **Offline requirements:** Must the app work offline? Service worker needs? Local data persistence?

3. **Identify the critical user interactions.** List the 3–5 most important UI workflows from the user's perspective. For each:

   - Describe the interaction sequence (what the user sees, clicks, types, and expects).
   - Identify the data requirements (what data must be fetched, created, or updated).
   - Note the performance sensitivity (is this a first-impression flow? a high-frequency interaction?).
   - Note the complexity drivers (conditional rendering, multi-step forms, real-time updates, optimistic UI, drag-and-drop, animations).

   These critical interactions will serve as the primary validation lens for all architectural decisions.