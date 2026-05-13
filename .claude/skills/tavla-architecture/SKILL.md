---
name: tavla-architecture
description: >
  Provides architectural context about the Tavla product — a Norwegian public transit departure board system.
  Use this skill whenever working on Tavla code, discussing Tavla repositories, debugging Tavla issues, or
  planning features for either the admin application or the departure board displays. Trigger on any mention
  of "tavla", "tavla-admin", "tavla-visning", departure boards, or when navigating either of the two Tavla
  repositories. Also trigger when questions arise about the Firebase setup, Firestore collections, Firebase
  Functions, or backend infrastructure used by the product.
---

# Tavla Architecture

Tavla is a Norwegian public transit departure board system. It consists of two separate repositories and runs
on Google Cloud infrastructure. The boards powered by this system are displayed throughout Norway.

---

## Repositories Overview

### 1. `tavla` — Backend, Admin Frontend & Firebase

This is the main monorepo. It contains:

| Path | Contents |
|------|----------|
| `/tavla/` | The **tavla-admin** frontend application — the admin UI for managing boards |
| `/tavla/firebaseFunctions/` | Firebase Cloud Functions (backend logic, triggers, API endpoints) |
| `/tavla/migrations/` | Database migration scripts (Firestore schema changes, data migrations) |
| `/backend/` | Backend services and infrastructure code |

**Tech stack**: Next.js + React. Hosted at `tavla.entur.no` (prod) and `tavla.dev.entur.no` (dev).

tavla-admin reads from and writes to Firestore directly via the Firebase SDK, and uses Firebase Auth for user identity.

**Firebase Functions**: To understand what a function does, read its source file in `/tavla/firebaseFunctions/`. **Never deploy Firebase Functions on the user's behalf** — always instruct the user to run Firebase CLI deployment commands themselves.

### 2. `tavla-visning` — Departure Board Display Frontend

This is the repository for the frontend application that runs **on the departure board screens** themselves.

**Tech stack**: Vite + React. Hosted at `vis-tavla.entur.no`.

**Routing**: A board is identified by its board ID or a custom URL slug in the path:
```
vis-tavla.entur.no/<board-id-or-custom-slug>
```
Server-side routing and actions resolve the board from Firestore. Transit departure data is then fetched directly from **Entur's open public APIs** (see the Entur API skill for details). There is no Firebase Auth in tavla-visning — it is a fully public display application.

Key characteristics:
- **Critical infrastructure**: These boards run in public spaces throughout Norway. Downtime or breakage has real-world impact on passengers.
- **Legacy browser support**: The app intentionally supports older browsers and older JavaScript versions. Do NOT introduce modern JS syntax or browser APIs without verifying compatibility. Avoid ES2020+ features, optional chaining (`?.`), nullish coalescing (`??`), and similar unless already established in the codebase.
- **Runs on embedded/kiosk hardware**: The runtime environment may be resource-constrained and cannot be easily updated.

---

## Infrastructure & Backend

- **Cloud provider**: Google Cloud Platform (GCP)
- **Authentication**: Firebase Auth (tavla-admin only — tavla-visning is fully public)
- **Database**: Cloud Firestore — flat document-oriented NoSQL (no subcollections anywhere)
- **Serverless logic**: Firebase Cloud Functions (located in `/tavla/firebaseFunctions/`)
- **Hosting**: Firebase Hosting / GCP

---

## Firestore Collections

The data model is **flat** — no subcollections exist. Each top-level collection contains only documents.

| Collection | Description |
|------------|-------------|
| `boards` | One document per board. TypeScript type: `BoardDB`. Contains all board configuration. |
| `config` | Singleton collection. Only one document: `env`, which holds a storage bucket reference. Rarely needs changing. |
| `folders` | One document per folder. Fields: `boardIds` (array of board IDs), `logoUrl` (from upload functionality), `name` (string), `owners` (array of user IDs). |
| `users` | Managed by Firebase Auth. Documents either have no fields, or a single field `owner` — an array of board IDs that the user owns and has access to. |

There are **no admin or superuser roles** — authorization is purely user → owned boards/folders.

---

## Package Managers & Local Development

### `tavla` repo — uses **Yarn**
```bash
yarn install         # install dependencies
yarn dev:persist     # run with Firebase emulators (local development)
```

### `tavla-visning` repo — uses **pnpm**
```bash
pnpm install         # install dependencies
pnpm run dev         # run local dev server
```

> See each repo's README for the full set of available commands.

**Never suggest `npm` or `npx` in `tavla`** — it uses Yarn. **Never suggest `yarn` or `npm` in `tavla-visning`** — it uses pnpm.

---

## Deployment Environments

| Environment | URL | Notes |
|-------------|-----|-------|
| `local` | localhost | Local development only, uses Firebase emulators |
| `dev` | tavla.dev.entur.no / vis-tavla.dev.entur.no | Staging — always called "dev", never "staging" |
| `prod` | tavla.entur.no / vis-tavla.entur.no | Production |

**Important**: The staging environment is always called **dev** internally — never "staging".

---

## Key Notes for Development

1. **Two repos, one product**: Display changes → `tavla-visning`. Everything else (admin, functions, backend) → `tavla`.

2. **`tavla-visning` is safety-critical**: Be conservative with dependencies, syntax, and breaking changes. Always verify browser compatibility before using new APIs or syntax.

3. **tavla-visning has no auth**: It is a public display app — do not add authentication or session logic there.

4. **Firebase Functions**: Read the source to understand them. Never run deployment CLI commands — let the user do that.

5. **Firestore is the source of truth**: All board configs, user permissions, and settings live in Firestore. Schema changes go through `/tavla/migrations/`.

6. **Transit data comes from Entur APIs**: tavla-visning fetches live departure data from Entur's open APIs — not from Firestore or Firebase Functions. See the Entur API skill for details.
