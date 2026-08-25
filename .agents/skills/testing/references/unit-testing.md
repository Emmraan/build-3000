# Unit Testing

### Phase 2: Unit Testing

5. **Design unit test architecture.** Unit tests are the foundation of the test suite — they must be fast, reliable, and focused:

   **What to unit test** (high value):
   - **Business logic and domain rules**: Pricing calculations, eligibility checks, validation rules, state machine transitions, workflow logic, permission computations. These are the core of the application's correctness and are where bugs have the most business impact.
   - **Data transformations and mapping**: Functions that convert between formats, models, or representations. Test with representative inputs including edge cases.
   - **Pure functions**: Functions with no side effects that take inputs and return outputs. Easiest to test, highest return on investment.
   - **Error handling paths**: Test that error conditions are handled correctly — the right exception is thrown, the right error code is returned, resources are cleaned up.
   - **Edge cases and boundary conditions**: Empty collections, null/undefined values, maximum/minimum values, zero, negative numbers, boundary dates (leap year, timezone transitions, DST changes), Unicode and special characters, very long strings.
   - **Complex conditionals**: Code with many branches (if/else chains, switch statements) where missing a condition causes incorrect behavior.

   **What NOT to unit test** (low value, high maintenance):
   - **Trivial getters/setters/constructors**: `getName()` returning `this.name` does not need a test. It will never break, and if it does, integration tests will catch it.
   - **Framework-generated code**: ORM model definitions, auto-generated serializers, framework boilerplate. These are tested by the framework's own test suite.
   - **Delegation-only methods**: Methods that simply call another method without any logic. Testing these tests the mock, not the code.
   - **Private implementation details**: Do not test private methods directly. Test the public behavior that uses them. If a private method is complex enough to need its own tests, consider extracting it into a separate, testable unit.
   - **Configuration and wiring**: DI container setup, route registration, middleware configuration. These are better tested at the integration level.

6. **Design unit test structure.** Every unit test must follow a consistent, readable structure:

   **Arrange-Act-Assert (AAA)** or **Given-When-Then** pattern:
   ```
   // Arrange: Set up the test preconditions
   const order = createOrder({ items: [{ price: 10.00, quantity: 3 }], discount: 0.1 });
   const calculator = new PriceCalculator(taxRate: 0.08);

   // Act: Execute the behavior being tested
   const result = calculator.calculateTotal(order);

   // Assert: Verify the expected outcome
   expect(result.subtotal).toBe(30.00);
   expect(result.discount).toBe(3.00);
   expect(result.tax).toBe(2.16);
   expect(result.total).toBe(29.16);
   ```

   **Rules**:
   - **One logical assertion per test** (not literally one `assert` call — one logical outcome being verified). A test named `should_calculate_total_with_discount` should test exactly that — not also test tax calculation, error handling, and logging. Multiple `assert` statements verifying facets of the same logical outcome are fine (`expect(result.total)`, `expect(result.tax)`, `expect(result.discount)` are all part of "calculate total correctly").
   - **No logic in tests**: No if/else, no loops, no try/catch (except for testing that an exception is thrown). Tests should be linear sequences: arrange, act, assert. Logic in tests creates tests that need tests.
   - **Each test is independent**: No test should depend on another test's execution or side effects. Tests must pass in any order and in isolation. Shared mutable state between tests is a bug.
   - **Tests should read as documentation**: A developer should be able to read the test name and body and understand the expected behavior without reading the production code.

7. **Design test naming conventions.** Test names must describe the behavior being tested, not the method being called:

   **Recommended pattern**: `should_{expected_behavior}_when_{condition}`

   ```
   ✗ BAD:  test_calculate_total()
   ✗ BAD:  testPriceCalculator()
   ✗ BAD:  test1(), test2(), test3()

   ✓ GOOD: should_calculate_total_with_tax_when_items_have_prices()
   ✓ GOOD: should_apply_percentage_discount_when_discount_code_is_valid()
   ✓ GOOD: should_return_zero_total_when_order_has_no_items()
   ✓ GOOD: should_throw_InvalidOrderError_when_quantity_is_negative()
   ✓ GOOD: should_round_total_to_two_decimal_places()
   ```

   **Alternative patterns** (acceptable if applied consistently):
   - `{method}_returns_{outcome}_for_{condition}`: `calculateTotal_returns_zero_for_empty_order`
   - BDD-style nested describes:
     ```
     describe('PriceCalculator')
       describe('calculateTotal')
         it('applies tax to subtotal')
         it('applies discount before tax')
         it('rounds to two decimal places')
         describe('when order has no items')
           it('returns zero total')
     ```

   Choose one convention and apply it consistently across the codebase. Enforce via linting or code review.

8. **Design the mocking strategy for unit tests.** Mocking is the most misused testing technique. Mock incorrectly, and tests provide false confidence; mock too much, and tests become meaningless:

   **When to mock** (correct use):
   - **External dependencies you do not control**: HTTP clients calling external APIs, email senders, payment gateways. You cannot (and should not) call real external systems in unit tests.
   - **Infrastructure with side effects**: Database connections, file system access, message queue publishers, cache clients. Unit tests must not require running infrastructure.
   - **Slow or non-deterministic operations**: Time-dependent operations (mock the clock), random number generators (seed or mock for determinism), operations that take seconds (mock for speed).
   - **Dependencies that are difficult to set up in isolation**: Complex object graphs, services with many dependencies, third-party SDKs with complex initialization.

   **When NOT to mock** (common mistakes):
   - **Do not mock the system under test**: If you are testing `PriceCalculator`, do not mock `PriceCalculator`. Test the real implementation.
   - **Do not mock value objects and data structures**: `Order`, `Money`, `Address` — these are pure data. Use real instances. Mocking a data class adds complexity without value.
   - **Do not mock everything**: If a unit test mocks every dependency and only tests that the correct methods are called with the correct arguments, it is testing the implementation, not the behavior. Such tests break on every refactoring and provide no confidence that the code produces correct results.
   - **Do not mock internal collaborators unnecessarily**: If `OrderService` calls `PriceCalculator` and both are your code, consider testing them together (a small integration test) rather than mocking `PriceCalculator` in `OrderService` tests. Mock at architectural boundaries, not at every method call.

   **Types of test doubles** (use the right type for the right purpose):
   - **Stub**: Returns predefined values. Does not verify calls. Use when you need a dependency to return specific data for the test but do not care how it is called. Example: `stubPaymentGateway.processPayment() returns Success`.
   - **Mock**: Verifies that specific methods are called with specific arguments. Use sparingly — only when the interaction itself is the behavior being tested (e.g., "verify that the notification service is called when an order is placed"). Over-mocking leads to brittle tests.
   - **Fake**: A simplified working implementation. Use for complex dependencies where stubs are insufficient. Example: `InMemoryUserRepository` that stores users in a HashMap instead of a database. Fakes are more realistic than stubs and more maintainable than mocks.
   - **Spy**: A real implementation that records calls for later verification. Use when you want the real behavior but also need to verify that a method was called.

   **Recommendation**: Default to stubs and fakes. Use mocks only when verifying interactions is the explicit purpose of the test. If more than 50% of a test's assertions are mock verifications (`verify(mock).wasCalledWith(...)`) rather than result assertions (`expect(result).toBe(...)`), the test is likely testing implementation details.

9. **Design parameterized and data-driven tests.** When the same logic must be tested with many different inputs:

   ```
   // Parameterized test for discount calculation
   test.each([
     { input: { subtotal: 100, discountPercent: 10 }, expected: 90.00 },
     { input: { subtotal: 100, discountPercent: 0 },  expected: 100.00 },
     { input: { subtotal: 100, discountPercent: 100 }, expected: 0.00 },
     { input: { subtotal: 0,   discountPercent: 50 },  expected: 0.00 },
     { input: { subtotal: 99.99, discountPercent: 15 }, expected: 84.99 },
   ])('should calculate discounted price: $input.subtotal with $input.discountPercent% discount = $expected',
     ({ input, expected }) => {
       expect(calculateDiscount(input.subtotal, input.discountPercent)).toBe(expected);
     }
   );
   ```

   **When to use**: The same function/method is tested with multiple input-output pairs. The test logic is identical, only the data varies. Edge cases, boundary values, and error conditions can be expressed as data rows.

   **Rules**:
   - Each test case should be understandable in isolation — include a description or use descriptive input values.
   - Do not use parameterized tests to test fundamentally different behaviors — use separate tests for behaviors that have different setup or different assertions.
   - Keep the parameter count manageable (< 20 cases per parameterized block). If you need 100 cases, consider property-based testing.

10. **Design property-based tests for complex logic.** For functions where the set of valid inputs is large and edge cases are hard to enumerate manually:

    **What property-based testing is**: Instead of specifying specific input-output pairs, define properties (invariants) that must hold for all valid inputs. The testing framework generates hundreds or thousands of random inputs and verifies the properties hold.

    **Example**:
    ```
    // Property: sorting is idempotent (sorting an already-sorted list produces the same result)
    property('sort is idempotent', forAll(arrays(integers()), (arr) => {
      const sorted = sort(arr);
      expect(sort(sorted)).toEqual(sorted);
    }));

    // Property: encoding then decoding produces the original value
    property('encode/decode round-trip', forAll(strings(), (s) => {
      expect(decode(encode(s))).toEqual(s);
    }));

    // Property: discount never exceeds subtotal
    property('discounted price is never negative', forAll(
      floats({ min: 0, max: 10000 }),
      floats({ min: 0, max: 100 }),
      (subtotal, discountPercent) => {
        expect(calculateDiscount(subtotal, discountPercent)).toBeGreaterThanOrEqual(0);
      }
    ));
    ```

    **When to use**: Serialization/deserialization (round-trip property), mathematical or financial calculations (invariants like monotonicity, bounds, commutativity), parsers (all valid inputs parse without errors, parse/unparse round-trip), sorting and ordering (idempotency, stability, output is permutation of input), data structure operations (insert/delete consistency, capacity constraints).

    **Libraries**: fast-check (JavaScript/TypeScript), Hypothesis (Python), QuickCheck (Haskell), gopter (Go), jqwik (Java).
