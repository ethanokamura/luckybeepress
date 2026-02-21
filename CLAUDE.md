# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint checks

# Firebase Cloud Functions (from /functions directory)
npm run build        # Compile TypeScript
npm run build:watch  # Watch mode
npm run serve        # Build + start emulators (functions only)
npm run deploy       # Deploy to Firebase
```

## Architecture

This is a Next.js e-commerce platform (LuckyBeePress) using the App Router with Firebase backend and Stripe payments.

### Route Groups

- `app/(dashboard)/` — Authenticated user-facing routes: products, cart, checkout, orders, account
- `app/(admin)/` — Admin routes: customer management, order oversight
- `app/api/` — API routes: Stripe checkout/webhook, invoice generation

### Data & Service Layer

- `lib/firebase.ts` — Firebase client SDK initialization
- `lib/firebase-helpers.ts` — Firestore utility functions (CRUD helpers)
- `lib/stripe.ts` — Stripe client configuration
- `lib/algolia.ts` — Algolia search client
- `functions/src/` — Firebase Cloud Functions (server-side business logic for users, orders, carts, products, addresses, contact)

### Shared Types

All TypeScript types live in `types/`: `users.ts`, `products.ts`, `orders.ts`, `carts.ts`, `addresses.ts`, `contact.ts`, `queries.ts`, `base_types.ts`.

### Components

- `components/ui/` — shadcn/ui primitives (do not edit directly)
- `components/shared/` — App-level shared components
- `components/pdf/` — Invoice PDF rendering (`@react-pdf/renderer`)

### State & Data Flow

- React Context in `context/` for global state (auth, cart, etc.)
- Custom hooks in `hooks/` for data fetching and business logic
- Firestore is the primary database; Cloud Functions handle write-heavy or privileged operations
- Stripe webhooks (`app/api/stripe/webhook/`) update order state after payment

## Key Configuration

- `next.config.ts` — Image domains for CDN optimization
- `firebase.json` — Hosting and functions deployment targets
- `components.json` — shadcn/ui path aliases (`@/components/ui`)
- TypeScript strict mode is enabled
- ESLint uses flat config (`eslint.config.mjs`) with Next.js rules

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`
- `NEXT_PUBLIC_APP_URL`

## Active Technologies
- TypeScript (strict mode), Node.js 18 (Cloud Functions) + Next.js 14 App Router, Firebase Web SDK v10, Firebase Admin SDK, Firebase Functions v2, shadcn/ui (001-repeat-customer-min)
- Firestore (primary database) — `users` and `orders` collections (001-repeat-customer-min)

## Recent Changes
- 001-repeat-customer-min: Added TypeScript (strict mode), Node.js 18 (Cloud Functions) + Next.js 14 App Router, Firebase Web SDK v10, Firebase Admin SDK, Firebase Functions v2, shadcn/ui
