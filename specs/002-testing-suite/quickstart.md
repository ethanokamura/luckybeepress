# Quickstart: Testing Suite

**Branch**: `002-testing-suite`

## Install

```bash
# From repo root
npm install --save-dev vitest @vitest/coverage-v8

# No additional env vars needed — all external services are mocked
```

## Run Tests

```bash
# Run all tests
npm test

# Watch mode (development)
npm run test:watch

# Coverage report
npm run test:coverage
```

## Project Structure

```
luckybeepress/
├── vitest.config.ts                # Vitest config (resolve aliases, env)
├── __tests__/
│   ├── unit/
│   │   └── firebase-helpers.test.ts   # Pure utility function tests
│   └── api/
│       ├── bulk.test.ts               # POST /api/admin/products/bulk
│       ├── categories-create.test.ts  # POST /api/admin/categories
│       └── categories-id.test.ts      # PATCH + DELETE /api/admin/categories/[id]
└── functions/
    └── src/
        └── __tests__/
            └── order-triggers.test.ts # onOrderUpdated Cloud Function tests
```

## Key Files

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Path aliases (`@/` → project root), test environment, global setup |
| `__tests__/unit/firebase-helpers.test.ts` | Tests all exported pure functions |
| `__tests__/api/bulk.test.ts` | Mocks Firebase Admin, tests bulk route validation + side effects |
| `__tests__/api/categories-create.test.ts` | Mocks Firebase Admin, tests category create + seed |
| `__tests__/api/categories-id.test.ts` | Mocks Firebase Admin + Algolia, tests rename cascade + delete reassign |
| `functions/src/__tests__/order-triggers.test.ts` | Uses `firebase-functions-test` offline mode |

## Mock Pattern

Every API test file uses the same mock setup for Firebase Admin:

```typescript
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock firebase-admin modules BEFORE importing the route
vi.mock("firebase-admin/app", () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  cert: vi.fn(),
}));

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
vi.mock("firebase-admin/firestore", () => ({
  getFirestore: vi.fn(() => mockDb),
}));

// Then import the route handler
import { POST } from "@/app/api/admin/products/bulk/route";
```

## Running Only One Suite

```bash
# Only utility function tests
npx vitest __tests__/unit

# Only API tests
npx vitest __tests__/api

# Only Cloud Function tests
npx vitest functions/src/__tests__
```
