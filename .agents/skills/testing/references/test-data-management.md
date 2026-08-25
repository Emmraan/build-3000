# Test Data Management

### Phase 6: Test Data Management

20. **Design test data strategy.** Test data management is one of the most underestimated aspects of testing. Poor test data strategy leads to: flaky tests (shared data modified by other tests), slow tests (expensive data setup), and unmaintainable tests (fragile fixtures that break with schema changes).

    **Principle: Each test owns its data.** Every test creates the data it needs and does not depend on data created by other tests or by a global seed script. Shared mutable test data is the #1 cause of flaky tests.

    **Test data creation patterns**:

    **Pattern 1: Factory functions (recommended)**:
    - Create factory functions that generate test entities with sensible defaults and allow overriding specific fields:
      ```
      function createTestUser(overrides = {}) {
        return {
          id: uuid(),
          email: `test-${uuid()}@example.com`,
          name: 'Test User',
          role: 'user',
          created_at: new Date(),
          ...overrides
        };
      }

      function createTestOrder(overrides = {}) {
        return {
          id: uuid(),
          customer_id: overrides.customer_id || createTestUser().id,
          status: 'pending',
          total_cents: 1000,
          currency: 'USD',
          items: [{ product_id: uuid(), quantity: 1, price_cents: 1000 }],
          ...overrides
        };
      }
      ```
    - **Advantages**: Each test gets unique data (no collision with other tests). Easy to customize for specific test scenarios. Factory changes when the schema changes (one place to update).
    - **Use a library**: Factory Bot (Ruby), Fishery/Factory Girl (JavaScript), factory_boy (Python), instancio (Java). These provide more sophisticated factory features (sequences, traits, associations, lazy evaluation).

    **Pattern 2: Database fixtures (use carefully)**:
    - Predefined datasets loaded into the database before tests.
    - **When to use**: Reference data that is constant and shared across many tests (countries, currencies, feature flags, roles). These are read-only and never modified by tests.
    - **When NOT to use**: Mutable data that tests modify. If test A modifies a fixture record and test B reads it, the tests are coupled and the order of execution matters.

    **Pattern 3: Builder pattern (for complex objects)**:
    ```
    const order = new OrderBuilder()
      .withCustomer(testCustomer)
      .withItems([
        { product: 'Widget', quantity: 3, price: 10.00 },
        { product: 'Gadget', quantity: 1, price: 25.00 }
      ])
      .withDiscount(0.1)
      .withShipping('express')
      .build();
    ```
    - Use for entities with many optional fields and complex construction logic.

21. **Design test database cleanup.** After each test (or test suite), the database must be in a clean state:

    **Strategy 1: Transaction rollback (recommended for unit/integration tests)**:
    - Wrap each test in a database transaction. At the end of the test, rollback the transaction. No data is committed.
    - **Advantages**: Fastest cleanup (rollback is instantaneous). Guarantees clean state.
    - **Disadvantages**: Cannot test code that commits transactions explicitly. Cannot test behavior across multiple transactions (concurrent access). Some frameworks/ORMs interfere with nested transactions.
    - **Implementation**: Most test frameworks support this natively (Spring's `@Transactional` test, Django's `TransactionTestCase`, Go's test-scoped transactions).

    **Strategy 2: Truncation between tests**:
    - After each test (or test suite), truncate all tables: `TRUNCATE TABLE orders, customers, products CASCADE`.
    - **Advantages**: Works with code that commits transactions. Cleaner than rollback for tests that test commit behavior.
    - **Disadvantages**: Slower than rollback (especially with many tables). Must handle truncation order due to foreign key constraints (use `CASCADE` or disable FK checks temporarily).

    **Strategy 3: Database recreation**:
    - Drop and recreate the database (or schema) before each test suite. Apply all migrations to create a fresh schema.
    - **Advantages**: Guarantees absolutely clean state. Tests migration correctness.
    - **Disadvantages**: Slowest option. Only appropriate for test suite setup, not per-test cleanup.

    **Recommendation**: Use transaction rollback by default. Use truncation for tests that require committed transactions. Use database recreation only for test suite initialization.

22. **Design test data for specific scenarios.** Some testing scenarios require specially crafted data:

    **Time-dependent tests**:
    - Do not use `new Date()` or `Date.now()` directly in code that is being tested. Inject a clock dependency that can be controlled in tests:
      ```
      // Production: use real clock
      const clock = { now: () => new Date() };

      // Test: use fixed or controllable clock
      const clock = { now: () => new Date('2024-01-15T10:00:00Z') };
      ```
    - Test time-dependent behavior (expiry, timeout, scheduling) by setting the clock to specific values, not by using `sleep()` or waiting for real time to pass.

    **Randomness-dependent tests**:
    - If the system uses random values (UUIDs, random selection, A/B test assignment), inject a seeded random number generator for deterministic testing.
    - Alternatively, inject the random value as a parameter rather than generating it inside the function being tested.

    **Concurrency tests**:
    - Use a deterministic thread scheduler if available, or use multiple concurrent test threads that all attempt to modify the same resource simultaneously. Verify: no data corruption, no deadlocks, correct final state, appropriate error handling for conflicts.
    - Run concurrency tests multiple times (10-100 iterations) to increase the probability of exposing race conditions.
