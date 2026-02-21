# Implementation Plan: Testing Suite

**Branch**: `002-testing-suite` | **Date**: 2026-02-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-testing-suite/spec.md`

## Summary

Install Vitest and write three focused test layers for the LuckyBeePress codebase: (1) unit tests for all pure utility functions in `lib/firebase-helpers.ts`, (2) API route tests for the three admin bulk-operation routes using mocked Firebase Admin + Algolia, and (3) Cloud Function tests for the `onOrderUpdated` repeat-customer trigger using `firebase-functions-test` in offline mode. No external services or environment variables required to run the suite.

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20
**Primary Dependencies**: Next.js 16 (App Router), Firebase Admin SDK v13, `algoliasearch` v5 (pure ESM), `firebase-functions` v7
**Storage**: Firestore (fully mocked in tests via `vi.mock`)
**Testing**: Vitest + `@vitest/coverage-v8`; `firebase-functions-test` v3 for Cloud Functions
**Target Platform**: Local dev + CI (no emulator, no live Firebase project)
**Project Type**: Web application (Next.js) with Firebase Cloud Functions
**Performance Goals**: Full test suite runs < 15 seconds
**Constraints**: Zero external network calls in tests; no `.env` required
**Scale/Scope**: ~5 test files, ~60–80 individual test cases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution template is not yet filled in for this project. No gates apply. Design follows established project patterns (Admin SDK, Algolia sync, TypeScript strict mode).

**Post-design re-check**: No violations introduced. Tests are additive only — no changes to application code, no new Firestore collections, no new API routes.

## Project Structure

### Documentation (this feature)

```text
specs/002-testing-suite/
├── plan.md              ← this file
├── spec.md              ← feature requirements
├── research.md          ← framework + strategy decisions
├── data-model.md        ← test fixtures and state machines
├── quickstart.md        ← setup and run instructions
├── contracts/
│   ├── utility-functions.md   ← input/output contracts for pure functions
│   └── api-routes.md          ← request/response + side-effect contracts
└── tasks.md             ← Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
vitest.config.ts                         ← new: Vitest configuration + path aliases

__tests__/
├── unit/
│   └── firebase-helpers.test.ts         ← new: pure utility function tests
└── api/
    ├── bulk.test.ts                     ← new: POST /api/admin/products/bulk
    ├── categories-create.test.ts        ← new: POST /api/admin/categories
    └── categories-id.test.ts            ← new: PATCH + DELETE /api/admin/categories/[id]

functions/src/
└── __tests__/
    └── order-triggers.test.ts           ← new: onOrderUpdated Cloud Function tests

package.json                             ← modified: add test/test:watch/test:coverage scripts
```

**Structure Decision**: Web application layout (Option 2 variant). Tests live at the root level alongside `app/` and `lib/`, separate from the Next.js routing tree to avoid router conflicts. Cloud Function tests live inside `functions/src/` since they import directly from that package.

## Complexity Tracking

No complexity violations. No new abstractions, patterns, or dependencies beyond Vitest (the minimum viable test framework for this ESM/TypeScript stack).
