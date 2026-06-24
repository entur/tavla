# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Keeping this file up to date

This file is only useful while it matches reality. When a change you make would make a statement here stale, update CLAUDE.md in the **same** change — don't leave it for later. Watch especially for:

- **Versions / tooling** — framework or language versions, package manager, lint/format tooling (`Repository Structure`, `Key Patterns`).
- **Commands / scripts** — added, renamed, or removed `package.json` scripts, shell scripts, or `./migration` usage (`Frontend Commands`, `Backend Commands`, `Migrations`).
- **Paths** — moved or renamed files referenced here (e.g. `getBackendUrl`, `getUserFromSessionCookie`, the `db-types` directory).
- **Architecture** — new/changed backend endpoints, Redis channels, data sources, Firestore collections, or auth flow (`Architecture & Data Flow`).
- **Env vars** — new required variables or changed defaults (`Environment Setup`).
- **Conventions** — changes to commit/branch conventions, the PR template, or the GraphQL/`docs/EXPLORER_LINKS.md` regeneration rule.

If a change touches developer-facing setup or workflow, also check whether `README.md`, `tavla/README.md`, `backend/readme.md`, or `docs/` need the same update. When unsure whether something belongs here, prefer a short, factual line over silence.

## What is Tavla

Tavla is a free, real-time public departure board service for Norwegian public transport (Entur). Users create customizable boards for any transit stop in Norway, configure appearance, and share them via public URLs.

## Repository Structure

Monorepo with two main applications:

- **`tavla/`** – Next.js 16 frontend (React 19, TypeScript, Tailwind CSS, Firebase emulator in dev)
- **`backend/`** – Rust/Axum API server: thin layer between frontend and Redis pub/sub for real-time board updates
- **`redirect/`** – Rust redirect service for custom board URLs
- **`tavla/migrations/`** – Python migration scripts for Firestore

This repo is the **admin/configuration app** where boards are created and edited. The public-facing board display (what renders on the screens) lives in a separate repo: [`entur/tavla-visning`](https://github.com/entur/tavla-visning). Run it locally to preview boards.

## Frontend Commands (`tavla/` directory)

```bash
yarn install --frozen-lockfile   # Install dependencies
yarn dev:persist                 # Start dev server + Firebase emulators (recommended, persists .db)
yarn dev                         # Start dev without state persistence
yarn fix                         # Fix lint + format (Biome)
yarn lint                        # Check only
yarn typecheck                   # TypeScript check
yarn generate                    # Regenerate GraphQL types (run after schema changes)
yarn build                       # Build (dev)
yarn build:prod                  # Build for production
```

No unit test framework is configured — CI only runs `yarn lint` and `yarn typecheck`.

Dev URLs: App at `http://localhost:3000`, Firebase Emulator UI at `http://127.0.0.1:4000/`

## Design system

When working with Entur components, branding, or accessibility, read and follow:
https://raw.githubusercontent.com/entur/design-system/main/skills/entur-linje/SKILL.md

## Backend Commands (`backend/` directory)

```bash
./start-redis.sh   # Start Redis master + replica locally
./run-local.sh     # Start backend with local env vars
./stop-redis.sh    # Stop Redis
cargo run          # Run backend manually (requires env vars set)
cargo test         # Run all tests
cargo test <name>  # Run a specific test
cargo clippy -- --deny warnings   # Lint
cargo fmt --all --check           # Format check
```

Test the running server: `curl localhost:3001/active -H "Authorization: Bearer super_secret_key"`

## Architecture & Data Flow

1. Frontend calls backend REST endpoints (e.g. `POST /refresh/:bid`)
2. Backend publishes to Redis channels (`update` global, or `<board-id>` specific)
3. Frontend long-polls `GET /subscribe/:bid` — returns first event or times out after ~55s, then re-subscribes
4. `active_boards` counter in Redis tracks currently connected boards

**Frontend data sources:**
- Entur GraphQL API (`https://api.entur.io/journey-planner/v3/graphql`) — transit departures, stops, routes
- Firestore — board configs, user data, folders
- Custom backend — real-time refresh signals

**Auth:** Firebase Authentication with session cookies. Server-side verification via `getUserFromSessionCookie()` in `tavla/app/(innlogget)/utils/server.ts`.

**Database:** Cloud Firestore collections: `boards`, `folders`, `users`, `config`. Schema validated with Zod in `tavla/src/types/db-types/`.

## Environment Setup

Frontend needs `.env.local` in `tavla/` (get secrets from team password manager). Required variables include Firebase credentials, `BACKEND_API_KEY`, and `GOOGLE_APPLICATION_CREDENTIALS`.

To connect frontend to local backend, temporarily change `getBackendUrl()` in `tavla/src/utils/backendUrl.ts` to return `'http://127.0.0.1:3001'`. **Do not commit this change.**

Backend env vars for local dev: `BACKEND_API_KEY=super_secret_key`, `REDIS_PASSWORD=super_secret_redis_pw`, plus Redis host/port vars. See `backend/readme.md` for the full table.

## Key Patterns

**File organization:** Files shared across multiple routes belong in `tavla/app/_components`, `tavla/app/_hooks`, or `tavla/app/_utils`. Route-specific files stay co-located with their route.

**GraphQL:** Operations defined in `.graphql` files, types generated via `yarn generate` (config in `codegen.ts` and `graphql.config.json`). Always run `yarn generate` after schema changes.

Codegen writes three files, split deliberately so types flow in one direction (base ← operations ← documents):
- `src/types/graphql-schema.ts` — base schema types (objects, enums, inputs, scalars), `typescript` plugin only.
- `src/types/operations.ts` — operation/fragment result + variable types (`T*Query`, `T*Fragment`), imports base types from `graphql-schema`.
- `src/graphql/index.ts` — typed document strings, imports operation types from `operations`.

The split is required because `@graphql-codegen/typescript-operations` v6 re-emits every enum/input it references; co-locating it with the `typescript` plugin produced duplicate-identifier types. Import operation types from `types/operations`, base types from `types/graphql-schema`. All three are generated — commit them together after `yarn generate`.

When adding, removing, or modifying any `.graphql` file under `tavla/src/graphql/` (queries or fragments), regenerate `docs/EXPLORER_LINKS.md` by re-running the same Python script logic used to create it: merge each query with its fragments recursively, URL-encode as `query`+`operationName`+`variables` parameters, and write the updated file. Use the same realistic NSR example IDs (`NSR:StopPlace:59872` Oslo S, `NSR:StopPlace:6013` Bergen stasjon, `NSR:Quay:107371` Oslo S pl. 1).

**Linting/formatting:** Biome (not ESLint/Prettier). Pre-commit hooks run Biome on staged files via Husky.

**Component library:** `@entur/*` design system components throughout the frontend.

**Feature flags:** Controlled in posthog. 

**Accessibility:** All UI/UX changes must follow WCAG (semantic HTML, ARIA, color contrast, keyboard navigation).

## Commit Convention (gitmoji subset)

Start commit messages with an emoji and imperative Norwegian verb:

| Emoji | When |
|-------|------|
| ✨ | New feature |
| 🐛 | Bug fix |
| 💄 | Visual/CSS changes |
| 🧹 | Refactor/cleanup |
| 🚸 | UX/accessibility improvement |
| 📦 | Dependencies |
| 👷 | CI/CD, build tooling |
| 🔒 | Security |
| 📝 | Docs |
| 📈 | Metrics/telemetry |

Branch naming: `feature/`, `bugfix/`, `rydding/` prefix + short description.

## Pull Requests

Always write PR titles and descriptions in Norwegian. Follow the repo's PR template (`.github/pull_request_template.md`):

```markdown
### 🥅 Bakgrunn

### ✨ Løsning

- 

### 📸 Bilder

| Før   | Etter |
| ----- | ----- |
| bilde | bilde |

### ✅ Sjekkliste

- [ ] Testet i Chrome, Firefox og Safari
- [ ] Lagt på aktuell posthog-tracking
- [ ] Husket og testet UU
- [ ] Oppdatert dokumentasjon (hvis relevant)
```

Keep sections Bilder and Sjekkliste, but dont change them from the template - a human should look add images and go through the check list.

## Migrations

From the `tavla/migrations/` directory (Python migration scripts for Firestore):

```bash
./migration setup          # First-time environment setup
./migration run scripts/<filename>   # Run a migration script
```

To test locally with real dev data: stop emulator, run `./migration run scripts/rollback_firestore.py local` (from `tavla/migrations/`), restart with `yarn dev:persist`.
