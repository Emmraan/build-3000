# End-to-End Testing

### Phase 5: End-to-End Testing

18. **Design end-to-end (E2E) test strategy.** E2E tests verify complete business workflows across the full system. They provide the highest confidence but are the slowest and most maintenance-intensive:

    **What to E2E test** (small, critical set):
    - **Critical business flows only**: The 5-10 most important user journeys that, if broken, would have the most severe business impact. Examples:
      - User registration → email verification → login.
      - Product search → add to cart → checkout → payment → order confirmation.
      - API key creation → API call with key → rate limiting.
    - **Smoke tests for deployment verification**: A minimal set of tests that verify the deployed system is functional. Run immediately after deployment: can the system serve requests? Does authentication work? Does the database connection work?

    **What NOT to E2E test**:
    - Every feature and edge case. E2E tests should not replace unit and integration tests. If you have 500 E2E tests, the suite is too large and will be slow, flaky, and expensive to maintain.
    - Error handling edge cases. Test these at the unit and integration level.
    - Variations of the same flow (different payment methods, different shipping options). Test the flow once E2E; test variations at the integration level.

    **E2E test design rules**:
    - **Keep the count low**: Aim for 10-30 E2E tests for a typical service or system. More than 50 is a warning sign.
    - **Each test is independent**: No test depends on another test's data or execution. Each test sets up its own data and cleans up after itself.
    - **Test at the API level, not the UI level**: For backend systems, E2E tests call the API endpoints (HTTP requests), not the browser UI. This is faster, more reliable, and more focused on backend behavior.
    - **Use realistic but controlled test data**: Create specific test data for each test, not shared "seed data" that all tests depend on.
    - **Set generous timeouts**: E2E tests involve multiple services, databases, and potentially external sandboxes. Set timeouts that accommodate real latency without being so long that a hung test blocks the pipeline for minutes.
    - **Tag and categorize**: Tag E2E tests so they can be run selectively: `@smoke` (run after every deployment), `@critical` (run before production deployment), `@full` (run nightly or weekly).

19. **Design E2E test environment.** E2E tests require a complete, realistic environment:

    **Staging environment** (recommended for E2E):
    - A deployment of all services with configuration matching production (same database engine, same message broker, same cache). Test data only — no production data.
    - External integrations use sandbox/test mode (Stripe test mode, SendGrid sandbox).
    - Refreshed periodically (rebuild from scratch weekly or after each deployment to prevent data accumulation).

    **Ephemeral environments** (for PR-level E2E testing):
    - Spin up a complete environment per pull request using containerized services (Docker Compose, Kubernetes namespaces, or cloud-native ephemeral environments).
    - Advantages: Isolated, no interference between parallel PRs, fresh state for each test run.
    - Disadvantages: Slower startup (minutes), more infrastructure cost, may not perfectly replicate production topology.

    **Production-like E2E testing** (for mature systems):
    - Run a small set of smoke tests against production after deployment. Use test-specific accounts and data that are isolated from real user data. Be cautious: production tests must not create side effects that affect real users (use a test tenant, test payment method, test email address).
