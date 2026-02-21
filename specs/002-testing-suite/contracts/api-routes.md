# Contract: Admin API Routes

---

## POST `/api/admin/products/bulk`

**Handler**: `app/api/admin/products/bulk/route.ts` → `POST`

### Request Schema
```typescript
{
  action: "status" | "category" | "delete";
  productIds: string[];
  status?: "draft" | "active" | "archived";  // required when action = "status"
  category?: string;                           // required when action = "category"
}
```

### Response Contracts

| Scenario | Status | Body |
|----------|--------|------|
| `productIds = []` | `400` | `{ error: "No product IDs provided" }` |
| `productIds.length > 2000` | `400` | `{ error: "Cannot process more than 2000 products at once" }` |
| `action = "invalid"` | `400` | `{ error: "Invalid action" }` |
| `action = "status"`, `status` missing | `400` | `{ error: "Invalid or missing status value" }` |
| `action = "status"`, `status = "unknown"` | `400` | `{ error: "Invalid or missing status value" }` |
| `action = "category"`, `category` missing | `400` | `{ error: "Missing category value" }` |
| Valid `status` update, 3 products | `200` | `{ success: true, processed: 3 }` |
| Valid `delete`, 5 products | `200` | `{ success: true, processed: 5 }` |
| Valid `category` update, 2 products | `200` | `{ success: true, processed: 2 }` |

### Side Effect Assertions

- **Firestore batch**: For N product IDs, `batch.update()` is called N times; `batch.commit()` is called `ceil(N/400)` times.
- **Firestore delete**: `batch.delete()` called N times for `action = "delete"`.
- **Algolia sync** (when `ALGOLIA_ADMIN_API_KEY` set): `partialUpdateObject` called N times for status/category; `deleteObject` called N times for delete.
- **Algolia skip** (when key absent): Neither `partialUpdateObject` nor `deleteObject` is called.

---

## POST `/api/admin/categories`

**Handler**: `app/api/admin/categories/route.ts` → `POST`

### Response Contracts

| Scenario | Status | Body |
|----------|--------|------|
| `{ seed: true }`, 0 existing categories | `200` | `{ success: true, seeded: 21 }` |
| `{ seed: true }`, categories already exist | `409` | `{ error: "Categories already exist..." }` |
| `{ name: "" }` | `400` | `{ error: "Name is required" }` |
| `{ name: "   " }` (whitespace only) | `400` | `{ error: "Name is required" }` |
| `{ name: "Birthday" }` (duplicate) | `409` | `{ error: "A category with that name already exists" }` |
| `{ name: "New Cat" }` (valid) | `200` | `{ success: true, id: string }` |

---

## PATCH `/api/admin/categories/[id]`

**Handler**: `app/api/admin/categories/[id]/route.ts` → `PATCH`

### Response Contracts

| Scenario | Status | Body |
|----------|--------|------|
| `id` not found | `404` | `{ error: "Category not found" }` |
| `{ name: "Birthday" }` (duplicate name, diff id) | `409` | `{ error: "A category with that name already exists" }` |
| `{ name: "Renamed" }` (valid rename) | `200` | `{ success: true }` |
| `{ order: 5 }` (no name change) | `200` | `{ success: true }` |
| `{ supportsBoxSet: true }` | `200` | `{ success: true }` |

### Side Effect Assertions (on rename)

- Products with old category name are batch-updated to new name.
- Algolia `partialUpdateObject` called for each affected product ID.
- Category document itself updated with new name and `updatedAt`.

### Side Effect Assertions (order/supportsBoxSet update only)

- No product batch update performed.
- No Algolia sync performed.
- Category document updated with the changed field(s) and `updatedAt`.

---

## DELETE `/api/admin/categories/[id]`

**Handler**: `app/api/admin/categories/[id]/route.ts` → `DELETE`

### URL

`DELETE /api/admin/categories/[id]?reassignTo=<categoryId>`

### Response Contracts

| Scenario | Status | Body |
|----------|--------|------|
| `id` not found | `404` | `{ error: "Category not found" }` |
| Products assigned, no `reassignTo` | `409` | `{ error: "Category has products", count: N }` |
| `reassignTo` target not found | `404` | `{ error: "Reassign target not found" }` |
| No products, no `reassignTo` | `200` | `{ success: true, reassigned: 0 }` |
| Products assigned + valid `reassignTo` | `200` | `{ success: true, reassigned: N }` |

### Side Effect Assertions (with reassignment)

- Products batch-updated to target category name.
- Algolia `partialUpdateObject` called for each reassigned product.
- Source category document deleted from Firestore.

---

## Cloud Function: `onOrderUpdated`

**Handler**: `functions/src/index.ts` → `onOrderUpdated`

### Trigger Shape

```typescript
change = {
  before: snapshot with { status: string; userId: string }
  after:  snapshot with { status: string; userId: string }
}
```

### Behavior Contracts

| `before.status` | `after.status` | Other delivered orders for user | Expected write |
|-----------------|----------------|--------------------------------|---------------|
| `"processing"` | `"delivered"` | N/A | `user.isRepeatCustomer = true` |
| `"delivered"` | `"refunded"` | None | `user.isRepeatCustomer = false` |
| `"delivered"` | `"refunded"` | 1+ exist | No write (user stays true) |
| `"pending"` | `"shipped"` | N/A | No write |
| `"pending"` | `"cancelled"` | N/A | No write |
