# Phase 4 — State Management Architecture

11. **Analyze state categories and ownership.** Classify every piece of state in the application into the following categories. For each category, recommend the management approach:

    | State Category | Description | Examples | Recommended Approach |
    |---------------|-------------|----------|---------------------|
    | **Local UI state** | State scoped to a single component | Modal open/closed, input focus, hover state, accordion expanded | Component-local state (`useState`, `ref`, `$:`) |
    | **Shared UI state** | UI state needed by multiple components in a subtree | Sidebar collapsed, active tab in a panel, filter visibility | Lift state to nearest common ancestor, or lightweight context |
    | **Server/remote state** | Data fetched from backend APIs | User profile, product list, order history | Server state library (TanStack Query, SWR, Apollo Client, tRPC) |
    | **Global application state** | Cross-cutting app-level state | Current authenticated user, theme preference, feature flags, permissions | Global store (Zustand, Pinia, Redux Toolkit, Svelte stores) or context |
    | **URL state** | State encoded in the URL | Search query, filters, pagination, active tab, selected item | URL search params and route params — URL is the source of truth |
    | **Form state** | Complex form data with validation | Multi-step forms, dynamic field arrays, dependent validations | Form library (React Hook Form, Formik, VeeValidate, Superforms) or controlled component patterns |
    | **Derived/computed state** | State calculated from other state | Filtered list, total price, display name | Derived/computed values (`useMemo`, `computed`, `$derived`) — never store what you can compute |
    | **Persistent client state** | State that survives page reload | User preferences, draft content, cart items | `localStorage` / `sessionStorage` / IndexedDB with sync to state layer |

    **Critical rule:** Never duplicate server state into a global client store. Use a server state cache (TanStack Query pattern) as the single source of truth for remote data. Global stores should only hold truly client-side, application-level state.

12. **Design the server state (data fetching) architecture.** This is typically the most complex state category. Define:
    - **Data fetching library:** Recommend and justify (TanStack Query, SWR, Apollo Client, urql, tRPC, or framework-native like Remix loaders, Next.js Server Components, SvelteKit `load` functions).
    - **Cache key strategy:** Define a consistent, hierarchical key structure (e.g., `['users', userId, 'orders', { status, page }]`).
    - **Stale time and cache time:** Define defaults and per-resource overrides. Explain the stale-while-revalidate model.
    - **Optimistic updates:** For which mutations? Define the rollback strategy on failure.
    - **Pagination strategy:** Offset-based, cursor-based, or infinite scroll? Define the data model for paginated queries.
    - **Real-time data sync:** If applicable, define how WebSocket/SSE events update the cache (cache invalidation vs. direct cache mutation).
    - **Error handling for data fetching:** Define retry policy (count, backoff), error UI patterns (inline error, toast, full-page error), and stale data display policy (show stale data with error indicator vs. show error state).
    - **Request deduplication and batching:** How are duplicate in-flight requests handled?
    - **Prefetching strategy:** Which data should be prefetched on hover, route transition, or viewport intersection?

13. **Design the global state architecture (if needed).** If the application requires global client state beyond server state cache:
    - **Store selection:** Recommend and justify (Zustand, Redux Toolkit, Pinia, Jotai, Nanostores, Svelte stores, or built-in context).
    - **Store structure:** Define the shape of the global store. Organize by domain slice, not by data type.
    - **Action/mutation patterns:** Define how state is updated (actions, reducers, direct mutation with Immer, etc.).
    - **Selector patterns:** Define how components subscribe to state slices to prevent unnecessary re-renders.
    - **Persistence:** Which slices persist to `localStorage`? Define serialization and hydration strategy.
    - **DevTools integration:** Ensure time-travel debugging and state inspection are available in development.

    **Rule:** Keep the global store as small as possible. If state can be URL state, make it URL state. If it can be server state, use the server state cache. If it can be local, keep it local.