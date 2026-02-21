# Research: Repeat Customer Minimum Order Discount

**Branch**: `001-repeat-customer-min` | **Date**: 2026-02-21 | **Phase**: 0

## Summary

All unknowns resolved via direct codebase inspection. No external research needed — decisions are driven by existing patterns in the repository.

---

## Decision 1: Terminal Order Status Mapping

**Question**: What order status represents "completed/fulfilled" in the spec?

**Decision**: `delivered`

**Rationale**: The `OrderStatus` type in `types/orders.ts` uses `delivered` as the terminal successful state, with the inline comment `// completed`. The spec terms "completed/fulfilled" map directly to `delivered` in this codebase. There is no separate "fulfilled" status.

**Alternatives considered**: None — `delivered` is the only terminal success status in the existing type definition.

---

## Decision 2: Full Refund Detection

**Question**: How is a fully refunded order distinguished from a partially refunded one?

**Decision**: Use `order.status === "refunded"` to identify fully refunded orders.

**Rationale**: The `OrderStatus` type includes a `refunded` value, and the `Order` type has a `refundedAt: Timestamp | null` field, making refunded orders clearly distinguishable. `PaymentStatus` also has `partially_refunded` — partial refunds change `paymentStatus` but not necessarily `status`. Full refunds change `status` to `"refunded"`. This is consistent with the existing webhook handler which distinguishes payment statuses separately from order statuses.

**Alternatives considered**: Checking `paymentStatus === "refunded"` — rejected because `paymentStatus` tracks payment processor state, while `status` tracks fulfillment/lifecycle state. The repeat customer logic should track lifecycle, not payment processor state.

---

## Decision 3: Repeat Status Storage Strategy

**Question**: Should repeat status be computed on-the-fly from order history queries, or stored as a denormalized field on the user document?

**Decision**: Store `isRepeatCustomer: boolean` as a field on the user document, updated by a Cloud Function trigger.

**Rationale**:
- Cart and checkout load on every page visit; an order-history query on every page load would add latency and Firestore read costs.
- `AuthContext` already fetches the user document and provides it via `userData` — making `isRepeatCustomer` immediately available to all components with zero additional reads.
- Cloud Functions are already used for Firestore triggers in this project (`onUserCreated`, `onOrderCreated`); adding an `onOrderUpdated` trigger follows the same established pattern.
- The business rules for status change (on `delivered`, on `refunded`) are clearly defined, making the denormalized field reliably maintainable.

**Alternatives considered**:
- **On-demand query**: Query `orders` collection for `userId` + `status == "delivered"` on each cart load. Rejected — adds Firestore read costs and latency on every cart page load.
- **Client-side hook**: Derive repeat status in `useOrders()` and store in React state. Rejected — React state is ephemeral; would require re-fetching order history on every session.

---

## Decision 4: Constants Centralization

**Question**: Where should the minimum order constants live?

**Decision**: Export from `lib/firebase-helpers.ts` alongside the existing `formatPrice`, `toCents`, and `toDollars` helpers.

**Rationale**: `lib/firebase-helpers.ts` already exports pricing-related utilities used by both cart and checkout pages. Centralizing the constants there eliminates the current duplication (`MINIMUM_ORDER_AMOUNT` is independently declared in both `cart/page.tsx` and `checkout/page.tsx`) and is consistent with the project's existing pattern.

**Alternatives considered**: A separate `lib/constants.ts` file — rejected as unnecessary file creation for two constants that logically belong with the pricing helpers.

---

## Decision 5: Cloud Function Trigger Type

**Question**: Which Firebase Functions v2 trigger handles document updates?

**Decision**: `onDocumentUpdated` from `firebase-functions/v2/firestore`

**Rationale**: The existing Cloud Functions use `onDocumentCreated` from `firebase-functions/v2/firestore`. The v2 API provides `onDocumentUpdated` for update events, giving access to `event.data.before` and `event.data.after` — exactly what's needed to detect status transitions. This is consistent with the existing import pattern.

---

## Decision 6: Net 30 / Pending Payment Handling

**Question**: How are Net 30 orders represented in the current system?

**Decision**: No Net 30 payment method exists in the current codebase. The `PaymentMethod` type is `card | paypal | apple_pay | google_pay | cash_on_delivery`. The repeat customer trigger fires only when `status === "delivered"`, which naturally excludes any undelivered orders regardless of payment method. No special handling for Net 30 is needed beyond what the trigger logic already provides.

**Rationale**: The spec requirement ("Net 30 orders not yet paid do not count") is automatically satisfied: an order won't reach `delivered` status if it hasn't been fulfilled. The trigger's condition (`status transitions to "delivered"`) is sufficient.

---

## Decision 7: AuthContext Integration

**Question**: How does the cart/checkout UI access the user's repeat status without additional data fetching?

**Decision**: Destructure `userData` from `useAuth()` in the cart and checkout pages. `userData` is the typed `User` document from Firestore, already fetched and kept live by `AuthContext`.

**Rationale**: `AuthContext` already subscribes to the user document on auth state change and provides `userData: User | null` to all consuming components. Once `isRepeatCustomer` is added to the `User` type and written to Firestore, it will be available immediately in both pages with no new hooks or data fetching.

---

## File Map (Files to Modify)

| File | Change |
|------|--------|
| `types/users.ts` | Add `isRepeatCustomer?: boolean` to `User` interface |
| `lib/firebase-helpers.ts` | Export `NEW_CUSTOMER_MIN_ORDER` and `REPEAT_CUSTOMER_MIN_ORDER` constants |
| `app/(dashboard)/cart/page.tsx` | Use `userData.isRepeatCustomer` to select minimum; import constants from helpers |
| `app/(dashboard)/checkout/page.tsx` | Same as cart — 3 enforcement points updated |
| `functions/src/index.ts` | Add `onOrderUpdated` trigger |
| `app/(admin)/admin/customers/[id]/page.tsx` | Display repeat customer status badge |
| `app/(admin)/admin/customers/page.tsx` | Display repeat status column in customer list |
