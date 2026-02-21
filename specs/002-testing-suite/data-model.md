# Data Model: Testing Suite

**Branch**: `002-testing-suite` | **Date**: 2026-02-21

## Overview

The testing suite does not introduce any new Firestore collections or application data models. Instead, this document defines the **test fixture shapes** and **mock data structures** used across the test files.

---

## Test Fixtures

### ProductFixture

Used in API route tests for `/api/admin/products/bulk`.

```typescript
interface ProductFixture {
  id: string;         // e.g., "prod-001"
  name: string;
  category: string;
  status: "draft" | "active" | "archived";
}

// Canonical test set (matches existing Firestore schema)
const PRODUCT_FIXTURES: ProductFixture[] = [
  { id: "prod-001", name: "Birthday Card", category: "Birthday", status: "active" },
  { id: "prod-002", name: "Thank You Card", category: "Thank You", status: "active" },
  { id: "prod-003", name: "Draft Card", category: "Holiday", status: "draft" },
];
```

### CategoryFixture

Used in API route tests for `/api/admin/categories` and `/api/admin/categories/[id]`.

```typescript
interface CategoryFixture {
  id: string;           // Firestore document ID
  name: string;
  order: number;
  supportsBoxSet: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CATEGORY_FIXTURES: CategoryFixture[] = [
  { id: "cat-001", name: "Birthday", order: 0, supportsBoxSet: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-002", name: "Thank You", order: 1, supportsBoxSet: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-003", name: "Holiday", order: 2, supportsBoxSet: true, createdAt: new Date(), updatedAt: new Date() },
];
```

### OrderFixture

Used in Cloud Function tests for `onOrderUpdated`.

```typescript
interface OrderFixture {
  userId: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
}

// Represents the Firestore Change event shape
interface OrderChangeFixture {
  before: { status: string };
  after: { status: string; userId: string };
}
```

### UserFixture

Used in Cloud Function tests — represents the user document being updated.

```typescript
interface UserFixture {
  id: string;           // Firebase Auth UID
  isRepeatCustomer: boolean;
}
```

---

## Mock Shapes

### FirestoreBatchMock

Captures all `batch.update()` and `batch.delete()` calls for assertion.

```typescript
interface FirestoreBatchMock {
  update: vi.Mock;        // tracks (ref, data) calls
  delete: vi.Mock;        // tracks (ref) calls
  commit: vi.Mock;        // resolves immediately
}
```

### FirestoreQueryMock

Simulates Firestore query results (`.where().get()` chain).

```typescript
interface FirestoreQueryMock {
  docs: Array<{
    id: string;
    data: () => Record<string, unknown>;
    ref: { id: string };
  }>;
  empty: boolean;
  size: number;
  data: () => { count: number };  // for count queries
}
```

### AlgoliaMock

Captures all `partialUpdateObject()` and `deleteObject()` calls.

```typescript
interface AlgoliaMock {
  partialUpdateObject: vi.Mock;  // resolves immediately
  deleteObject: vi.Mock;          // resolves immediately
}
```

---

## State Transitions Under Test

### `onOrderUpdated` State Machine

```
Order status transitions that trigger isRepeatCustomer updates:

ANY → "delivered"
  └─ SET user.isRepeatCustomer = true

ANY → "refunded"
  ├─ IF no other "delivered" orders exist for user
  │   └─ SET user.isRepeatCustomer = false
  └─ IF other "delivered" orders exist for user
      └─ KEEP user.isRepeatCustomer = true (no write)

ANY → anything else (pending, confirmed, processing, shipped, cancelled)
  └─ NO-OP (function exits early)
```

### Bulk Product Operation Validation Rules

```
POST /api/admin/products/bulk

productIds = []           → 400 "No product IDs provided"
productIds.length > 2000  → 400 "Cannot process more than 2000 products at once"
action = "invalid"        → 400 "Invalid action"
action = "status", no status value   → 400 "Invalid or missing status value"
action = "status", invalid status    → 400 "Invalid or missing status value"
action = "category", no category     → 400 "Missing category value"
valid input               → 200 { success: true, processed: N }
```

### Category API Validation Rules

```
POST /api/admin/categories

{ seed: true } + categories exist   → 409 "Categories already exist"
{ seed: true } + no categories      → 200 { success, seeded: 21 }
{ name: "" }                        → 400 "Name is required"
{ name: "Birthday" } (dupe)         → 409 "A category with that name already exists"
{ name: "New Category" }            → 200 { success, id }

PATCH /api/admin/categories/[id]

id not found              → 404 "Category not found"
{ name: "Birthday" } (dupe, different id) → 409 duplicate error
{ name: "Renamed" }       → cascade product updates + Algolia sync
{ order: 5 }              → simple field update, no cascade

DELETE /api/admin/categories/[id]

id not found              → 404 "Category not found"
has products, no reassignTo → 409 { error, count }
has products + reassignTo  → reassign + delete → 200 { success, reassigned: N }
no products               → delete → 200 { success, reassigned: 0 }
```
