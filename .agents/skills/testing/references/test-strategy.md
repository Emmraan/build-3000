# Test Strategy Design

### Phase 1: Test Strategy Design

1. **Identify what matters most.** Before writing any test, establish what failures would be most damaging and what the testing must protect against. If the user says "we need more tests," that is not a strategy — it is an activity. Ask and clarify until the testing goals are explicit:

   - **What are the highest-risk areas of the system?** Identify components where bugs have the most severe consequences:
     - **Financial operations**: Payment processing, billing calculations, refunds, account balances. A bug here costs real money.
     - **Data integrity**: Writes that corrupt data, lose data, or create inconsistencies. A bug here may be irreversible.
     - **Security boundaries**: Authentication, authorization, access control. A bug here exposes customer data.
     - **Core business logic**: The domain rules that define correct behavior (order processing, pricing rules, eligibility calculations). A bug here produces wrong results silently.
     - **Integration boundaries**: External API interactions where failures are common and recovery is complex.
     - **Data migrations**: Schema changes and data transformations that affect production data.
   - **What has broken before?** Review past production incidents. The most valuable tests prevent recurrence of known failures. If the system has had 3 incidents from payment calculation errors, payment calculation testing is the highest priority.
   - **What is changing frequently?** Code that changes often has the highest probability of introducing new bugs. Focus testing effort on areas of active development.
   - **What is hardest to test manually?** Concurrent access, race conditions, edge cases in complex calculations, error recovery paths — these are areas where automated testing provides the most value because manual testing is unreliable or impossible.

2. **Design the test pyramid (or the appropriate shape for your system).** The test pyramid is a guideline for the distribution of tests by level. Adapt it to your system's specific risk profile:

   **Standard test pyramid** (recommended starting point):
   ```
        /  E2E  \           Few — slow, expensive, high confidence per test
       / Integration \       Moderate — test component boundaries
      /    Unit Tests   \    Many — fast, cheap, focused
   ```

   - **Unit tests (base — largest count)**: Test individual functions, methods, or classes in isolation. Fast (milliseconds per test), no external dependencies, run on every commit. Cover: business logic, calculations, data transformations, validation rules, pure functions, and state machines.
   - **Integration tests (middle — moderate count)**: Test the interaction between components and external systems (databases, caches, message queues, HTTP endpoints). Slower (seconds per test), require infrastructure (test database, test containers). Cover: database queries, API endpoint behavior, message producer/consumer, cache interactions, and serialization/deserialization.
   - **End-to-end tests (top — smallest count)**: Test complete business workflows across the full system. Slowest (seconds to minutes per test), require a complete test environment. Cover: critical user journeys, cross-service workflows, and deployment verification (smoke tests).

   **When to deviate from the pyramid**:
   - **CRUD-heavy applications**: Integration tests (testing API endpoints with a real database) provide more value than unit tests of thin service layers that just pass data through. The pyramid may look more like a diamond (more integration, fewer unit).
   - **Complex domain logic**: Unit tests of domain logic provide the highest value. The pyramid shape is ideal — invest heavily in unit tests.
   - **Microservices**: Contract tests become critical for inter-service boundaries. Add a contract testing layer between unit and integration.
   - **Legacy systems without tests**: Start with a few end-to-end tests that cover critical paths (smoke tests), then add integration tests for the riskiest components, then add unit tests as code is refactored. The initial shape may be an inverted pyramid or an ice cream cone — that is acceptable as a starting point, not as a target.

   State the target test distribution for the system and justify it: "For this payment processing service, the target is: 60% unit tests (complex pricing calculations, business rules), 30% integration tests (database operations, API endpoints, Stripe adapter), 8% contract tests (API contracts with consuming services), 2% E2E tests (critical payment flow smoke tests). The heavy unit test investment is justified by the complex pricing logic where calculation errors have direct financial impact."

3. **Define test boundaries and ownership.** For each component or service, define what is tested at which level:

   **Service-level test boundaries**:
   - **Unit tests**: Test business logic, domain models, and utility functions within the service. Mock all external dependencies (database, HTTP clients, message queues).
   - **Integration tests**: Test the service's API endpoints, database interactions, and internal message handling using real (containerized) infrastructure. Mock external services that are not owned by the team.
   - **Contract tests**: Test the contracts between this service and its consumers (API contracts) and between this service and its dependencies (external API contracts).
   - **E2E tests**: A small set of tests that verify critical flows across multiple services in a staging environment.

   **Ownership**:
   - Unit and integration tests: Owned by the team that owns the service. Written alongside the code. Run in the service's CI pipeline.
   - Contract tests: Consumer-side contracts owned by the consuming team. Provider verification owned by the providing team. Both run in their respective CI pipelines.
   - E2E tests: Owned by the team responsible for the end-to-end flow, or by a dedicated quality/platform team. Run in a separate pipeline against a staging environment.

4. **Define test requirements for the CI/CD pipeline.** Establish the quality gates:

   **Pre-merge (pull request) requirements**:
   - All unit tests pass.
   - All integration tests pass.
   - Contract tests pass (if applicable).
   - Code coverage does not decrease (or meets minimum threshold for changed files).
   - SAST (static analysis security testing) passes with no new critical/high findings.
   - Linting passes.
   - Maximum pipeline time: 10-15 minutes. If tests take longer, they will be skipped or ignored by developers.

   **Post-merge (main branch) requirements**:
   - Full test suite (unit + integration + contract) passes.
   - Performance regression tests pass (if applicable).
   - Dependency vulnerability scan passes.
   - Container image scan passes.

   **Pre-deployment (staging) requirements**:
   - Smoke tests pass against the staging environment.
   - E2E tests for critical paths pass.
   - Performance tests pass (if significant changes).

   **Post-deployment (production) requirements**:
   - Smoke tests pass against production.
   - Canary metrics are healthy (error rate, latency within thresholds).
