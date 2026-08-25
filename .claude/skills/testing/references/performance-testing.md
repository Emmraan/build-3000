# Performance Testing

### Phase 8: Performance Testing

25. **Design the performance testing strategy.** Performance testing validates that the system meets its performance requirements (latency, throughput, resource utilization) under expected and extreme load:

    **Performance test types**:

    **Load test** (normal expected load):
    - Simulate the expected production traffic pattern (mix of endpoints, read/write ratio, user concurrency) for an extended period (30-60 minutes).
    - Verify: p50, p95, p99 latency for each endpoint meets SLA. Error rate is within acceptable bounds (< 0.1%). Resource utilization (CPU, memory, database connections) is within safe thresholds. No memory leaks (resource utilization does not grow over time).
    - **When to run**: Before major releases, after significant architectural changes, periodically (weekly or monthly) for regression detection.

    **Stress test** (beyond expected load):
    - Gradually increase load beyond the expected peak until the system degrades. Identify the breaking point: at what load does latency exceed the SLA? At what load do errors appear? What component fails first (application, database, cache, external dependency)?
    - **Purpose**: Understand the system's limits and plan capacity.

    **Spike test** (sudden load surge):
    - Simulate a sudden traffic spike (e.g., 10x normal load for 2 minutes, then back to normal).
    - Verify: the system handles the spike without crashing, auto-scaling triggers correctly, the system recovers to normal performance after the spike, and no data corruption occurs during the spike.

    **Soak test** (sustained load over time):
    - Run the system at expected load for an extended period (4-24 hours).
    - Verify: no memory leaks, no connection pool exhaustion, no degrading performance over time, no disk space exhaustion, and no database bloat issues.

    **Benchmark test** (isolated component performance):
    - Measure the performance of a specific component (database query, computation, serialization) in isolation.
    - Use for: comparing alternative implementations, validating optimization effects, establishing performance baselines.

26. **Design performance test infrastructure.**

    **Test environment**:
    - The performance test environment must mirror production in: instance types, database engine and configuration, network topology, and storage configuration.
    - Data volume must match production. Performance with 1,000 rows tells you nothing about performance with 10 million rows. Use anonymized or synthetic data at production scale.
    - Isolate the performance test environment from other environments to avoid interference.

    **Load generation tools**:
    - **k6** (recommended for API load testing): JavaScript-based, developer-friendly, supports complex scenarios, built-in metrics and thresholds, integrates with CI/CD. Open-source with cloud option.
    - **Locust** (Python-based): Good for Python teams, supports distributed load generation, web UI for monitoring.
    - **Gatling** (Scala/Java-based): Good for JVM teams, powerful scenario modeling, detailed reporting.
    - **Apache JMeter**: Established tool, GUI-based, broad protocol support. Heavier and more complex to configure than modern alternatives.
    - **wrk / hey / vegeta**: Lightweight HTTP benchmarking tools for simple load tests. Good for quick benchmarks, not for complex scenarios.

    **Workload modeling**:
    - Model the realistic production workload: what percentage of requests go to each endpoint, what is the read/write mix, what are the typical payload sizes, and what is the think time between user actions.
    - Use production traffic logs or analytics to derive the workload model. A performance test with an unrealistic workload provides unreliable results.
    - Include ramp-up periods: gradually increase load over 2-5 minutes rather than hitting full load instantly. This simulates realistic traffic growth and gives auto-scaling time to react.

27. **Design performance regression detection.** Detect performance degradation before it reaches production:

    **Performance baselines**:
    - After each successful performance test, record the results as the baseline: p50, p95, p99 latency for each endpoint, throughput (RPS), and error rate.
    - Store baselines in a database or metrics system for trend analysis.

    **Regression detection**:
    - Compare each performance test run to the baseline. Flag regressions when:
      - p95 latency increased by > 20% for any endpoint.
      - Throughput decreased by > 10%.
      - Error rate increased by > 0.5%.
    - Run a lightweight performance test (baseline load for 5 minutes) in the CI/CD pipeline after deployment to staging. Fail the pipeline if regressions are detected.
    - Investigate regressions immediately. Common causes: new database queries without indexes, N+1 query patterns, increased serialization overhead, memory allocation changes, dependency upgrades with performance impact.
