# Phase 6 — API Integration and Data Layer

17. **Design the API integration layer.** Define the architecture for communicating with backend services:
    - **API client setup:** Create a centralized, configured HTTP client (Axios instance, custom `fetch` wrapper, or generated client from OpenAPI/GraphQL schema). Define:
      - Base URL configuration per environment.
      - Default headers (Content-Type, Accept, correlation/request ID).
      - Authentication token injection (interceptor/middleware that attaches the access token).
      - Request/response transformation (camelCase ↔ snake_case if needed).
    - **API layer organization:** One service module per backend domain or resource. Each module exports typed functions:
      ```typescript
      // services/users.ts
      export const usersApi = {
        getById: (id: string): Promise<User> => client.get(`/users/${id}`),
        update: (id: string, data: UpdateUserDto): Promise<User> => client.put(`/users/${id}`, data),
        list: (params: ListUsersParams): Promise<PaginatedResponse<User>> => client.get('/users', { params }),
      };
      ```
    - **Type safety:** All API request and response types must be defined in TypeScript. Prefer auto-generated types from OpenAPI specs (`openapi-typescript`, `orval`) or GraphQL codegen (`graphql-codegen`). Manual types are the fallback.
    - **Error handling:** Define a unified error handling strategy:
      - Categorize errors: network errors, 4xx client errors, 5xx server errors, timeout errors.
      - Transform API errors into a consistent application error shape.
      - Map specific error codes to user-facing messages.
      - Handle 401 (trigger token refresh or redirect to login) and 403 (show forbidden state) globally.

18. **Design form handling and validation.** For applications with significant form interactions:
    - **Form library:** Recommend and justify (React Hook Form, Formik, VeeValidate, Superforms, native form handling). Prefer libraries that minimize re-renders and support schema validation.
    - **Validation strategy:**
      - **Schema validation library:** Zod, Yup, Valibot, or ArkType. Define shared schemas between frontend and backend if possible.
      - **Validation timing:** Define when validation runs (onChange, onBlur, onSubmit). Recommend onBlur for individual fields and onSubmit for the full form.
      - **Server-side validation integration:** All client-side validation must be duplicated on the server. Define how server validation errors are mapped back to specific fields.
    - **Complex form patterns:** Define approaches for:
      - Multi-step/wizard forms (state preservation across steps, step validation, navigation).
      - Dynamic field arrays (add/remove items, reorder).
      - Dependent fields (field B options change based on field A value).
      - File uploads (progress tracking, preview, size/type validation, chunked upload for large files).
      - Autosave (debounce interval, conflict resolution, dirty state tracking).
    - **Form UX consistency rules:**
      - Keep label/help/error placement consistent for all fields.
      - Use one validation message style guide (tone, length, actionability) across the product.
      - Keep button labels and CTA hierarchy consistent across all forms (`primary`, `secondary`, `destructive`, `ghost`).