# Copilot Instructions for AI Agents

## Project Overview
- **Monorepo** with two main components:
  - `backend/`: Rust API server, acts as a thin layer between frontend and Redis (pub/sub, state tracking)
  - `tavla/`: Next.js 15 frontend (React 18, TypeScript, Tailwind, Firebase emulator for local dev)
- Data flow: Frontend calls backend REST endpoints, backend publishes/consumes Redis messages, frontend subscribes for updates (long-poll pattern).

## Key Workflows
### Backend (Rust)
- Start all services locally: `./start-redis.sh` then `./run-local.sh` (from `backend/`)
- Manual Redis setup: see `backend/README.md` for step-by-step config (master/replica, password)
- Run backend: `cargo run` (from `backend/`)
- Test endpoint: `curl localhost:3001/active -H "Authorization: Bearer super_secret_key"`
- Env vars: see table in `backend/README.md` (e.g., `BACKEND_API_KEY`, `REDIS_PASSWORD`)
- API endpoints: documented in `backend/README.md` (auth, payloads, error handling)

### Frontend (Next.js)
- Install deps: `yarn install --frozen-lockfile` (from `tavla/tavla/`)
- Start dev: `yarn dev:persist` (recommended, persists local DB)
- Env: `.env.local` required, get secrets from team password manager
- Codegen: `yarn generate` (uses `codegen.ts` and `graphql.config.json`)
- Lint/format/typecheck: `yarn fix`, `yarn lint`, `yarn typecheck`, `yarn prettier`
- Backend URL: for local dev, update `getBackendUrl` in `tavla/src/Shared/utils/index.ts` (do NOT commit)

## Patterns & Conventions
- **API key**: Frontend and backend must use matching `BACKEND_API_KEY` (see `.env.local` and backend env)
- **Gitmoji**: Use a restricted set of emojis in commit messages (see table in `tavla/tavla/README.md`)
- **Branch naming**: Optional, but use `feature/`, `bugfix/`, `rydding/` prefixes
- **Migrations**: Use `./migration setup` and `./migration run scripts/<file>` from repo root
- **Error handling**: Backend returns generic 500s, no internal details leaked
- **Redis channels**: `update` (all boards), `<board-id>` (single board)
- **Frontend-backend integration**: Auth via bearer token, long-poll subscribe pattern

## Troubleshooting
- 401 errors: Check API key in both frontend and backend
- No WebSocket updates: Backend not running or CORS issue
- Data loss: Use `yarn dev:persist` for frontend
- Type errors after schema change: Run `yarn generate`
- See troubleshooting tables in both `backend/README.md` and `tavla/tavla/README.md`

## Key Files & Directories
- `backend/README.md`: Backend setup, API, architecture
- `tavla/tavla/README.md`: Frontend setup, commands, conventions
- `tavla/src/Shared/utils/index.ts`: Backend URL override for local dev
- `tavla/tavla/codegen.ts`, `graphql.config.json`: GraphQL codegen config
- `migrations/`, `scripts/`: Migration scripts

> For any workflow or integration not covered here, check the respective README files for up-to-date details.
