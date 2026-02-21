# Research: Testing Suite

**Branch**: `002-testing-suite` | **Date**: 2026-02-21 | **Phase**: 0

## Summary

All unknowns resolved via direct codebase inspection and ecosystem analysis. No current testing infrastructure exists — full greenfield setup.

---

## Decision 1: Test Framework — Vitest over Jest

**Question**: Which test framework to use for a Next.js 16 + TypeScript + ESM project?

**Decision**: **Vitest** (`vitest`, `@vitest/coverage-v8`)

**Rationale**:
- `algoliasearch` v5 (installed) is a pure ESM package. Jest requires complex transform config to handle ESM; Vitest handles it natively via esbuild.
- `firebase-admin` v13 also ships ESM. The Jest + `ts-jest` + ESM combination requires `experimentalVmModules` and fragile config.
- Vitest's `vi.mock()` API is compatible with Jest's `jest.mock()` — minimal cognitive overhead for developers familiar with Jest.
- Vitest workspace support allows running both root-level tests and `functions/` tests in a single `npm test` invocation.
- TypeScript is supported with zero config via built-in esbuild transform.

**Alternatives considered**:
- **Jest + ts-jest**: More established, but ESM support is still experimental and requires additional flags. The `algoliasearch` v5 ESM-only package would require manual transform exclusion patterns.
- **Jest + Babel**: Too much config, loses TypeScript strict-mode type checking at test time.

---

## Decision 2: Cloud Function Test Strategy — firebase-functions-test in Offline Mode

**Question**: How to test `onOrderUpdated`, `onUserCreated`, and `onOrderCreated` without a live Firebase project?

**Decision**: Use `firebase-functions-test` v3 (already installed at `functions/devDependencies`) in **offline mode** — `initializeApp()` called with no arguments.

**Rationale**:
- Offline mode mocks all Firestore reads/writes via the test SDK's stub system. No emulator required.
- `firebase-functions-test` wraps the function handlers in a way that correctly simulates Firestore change events (`before`/`after` snapshots).
- Already installed (`functions/devDependencies` has `firebase-functions-test: ^3.2.0`).
- The critical `onOrderUpdated` logic reads `before.data().status` and `after.data().status` — these are cleanly expressible as test stubs.

**Alternatives considered**:
- **Firebase Emulator Suite**: More realistic but requires a running emulator process and Firebase project setup — violates FR-001 (must run with no env vars).
- **Manual mock of `firebase-admin`**: Possible but more error-prone than the official test SDK.

---

## Decision 3: API Route Test Strategy — Direct Handler Import with vi.mock

**Question**: How to test Next.js App Router route handlers (`route.ts` files) that call Firebase Admin at module level?

**Decision**: Import the `POST`/`PATCH`/`DELETE` exports directly and mock `firebase-admin/app`, `firebase-admin/firestore`, and `algoliasearch` at the module level using `vi.mock()`.

**Rationale**:
- Route handlers are standard async functions (`(req, context) => Response`). They can be called directly without a running Next.js server.
- The `NextRequest` class can be constructed directly: `new NextRequest('http://test', { method: 'POST', body: JSON.stringify({...}) })`.
- Firebase Admin is initialized at the module's top level (`if (!getApps().length) initializeApp(...)`). Mocking the `firebase-admin/app` module with `vi.mock` before the module loads prevents real initialization.
- Firestore batch writes and queries are the primary side effects — mocking `getFirestore()` to return a chainable mock covers all code paths.

**Alternatives considered**:
- **MSW (Mock Service Worker)**: Intercepts HTTP calls, but our routes make direct Firebase Admin SDK calls (not HTTP) — MSW wouldn't intercept them.
- **Supertest + test server**: Requires starting a Next.js server process — slow and complex.
- **Integration tests against Firebase Emulator**: Valid long-term but violates the no-env-var requirement for the initial suite.

---

## Decision 4: Coverage Targets

**Question**: What coverage targets are appropriate for the initial suite?

**Decision**: No hard coverage gate in CI for now. Target: **all exported functions in `lib/firebase-helpers.ts`** (100% line coverage on that file) + **all validation branches in the 3 admin API routes**.

**Rationale**:
- The codebase is starting from 0% coverage. A hard 80% gate would be discouraging and would require mocking deeply complex components (Stripe webhooks, PDF renderer) that are out of scope for this initial effort.
- Targeting the highest-value, most-stable code first (pure functions + business logic validation) gives the most regression protection for the least mock complexity.

**Alternatives considered**:
- **80% coverage gate**: Too aggressive for a greenfield setup with complex mocking needs.
- **No coverage tracking at all**: Misses the opportunity to identify untested paths.

---

## Decision 5: Test File Location

**Question**: Where should test files live?

**Decision**:
- `__tests__/unit/` — pure utility function tests
- `__tests__/api/` — API route tests
- `functions/src/__tests__/` — Cloud Function tests (run via Vitest workspace)

**Rationale**:
- Separating unit and API tests allows `--reporter=verbose` to print clearly organized sections.
- Cloud Function tests live in the `functions/` tree because they use `firebase-functions-test` and import from `functions/src/` directly.
- Keeping tests out of `src/` directories avoids conflicts with Next.js file-based routing (a `route.test.ts` in `app/` would confuse the router).

---

## Resolved Unknowns

| Unknown | Resolution |
|---------|------------|
| ESM compatibility with `algoliasearch` v5 | Vitest handles it natively |
| Firebase Admin module-level init in route files | `vi.mock('firebase-admin/app')` + `vi.mock('firebase-admin/firestore')` before import |
| Cloud Function testing without emulator | `firebase-functions-test` offline mode |
| Next.js API route testing without server | Direct handler import + `new NextRequest(...)` |
| Unified test command for root + functions | Vitest workspace (`vitest.workspace.ts`) |
