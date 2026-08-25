# Test Observability and Metrics

### Phase 12: Test Observability and Metrics

34. **Design test metrics and reporting.** Measure the test suite's health and value:

    **Metrics to track**:

    **Test execution metrics**:
    - **Total test count** by type (unit, integration, contract, E2E).
    - **Pass rate**: Percentage of tests passing per run. Target: 100% for the main branch. Investigate any test that fails on the main branch immediately.
    - **Execution time**: Total time for each test category. Track trends — a gradually slowing test suite degrades developer productivity.
      - Unit tests: < 1 minute total.
      - Integration tests: < 5 minutes total.
      - E2E tests: < 15 minutes total.
      - Total pre-merge pipeline: < 15 minutes.
    - **Flaky test rate**: Percentage of tests that have been both pass and fail on the same code commit. Target: < 1%. Above 5%: the test suite is losing credibility.
    - **Test failure rate by cause**: Categorize failures — real bugs caught, flaky failures, environment issues, test data issues. Only "real bugs caught" provides value.

    **Coverage metrics** (use carefully — coverage is a tool, not a goal):
    - **Line coverage**: Percentage of code lines executed by tests. Useful for identifying completely untested code. Not useful as a quality metric — 100% line coverage with no assertions provides zero confidence.
    - **Branch coverage**: Percentage of conditional branches (if/else) tested. More meaningful than line coverage — identifies untested conditions.
    - **Mutation coverage** (most meaningful, most expensive): A mutation testing tool introduces small changes (mutations) to the production code and checks if any test fails. If no test fails, the test suite missed the mutation — indicating a gap in test effectiveness. Tools: Stryker (JavaScript/TypeScript), PIT (Java), mutmut (Python).
    - **Coverage targets**: Do NOT set a global coverage target (e.g., "80% coverage"). Instead:
      - Require coverage for critical code paths (payment processing, authorization, data integrity) — aim for 90%+ in these areas.
      - Require coverage for new code: "New code in PRs must have > 80% branch coverage." This prevents coverage from decreasing as new code is added.
      - Do not require coverage for boilerplate (configuration, DI wiring, generated code). Exclude these directories from coverage reports.
      - Use coverage as a guide for finding untested code, not as a metric to game.

    **Value metrics** (the most important, hardest to measure):
    - **Bugs caught by tests before production**: Track incidents and determine whether the bug would have been caught by an existing or reasonable test. A test suite that catches bugs before production is valuable regardless of its coverage percentage.
    - **Test-prevented regressions**: When a test fails on a PR, investigate whether it caught a real regression. Track "saves" to justify testing investment.
    - **Time to detect production bugs**: How long after deployment do bugs appear? A shorter time suggests the test suite is missing important scenarios. A longer time (or no bugs) suggests the test suite is effective.
    - **Developer confidence**: Qualitative measure — do developers trust the test suite? Do they feel confident deploying when all tests pass? If developers say "I don't trust the tests, I need to test manually," the test suite has failed its primary purpose.

35. **Design test reporting and dashboards.**

    **CI test reporting**:
    - Every CI run produces a test report showing: pass/fail per test, execution time per test, test output/logs for failures, and coverage report.
    - Use JUnit XML format (standard across all CI systems) for test result reporting.
    - Display test results directly in pull request reviews (GitHub Actions, GitLab CI, or test reporting plugins).
    - For failing tests, include the assertion failure message and relevant logs — developers should be able to diagnose the failure from the CI report without reproducing locally.

    **Test health dashboard**:
    - **Total test count trend** (by type, over time).
    - **Pass rate trend** (should be consistently 100% on main branch).
    - **Pipeline duration trend** (should not grow unbounded).
    - **Flaky test rate trend** (should be consistently < 1%).
    - **Coverage trend** (should not decrease over time).
    - **Quarantined test count** (should trend toward zero).
