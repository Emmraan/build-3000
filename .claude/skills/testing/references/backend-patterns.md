# Testing Specific Backend Patterns

### Phase 14: Testing Specific Backend Patterns

38. **Design tests for database migrations.** Database migrations are one of the highest-risk operations and deserve dedicated testing:

    **Migration test strategy**:
    - **Forward migration test**: Apply all migrations from scratch to an empty database. Verify the final schema matches the expected schema (compare `pg_dump --schema-only` output or use a schema comparison tool).
    - **Single migration test**: Apply only the new migration to a database with the previous schema. Verify: migration applies without error, expected schema changes are present, existing data is preserved and correctly transformed (if it is a data migration).
    - **Rollback test**: If the migration framework supports rollback, apply the migration and then roll it back. Verify the schema is restored to its previous state.
    - **Data migration test**: For migrations that transform data (not just schema), create test data representing all variations before the migration, apply the migration, and verify the data is correctly transformed.
    - **Backward compatibility test**: Verify the new schema is backward-compatible with the previous application version. Run the previous version's integration tests against the new schema. This validates that the migration can be deployed before the application code update (expand-and-contract pattern).

39. **Design tests for error handling and edge cases.** The most important tests often cover the unhappy path:

    **Error handling tests**:
    - **Validation errors**: Test every validation rule with invalid input. Verify the correct error type/code is returned with field-level details.
    - **Not-found errors**: Request a non-existent resource. Verify 404 with appropriate error message.
    - **Authorization errors**: Access a resource without permission. Verify 403 (or 404 if the system hides resource existence).
    - **Conflict errors**: Attempt an operation that conflicts with current state (double cancellation, updating a deleted record). Verify correct error handling.
    - **External dependency failure**: Simulate external API failure (timeout, 500 error, connection refused). Verify: correct error returned to the user, circuit breaker engaged, fallback behavior activated (if applicable), no data corruption.
    - **Resource exhaustion**: Simulate connection pool exhaustion, memory pressure, or disk full scenarios (as much as possible in tests). Verify graceful degradation.

    **Boundary and edge case tests**:
    - **Empty inputs**: Empty strings, empty arrays, empty objects. Null/undefined/None values where not expected.
    - **Maximum values**: Maximum string length, maximum numeric value, maximum array size, maximum file size.
    - **Zero and negative values**: Zero quantity, zero price, negative discount, negative age.
    - **Unicode and special characters**: Names with accented characters, CJK characters, emoji, RTL text, zero-width characters.
    - **Time boundaries**: Midnight, end of month, end of year, leap year, DST transitions, timezone edge cases.
    - **Concurrent modifications**: Two users updating the same record simultaneously. Verify optimistic locking, merge behavior, or rejection.

40. **Design tests for background jobs and scheduled tasks.**

    **Background job tests**:
    - **Job execution**: Trigger the job with test data. Verify: the job completes successfully, the expected side effects occur (data changes, events published, files generated), and the job handles failures gracefully (retries, DLQ routing).
    - **Idempotency**: Run the same job twice with the same input. Verify no duplicate effects.
    - **Failure and recovery**: Simulate a failure partway through job execution. Verify: the job can be retried from the failure point (or from the beginning without corruption), and partial results are handled correctly.
    - **Timeout**: Verify the job completes within its expected time. Set a test timeout slightly longer than the expected maximum job duration.

    **Scheduled task tests**:
    - **Schedule correctness**: Verify the cron expression or schedule configuration produces the expected execution times (use a cron expression parser/evaluator).
    - **Locking**: If the job must run as a singleton (only one instance at a time), verify that concurrent executions are prevented (distributed lock).
    - **Missed execution**: Simulate a missed schedule (the system was down during the scheduled time). Verify the job runs on the next cycle or catches up.
