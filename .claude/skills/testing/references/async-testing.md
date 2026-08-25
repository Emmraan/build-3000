# Testing Asynchronous Systems

### Phase 7: Testing Asynchronous Systems

23. **Design tests for asynchronous processing.** Async systems (message queues, event-driven architecture, background jobs) are inherently harder to test because the effect happens later, in a different execution context:

    **Strategy 1: Test producer and consumer separately (recommended)**:
    - **Producer test** (integration): Perform the action that produces the message. Assert that the correct message was written to the outbox table (if using outbox pattern) or published to the test broker.
    - **Consumer test** (integration): Publish a test message to the broker. Verify the consumer processes it correctly: the expected side effects occur (database updates, events published), and the message is acknowledged.
    - **Advantages**: Tests are fast, focused, and independent. Producer and consumer can be developed and tested by different teams.

    **Strategy 2: Test the full async flow (E2E-level)**:
    - Perform the triggering action (e.g., create an order via API). Wait for the async effect to complete (e.g., email is sent, inventory is updated). Assert the final state.
    - **Waiting strategy**: Poll the expected outcome (check database, check output queue, check mock external service) with a timeout. Do not use `sleep(5000)` — it makes tests slow when the system is fast and flaky when the system is slow.
      ```
      // Polling with timeout
      await waitFor(
        () => db.query('SELECT status FROM orders WHERE id = ?', [orderId]),
        (result) => result.status === 'confirmed',
        { timeout: 10000, interval: 200 }
      );
      ```
    - **Use a test helper for async assertions**: Libraries like `awaitility` (Java), `eventually` patterns, or custom `waitFor` utilities that poll with configurable timeout and interval.

    **Strategy 3: Synchronous test mode**:
    - Configure the application to process messages synchronously during tests (disable async dispatching, process inline). This eliminates the timing issue entirely.
    - **Advantages**: Tests are fast and deterministic.
    - **Disadvantages**: Does not test the actual async processing pipeline (queue, consumer, acknowledgment). May miss bugs related to async behavior (serialization, deserialization, ordering).
    - **Use for**: Unit tests of the processing logic. Complement with integration tests that test the real async pipeline.

24. **Design tests for eventual consistency.** In eventually consistent systems, the test must account for propagation delays:

    - **Assert on the eventual state, not the immediate state**: After a write, do not immediately read from a replica and assert the result. Poll until the expected state appears or a timeout is reached.
    - **Test the consistency contract**: If the system promises "data is consistent within 5 seconds," test that the data appears within 5 seconds (with a safety margin). If it does not appear within the timeout, the test fails — indicating a consistency violation.
    - **Test conflict resolution**: If two concurrent writes can conflict, test the conflict resolution logic: simulate concurrent writes and verify the correct resolution (last-write-wins, merge, rejection).
