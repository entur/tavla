# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Tavla

Tavla is a free, real-time public departure board service for Norwegian public transport (Entur). Users create customizable boards for any transit stop in Norway, configure appearance, and share them via public URLs.

## Repository Structure

Monorepo with two main applications:

- **`tavla/`** – Next.js 16 frontend (React 19, TypeScript, Tailwind CSS, Firebase emulator in dev)
- **`backend/`** – Rust/Axum API server: thin layer between frontend and Redis pub/sub for real-time board updates
- **`redirect/`** – Rust redirect service for custom board URLs
- **`migrations/`** – Python migration scripts for Firestore

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

**Auth:** Firebase Authentication with session cookies. Server-side verification via `getUserFromSessionCookie()` in `tavla/app/(admin)/utils/server.ts`.

**Database:** Cloud Firestore collections: `boards`, `folders`, `users`, `config`. Schema validated with Zod in `tavla/src/types/db-types/`.

## Environment Setup

Frontend needs `.env.local` in `tavla/` (get secrets from team password manager). Required variables include Firebase credentials, `BACKEND_API_KEY`, and `GOOGLE_APPLICATION_CREDENTIALS`.

To connect frontend to local backend, temporarily change `getBackendUrl()` in `tavla/src/utils/index.ts` to return `'http://127.0.0.1:3001'`. **Do not commit this change.**

Backend env vars for local dev: `BACKEND_API_KEY=super_secret_key`, `REDIS_PASSWORD=super_secret_redis_pw`, plus Redis host/port vars. See `backend/readme.md` for the full table.

## Key Patterns

**GraphQL:** Operations defined in `.graphql` files, types generated via `yarn generate` (config in `codegen.ts` and `graphql.config.json`). Always run `yarn generate` after schema changes.

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

From the repo root `migrations/` directory:

```bash
./migration setup          # First-time environment setup
./migration run scripts/<filename>   # Run a migration script
```

To test locally with real dev data: stop emulator, run `python3 scripts/rollback_firestore local`, restart with `yarn dev:persist`.
