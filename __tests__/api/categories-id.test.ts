import { vi, describe, it, expect, beforeEach } from "vitest";

// vi.hoisted ensures these are available when vi.mock() factories run
const { mockBatch, mockDb, mockAlgoliaInstance, makeFakeDocRef } = vi.hoisted(() => {
  const mockBatch = {
    update: vi.fn(),
    delete: vi.fn(),
    set: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined),
  };

  function makeFakeDocRef(overrides: {
    exists?: boolean;
    data?: () => Record<string, unknown>;
  } = {}) {
    const ref: Record<string, unknown> = {
      exists: overrides.exists ?? true,
      data: overrides.data ?? (() => ({ name: "Birthday", order: 0, supportsBoxSet: false })),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    const getResult = { ...ref };
    (ref as any).get = vi.fn().mockResolvedValue(getResult);
    return ref;
  }

  let catRef = makeFakeDocRef();

  const mockDb = {
    batch: vi.fn(() => mockBatch),
    collection: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: vi.fn(),
    count: vi.fn().mockReturnThis(),
    doc: vi.fn(() => catRef),
    update: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    _getCatRef: () => catRef,
    _setCatRef: (ref: ReturnType<typeof makeFakeDocRef>) => { catRef = ref; },
  };

  const mockAlgoliaInstance = {
    partialUpdateObject: vi.fn().mockResolvedValue(undefined),
    deleteObject: vi.fn().mockResolvedValue(undefined),
  };

  return { mockBatch, mockDb, mockAlgoliaInstance, makeFakeDocRef };
});

vi.mock("firebase-admin/app", () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  cert: vi.fn(),
}));

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: vi.fn(() => mockDb),
}));

vi.mock("algoliasearch", () => ({
  algoliasearch: vi.fn(() => mockAlgoliaInstance),
}));

vi.mock("@/lib/algolia", () => ({
  PRODUCTS_INDEX: "products",
}));

// Import routes after mocks
import { PATCH, DELETE } from "@/app/api/admin/categories/[id]/route";
import { NextRequest } from "next/server";

function makePatchRequest(id: string, body: unknown): NextRequest {
  return new NextRequest(`http://localhost/api/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function makeDeleteRequest(id: string, reassignTo?: string): NextRequest {
  const url = reassignTo
    ? `http://localhost/api/admin/categories/${id}?reassignTo=${reassignTo}`
    : `http://localhost/api/admin/categories/${id}`;
  return new NextRequest(url, { method: "DELETE" });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Reset catRef to a fresh default
  const ref = makeFakeDocRef();
  (mockDb as any)._setCatRef(ref);
  mockDb.doc.mockImplementation(() => (mockDb as any)._getCatRef());
  mockBatch.commit.mockResolvedValue(undefined);
  mockAlgoliaInstance.partialUpdateObject.mockResolvedValue(undefined);
  mockAlgoliaInstance.deleteObject.mockResolvedValue(undefined);
  delete process.env.ALGOLIA_ADMIN_API_KEY;
});

// ============================================================
// PATCH — not found
// ============================================================

describe("PATCH /api/admin/categories/[id] — not found", () => {
  it("returns 404 when category does not exist", async () => {
    const ref = makeFakeDocRef({ exists: false });
    (mockDb as any)._setCatRef(ref);
    mockDb.doc.mockImplementation(() => ref);

    const res = await PATCH(makePatchRequest("missing-id", { name: "New Name" }), makeParams("missing-id"));
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Category not found");
  });
});

// ============================================================
// PATCH — duplicate name
// ============================================================

describe("PATCH /api/admin/categories/[id] — duplicate name", () => {
  it("returns 409 when new name already exists on a different document", async () => {
    const ref = makeFakeDocRef({
      data: () => ({ name: "Birthday", order: 0, supportsBoxSet: false }),
    });
    (mockDb as any)._setCatRef(ref);
    mockDb.doc.mockImplementation(() => ref);

    // Duplicate name check: returns non-empty snapshot
    mockDb.get.mockResolvedValueOnce({ empty: false, docs: [{ id: "other-cat" }] });

    const res = await PATCH(makePatchRequest("cat-1", { name: "Thank You" }), makeParams("cat-1"));
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("A category with that name already exists");
  });
});

// ============================================================
// PATCH — name change (cascade)
// ============================================================

describe("PATCH /api/admin/categories/[id] — name change", () => {
  it("returns 200, cascades batch.update to products, calls Algolia partialUpdateObject", async () => {
    process.env.ALGOLIA_ADMIN_API_KEY = "test-key";
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app";

    const ref = makeFakeDocRef({
      data: () => ({ name: "Birthday", order: 0, supportsBoxSet: false }),
    });
    (mockDb as any)._setCatRef(ref);
    mockDb.doc.mockImplementation(() => ref);

    // Duplicate name check: empty (new name not taken)
    mockDb.get.mockResolvedValueOnce({ empty: true, docs: [] });
    // Product query: 2 products with old category name
    mockDb.get.mockResolvedValueOnce({
      docs: [{ id: "p1" }, { id: "p2" }],
    });

    const res = await PATCH(makePatchRequest("cat-1", { name: "Renamed" }), makeParams("cat-1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockBatch.update).toHaveBeenCalledTimes(2);
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
    expect(mockAlgoliaInstance.partialUpdateObject).toHaveBeenCalledTimes(2);
  });
});

// ============================================================
// PATCH — order-only update (no cascade)
// ============================================================

describe("PATCH /api/admin/categories/[id] — order-only update", () => {
  it("returns 200, does NOT call batch.update or Algolia", async () => {
    const ref = makeFakeDocRef({
      data: () => ({ name: "Birthday", order: 0, supportsBoxSet: false }),
    });
    (mockDb as any)._setCatRef(ref);
    mockDb.doc.mockImplementation(() => ref);

    const res = await PATCH(makePatchRequest("cat-1", { order: 5 }), makeParams("cat-1"));
    expect(res.status).toBe(200);
    expect(mockBatch.update).not.toHaveBeenCalled();
    expect(mockAlgoliaInstance.partialUpdateObject).not.toHaveBeenCalled();
  });
});

// ============================================================
// PATCH — supportsBoxSet-only update
// ============================================================

describe("PATCH /api/admin/categories/[id] — supportsBoxSet-only update", () => {
  it("returns 200, no cascade, no Algolia", async () => {
    const ref = makeFakeDocRef({
      data: () => ({ name: "Birthday", order: 0, supportsBoxSet: false }),
    });
    (mockDb as any)._setCatRef(ref);
    mockDb.doc.mockImplementation(() => ref);

    const res = await PATCH(makePatchRequest("cat-1", { supportsBoxSet: true }), makeParams("cat-1"));
    expect(res.status).toBe(200);
    expect(mockBatch.update).not.toHaveBeenCalled();
    expect(mockAlgoliaInstance.partialUpdateObject).not.toHaveBeenCalled();
  });
});

// ============================================================
// DELETE — not found
// ============================================================

describe("DELETE /api/admin/categories/[id] — not found", () => {
  it("returns 404 when category does not exist", async () => {
    const ref = makeFakeDocRef({ exists: false });
    (mockDb as any)._setCatRef(ref);
    mockDb.doc.mockImplementation(() => ref);

    const res = await DELETE(makeDeleteRequest("missing-id"), makeParams("missing-id"));
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Category not found");
  });
});

// ============================================================
// DELETE — products assigned, no reassignTo
// ============================================================

describe("DELETE /api/admin/categories/[id] — products assigned without reassignTo", () => {
  it("returns 409 with error and count", async () => {
    const ref = makeFakeDocRef({
      data: () => ({ name: "Birthday", order: 0, supportsBoxSet: false }),
    });
    (mockDb as any)._setCatRef(ref);
    mockDb.doc.mockImplementation(() => ref);

    // Products query: 3 products assigned
    mockDb.get.mockResolvedValueOnce({
      docs: [{ id: "p1" }, { id: "p2" }, { id: "p3" }],
    });

    const res = await DELETE(makeDeleteRequest("cat-1"), makeParams("cat-1"));
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("Category has products");
    expect(data.count).toBe(3);
  });
});

// ============================================================
// DELETE — products + valid reassignTo
// ============================================================

describe("DELETE /api/admin/categories/[id] — products with valid reassignTo", () => {
  it("returns 200, batch.update called per product, Algolia synced, category deleted", async () => {
    process.env.ALGOLIA_ADMIN_API_KEY = "test-key";
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app";

    // Source category ref
    const sourceRef = makeFakeDocRef({
      data: () => ({ name: "Birthday", order: 0, supportsBoxSet: false }),
    });
    // Target category ref
    const targetRef = makeFakeDocRef({
      data: () => ({ name: "Thank You", order: 1, supportsBoxSet: true }),
    });

    let callCount = 0;
    mockDb.doc.mockImplementation(() => {
      callCount++;
      // First call is for source category; subsequent calls for target + product refs
      return callCount === 1 ? sourceRef : targetRef;
    });

    // Products query: 2 products
    mockDb.get.mockResolvedValueOnce({ docs: [{ id: "p1" }, { id: "p2" }] });

    const res = await DELETE(makeDeleteRequest("cat-1", "cat-2"), makeParams("cat-1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reassigned).toBe(2);
    expect(mockBatch.update).toHaveBeenCalledTimes(2);
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
    expect(mockAlgoliaInstance.partialUpdateObject).toHaveBeenCalledTimes(2);
    expect(sourceRef.delete).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// DELETE — no products
// ============================================================

describe("DELETE /api/admin/categories/[id] — no products", () => {
  it("returns 200 with reassigned=0, category doc deleted, no batch", async () => {
    const ref = makeFakeDocRef({
      data: () => ({ name: "Empty Cat", order: 5, supportsBoxSet: false }),
    });
    (mockDb as any)._setCatRef(ref);
    mockDb.doc.mockImplementation(() => ref);

    // Products query: empty
    mockDb.get.mockResolvedValueOnce({ docs: [] });

    const res = await DELETE(makeDeleteRequest("cat-1"), makeParams("cat-1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reassigned).toBe(0);
    expect(mockBatch.update).not.toHaveBeenCalled();
    expect(ref.delete).toHaveBeenCalledTimes(1);
  });
});
