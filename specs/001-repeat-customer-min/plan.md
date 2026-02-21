# Implementation Plan: Repeat Customer Minimum Order Discount

**Branch**: `001-repeat-customer-min` | **Date**: 2026-02-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-repeat-customer-min/spec.md`

## Summary

Add a $100 minimum order threshold for repeat customers (those with at least one `delivered` order), replacing the current hardcoded $150 minimum for all users. A new `isRepeatCustomer` field is denormalized onto the user document and kept current by a new Cloud Function trigger that fires when order status changes to `delivered` or `refunded`. The cart and checkout pages read this field from the existing `AuthContext` to dynamically display and enforce the correct minimum with no additional data fetching.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js 18 (Cloud Functions)
**Primary Dependencies**: Next.js 14 App Router, Firebase Web SDK v10, Firebase Admin SDK, Firebase Functions v2, shadcn/ui
**Storage**: Firestore (primary database) — `users` and `orders` collections
**Testing**: Manual end-to-end testing via Firebase emulator; no automated test suite currently in project
**Target Platform**: Web (Next.js on Vercel), Cloud Functions on Firebase (us-central1)
**Project Type**: E-commerce web application (Next.js frontend + Firebase backend)
**Performance Goals**: No new Firestore reads at cart/checkout load — repeat status read from existing `userData` already in memory
**Constraints**: Backwards-compatible — existing user documents without `isRepeatCustomer` field default to new-customer behavior
**Scale/Scope**: Single-tenant storefront; small customer base; 7 files touched

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is a placeholder template with no project-specific rules defined. No gates apply. ✓

## Project Structure

### Documentation (this feature)

```text
specs/001-repeat-customer-min/
├── plan.md                          # This file
├── spec.md                          # Feature specification
├── research.md                      # Phase 0 — all decisions resolved
├── data-model.md                    # Phase 1 — schema and trigger design
├── contracts/
│   └── internal-contracts.md        # Phase 1 — component boundaries
├── checklists/
│   └── requirements.md              # Spec quality checklist
└── tasks.md                         # Phase 2 — created by /speckit.tasks
```

### Source Code (repository root)

```text
types/
└── users.ts                         # Add isRepeatCustomer?: boolean to User

lib/
└── firebase-helpers.ts              # Export NEW_CUSTOMER_MIN_ORDER and REPEAT_CUSTOMER_MIN_ORDER

app/(dashboard)/
├── cart/page.tsx                    # Dynamic minimum: import constants, read userData.isRepeatCustomer
└── checkout/page.tsx                # Same — 3 enforcement points updated

functions/src/
└── index.ts                         # Add onOrderUpdated trigger

app/(admin)/admin/customers/
├── page.tsx                         # Add repeat status indicator to customer list
└── [id]/page.tsx                    # Add repeat status badge to customer detail
```

**Structure Decision**: Single Next.js application with Firebase Functions as the backend layer. Follows the existing Option 2 (web app) pattern — frontend under `app/`, backend triggers under `functions/src/`, shared types under `types/`, shared utilities under `lib/`.

## Complexity Tracking

> No constitution violations — section not applicable.

---

## Phase 0: Research (Complete)

All decisions resolved via direct codebase inspection. See [research.md](./research.md) for full rationale.

| Decision | Resolution |
|----------|------------|
| Terminal order status | `delivered` (maps to spec's "completed/fulfilled") |
| Full refund signal | `order.status === "refunded"` |
| Storage strategy | Denormalized `isRepeatCustomer` field on user document |
| Constants location | Export from `lib/firebase-helpers.ts` |
| Cloud Function trigger | `onDocumentUpdated` from `firebase-functions/v2/firestore` |
| Net 30 handling | Naturally excluded — orders only reach `delivered` after fulfillment |
| UI data access | `userData` from existing `AuthContext` (no new reads) |

---

## Phase 1: Design (Complete)

See [data-model.md](./data-model.md) and [contracts/internal-contracts.md](./contracts/internal-contracts.md).

### Design Decisions

**1. Type change is backwards-compatible**
`isRepeatCustomer?: boolean` (optional) means existing Firestore documents without the field continue to work. Both cart and checkout use `userData?.isRepeatCustomer` with falsy default, treating absent as `false`.

**2. Cloud Function trigger is minimal**
`onOrderUpdated` only reacts to `status` field transitions to `"delivered"` or `"refunded"`. All other updates (notes, shipping info, admin changes) are no-ops in this function. No new Firestore reads on `delivered` transition (just 1 write). On `refunded` transition: 1 query + 0-or-1 write.

**3. Re-evaluation on refund**
When an order is refunded, the function queries for remaining `delivered` orders for that user. If the result is empty, `isRepeatCustomer` is set to `false`. This correctly handles the "only order was refunded" edge case from the spec.

**4. Partial refund leaves status unchanged**
`paymentStatus: "partially_refunded"` does not change `order.status`. The trigger condition is `status === "refunded"`, so partial refunds are transparently ignored.

**5. Cart message is customer-aware**
The cart warning message will display the applicable minimum (`$100` or `$150`) based on customer type, not a hardcoded value. This ensures repeat customers see their correct threshold.

---

## Implementation Steps

The following steps are ordered by dependency. Each step is independently testable.

### Step 1 — Add `isRepeatCustomer` to User type
**File**: `types/users.ts`
**Change**: Add `isRepeatCustomer?: boolean` to the `User` interface.
**Test**: TypeScript compilation passes; existing code is unaffected (field is optional).

### Step 2 — Export minimum order constants from firebase-helpers
**File**: `lib/firebase-helpers.ts`
**Change**: Add and export:
```typescript
export const NEW_CUSTOMER_MIN_ORDER = 15000;      // $150.00 in cents
export const REPEAT_CUSTOMER_MIN_ORDER = 10000;   // $100.00 in cents
```
**Test**: Import resolves correctly from both cart and checkout pages.

### Step 3 — Update cart page
**File**: `app/(dashboard)/cart/page.tsx`
**Changes**:
- Remove local `const MINIMUM_ORDER_AMOUNT = 15000`
- Import `NEW_CUSTOMER_MIN_ORDER`, `REPEAT_CUSTOMER_MIN_ORDER` from `@/lib/firebase-helpers`
- Destructure `userData` from `useAuth()`
- Derive `const minOrderAmount = userData?.isRepeatCustomer ? REPEAT_CUSTOMER_MIN_ORDER : NEW_CUSTOMER_MIN_ORDER`
- Replace all `MINIMUM_ORDER_AMOUNT` references with `minOrderAmount`
- Update warning message to use `minOrderAmount`

**Test**: Log in as new customer → see $150 minimum; log in as repeat customer (with `isRepeatCustomer: true` in Firestore) → see $100 minimum.

### Step 4 — Update checkout page
**File**: `app/(dashboard)/checkout/page.tsx`
**Changes** (3 enforcement points):
- Remove local `const MINIMUM_ORDER_AMOUNT = 15000`
- Import constants from `@/lib/firebase-helpers`
- Destructure `userData` from `useAuth()`
- Derive `minOrderAmount` same as cart
- Update line 79 (final validation before Stripe), line 163 (redirect guard), and all message strings

**Test**: Attempt checkout with $120 as new customer → blocked; as repeat customer → allowed.

### Step 5 — Add `onOrderUpdated` Cloud Function
**File**: `functions/src/index.ts`
**Change**: Add new export:
```typescript
export const onOrderUpdated = onDocumentUpdated(
  "orders/{orderId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after || !after.userId) return;

    // Delivered: grant repeat status
    if (before.status !== "delivered" && after.status === "delivered") {
      await db.collection("users").doc(after.userId).update({
        isRepeatCustomer: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      logger.info("User granted repeat customer status", { userId: after.userId });
      return;
    }

    // Refunded: re-evaluate repeat status
    if (before.status !== "refunded" && after.status === "refunded") {
      const remaining = await db
        .collection("orders")
        .where("userId", "==", after.userId)
        .where("status", "==", "delivered")
        .get();
      if (remaining.empty) {
        await db.collection("users").doc(after.userId).update({
          isRepeatCustomer: false,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        logger.info("User repeat customer status revoked", { userId: after.userId });
      }
    }
  }
);
```
**Test**: Set an order to `delivered` in Firebase console → verify `isRepeatCustomer: true` appears on user doc. Set to `refunded` → verify reverts to `false` if no other delivered orders.

### Step 6 — Show repeat status in admin customer detail
**File**: `app/(admin)/admin/customers/[id]/page.tsx`
**Change**: Display a badge or labeled field showing repeat customer status ("Repeat Customer" / "New Customer") using `userData.isRepeatCustomer`.
**Test**: View a customer with `isRepeatCustomer: true` → badge shows; customer without it → shows "New Customer".

### Step 7 — Show repeat status in admin customer list
**File**: `app/(admin)/admin/customers/page.tsx`
**Change**: Add a "Status" column (or indicator) to the customer list table showing repeat vs. new status.
**Test**: Customer list renders with status indicator for each customer.

---

## Edge Case Verification Checklist

| Edge case | Handled by |
|-----------|-----------|
| Only order is delivered → gets $100 min | Step 5: `delivered` trigger sets `isRepeatCustomer: true` |
| Only order is then fully refunded → reverts to $150 | Step 5: `refunded` trigger, empty query → sets `false` |
| One of multiple delivered orders is refunded | Step 5: remaining query non-empty → no change, keeps `true` |
| Partial refund (`paymentStatus: partially_refunded`) | No `status` change to `"refunded"` → trigger does not fire |
| Cancelled order | `cancelled` status: not `delivered`, not `refunded` → no effect |
| Unpaid / pending orders | Status is `confirmed` or `processing` → no trigger effect |
| Existing users (no `isRepeatCustomer` field) | `userData?.isRepeatCustomer` is `undefined` → treated as `false` → $150 |
| Guest order | No authenticated `userId` → trigger guard `if (!after.userId) return` |
| Admin changes other order fields | Status unchanged → trigger no-ops |

---

## Deployment Notes

- Cloud Function `onOrderUpdated` requires Firebase Functions deployment: `npm run deploy` from `/functions`
- No database migration needed — new field is optional and backwards-compatible
- No environment variable changes required
- Vercel deployment: Next.js changes deploy via standard `git push` + Vercel CI

## Post-Implementation Validation

1. Manually verify: new user account sees $150 minimum in cart
2. Manually verify: set `isRepeatCustomer: true` in Firestore console → cart shows $100 minimum on next session
3. Manually verify: trigger fires by setting an order to `delivered` in Firestore console → `isRepeatCustomer: true` appears on user doc
4. Manually verify: set that order to `refunded` → `isRepeatCustomer: false` on user doc (if only qualifying order)
5. Manually verify: admin customer detail shows correct status
