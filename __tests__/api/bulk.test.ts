import { vi, describe, it, expect, beforeEach } from "vitest";

// vi.hoisted ensures these are available when vi.mock() factories run
const { mockBatch, mockDb, mockAlgoliaInstance } = vi.hoisted(() => {
  const mockBatch = {
    update: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined),
  };

  const mockDb = {
    batch: vi.fn(() => mockBatch),
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: vi.fn(),
    count: vi.fn().mockReturnThis(),
    update: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  };

  const mockAlgoliaInstance = {
    partialUpdateObject: vi.fn().mockResolvedValue(undefined),
    deleteObject: vi.fn().mockResolvedValue(undefined),
  };

  return { mockBatch, mockDb, mockAlgoliaInstance };
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

// Import route after mocks
import { POST } from "@/app/api/admin/products/bulk/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/admin/products/bulk", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockBatch.commit.mockResolvedValue(undefined);
  mockAlgoliaInstance.partialUpdateObject.mockResolvedValue(undefined);
  mockAlgoliaInstance.deleteObject.mockResolvedValue(undefined);
  delete process.env.ALGOLIA_ADMIN_API_KEY;
});

// ============================================================
// Validation — 400 errors
// ============================================================

describe("POST /api/admin/products/bulk — validation", () => {
  it("returns 400 when productIds is empty", async () => {
    const res = await POST(makeRequest({ action: "status", productIds: [] }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("No product IDs provided");
  });

  it("returns 400 when productIds exceeds 2000", async () => {
    const ids = Array.from({ length: 2001 }, (_, i) => `prod-${i}`);
    const res = await POST(makeRequest({ action: "status", productIds: ids }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Cannot process more than 2000 products at once");
  });

  it("returns 400 for invalid action", async () => {
    const res = await POST(makeRequest({ action: "invalid", productIds: ["p1"] }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid action");
  });

  it("returns 400 when action=status but status is missing", async () => {
    const res = await POST(makeRequest({ action: "status", productIds: ["p1"] }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid or missing status value");
  });

  it("returns 400 when action=status but status is unknown", async () => {
    const res = await POST(makeRequest({ action: "status", productIds: ["p1"], status: "unknown" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid or missing status value");
  });

  it("returns 400 when action=category but category is missing", async () => {
    const res = await POST(makeRequest({ action: "category", productIds: ["p1"] }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing category value");
  });
});

// ============================================================
// Success — status update
// ============================================================

describe("POST /api/admin/products/bulk — status update", () => {
  it("returns 200 and calls batch.update 3×, batch.commit 1× for 3 products", async () => {
    const productIds = ["p1", "p2", "p3"];
    const res = await POST(makeRequest({ action: "status", productIds, status: "active" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ success: true, processed: 3 });
    expect(mockBatch.update).toHaveBeenCalledTimes(3);
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// Success — delete
// ============================================================

describe("POST /api/admin/products/bulk — delete", () => {
  it("returns 200 and calls batch.delete 3×, batch.commit 1× for 3 products", async () => {
    const productIds = ["p1", "p2", "p3"];
    const res = await POST(makeRequest({ action: "delete", productIds }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ success: true, processed: 3 });
    expect(mockBatch.delete).toHaveBeenCalledTimes(3);
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// Algolia sync
// ============================================================

describe("POST /api/admin/products/bulk — Algolia sync", () => {
  it("skips Algolia when ALGOLIA_ADMIN_API_KEY is absent", async () => {
    const res = await POST(makeRequest({ action: "status", productIds: ["p1"], status: "active" }));
    expect(res.status).toBe(200);
    expect(mockAlgoliaInstance.partialUpdateObject).not.toHaveBeenCalled();
  });

  it("calls partialUpdateObject for status update when key is set", async () => {
    process.env.ALGOLIA_ADMIN_API_KEY = "test-key";
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app";
    const productIds = ["p1", "p2"];
    const res = await POST(makeRequest({ action: "status", productIds, status: "active" }));
    expect(res.status).toBe(200);
    expect(mockAlgoliaInstance.partialUpdateObject).toHaveBeenCalledTimes(2);
  });

  it("calls deleteObject for delete when key is set", async () => {
    process.env.ALGOLIA_ADMIN_API_KEY = "test-key";
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app";
    const productIds = ["p1", "p2", "p3"];
    const res = await POST(makeRequest({ action: "delete", productIds }));
    expect(res.status).toBe(200);
    expect(mockAlgoliaInstance.deleteObject).toHaveBeenCalledTimes(3);
  });
});

// ============================================================
// Chunk boundary
// ============================================================

describe("POST /api/admin/products/bulk — chunking", () => {
  it("calls batch.commit 2× for 401 products (ceiling of 401/400)", async () => {
    const productIds = Array.from({ length: 401 }, (_, i) => `prod-${i}`);
    const res = await POST(makeRequest({ action: "status", productIds, status: "draft" }));
    expect(res.status).toBe(200);
    expect(mockBatch.commit).toHaveBeenCalledTimes(2);
  });
});
