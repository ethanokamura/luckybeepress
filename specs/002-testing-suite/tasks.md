# Tasks: Testing Suite

**Input**: Design documents from `/specs/002-testing-suite/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: All tasks in this feature ARE test tasks — this feature IS the testing suite.

**Organization**: Tasks grouped by user story from `spec.md`. US3 (utilities) precedes US2 (API routes) precedes US4 (Cloud Functions) because they increase in mock complexity. US1 ("npm test runs cleanly") is validated as the final checkpoint.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4 from spec.md)
- Exact file paths in every description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install Vitest, configure path aliases, create directory skeleton, and wire `npm test`.

- [X] T001 Install vitest and coverage dependency: `npm install --save-dev vitest @vitest/coverage-v8` (modifies `package.json` + `package-lock.json`)
- [X] T002 [P] Create `vitest.config.ts` at repo root — configure `resolve.alias` so `@/` maps to the project root (matching `tsconfig.json` paths), set `test.environment` to `node`, and set `test.include` to `['__tests__/**/*.test.ts', 'functions/src/__tests__/**/*.test.ts']`
- [X] T003 [P] Add `"test"`, `"test:watch"`, and `"test:coverage"` scripts to `package.json` pointing to `vitest`, `vitest --watch`, and `vitest --coverage` respectively
- [X] T004 [P] Create directory skeleton: `mkdir -p __tests__/unit __tests__/api __tests__/helpers functions/src/__tests__`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared mock factories and fixture files consumed by every test file. Must exist before any test file is written.

**⚠️ CRITICAL**: No test files (US2–US4) can be written until T005 and T006 exist.

- [X] T005 Create `__tests__/helpers/firebase-admin-mock.ts` — export a `createFirebaseAdminMocks()` factory that returns typed `vi.fn()` stubs for: `mockBatch` (`update`, `delete`, `commit`), `mockDb` (`batch`, `collection`, `doc`, `where`, `orderBy`, `limit`, `get`, `count`, `update`, `set`, `delete`), and `mockAlgolia` (`partialUpdateObject`, `deleteObject`). Export the `vi.mock(...)` boilerplate strings as comments so each test file can copy the correct `vi.mock('firebase-admin/app')` and `vi.mock('firebase-admin/firestore')` blocks.
- [X] T006 [P] Create `__tests__/helpers/fixtures.ts` — export `CATEGORY_FIXTURES` (3 categories: Birthday/0/false, Thank You/1/true, Holiday/2/true), `PRODUCT_FIXTURES` (3 products with id, name, category, status), and `ORDER_FIXTURES` (delivered and refunded order snapshots matching the shape expected by `onOrderUpdated`)

**Checkpoint**: Mock factory and fixtures ready — test file authoring can now begin in parallel for US2–US4

---

## Phase 3: User Story 3 — Price & Slug Utility Tests (Priority: P1) 🎯 MVP

**Goal**: Every exported pure function in `lib/firebase-helpers.ts` has at least one passing test with boundary-value coverage.

**Independent Test**: Run `npx vitest __tests__/unit` — all tests pass with zero mocks and no env vars.

- [X] T007 [US3] Write `__tests__/unit/firebase-helpers.test.ts` — one `describe` block per function, testing all contracts from `contracts/utility-functions.md`:
  - `toCents`: standard, zero, decimal rounding (`toCents(1.005) = 101`)
  - `toDollars`: inverse of toCents, zero
  - `formatPrice`: `300 → "$3.00"`, `0 → "$0.00"`, `1099 → "$10.99"`, `15000 → "$150.00"`
  - `generateSlug`: basic case, special chars, leading/trailing spaces, consecutive dashes
  - `generateOrderNumber`: matches `/^ORD-\d{4}-[A-Z0-9]{6}$/`, year is current year
  - `calculateSingleTotal`: `(300,6)=1800`, `(0,100)=0`
  - `calculateBoxTotal`: `(1100,4)=4400`, `(0,4)=0`
  - `formatWholesaleInfo`: no box option, with box option, box option but null price

**Checkpoint**: `npx vitest __tests__/unit` shows all utility tests green.

---

## Phase 4: User Story 2 — Admin API Route Validation Tests (Priority: P1)

**Goal**: Every validation branch and key side-effect path in the three admin bulk-operation routes is covered by a test that calls the handler directly with a mocked Firebase Admin + Algolia.

**Independent Test**: Run `npx vitest __tests__/api` — all API tests pass without a live Firebase project.

- [X] T008 [P] [US2] Write `__tests__/api/bulk.test.ts` — mock `firebase-admin/app`, `firebase-admin/firestore`, and `algoliasearch` using the factory from `__tests__/helpers/firebase-admin-mock.ts`; import `POST` from `app/api/admin/products/bulk/route`; construct `NextRequest` inline; cover all validation branches from `contracts/api-routes.md`:
  - `productIds = []` → 400
  - `productIds.length > 2000` → 400
  - `action = "invalid"` → 400
  - `action = "status"`, `status` missing or invalid → 400
  - `action = "category"`, `category` missing → 400
  - Valid `status` update (3 IDs) → 200, `batch.update` called 3×, `batch.commit` called 1×
  - Valid `delete` (3 IDs) → 200, `batch.delete` called 3×
  - Algolia sync called when `ALGOLIA_ADMIN_API_KEY` env is set; skipped when absent
  - Chunk boundary: 401 IDs → `batch.commit` called 2× (ceiling of 401/400)

- [X] T009 [P] [US2] Write `__tests__/api/categories-create.test.ts` — same mock setup; import `POST` from `app/api/admin/categories/route`; cover:
  - `{ seed: true }` with 0 existing categories → 200, `batch.set` called 21×
  - `{ seed: true }` with existing categories (count > 0 stub) → 409
  - `{ name: "" }` → 400
  - `{ name: "   " }` (whitespace only) → 400
  - `{ name: "Birthday" }` with duplicate query returning non-empty → 409
  - `{ name: "New Cat" }` valid → 200, `{ success: true, id: string }`
  - Auto-order: when `order` is omitted, `id` is used from highest-order query + 1

- [X] T010 [P] [US2] Write `__tests__/api/categories-id.test.ts` — same mock setup; import `PATCH` and `DELETE` from `app/api/admin/categories/[id]/route`; cover PATCH:
  - Category not found → 404
  - Duplicate name → 409
  - Name change → 200, product batch update called, Algolia `partialUpdateObject` called per affected product
  - Order-only update → 200, NO product batch update, NO Algolia call
  - `supportsBoxSet`-only update → 200, no cascade
  And DELETE:
  - Category not found → 404
  - Products assigned, no `reassignTo` → 409 with `{ error, count: N }`
  - Products assigned + valid `reassignTo` → 200, product batch update to target name, Algolia sync, category doc deleted
  - No products → 200 `{ success: true, reassigned: 0 }`, category doc deleted, no batch update

**Checkpoint**: `npx vitest __tests__/api` shows all API route tests green.

---

## Phase 5: User Story 4 — Repeat Customer Cloud Function Tests (Priority: P2)

**Goal**: The `onOrderUpdated` trigger correctly sets `isRepeatCustomer` on the user document for all status transitions defined in `contracts/api-routes.md`.

**Independent Test**: Run `npx vitest functions/src/__tests__` — all function tests pass without a Firebase emulator.

- [X] T011 [US4] Create `functions/src/__tests__/setup.ts` — initialize `firebase-functions-test` in offline mode (`const testEnv = initializeTest()` with no project config); export helper `makeChange(before, after)` that creates a `Change<DocumentSnapshot>` from plain objects using the test SDK's `makeDocumentSnapshot`

- [X] T012 [US4] Write `functions/src/__tests__/order-triggers.test.ts` — import `onOrderUpdated` from `../index`, use the helpers from `setup.ts`, mock `firebase-admin` so Firestore writes are captured; cover all state machine transitions from `contracts/api-routes.md`:
  - `pending → delivered` → `user.isRepeatCustomer` set to `true`
  - `delivered → refunded`, no other delivered orders → `isRepeatCustomer` set to `false`
  - `delivered → refunded`, one other delivered order exists → no write (user stays `true`)
  - `pending → shipped` → no Firestore write (function exits early)
  - `pending → cancelled` → no Firestore write

**Checkpoint**: `npx vitest functions/src/__tests__` shows all function tests green.

---

## Phase 6: User Story 1 — Full Suite Validation & Polish (Priority: P1)

**Goal**: `npm test` runs cleanly from the repo root with no environment variables, exits 0, and prints a clear pass/fail summary.

**Independent Test**: `npm test` from a clean checkout — no `.env`, no emulator, no service account.

- [X] T013 [P] [US1] Add coverage configuration to `vitest.config.ts`: set `coverage.reporter` to `['text', 'html']`, set `coverage.include` to `['lib/firebase-helpers.ts', 'app/api/admin/**/*.ts', 'functions/src/index.ts']`, set `coverage.exclude` to `['**/*.d.ts', '**/node_modules/**']`
- [X] T014 [US1] Run `npm test` end-to-end, confirm all tests pass, confirm no `process.env` values are required; fix any import resolution or ESM issues surfaced by the live run (path alias mismatches, missing `@types`, etc.)

**Checkpoint**: `npm test` exits 0. All 4 user stories are independently verifiable.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately; T002, T003, T004 are parallel
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — blocks Phase 3, 4, 5
- **Phase 3 (US3)**: Depends on Phase 2; T007 has no peer dependencies and can start as soon as T006 is done
- **Phase 4 (US2)**: Depends on Phase 2; T008, T009, T010 are fully parallel with each other (different files)
- **Phase 5 (US4)**: Depends on Phase 2; T011 must precede T012
- **Phase 6 (US1)**: Depends on Phases 3, 4, 5 being functionally complete; T013 is parallel with T014

### User Story Dependencies

- **US3 (P1)**: Can start right after Foundational — no deps on other stories; touches only `__tests__/unit/`
- **US2 (P1)**: Can start right after Foundational — no deps on US3; three files fully parallel
- **US4 (P2)**: Can start right after Foundational — no deps on US2 or US3; lives entirely in `functions/src/__tests__/`
- **US1 (P1)**: Validated last — it confirms the whole suite works together

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 all parallel
- **Phase 2**: T005, T006 parallel
- **Phase 3, 4, 5 can all start concurrently** after Phase 2 — with a team:
  - Dev A: T007 (utilities)
  - Dev B: T008 + T009 + T010 (API routes, all parallel)
  - Dev C: T011 + T012 (Cloud Functions)

---

## Parallel Example: Phase 4 (US2 — API Routes)

```text
# Once T005 and T006 are complete, launch all three API test files together:
Task: "Write __tests__/api/bulk.test.ts (T008)"
Task: "Write __tests__/api/categories-create.test.ts (T009)"
Task: "Write __tests__/api/categories-id.test.ts (T010)"
```

---

## Implementation Strategy

### MVP First (Phases 1–3: Setup + Utilities)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T006)
3. Complete Phase 3: Utility tests (T007)
4. **STOP and VALIDATE**: `npx vitest __tests__/unit` passes — pure functions are regression-protected
5. Commit and continue

### Incremental Delivery

1. Setup + Foundational → skeleton ready (`npm test` runs but 0 tests exist)
2. Add utility tests → `npm test` passes on `firebase-helpers.ts` coverage
3. Add API route tests → bulk and category route validation is regression-protected
4. Add Cloud Function tests → repeat-customer logic is regression-protected
5. Final polish → `npm test` exits 0 with coverage report

### Total Task Count

| Phase | Tasks | Parallel |
|-------|-------|----------|
| Phase 1: Setup | 4 | 3 of 4 |
| Phase 2: Foundational | 2 | 2 of 2 |
| Phase 3: US3 Utilities | 1 | — |
| Phase 4: US2 API Routes | 3 | 3 of 3 |
| Phase 5: US4 Functions | 2 | — |
| Phase 6: US1 Validation | 2 | 1 of 2 |
| **Total** | **14** | **9 of 14** |

---

## Notes

- All test files use `import { vi, describe, it, expect, beforeEach } from "vitest"` — no globals config needed
- `NextRequest` is imported from `"next/server"` and constructed with `new NextRequest("http://localhost", { method, body })`
- `firebase-admin` mocks MUST be declared with `vi.mock(...)` before any route import to intercept module-level initialization
- `firebase-functions-test` v3 is already installed in `functions/devDependencies` — no additional install needed for T011/T012
- Commit after each phase checkpoint to keep history clean
