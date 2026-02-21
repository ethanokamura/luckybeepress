import { vi, describe, it, expect, beforeEach } from "vitest";

// vi.hoisted ensures these are available when vi.mock() factories run
const { mockBatch, mockDb } = vi.hoisted(() => {
  const mockBatch = {
    update: vi.fn(),
    delete: vi.fn(),
    set: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined),
  };

  function makeFakeDocRef(id = "new-cat-id") {
    return { id, set: vi.fn().mockResolvedValue(undefined) };
  }

  const mockDb = {
    batch: vi.fn(() => mockBatch),
    collection: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: vi.fn(),
    count: vi.fn().mockReturnThis(),
    doc: vi.fn(() => makeFakeDocRef()),
    update: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    _makeFakeDocRef: makeFakeDocRef,
  };

  return { mockBatch, mockDb };
});

vi.mock("firebase-admin/app", () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  cert: vi.fn(),
}));

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: vi.fn(() => mockDb),
}));

// Import route after mocks
import { POST } from "@/app/api/admin/categories/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockBatch.commit.mockResolvedValue(undefined);
  mockDb.doc.mockImplementation(() => (mockDb as any)._makeFakeDocRef());
});

// ============================================================
// Seed
// ============================================================

describe("POST /api/admin/categories — seed", () => {
  it("returns 200 and seeds 21 categories when collection is empty", async () => {
    // count().get() returns count = 0
    mockDb.get.mockResolvedValueOnce({ data: () => ({ count: 0 }) });

    const res = await POST(makeRequest({ seed: true }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ success: true, seeded: 21 });
    expect(mockBatch.set).toHaveBeenCalledTimes(21);
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
  });

  it("returns 409 when categories already exist", async () => {
    // count().get() returns count = 5
    mockDb.get.mockResolvedValueOnce({ data: () => ({ count: 5 }) });

    const res = await POST(makeRequest({ seed: true }));
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toMatch(/already exist/i);
  });
});

// ============================================================
// Create single category — validation
// ============================================================

describe("POST /api/admin/categories — validation", () => {
  it("returns 400 for empty name", async () => {
    const res = await POST(makeRequest({ name: "" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Name is required");
  });

  it("returns 400 for whitespace-only name", async () => {
    const res = await POST(makeRequest({ name: "   " }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Name is required");
  });

  it("returns 409 for duplicate name", async () => {
    // where().limit().get() returns non-empty snapshot (duplicate check)
    mockDb.get.mockResolvedValueOnce({ empty: false, docs: [{ id: "existing" }] });

    const res = await POST(makeRequest({ name: "Birthday" }));
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("A category with that name already exists");
  });
});

// ============================================================
// Create single category — success
// ============================================================

describe("POST /api/admin/categories — create", () => {
  it("returns 200 with success and id for valid new category", async () => {
    // Duplicate check: empty snapshot
    mockDb.get.mockResolvedValueOnce({ empty: true, docs: [] });
    // Order query: empty snapshot → order = 0
    mockDb.get.mockResolvedValueOnce({ empty: true, docs: [] });

    const res = await POST(makeRequest({ name: "New Cat" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(typeof data.id).toBe("string");
  });

  it("auto-assigns order = max existing order + 1 when order is omitted", async () => {
    // Duplicate check: empty
    mockDb.get.mockResolvedValueOnce({ empty: true, docs: [] });
    // Order query: one existing category with order = 5
    mockDb.get.mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => ({ order: 5 }) }],
    });

    const res = await POST(makeRequest({ name: "New Cat" }));
    expect(res.status).toBe(200);
    // The route should have used order = 6
    const fakeRef = mockDb.doc.mock.results[mockDb.doc.mock.results.length - 1].value;
    expect(fakeRef.set).toHaveBeenCalledWith(
      expect.objectContaining({ order: 6 })
    );
  });
});
