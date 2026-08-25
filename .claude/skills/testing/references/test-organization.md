# Test Organization and Structure

### Phase 10: Test Organization and Structure

29. **Design test directory structure.** Organize tests for discoverability and maintainability:

    **Co-located tests (recommended for unit and integration tests)**:
    ```
    src/
      orders/
        order-service.ts
        order-service.test.ts          # Unit tests
        order-service.integration.ts   # Integration tests
        order-repository.ts
        order-repository.test.ts
        order-repository.integration.ts
      payments/
        payment-service.ts
        payment-service.test.ts
    ```
    - Tests live next to the code they test. Easy to find, easy to maintain, clear ownership.
    - Use file name suffixes to distinguish test types: `.test.ts` (unit), `.integration.ts` (integration), `.e2e.ts` (end-to-end).

    **Separate test directory (alternative, common in Java/Go)**:
    ```
    src/
      orders/
        order_service.go
        order_repository.go
    tests/
      unit/
        orders/
          order_service_test.go
      integration/
        orders/
          order_repository_test.go
      e2e/
        order_flow_test.go
    ```

    **Shared test utilities**:
    ```
    tests/
      helpers/
        factories.ts          # Test data factories
        test-db.ts            # Database setup/teardown utilities
        test-server.ts        # Test HTTP server setup
        assertions.ts         # Custom assertions
        mocks/
          payment-gateway.ts  # Mock external services
          email-service.ts
    ```
    - Test utilities are shared across test files but scoped to the test directory. Production code must never depend on test utilities.

30. **Design test categorization and execution.** Categorize tests so they can be run selectively:

    **Test categories**:
    - **Unit tests**: Tag/directory: `unit`. Run: on every commit, in < 1 minute. Configuration: no external dependencies.
    - **Integration tests**: Tag/directory: `integration`. Run: on every commit, in < 5 minutes. Configuration: Testcontainers or Docker Compose.
    - **Contract tests**: Tag/directory: `contract`. Run: on every commit (consumer side), on provider CI (provider verification).
    - **E2E tests**: Tag/directory: `e2e`. Run: before production deployment, in < 15 minutes. Configuration: staging environment or ephemeral environment.
    - **Performance tests**: Tag/directory: `performance`. Run: nightly or before release, in 30-60 minutes. Configuration: dedicated performance environment.
    - **Smoke tests**: Tag/directory: `smoke`. Run: immediately after deployment (staging and production), in < 2 minutes. Configuration: target deployment environment.

    **CI pipeline test stages**:
    ```
    Commit → Lint → Unit Tests → Integration Tests → Contract Tests → Build → Deploy to Staging → Smoke Tests → E2E Tests → Performance Tests (optional) → Deploy to Production → Production Smoke Tests
    ```

    **Selective test execution**:
    - On pull requests: run unit, integration, and contract tests. Skip E2E and performance tests (too slow for PR feedback).
    - On merge to main: run all tests including E2E.
    - Nightly: run performance tests and extended E2E suite.
    - After production deployment: run smoke tests.
