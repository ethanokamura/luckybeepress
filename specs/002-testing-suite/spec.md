# Feature Specification: Testing Suite

**Feature Branch**: `002-testing-suite`
**Created**: 2026-02-21
**Status**: Draft
**Input**: "Please create a testing suite to ensure that the code works as expected."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Runs Tests and Gets Instant Feedback (Priority: P1)

A developer working on LuckyBeePress runs a single command (`npm test`) from the project root and receives a pass/fail report for all utility functions, API route business logic, and Cloud Function triggers. Tests run in under 10 seconds.

**Why this priority**: Zero test coverage currently exists. Any future regression — broken price formatting, wrong batch chunk size, incorrect repeat-customer logic — goes undetected until production. This story is the foundation.

**Independent Test**: Run `npm test` in a fresh clone; confirm all tests pass with no external services running.

**Acceptance Scenarios**:

1. **Given** a developer clones the repo and runs `npm test`, **When** all tests pass, **Then** the output shows a green summary with no failures.
2. **Given** a developer introduces a bug in `toCents` (e.g., `Math.round` removed), **When** they run `npm test`, **Then** the affected test fails with a clear diff showing expected vs. received values.
3. **Given** the Firebase Admin SDK is unavailable (no service account), **When** tests run, **Then** all tests still pass because Firebase is fully mocked.

---

### User Story 2 - Admin API Routes Validate Inputs Correctly (Priority: P1)

The bulk product and category management API routes enforce business rules (max 2000 product IDs, no duplicate category names, product count guard before deletion). Tests confirm each validation path without touching a real database.

**Why this priority**: These routes operate on potentially hundreds of records. A missed validation (e.g., accepting empty productIds) could silently do nothing or cascade incorrectly.

**Independent Test**: Call each route handler with invalid inputs and confirm the correct HTTP status code and error message are returned.

**Acceptance Scenarios**:

1. **Given** a POST to `/api/admin/products/bulk` with an empty `productIds` array, **When** the handler processes it, **Then** it returns `400` with `"No product IDs provided"`.
2. **Given** a POST to `/api/admin/products/bulk` with 2001 product IDs, **When** the handler processes it, **Then** it returns `400` with the max-IDs error.
3. **Given** a DELETE to `/api/admin/categories/[id]` when products are assigned and no `reassignTo` param, **When** processed, **Then** it returns `409` with `{ error, count }`.
4. **Given** a PATCH to `/api/admin/categories/[id]` with a name matching an existing category, **When** processed, **Then** it returns `409` with the duplicate-name error.

---

### User Story 3 - Price and Slug Utilities Work Correctly for All Inputs (Priority: P1)

Pure utility functions (`formatPrice`, `toCents`, `toDollars`, `generateSlug`, `calculateSingleTotal`, `calculateBoxTotal`) handle edge cases — zero values, decimals, special characters — without external dependencies.

**Why this priority**: These functions are called on every product card, cart line item, and checkout total. A rounding error of 1 cent compounds across every order.

**Independent Test**: Call each utility with boundary inputs (0, negative, decimals) and confirm the output matches the expected string or number exactly.

**Acceptance Scenarios**:

1. **Given** `toCents(3.00)` is called, **Then** it returns `300`.
2. **Given** `formatPrice(1099)` is called, **Then** it returns `"$10.99"`.
3. **Given** `generateSlug("Lucky Bee's Greeting Card!")` is called, **Then** it returns `"lucky-bees-greeting-card"` (special chars stripped, spaces hyphenated).
4. **Given** `calculateSingleTotal(300, 6)` is called, **Then** it returns `1800`.

---

### User Story 4 - Repeat Customer Cloud Function Updates Status Correctly (Priority: P2)

The `onOrderUpdated` Cloud Function sets `isRepeatCustomer: true` on a user when their order reaches `delivered` status, and re-evaluates (potentially reverting) when an order is `refunded`.

**Why this priority**: This is business-critical logic — incorrect repeat status means customers either get unearned discounts or are incorrectly denied them.

**Independent Test**: Using the Firebase test SDK in offline mode, simulate order status changes and verify the correct write is made to the user document.

**Acceptance Scenarios**:

1. **Given** an order transitions to `delivered`, **When** `onOrderUpdated` runs, **Then** the user's `isRepeatCustomer` field is set to `true`.
2. **Given** an order transitions to `refunded` and no other `delivered` orders exist, **When** `onOrderUpdated` runs, **Then** the user's `isRepeatCustomer` field is set to `false`.
3. **Given** an order transitions to `refunded` but another `delivered` order exists, **When** `onOrderUpdated` runs, **Then** the user's `isRepeatCustomer` field remains `true`.

---

### Edge Cases

- **Batch chunking**: Verify that `chunkArray(arr, 400)` with exactly 400 items produces one chunk, 401 items produces two.
- **Duplicate category names**: Creating a category with the same name as an existing one must fail with 409 regardless of casing (if spec enforces case-sensitivity, test both paths).
- **Category seed with existing data**: Seeding defaults when categories already exist must return 409 without creating any documents.
- **Zero-price products**: `formatPrice(0)` must return `"$0.00"` not a NaN or empty string.
- **Slug edge cases**: All-special-character strings, leading/trailing spaces, multiple consecutive spaces.
- **Order trigger with no prior status**: A new order creation event should not accidentally trigger the update logic.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The test suite MUST run with `npm test` from the project root with no environment variables required.
- **FR-002**: All Firebase Admin and Algolia calls MUST be mocked — no real network connections in tests.
- **FR-003**: Tests MUST cover all exported pure utility functions in `lib/firebase-helpers.ts`.
- **FR-004**: Tests MUST cover all input validation paths for `/api/admin/products/bulk`, `/api/admin/categories`, and `/api/admin/categories/[id]`.
- **FR-005**: Tests MUST cover the `onOrderUpdated` Cloud Function repeat-customer state machine.
- **FR-006**: The test framework MUST support TypeScript natively (no manual compilation step).
- **FR-007**: Tests MUST be isolated — no shared mutable state between test files.

### Key Entities

- **Test suite**: The full set of test files, configuration, and mock infrastructure.
- **Unit tests**: Tests for pure functions with no mocks needed.
- **API tests**: Tests for route handler business logic with Firebase Admin and Algolia mocked.
- **Function tests**: Tests for Cloud Function triggers using Firebase test SDK in offline mode.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm test` passes with 0 failures on a fresh checkout (no `.env` required).
- **SC-002**: All pure utility functions in `lib/firebase-helpers.ts` have ≥ 1 test per exported function.
- **SC-003**: All validation branches in the three admin API routes have a corresponding failing-input test.
- **SC-004**: The `onOrderUpdated` delivered → `isRepeatCustomer: true` and refunded re-evaluation paths are both tested.
- **SC-005**: Total test run time is under 15 seconds on a modern laptop.

## Assumptions

- The project will use Vitest as the test framework (better ESM support for `algoliasearch` v5 and `firebase-admin` v13 which are both ESM-first).
- Tests do not require a Firebase emulator — all Firestore/Admin calls are mocked at the module level.
- The `functions/` subdirectory tests are run as part of the root `npm test` via a Vitest workspace config.
- `firebase-functions-test` v3 (already installed in `functions/devDependencies`) is compatible with Vitest.

## Dependencies

- Vitest + `@vitest/coverage-v8` for the test runner and coverage.
- `firebase-functions-test` (already installed) for Cloud Function offline testing.
- No additional mocking libraries needed — Vitest's built-in `vi.mock()` covers Firebase Admin and Algolia.
