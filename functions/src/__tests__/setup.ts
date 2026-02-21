/**
 * Cloud Function test setup helpers.
 * Uses firebase-functions-test v3 in offline mode — no emulator required.
 */

import { Change, DocumentSnapshot } from "firebase-admin/firestore";

/** Minimal snapshot shape used by onOrderUpdated tests */
export interface OrderSnapshotData {
  status: string;
  userId: string;
}

/**
 * Creates a minimal mock DocumentSnapshot-like object with data() method.
 * Compatible with the shape firebase-functions-test v3 expects.
 */
export function makeSnapshot(data: OrderSnapshotData): DocumentSnapshot {
  return {
    data: () => data,
    exists: true,
  } as unknown as DocumentSnapshot;
}

/**
 * Creates a Change<DocumentSnapshot> from plain before/after data objects,
 * matching the shape passed to onDocumentUpdated handlers.
 */
export function makeChange(
  before: OrderSnapshotData,
  after: OrderSnapshotData
): Change<DocumentSnapshot> {
  return {
    before: makeSnapshot(before),
    after: makeSnapshot(after),
  };
}
