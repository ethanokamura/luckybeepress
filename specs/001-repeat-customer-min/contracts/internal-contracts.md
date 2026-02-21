# Internal Contracts: Repeat Customer Minimum Order Discount

**Branch**: `001-repeat-customer-min` | **Date**: 2026-02-21

This feature has no public API contracts (no new HTTP endpoints, no external integrations). The contracts below document the internal boundaries between components.

---

## Contract 1: User Document Repeat Status Field

**Producer**: `onOrderUpdated` Cloud Function
**Consumer**: `AuthContext` → `cart/page.tsx`, `checkout/page.tsx`, `admin/customers/[id]/page.tsx`

**Schema**:
```
users/{userId} {
  ...existing fields...
  isRepeatCustomer?: boolean   // NEW
}
```

**Guarantees**:
- `isRepeatCustomer: true` if and only if the user has at least one order where `status === "delivered"` and no subsequent `status === "refunded"` reverted them to non-repeat
- `isRepeatCustomer: false` or absent (`undefined`) means standard $150 minimum applies
- Field is set atomically by the Cloud Function; consumers treat `undefined` as `false`
- Field update happens within the same Firestore write that changes order status (triggered immediately after status transition)

**Breaking change rule**: This field is optional (`?:`). Existing user documents without it default to `false` behavior. No migration required for existing data.

---

## Contract 2: Minimum Order Constants

**Producer**: `lib/firebase-helpers.ts`
**Consumer**: `cart/page.tsx`, `checkout/page.tsx`

**Exported values**:
```
NEW_CUSTOMER_MIN_ORDER     = 15000  // cents ($150.00)
REPEAT_CUSTOMER_MIN_ORDER  = 10000  // cents ($100.00)
```

**Guarantee**: Both constants are in cents (integer), matching the existing convention for all price values in the codebase (`Cart.subtotal`, `Order.total`, etc.).

**Usage invariant**: Consumers MUST NOT declare a local `MINIMUM_ORDER_AMOUNT` constant. All minimum enforcement must import from `lib/firebase-helpers.ts`.

---

## Contract 3: Cart/Checkout Minimum Enforcement

**Producer**: `cart/page.tsx`, `checkout/page.tsx`
**Consumer**: End user (buyer)

**Behavior**:

| Customer type | `cart.subtotal` | Cart button | Checkout entry | Checkout validation |
|---------------|-----------------|-------------|----------------|---------------------|
| New (`isRepeatCustomer: false/undefined`) | < 15000 | Disabled | Blocked (redirect) | Blocked (alert) |
| New | ≥ 15000 | Enabled | Allowed | Passes |
| Repeat (`isRepeatCustomer: true`) | < 10000 | Disabled | Blocked (redirect) | Blocked (alert) |
| Repeat | ≥ 10000 | Enabled | Allowed | Passes |

**Message invariant**: When minimum is not met, the displayed amount must match the customer's applicable minimum (not a hardcoded $150).

---

## Contract 4: Cloud Function Trigger Boundary

**Producer**: Admin order management (`updateOrderStatus` in `hooks/useFirebase.tsx`)
**Consumer**: `onOrderUpdated` Cloud Function

**Trigger conditions**:
- Fires on ANY update to `orders/{orderId}`
- Function internally filters: only acts when `status` field changes to `"delivered"` or `"refunded"`
- All other updates (notes, shipping info, adminNotes, etc.) are no-ops in this function

**Idempotency**: If the same order is set to `"delivered"` multiple times (edge case), the function writes `isRepeatCustomer: true` each time — safe because it's the same value.

**No side effects**: The `onOrderUpdated` function only writes to the triggering user's document. It does not send emails, modify other collections, or call external services.
