# Tasks: Repeat Customer Minimum Order Discount

**Input**: Design documents from `specs/001-repeat-customer-min/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not requested in spec. No test tasks generated.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup

**Purpose**: Verify the project builds cleanly before making changes.

- [x] T001 Verify TypeScript build passes and ESLint is clean: run `npm run build && npm run lint` from repo root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core changes that MUST be complete before any user story can be implemented. These two tasks affect shared files consumed by every subsequent task.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Add `isRepeatCustomer?: boolean` field to the `User` interface in `types/users.ts`
- [x] T003 [P] Export `NEW_CUSTOMER_MIN_ORDER = 15000` and `REPEAT_CUSTOMER_MIN_ORDER = 10000` constants from `lib/firebase-helpers.ts`

**Checkpoint**: Types compile, constants are importable. Run `npm run build` to verify before proceeding.

---

## Phase 3: User Stories 1 & 2 — Dynamic Minimum in Cart & Checkout (Priority: P1) 🎯 MVP

**Goal**: Repeat customers see $100 minimum; new customers see $150 minimum. Both cart and checkout enforce and display the correct amount dynamically based on `userData.isRepeatCustomer`.

**User Stories**:
- **US1**: Repeat customer with `isRepeatCustomer: true` on their Firestore user doc sees $100 minimum and can check out with $100–$149 in cart.
- **US2**: New customer with `isRepeatCustomer: false`/absent sees $150 minimum and is blocked below $150.

**Independent Test**: Manually set `isRepeatCustomer: true` on a test user doc in Firestore console. Log in as that user, add $110 to cart → checkout proceeds. Log in as user without the field → blocked at $150.

### Implementation for User Stories 1 & 2

- [x] T004 [US1] Update `app/(dashboard)/cart/page.tsx`: remove local `MINIMUM_ORDER_AMOUNT` constant; import `NEW_CUSTOMER_MIN_ORDER` and `REPEAT_CUSTOMER_MIN_ORDER` from `@/lib/firebase-helpers`; destructure `userData` from `useAuth()`; derive `const minOrderAmount = userData?.isRepeatCustomer ? REPEAT_CUSTOMER_MIN_ORDER : NEW_CUSTOMER_MIN_ORDER`; replace all three `MINIMUM_ORDER_AMOUNT` references (comparison, warning message, button disabled prop) with `minOrderAmount`
- [x] T005 [US1] Update `app/(dashboard)/checkout/page.tsx`: same constant swap as cart; destructure `userData` from `useAuth()`; derive `minOrderAmount` the same way; update all three enforcement points — line ~79 (final validation before Stripe call), line ~163 (redirect guard), and the warning message strings — to use `minOrderAmount`

**Checkpoint**: US1 + US2 complete. Log in as repeat customer (set `isRepeatCustomer: true` in Firestore console) → cart shows $100 minimum, checkout allows $110 cart. Log in as new customer → both pages block below $150.

---

## Phase 4: User Story 3 — Automatic Status Update on Order Completion (Priority: P2)

**Goal**: When an order's `status` transitions to `"delivered"`, the user's `isRepeatCustomer` field is set to `true`. When an order transitions to `"refunded"`, the system re-evaluates and reverts to `false` if no other `delivered` orders remain.

**Independent Test**: In Firestore console, set an order document's `status` to `"delivered"` → within seconds, the corresponding user document gains `isRepeatCustomer: true`. Set that order to `"refunded"` → `isRepeatCustomer` reverts to `false` (if it was the only qualifying order).

### Implementation for User Story 3

- [x] T006 [US3] Add `onOrderUpdated` export to `functions/src/index.ts` using `onDocumentUpdated("orders/{orderId}")` from `firebase-functions/v2/firestore`; implement the following logic: (a) if `before.status !== "delivered" && after.status === "delivered"`, update `users/{after.userId}` with `{ isRepeatCustomer: true, updatedAt: serverTimestamp() }`; (b) if `before.status !== "refunded" && after.status === "refunded"`, query `orders` where `userId == after.userId && status == "delivered"` and if the result is empty, update `users/{after.userId}` with `{ isRepeatCustomer: false, updatedAt: serverTimestamp() }`; add guard at top: `if (!before || !after || !after.userId) return`
- [ ] T007 [US3] Build and deploy Cloud Functions from the `functions/` directory: run `npm run build` then `npm run deploy` to push `onOrderUpdated` to Firebase

**Checkpoint**: US3 complete. Trigger fires correctly on status transitions verified via Firestore console and Firebase Functions logs.

---

## Phase 5: User Story 4 — Admin Customer Status Visibility (Priority: P3)

**Goal**: Admin users can see each customer's repeat status in both the customer list and customer detail views.

**Independent Test**: Navigate to `/admin/customers` as an admin → verify a status indicator (badge or column) appears per customer. Click into a customer with `isRepeatCustomer: true` → detail page shows "Repeat Customer" label.

### Implementation for User Story 4

- [x] T008 [P] [US4] Update `app/(admin)/admin/customers/[id]/page.tsx`: read `customer.isRepeatCustomer` from the customer data already fetched on that page; display a labeled badge (e.g. "Repeat Customer" or "New Customer") in the customer detail section
- [x] T009 [P] [US4] Update `app/(admin)/admin/customers/page.tsx`: add a "Type" or "Status" column to the customer list table/grid; display "Repeat" or "New" indicator per customer row using `customer.isRepeatCustomer`

**Checkpoint**: US4 complete. Admin customer list and detail pages show correct repeat status for each customer.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, edge case verification, and deployment confirmation.

- [ ] T010 Verify TypeScript strict-mode compilation passes across all modified files: run `npm run build` from repo root
- [ ] T011 Run ESLint across modified files: run `npm run lint` from repo root and resolve any errors
- [ ] T012 [P] Manual edge case verification — refund scenario: set a test user's only delivered order to `"refunded"` in Firestore console; confirm `isRepeatCustomer` reverts to `false` on user document; confirm cart reverts to $150 minimum on next login
- [ ] T013 [P] Manual edge case verification — partial refund: update an order's `paymentStatus` to `"partially_refunded"` (leave `status` as `"delivered"`); confirm `isRepeatCustomer` remains `true`
- [ ] T014 [P] Manual edge case verification — backwards compatibility: confirm an existing user document without `isRepeatCustomer` field sees $150 minimum in cart and checkout (field absence treated as `false`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **US1+US2 (Phase 3)**: Depends on Phase 2 (needs `User` type + constants)
- **US3 (Phase 4)**: Depends on Phase 2 (needs `User` type for Cloud Function write) — independent of Phase 3
- **US4 (Phase 5)**: Depends on Phase 2 (needs `User` type for admin display) — independent of Phases 3 and 4
- **Polish (Phase 6)**: Depends on all desired user stories complete

### User Story Dependencies

- **US1+US2 (Phase 3)**: Starts after Phase 2 — no dependency on US3 or US4
- **US3 (Phase 4)**: Starts after Phase 2 — no dependency on US1/US2 (they share `isRepeatCustomer` field but don't depend on each other at runtime)
- **US4 (Phase 5)**: Starts after Phase 2 — no dependency on US1/US2/US3

### Within Each Phase

- T004 and T005 (Phase 3) are sequential (cart before checkout for logical testing order, but both touch different files so can technically be parallelized)
- T008 and T009 (Phase 5) are fully parallel — different files

### Parallel Opportunities

- T002 and T003 (Phase 2) can run in parallel — different files
- T004 and T005 (Phase 3) can run in parallel — different files
- Phases 3, 4, and 5 can all start as soon as Phase 2 completes — no inter-story dependencies
- T008 and T009 (Phase 5) are parallel
- T012, T013, T014 (Phase 6) are all parallel

---

## Parallel Execution Examples

```bash
# Phase 2: Run both foundational tasks together
Task: "Add isRepeatCustomer to types/users.ts"
Task: "Export min order constants from lib/firebase-helpers.ts"

# Phase 3+: Run all story phases together after Phase 2 completes
Task: "Update cart page (T004)"   → US1+US2
Task: "Add Cloud Function (T006)" → US3
Task: "Update admin pages (T008, T009)" → US4

# Phase 6: Run all verification tasks together
Task: "Refund edge case (T012)"
Task: "Partial refund edge case (T013)"
Task: "Backwards compat edge case (T014)"
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only — Phase 1–3)

1. Complete Phase 1: Verify build
2. Complete Phase 2: Type + constants (foundational)
3. Complete Phase 3: Cart + checkout dynamic minimum
4. **STOP and VALIDATE**: Manually test repeat vs new customer minimum in cart and checkout
5. Ship — customers immediately benefit from correct minimums

> Note: Without Phase 4 (Cloud Function), the `isRepeatCustomer` field must be set manually in Firestore. This is viable for MVP if the customer base is small.

### Full Delivery (All Stories)

1. Phase 1–3: MVP above
2. Phase 4: Cloud Function auto-updates repeat status on order delivery/refund
3. Phase 5: Admin visibility
4. Phase 6: Polish and edge case validation

### Parallel Team Strategy

With two developers after Phase 2 completes:
- **Developer A**: Phase 3 (cart + checkout UI)
- **Developer B**: Phase 4 (Cloud Function) + Phase 5 (admin UI)

---

## Notes

- No new Firestore reads required at cart/checkout load — `userData` is already in memory via `AuthContext`
- Cloud Function uses `onDocumentUpdated` (v2 API) consistent with existing `onDocumentCreated` triggers
- `isRepeatCustomer` is optional (`?:`) — backwards-compatible with all existing user documents
- All minimum values are in cents (integers) matching the existing codebase convention
- Partial refunds (`paymentStatus: "partially_refunded"`) do not affect order `status` and therefore do not trigger repeat status changes
- `[P]` tasks = different files, no shared dependencies between them
