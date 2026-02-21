/** Shared test fixtures for all test suites. */

export const CATEGORY_FIXTURES = [
  { id: "cat-1", name: "Birthday", order: 0, supportsBoxSet: false },
  { id: "cat-2", name: "Thank You", order: 1, supportsBoxSet: true },
  { id: "cat-3", name: "Holiday", order: 2, supportsBoxSet: true },
] as const;

export const PRODUCT_FIXTURES = [
  {
    id: "prod-1",
    name: "Birthday Bee Card",
    category: "Birthday",
    status: "active",
  },
  {
    id: "prod-2",
    name: "Thank You Box",
    category: "Thank You",
    status: "active",
  },
  {
    id: "prod-3",
    name: "Holiday Draft",
    category: "Holiday",
    status: "draft",
  },
] as const;

/**
 * Order snapshots matching the shape expected by `onOrderUpdated`.
 * `before` and `after` are plain data objects — wrap in makeDocumentSnapshot
 * inside the Cloud Function test setup.
 */
export const ORDER_FIXTURES = {
  /** pending → delivered: grants isRepeatCustomer */
  pendingToDelivered: {
    before: { status: "pending", userId: "user-abc" },
    after: { status: "delivered", userId: "user-abc" },
  },
  /** delivered → refunded (no other delivered orders): revokes isRepeatCustomer */
  deliveredToRefunded: {
    before: { status: "delivered", userId: "user-abc" },
    after: { status: "refunded", userId: "user-abc" },
  },
  /** delivered → refunded (other delivered orders remain): no write */
  deliveredToRefundedRetains: {
    before: { status: "delivered", userId: "user-xyz" },
    after: { status: "refunded", userId: "user-xyz" },
  },
  /** pending → shipped: no write */
  pendingToShipped: {
    before: { status: "pending", userId: "user-abc" },
    after: { status: "shipped", userId: "user-abc" },
  },
  /** pending → cancelled: no write */
  pendingToCancelled: {
    before: { status: "pending", userId: "user-abc" },
    after: { status: "cancelled", userId: "user-abc" },
  },
} as const;
