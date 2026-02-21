# Data Model: Repeat Customer Minimum Order Discount

**Branch**: `001-repeat-customer-min` | **Date**: 2026-02-21

## Changed Entities

### User (`users/{userId}`)

**New field added to `types/users.ts`:**

```
isRepeatCustomer?: boolean
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `isRepeatCustomer` | `boolean \| undefined` | `undefined` (treated as `false`) | True if customer has at least one `delivered` order that has not been fully refunded. Written by Cloud Function; read by cart and checkout. |

**Write pattern**: Set to `true` when the first order reaches `delivered` status. Set to `false` when an order transitions to `refunded` AND no other `delivered` (non-refunded) orders remain for that user.

**Read pattern**: Read from `AuthContext.userData` in cart and checkout components. No additional Firestore read needed at page load.

---

### Order (`orders/{orderId}`)

**No schema changes.** Existing fields used:

| Field | Type | Role in this feature |
|-------|------|----------------------|
| `status` | `OrderStatus` | Trigger condition: transitions to `"delivered"` or `"refunded"` |
| `userId` | `string` | Used to look up and update the corresponding user document |
| `paymentStatus` | `PaymentStatus` | Not used by trigger; `status === "refunded"` is the authoritative signal |
| `refundedAt` | `Timestamp \| null` | Informational; not used in trigger logic |

**Qualifying status values** (contribute to repeat customer status):
- `delivered` — order successfully fulfilled

**Disqualifying status transitions** (may remove repeat status):
- `refunded` — full refund; triggers re-evaluation of repeat status

**Non-qualifying statuses** (no effect on repeat status):
- `pending`, `confirmed`, `processing`, `shipped` — in-progress, not yet fulfilled
- `cancelled` — never fulfilled
- `partially_refunded` (paymentStatus) — partial refund; order still counts as delivered

---

## State Transition: Repeat Customer Status

```
New Customer (isRepeatCustomer: undefined/false)
        │
        │ order.status → "delivered"
        ▼
Repeat Customer (isRepeatCustomer: true)
        │
        │ order.status → "refunded"
        │ AND no other delivered orders remain
        ▼
New Customer (isRepeatCustomer: false)
```

**Idempotency**: If a customer already has `isRepeatCustomer: true` and another order is delivered, no write occurs (value is already `true`). The trigger checks the before/after state transition to avoid unnecessary writes.

---

## Minimum Order Constants

**Location**: `lib/firebase-helpers.ts` (new exports alongside existing price helpers)

| Constant | Value (cents) | Applies To |
|----------|--------------|------------|
| `NEW_CUSTOMER_MIN_ORDER` | `15000` | Customers where `isRepeatCustomer` is `false` or `undefined` |
| `REPEAT_CUSTOMER_MIN_ORDER` | `10000` | Customers where `isRepeatCustomer` is `true` |

**Usage pattern** in cart and checkout:
```
const minOrderAmount = userData?.isRepeatCustomer
  ? REPEAT_CUSTOMER_MIN_ORDER
  : NEW_CUSTOMER_MIN_ORDER;
```

---

## Cloud Function: `onOrderUpdated`

**Trigger**: `onDocumentUpdated("orders/{orderId}")`

**Logic**:

```
WHEN order document is updated:
  IF before.status ≠ "delivered" AND after.status = "delivered":
    SET users/{after.userId}.isRepeatCustomer = true
    (Idempotent: same value written regardless of prior state)

  IF before.status ≠ "refunded" AND after.status = "refunded":
    QUERY orders WHERE userId = after.userId AND status = "delivered"
    IF query returns 0 results:
      SET users/{after.userId}.isRepeatCustomer = false
    ELSE:
      No change (customer still has other qualifying orders)
```

**Firestore reads per invocation**:
- On `delivered` transition: 0 reads (just a write)
- On `refunded` transition: 1 query (check for remaining delivered orders)

**Firestore writes per invocation**: 0 or 1 (user document update)

---

## Validation Rules

- `isRepeatCustomer` is never set to `true` for a `cancelled` order
- `isRepeatCustomer` is never set to `true` for an order with `paymentStatus: "partially_refunded"` (partial refund doesn't change `status` to `"refunded"`)
- Guest orders (no authenticated user) do not trigger user status updates — the trigger only fires for orders with a valid `userId` pointing to a document in the `users` collection
- The `isRepeatCustomer` field is treated as `false` when absent (`undefined`) for backwards compatibility with existing user records
