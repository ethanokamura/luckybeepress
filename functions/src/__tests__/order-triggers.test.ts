import { vi, describe, it, expect, beforeEach } from "vitest";

// vi.hoisted ensures these are available when vi.mock() factories run
const { mockUserUpdate, mockOrdersGet, mockDb } = vi.hoisted(() => {
  const mockUserUpdate = vi.fn().mockResolvedValue(undefined);
  const mockOrdersGet = vi.fn().mockResolvedValue({ empty: true, size: 0, docs: [] });

  const mockDb = {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    get: mockOrdersGet,
    update: mockUserUpdate,
  };

  return { mockUserUpdate, mockOrdersGet, mockDb };
});

vi.mock("firebase-admin", () => {
  const FieldValue = { serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP") };
  const firestoreFn = vi.fn(() => mockDb);
  (firestoreFn as any).FieldValue = FieldValue;

  return {
    default: {
      initializeApp: vi.fn(),
      firestore: firestoreFn,
    },
    initializeApp: vi.fn(),
    firestore: firestoreFn,
  };
});

vi.mock("firebase-functions/v2/firestore", () => ({
  onDocumentUpdated: vi.fn((_path: string, handler: Function) => handler),
  onDocumentCreated: vi.fn((_path: string, handler: Function) => handler),
}));

vi.mock("firebase-functions/v2", () => ({
  setGlobalOptions: vi.fn(),
}));

vi.mock("firebase-functions/logger", () => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
}));

import { makeChange } from "./setup";
import { ORDER_FIXTURES } from "../../../__tests__/helpers/fixtures";
import { onOrderUpdated } from "../index";

/** Build the event shape that the Cloud Function handler receives */
function makeEvent(
  before: { status: string; userId: string },
  after: { status: string; userId: string },
  orderId = "order-123"
) {
  const change = makeChange(before, after);
  return {
    data: {
      before: change.before,
      after: change.after,
    },
    params: { orderId },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUserUpdate.mockResolvedValue(undefined);
  mockOrdersGet.mockResolvedValue({ empty: true, size: 0, docs: [] });
});

// ============================================================
// pending → delivered: grants isRepeatCustomer
// ============================================================

describe("onOrderUpdated — pending → delivered", () => {
  it("sets isRepeatCustomer = true on the user document", async () => {
    const fixture = ORDER_FIXTURES.pendingToDelivered;
    const event = makeEvent({ ...fixture.before }, { ...fixture.after });

    await (onOrderUpdated as unknown as Function)(event);

    expect(mockUserUpdate).toHaveBeenCalledOnce();
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ isRepeatCustomer: true })
    );
  });
});

// ============================================================
// delivered → refunded, no other delivered orders: revokes isRepeatCustomer
// ============================================================

describe("onOrderUpdated — delivered → refunded (no remaining delivered orders)", () => {
  it("sets isRepeatCustomer = false when no other delivered orders exist", async () => {
    const fixture = ORDER_FIXTURES.deliveredToRefunded;
    mockOrdersGet.mockResolvedValueOnce({ empty: true, size: 0, docs: [] });

    const event = makeEvent({ ...fixture.before }, { ...fixture.after });
    await (onOrderUpdated as unknown as Function)(event);

    expect(mockUserUpdate).toHaveBeenCalledOnce();
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ isRepeatCustomer: false })
    );
  });
});

// ============================================================
// delivered → refunded, other delivered orders remain: no write
// ============================================================

describe("onOrderUpdated — delivered → refunded (other delivered orders remain)", () => {
  it("does NOT update the user document when another delivered order exists", async () => {
    const fixture = ORDER_FIXTURES.deliveredToRefundedRetains;
    mockOrdersGet.mockResolvedValueOnce({
      empty: false,
      size: 1,
      docs: [{ id: "other-order" }],
    });

    const event = makeEvent({ ...fixture.before }, { ...fixture.after });
    await (onOrderUpdated as unknown as Function)(event);

    expect(mockUserUpdate).not.toHaveBeenCalled();
  });
});

// ============================================================
// pending → shipped: no write
// ============================================================

describe("onOrderUpdated — pending → shipped", () => {
  it("does NOT write to Firestore (exits early)", async () => {
    const fixture = ORDER_FIXTURES.pendingToShipped;
    const event = makeEvent({ ...fixture.before }, { ...fixture.after });

    await (onOrderUpdated as unknown as Function)(event);

    expect(mockUserUpdate).not.toHaveBeenCalled();
    expect(mockOrdersGet).not.toHaveBeenCalled();
  });
});

// ============================================================
// pending → cancelled: no write
// ============================================================

describe("onOrderUpdated — pending → cancelled", () => {
  it("does NOT write to Firestore (exits early)", async () => {
    const fixture = ORDER_FIXTURES.pendingToCancelled;
    const event = makeEvent({ ...fixture.before }, { ...fixture.after });

    await (onOrderUpdated as unknown as Function)(event);

    expect(mockUserUpdate).not.toHaveBeenCalled();
    expect(mockOrdersGet).not.toHaveBeenCalled();
  });
});
