# Integration Testing

### Phase 3: Integration Testing

11. **Design integration test architecture.** Integration tests verify that components work together correctly — that the code interacts properly with real databases, real message queues, real caches, and real HTTP endpoints:

    **What to integration test** (high value):
    - **Database interactions**: Queries return correct results, writes persist correctly, constraints are enforced, transactions work, migrations produce the expected schema.
    - **API endpoints**: Request parsing, routing, middleware (authentication, authorization), response serialization, error responses, status codes.
    - **Message queue producers/consumers**: Messages are published correctly, consumers process messages correctly, acknowledgment/rejection works, DLQ routing works.
    - **Cache interactions**: Cache reads and writes, TTL behavior, cache miss handling, serialization/deserialization.
    - **Internal service-to-service communication**: gRPC/REST calls between services, request/response format, error propagation.

    **What NOT to integration test**:
    - Business logic already covered by unit tests. Integration tests should test the interaction, not re-test the logic.
    - External third-party APIs (Stripe, SendGrid). Use mock/stub adapters in integration tests. Test real external API communication in contract tests or sandbox tests (see integration skill).

12. **Design test infrastructure using containers.** Use containerized dependencies for integration tests — do not use shared test databases, H2/SQLite in place of PostgreSQL, or in-memory substitutes that behave differently from production:

    **Testcontainers** (recommended approach):
    - Testcontainers is a library that manages Docker containers for test dependencies. It starts containers before tests, provides connection URLs, and cleans up after tests.
    - **PostgreSQL**: Start a real PostgreSQL container with the same version as production. Run migrations to create the schema. Each test suite gets a clean database.
    - **Redis**: Start a real Redis container. Tests interact with real Redis, including data structures and TTL behavior.
    - **Kafka/RabbitMQ**: Start real message broker containers. Test producers and consumers against real broker behavior.
    - **Elasticsearch**: Start a real Elasticsearch container. Test search queries against real indexing behavior.

    **Why real containers, not in-memory substitutes**:
    - **SQLite is not PostgreSQL**: SQLite does not support PostgreSQL-specific features (JSONB, CTEs with recursion, window functions, partial indexes, ON CONFLICT, NOTIFY/LISTEN). Tests passing with SQLite may fail with PostgreSQL in production.
    - **In-memory Redis is not Redis**: In-memory stubs do not replicate Redis's exact data structure behavior, Lua scripting, pub/sub timing, or persistence semantics.
    - **The point of integration tests is to test real interactions**: Using fakes defeats the purpose. The 2-3 seconds of container startup time is a worthwhile tradeoff for tests that actually verify production-like behavior.

    **Container management**:
    - Start containers once per test suite (not per test) for performance. Each test cleans its own data (see step 20).
    - Use fixed port mapping for local development consistency, or dynamic ports with connection URL injection for CI.
    - Cache container images in CI (Docker layer caching) to minimize startup time.

13. **Design API endpoint integration tests.** For each API endpoint, test the full request-response cycle:

    **Test structure for API endpoints**:
    ```
    describe('POST /api/orders')
      beforeEach: seed test data (customer, products)
      
      it('creates an order and returns 201 with order details')
        - Send POST with valid body
        - Assert: status 201
        - Assert: response body contains order ID, items, total
        - Assert: order exists in database with correct data
      
      it('returns 400 when required fields are missing')
        - Send POST with missing 'items' field
        - Assert: status 400
        - Assert: error response contains field-level validation errors
      
      it('returns 401 when not authenticated')
        - Send POST without auth token
        - Assert: status 401
      
      it('returns 403 when user does not have permission')
        - Send POST with valid auth for unauthorized user
        - Assert: status 403
      
      it('returns 409 when order would exceed inventory')
        - Seed: product with quantity = 1
        - Send POST requesting quantity = 2
        - Assert: status 409
        - Assert: inventory unchanged in database
    ```

    **What to verify per endpoint**:
    - **Success path**: Correct status code, correct response body structure and values, correct database state after the operation, correct events published (if applicable).
    - **Validation errors**: Every validation rule produces the expected error. Field-level errors are returned for specific invalid fields.
    - **Authentication**: Unauthenticated requests are rejected. Invalid tokens are rejected. Expired tokens are rejected.
    - **Authorization**: Users can only access their own resources. Users without the required role/permission are rejected. IDOR prevention (user A cannot access user B's order by guessing the ID).
    - **Error responses**: Correct error format (consistent with the API's error contract). No internal details leaked (no stack traces, no SQL errors, no file paths).
    - **Idempotency** (for write endpoints): Sending the same request twice with the same idempotency key produces the same result without duplicate side effects.
    - **Pagination**: First page returns correct items and pagination metadata. Cursor/offset navigation works correctly. Empty results return an empty array, not an error.

14. **Design database integration tests.** Test that database operations work correctly with the real database:

    **What to test**:
    - **Queries**: Complex queries with joins, aggregations, subqueries, and CTEs return correct results with realistic test data. Test with edge cases: empty tables, null values, boundary dates.
    - **Writes**: Inserts, updates, and deletes modify the correct rows. Constraints are enforced (unique, foreign key, check constraints). Transactions commit and rollback correctly.
    - **Migrations**: Each migration applies cleanly to the previous schema. The full migration sequence from empty database to current schema produces the correct final schema. Migrations are backward-compatible with the running application code (see database-architecture skill).
    - **Indexes**: Critical queries use the expected indexes (verify with `EXPLAIN ANALYZE` in integration tests for performance-critical queries).
    - **Concurrent access**: Operations that can conflict (two users updating the same record) handle concurrency correctly (optimistic locking works, no data corruption).

    **Database test patterns**:
    - **Test per repository method**: For each data access method (`findOrdersByCustomer`, `createOrder`, `updateOrderStatus`), test with representative data and edge cases.
    - **Test the actual SQL**: If using an ORM, verify the generated SQL is correct (and efficient) by examining the query or by testing against a real database with realistic data volumes.
    - **Test constraints**: Attempt to violate unique constraints, foreign key constraints, and check constraints. Verify the database rejects invalid data.

15. **Design message queue integration tests.** Test producer and consumer behavior with real message brokers:

    **Producer tests**:
    - After performing a business operation, verify: the correct message is published to the correct topic/queue, the message body has the correct structure and values, the message headers include correlation ID and other metadata.
    - Test that messages are published within a transaction (outbox pattern — message is written to outbox table in the same transaction as the business data).

    **Consumer tests**:
    - Publish a test message to the queue/topic. Verify: the consumer processes it correctly, the expected side effects occur (database updates, API calls, events published), and the message is acknowledged.
    - Test error handling: publish a message that triggers an error, verify the message is retried or routed to the DLQ.
    - Test idempotency: publish the same message twice, verify it is processed only once (no duplicate side effects).
    - Test out-of-order delivery: publish messages out of order, verify correct behavior (skip, buffer, or process conditionally).
