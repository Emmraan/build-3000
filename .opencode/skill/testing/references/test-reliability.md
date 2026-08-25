# Test Reliability and Maintenance

### Phase 11: Test Reliability and Maintenance

31. **Design for test reliability.** Flaky tests (tests that pass sometimes and fail sometimes without code changes) are the single biggest threat to a test suite's value. A flaky test trains developers to ignore test failures:

    **Causes of flaky tests and prevention**:

    **Cause 1: Shared mutable test state**:
    - Test A modifies a database record. Test B reads the same record and asserts on its value. If Test B runs before Test A, it fails.
    - **Prevention**: Each test owns its data (step 20). Use transaction rollback or truncation. Never share mutable data between tests.

    **Cause 2: Time dependency**:
    - Test asserts that a timestamp is within the last 1 second. Under CI load, the test takes 1.5 seconds, and the assertion fails.
    - **Prevention**: Inject controllable clocks (step 22). Use time ranges rather than exact timestamps in assertions: `expect(createdAt).toBeBetween(testStart, testEnd)`.

    **Cause 3: Order dependency**:
    - Tests pass when run in a specific order but fail when run in a different order (or in parallel).
    - **Prevention**: Each test sets up and tears down its own state. Run tests in random order periodically to detect order dependencies. Most test frameworks support this (`--randomize` flag).

    **Cause 4: Async timing**:
    - Test asserts the result of an async operation too quickly (before it completes) or with a fixed sleep that is sometimes too short.
    - **Prevention**: Use polling with timeout (step 23), not `sleep()`. Use deterministic async testing (await completion signals, not time).

    **Cause 5: External dependency availability**:
    - Test calls a real external API (sandbox, external service) that is temporarily slow or unavailable.
    - **Prevention**: Do not call real external services in unit or integration tests. Mock or stub them. If contract tests call external sandboxes, mark them as potentially flaky and do not block CI on their failure.

    **Cause 6: Resource contention**:
    - Tests compete for shared resources (ports, files, database connections) in parallel execution.
    - **Prevention**: Use dynamic port allocation, unique file names, and per-test database schemas or transactions. Design tests for parallel execution from the start.

    **Flaky test policy**:
    - **Zero tolerance for known-flaky tests in the CI pipeline**: A flaky test must be either fixed immediately or quarantined (moved to a separate suite that does not block CI). A flaky test that stays in the main pipeline trains developers to re-run CI until it passes, destroying trust in the test suite.
    - **Track flaky tests**: Use test reporting tools that identify tests with intermittent failures. Flag tests that have failed and then passed without code changes.
    - **Quarantine**: Move flaky tests to a quarantine suite. Run the quarantine suite nightly. Fix quarantined tests on a regular cadence (weekly). If a quarantined test is not fixed within 30 days, evaluate whether to delete it.

32. **Design for test maintainability.** Tests that are expensive to maintain will eventually be abandoned or deleted:

    **Test the behavior, not the implementation**:
    - A test should assert on the output or observable side effects of an operation, not on how the operation is implemented internally.
    - **Bad**: `verify(repository.findById).wasCalledWith('123')` — this breaks if the method is renamed or the repository is restructured.
    - **Good**: `expect(result.order.id).toBe('123')` — this breaks only if the behavior changes.
    - If a refactoring (renaming methods, extracting classes, changing internal control flow) breaks tests without changing behavior, the tests are testing implementation details.

    **DRY in tests — apply carefully**:
    - **DRY for test setup utilities** (factories, builders, helpers): Yes. Centralize data creation to avoid duplication and reduce maintenance when schemas change.
    - **DRY for test assertions**: Cautiously. Custom assertion helpers are valuable if the same complex assertion is repeated many times. But do not over-abstract assertions — each test should be readable without jumping to utility files.
    - **DRY for test logic**: No. Each test should be a self-contained, linear story (arrange-act-assert). Sharing logic between tests (shared `beforeEach` setup, helper functions that perform arrange+act+assert) makes individual tests hard to understand and maintain. When a shared setup changes, it breaks tests in unpredictable ways. Prefer some duplication in tests over fragile shared abstractions.

    **Minimize coupling to internal structure**:
    - Test through public APIs and interfaces, not through internal methods.
    - For API endpoint tests: call the HTTP endpoint, not the service method directly. This tests the full request pipeline (routing, middleware, serialization) and is more resilient to internal refactoring.
    - For service tests: call the service interface method, not internal private methods. If a private method has logic worth testing, extract it into a separate, testable unit.

    **Avoid test helper creep**:
    - Test helpers and custom matchers are useful, but too many abstractions make tests unreadable. A test that reads like a DSL nobody understands is worse than a test with a few extra lines of explicit code.
    - Regularly review test helper code. If a helper is used in fewer than 5 tests, it may not be worth the abstraction.

33. **Design test review and quality standards.** Tests are production code and should be reviewed with the same rigor:

    **Code review checklist for tests**:
    - [ ] Test name describes the behavior being tested, not the method being called.
    - [ ] Test follows arrange-act-assert structure with clear sections.
    - [ ] Test asserts on behavior (output, side effects), not implementation (method calls).
    - [ ] Test creates its own data and does not depend on other tests' data.
    - [ ] Test does not use `sleep()` for async assertions (uses polling or await).
    - [ ] Mocks are used appropriately (external boundaries, not internal collaborators unnecessarily).
    - [ ] Test covers the primary success path and the most important failure/error paths.
    - [ ] No logic in the test (no if/else, no loops, no try/catch except for exception testing).
    - [ ] Test is deterministic (no random values without seeds, no time dependency without clock injection).
    - [ ] New critical business logic has corresponding unit tests.
    - [ ] New API endpoints have corresponding integration tests.
    - [ ] New external integrations have corresponding mock/stub configuration for testing.
