## Frontend (Next.js) – Utviklerguide

Denne mappen inneholder frontend-koden for Tavla (Next.js 15, React 18, TypeScript, Tailwind, Firebase-emulator i utvikling).

### Forutsetninger

-   Node 18 (bruk gjerne `mise` eller `nvm`)
-   Yarn 3 (Berry) – allerede satt opp i repoet
-   Firebase CLI (for emulatorer)
-   To interne service key JSON-filer: `ent-tavla-dev-*.json` og `ent-tavla-prd-*.json` (Disse finner du i teamets passord-manager, de skal ikke sjekkes inn i git)

### Installere avhengigheter

```
cd tavla/tavla
yarn install
```

### Node-versjon (eksempel med mise)

```
brew install mise
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
exec $SHELL
node -v
# Skal vise v18.x
```

### Kjøre i utvikling

```
yarn dev          # uten persistering av lokal database
yarn dev:persist  # anbefalt – lagrer emulator state (.db)
```

Tilgang:

-   App: http://localhost:3000
-   Firebase Emulator UI: http://127.0.0.1:4000/

### Miljøvariabler (lokalt minimum)

Lag `.env.local`og kopier innnholdet fra teamets passord-manager.
Sentry-variabler er valgfrie og trengs ikke for lokal kjøring.

### Vanlige kommandoer

| Oppgave             | Kommando                         |
| ------------------- | -------------------------------- |
| Start dev (persist) | `yarn dev:persist`               |
| Fix (lint + format) | `yarn fix`                       |
| Lint                | `yarn lint`                      |
| Type-sjekk          | `yarn typecheck`                 |
| Format-sjekk        | `yarn prettier`                  |
| Bygg (dev/prod)     | `yarn build` / `yarn build:prod` |
| GraphQL codegen     | `yarn generate`                  |

`yarn generate` bruker oppsett i `codegen.ts` og `graphql.config.json` for å generere typer fra skjema.

### Backend-integrasjon

Frontend kaller Rust-backenden med bearer-token (`BACKEND_API_KEY`). Sørg for at nøkkel samsvarer med verdien backend prosessen forventer. Midlertidig endring av backend-URL kan gjøres i util-funksjon (ikke committ endringen).

### Git-konvensjoner (gitmoji-subsett)

Vi bruker et avgrenset sett gitmoji i starten av commit-meldinger for å gjøre historikken mer skumbar. Start commitmelding med imperativ form ("legg til", "oppdater", "fjern").

Emojis / kategorier:
| Emoji | Kategori | Når brukes |
|-------|----------|-----------|
| ✨ | Feature | Ny funksjonalitet / større tillegg |
| 🐛 | Bug | Fikser en konkret feil |
| 📝 | Dokumentasjon | Endrer / legger til dokumentasjon |
| 💄 | Styling | Visuelle endringer (CSS, layout, ikke funksjonell endring) |
| 🧹 | Rydding | Refaktor, fjerner død kode, strukturelle forbedringer |
| 🚸 | Bedre UX | Forbedrer brukeropplevelse / tilgjengelighet |
| 📦 | Pakker | Legger til / oppdaterer avhengigheter |
| 👷 | CI/CD & bygg | Pipelines, byggskript, tooling-infrastruktur |
| 🔒 | Sikkerhet | Sikkerhets- eller personvernrelaterte endringer |
| 📈 | Målinger | Telemetri, logging, målepunkter |

Branches kan valgfritt bruke en kort kategori + beskrivelse, f.eks:

```
feature/filtrering-av-linjer
bugfix/feil-i-refresh-endpoint
rydding/refaktor-board-context
```

### Migrasjonsskript (fra rot `migrations/`)

Migreringsscriptet kan ta inn to argumenter - enten `setup` eller `run`:

For å sette opp mijøet for første gang:

```
./migration setup
```

For å kjøre en migreringsfil, putt filen i /scripts mappen og kjør:

```
./migration run scripts/<filnavn>
```

### Feilsøking

| Symptom                       | Mulig årsak              | Tiltak                                      |
| ----------------------------- | ------------------------ | ------------------------------------------- |
| 401 mot backend               | Ulik API-key             | Sjekk `.env.local` og backend miljøvariabel |
| Ingen WebSocket-oppdatering   | Backend ikke oppe / CORS | Start backend, sjekk nettleserkonsoll       |
| Data forsvinner               | Ikke brukt persist       | Bruk `yarn dev:persist`                     |
| Typefeil etter schema-endring | Codegen ikke kjørt       | Kjør `yarn generate`                        |
