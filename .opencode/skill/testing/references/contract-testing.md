# Contract Testing

### Phase 4: Contract Testing

16. **Design contract testing for service boundaries.** Contract tests verify that services can communicate correctly without testing them together:

    **Consumer-Driven Contract Testing** (Pact or similar):
    - **Consumer side**: The consuming service defines the contract: "When I send this request, I expect this response." This is encoded as a Pact file (or equivalent contract artifact).
    - **Provider side**: The providing service verifies the contract: "Given this request, here is my actual response." The provider runs the contract against its real endpoint and verifies compatibility.
    - **Flow**: Consumer writes contract → contract is stored in a Pact Broker (or artifact repository) → provider CI pipeline fetches the contract and verifies it → verification results are published → deployment is allowed only if contracts are verified.

    **What to contract test**:
    - **API contracts between internal services**: Service A calls Service B's `/api/orders/{id}` endpoint. The contract specifies: the request format, the expected response status code and body structure, and the expected error responses.
    - **Message contracts**: Service A publishes events that Service B consumes. The contract specifies: the message schema (fields, types, required/optional), the topic/queue, and the envelope metadata.
    - **External API contracts**: Your adapter's expectations of the external API's behavior (see integration skill, step 24, Layer 3).

    **What NOT to contract test**:
    - Business logic: Contracts test the format and structure of communication, not the business rules behind it.
    - All possible response variations: Focus on the response structures your consumer actually uses. Do not test response fields your consumer ignores.
    - Performance: Contracts verify correctness, not speed.

    **Contract testing rules**:
    - Contracts are owned by the consumer (the consumer defines what it needs), verified by the provider (the provider confirms it can fulfill the need).
    - Contracts should be minimal: include only the fields the consumer actually uses. Do not specify the entire response body — specify only the fields that matter to the consumer. This allows the provider to add new fields without breaking contracts.
    - Run contract verification in the provider's CI pipeline. Block deployment if verification fails.
    - Version contracts alongside the consumer code. When the consumer's needs change, update the contract and verify with the provider.

17. **Design schema compatibility testing for message contracts.** For event-driven systems, ensure message schema changes are backward-compatible:

    - **Schema registry validation**: If using Avro/Protobuf with a schema registry (Confluent Schema Registry), configure the registry to enforce backward compatibility. New schema versions that break compatibility are rejected at registration time.
    - **Manual schema tests**: If not using a schema registry, write tests that verify: a consumer using the old schema can deserialize messages produced with the new schema (backward compatibility). A consumer using the new schema can deserialize messages produced with the old schema (forward compatibility, if needed).
    - **Test unknown field tolerance**: Verify that consumers ignore unknown fields in messages (they do not fail when the producer adds a new field).
