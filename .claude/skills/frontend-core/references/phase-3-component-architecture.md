# Phase 3 — Component Architecture

8. **Define the component design system and hierarchy.** Establish the component classification model using a layered approach:

   **Layer 1 — Primitive/Base Components (Design System Atoms):**
   Lowest-level, maximally reusable UI elements. No business logic, no data fetching. Fully controlled via props. Examples: `Button`, `Input`, `Text`, `Icon`, `Badge`, `Avatar`, `Spinner`.
   - Must be fully accessible out of the box.
   - Must support theming via design tokens.
   - Must have comprehensive prop types and default values.
   - Must be documented with all variant states.

   **Layer 2 — Composite Components (Design System Molecules/Organisms):**
   Composed from primitives. Still generic, but represent a recognizable UI pattern. Minimal or no business logic. Examples: `SearchInput`, `Modal`, `DataTable`, `Dropdown`, `Tabs`, `Card`, `Pagination`, `Toast`.
   - Define composition API (children, slots, render props, compound components).
   - Define controlled vs. uncontrolled behavior.

   **Layer 3 — Feature Components:**
   Business-logic-aware components scoped to a specific feature. May fetch data, manage local state, orchestrate user workflows. Examples: `LoginForm`, `InvoiceTable`, `UserProfileCard`, `CheckoutSummary`.
   - Should compose Layer 1 and Layer 2 components.
   - Should not be reused across unrelated features.

   **Layer 4 — Page/View Components:**
   Top-level components that correspond to routes. Responsible for layout composition, data orchestration, and assembling feature components. Minimal UI logic of their own.

   For each layer, define: naming conventions, prop design rules, file co-location strategy, and export patterns.

9. **Establish component design principles and patterns.** Define the rules the agent will follow and recommend:

   - **Single Responsibility:** Each component does one thing. If a component file exceeds ~200 lines or its name requires "And" (e.g., `HeaderAndNavigation`), it should be split.
   - **Props interface design:**
     - Use TypeScript interfaces or types for all props. No `any`.
     - Prefer specific prop types over generic ones (`variant: 'primary' | 'secondary'` over `variant: string`).
     - Use discriminated unions for complex conditional props.
     - Default values for optional props must be documented.
     - Event handler props follow the `on[Event]` naming convention.
   - **Composition over configuration:** Prefer composable components (`<Card><Card.Header /><Card.Body /></Card>`) over mega-components with dozens of boolean props.
   - **Render logic separation:** Separate data/logic concerns from presentation. Patterns by framework:
     - React: Custom hooks for logic extraction; presentational components receive data via props.
     - Vue: Composables for logic extraction; `<script setup>` for clean composition.
     - Svelte: Reactive stores and derived stores for logic extraction.
   - **Controlled vs. Uncontrolled:** Form elements and interactive components should support both patterns. Default to uncontrolled with an option to control via props.
   - **Forwarding and extensibility:** Components should forward `ref`, `className`/`class`, and spread remaining HTML attributes to the root element.
   - **Conditional rendering:** Avoid deeply nested ternaries. Extract conditions into descriptive boolean variables or early-return patterns.
   - **No visual drift rule:** Do not introduce one-off visual patterns for core controls (buttons, inputs, cards, form feedback, badges). Extend variants in shared components instead.
   - **Semantic interaction rule:** Primary actions must use semantic controls (`button`, `a`, form elements). Never rely on `onClick` on non-interactive tags for core workflows.

10. **Design the component API for critical components.** For each complex or widely-used component identified in the critical user interactions (Step 3), produce a detailed component specification:
    - **Component name and purpose.**
    - **Props interface** (TypeScript type definition with descriptions for each prop).
    - **State** (internal state variables and their types).
    - **Events emitted** (callbacks with payload types).
    - **Slots/children API** (what content can be injected).
    - **Accessibility contract** (ARIA role, keyboard interactions, focus management — reference WAI-ARIA Authoring Practices).
    - **Visual variants** (sizes, colors, states: default, hover, active, disabled, loading, error).
    - **Usage example** (code snippet showing the most common usage).
    - **Edge cases** (empty state, overflow content, loading state, error state, truncation behavior).

10A. **Use canonical component blueprints for foundational UI.** For code generation tasks, always scaffold and reuse canonical blueprints for:
    - **Button:** `variant`, `size`, `loading`, `disabled`, `icon`, `iconPosition`; keyboard/focus-visible behavior and accessible loading text.
    - **Input + FormField wrapper:** label, description, error text, required state, `aria-describedby` wiring, invalid state behavior.
    - **Card:** header/body/footer slots, elevation and border variants from tokens.
    - **Modal/Dialog:** open state, title/description, focus trap, escape key handling, focus restore on close.
    - **List/Table shell:** loading/empty/error/data states; responsive behavior (table-to-cards strategy when required).

10B. **Standardize UI state messaging patterns.** All generated UI must use consistent message and interaction patterns:
    - Form errors: concise, field-specific, actionable.
    - Empty states: explain context + primary next action.
    - Loading states: skeletons/spinners that preserve layout stability.
    - Success/error feedback: consistent toast/inline banner patterns with predictable severity semantics.