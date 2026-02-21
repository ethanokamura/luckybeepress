import { vi } from "vitest";

/**
 * Returns fresh vi.fn() stubs for Firebase Admin Firestore.
 * Call this inside beforeEach to reset state between tests.
 *
 * Usage in each test file:
 *
 * ```ts
 * // --- MOCK DECLARATIONS (before any route import) ---
 * vi.mock("firebase-admin/app", () => ({
 *   initializeApp: vi.fn(),
 *   getApps: vi.fn(() => []),
 *   cert: vi.fn(),
 * }));
 *
 * const { mockBatch, mockDb, mockAlgolia } = createFirebaseAdminMocks();
 *
 * vi.mock("firebase-admin/firestore", () => ({
 *   getFirestore: vi.fn(() => mockDb),
 * }));
 *
 * vi.mock("algoliasearch", () => ({
 *   algoliasearch: vi.fn(() => mockAlgolia),
 * }));
 * ```
 */

export interface MockBatch {
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  commit: ReturnType<typeof vi.fn>;
}

export interface MockDb {
  batch: ReturnType<typeof vi.fn>;
  collection: ReturnType<typeof vi.fn>;
  doc: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

export interface MockAlgolia {
  partialUpdateObject: ReturnType<typeof vi.fn>;
  deleteObject: ReturnType<typeof vi.fn>;
}

export interface FirebaseAdminMocks {
  mockBatch: MockBatch;
  mockDb: MockDb;
  mockAlgolia: MockAlgolia;
}

export function createFirebaseAdminMocks(): FirebaseAdminMocks {
  const mockBatch: MockBatch = {
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
  } as unknown as MockDb;

  const mockAlgolia: MockAlgolia = {
    partialUpdateObject: vi.fn().mockResolvedValue(undefined),
    deleteObject: vi.fn().mockResolvedValue(undefined),
  };

  return { mockBatch, mockDb, mockAlgolia };
}
