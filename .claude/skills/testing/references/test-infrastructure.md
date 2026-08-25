# Test Infrastructure Optimization

### Phase 13: Test Infrastructure Optimization

36. **Design test pipeline optimization.** A slow test pipeline is an ineffective test pipeline — developers will skip it, reduce tests, or merge without waiting:

    **Parallelization**:
    - **Parallel test execution within a suite**: Most test frameworks support running tests in parallel (`--parallel`, `--workers=4`). Requires tests to be independent (no shared mutable state).
    - **Parallel test suites across CI jobs**: Split unit, integration, and contract tests into separate CI jobs that run in parallel:
      ```
      Job 1: Lint + Unit Tests (2 min)
      Job 2: Integration Tests - API (3 min)      } Run in parallel
      Job 3: Integration Tests - DB (3 min)        }
      Job 4: Contract Tests (1 min)                }
      Total wall time: 3 min (instead of 9 min sequential)
      ```
    - **Test sharding**: Split a large test suite across multiple CI runners. Each runner executes a subset of tests. Merge results at the end. Tools: Jest `--shard`, pytest-split, CI-native sharding (CircleCI parallelism, GitHub Actions matrix).

    **Caching**:
    - Cache dependencies (node_modules, Maven/Gradle cache, pip cache) between CI runs. Saves 30-60 seconds per run.
    - Cache Docker images for Testcontainers (Docker layer caching). Saves 10-30 seconds per container.
    - Cache compiled test code (TypeScript compilation cache, Go build cache).

    **Selective test execution** (advanced):
    - Run only tests affected by the code changes in the current PR. Tools: Jest `--changedSince`, Bazel, Nx, or custom affected-test detection based on dependency graph analysis.
    - Risk: May miss tests that are indirectly affected by changes. Mitigate by running the full test suite on merge to main.

    **Test container optimization**:
    - **Reuse containers across test suites**: Start the PostgreSQL container once and reuse it for all integration test suites (clean data between suites, not between individual tests).
    - **Use container images with pre-loaded data**: For large reference datasets, build a custom test database image with pre-loaded data to avoid loading data at test runtime.
    - **Pre-pull container images**: In CI, pull test container images during the setup phase (parallel with dependency installation).

37. **Design local development testing experience.** Developers must be able to run tests easily and quickly on their local machines:

    **Requirements**:
    - Running unit tests requires no external dependencies (no Docker, no database, no network access).
    - Running integration tests requires only Docker (docker-compose or Testcontainers). No manual database setup, no shared development database.
    - Test commands are simple and documented:
      ```
      make test           # Run all unit tests
      make test-int       # Run all integration tests
      make test-all       # Run everything
      make test-watch     # Run unit tests in watch mode (re-run on file change)
      ```
    - Tests run in < 60 seconds locally for unit tests, < 5 minutes for integration tests.
    - Test failures produce clear, actionable output: what failed, what was expected, what was actual, and where in the code.

    **Watch mode**: For unit tests, use a file watcher that re-runs affected tests when code changes. This provides sub-second feedback during development. Most frameworks support this natively (Jest `--watch`, pytest-watch, `go test ./...` with `entr`).
