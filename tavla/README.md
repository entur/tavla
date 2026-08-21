## Frontend (Next.js) – Utviklerguide

Denne mappen inneholder frontend-koden for Tavla (Next.js 16, React 19, TypeScript, Tailwind, Firebase-emulator i utvikling).

### Forutsetninger

- Node 22 (bruk gjerne `mise` eller `nvm`)
- Yarn 4 (Berry) – allerede satt opp i repoet
- Firebase CLI (for emulatorer)
- To interne service key JSON-filer: `ent-tavla-dev-*.json` og `ent-tavla-prd-*.json` (Disse finner du i teamets passord-manager, de skal ikke sjekkes inn i git)

### Installere avhengigheter

Frontend-koden ligger i `tavla/`-mappen i repo-roten (altså `tavla/tavla` sett fra mappen over repoet). Fra repo-roten:

```
cd tavla
yarn install --frozen-lockfile
```

### Node-versjon (eksempel med mise)

```
brew install mise
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
exec $SHELL
node -v
# Skal vise v22.x
```

### Kjøre opp lokalt

```
yarn dev          # uten persistering av lokal database
yarn dev:persist  # anbefalt – lagrer emulator state (.db)
```

Tilgang:

- App: http://localhost:3000
- Firebase Emulator UI: http://127.0.0.1:4000/

Dette repoet er admin-/konfigurasjonsappen. Selve tavle-visningen (det som rendres på skjermene) ligger i et eget repo. For å forhåndsvise tavler lokalt må du derfor også kjøre `tavla-visning`: https://github.com/entur/tavla-visning. 

Når du skal opprette en bruker lokalt får du ikke en epost om å verifisere e-post, men en lenke du må klikke på i terminalen der appen kjører. 

### Miljøvariabler (lokalt minimum)

Lag `.env.local`og kopier innnholdet fra teamets passord-manager.
Sentry- og PostHog-variabler er valgfrie og trengs ikke for lokal kjøring.

### Vanlige kommandoer

| Oppgave             | Kommando                         |
| ------------------- | -------------------------------- |
| Start dev (persist) | `yarn dev:persist`               |
| Fix (lint + format) | `yarn fix`                       |
| Lint                | `yarn lint`                      |
| Type-sjekk          | `yarn typecheck`                 |
| Format-sjekk        | `yarn format`                    |
| Bygg (dev/prod)     | `yarn build` / `yarn build:prod` |
| GraphQL codegen     | `yarn generate`                  |

`yarn generate` bruker oppsett i `codegen.ts` og `graphql.config.json` for å generere typer fra skjema.

### Backend-integrasjon

Det er ikke nødvendig å kjøre opp backend lokalt for å kjøre frontend lokalt. For å peke lokal frontend mot en lokal backend kan du midlertidig endre `getBackendUrl()` i `tavla/src/utils/backendUrl.ts` til å returnere `'http://127.0.0.1:3001'`

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
| 🤖 | KI | Skills, instruksjoner og annet som forbedrer bruk av agenter |


Branches kan valgfritt bruke en kort kategori + beskrivelse, f.eks:

```
feature/filtrering-av-linjer
bugfix/feil-i-refresh-endpoint
rydding/refaktor-board-context
```


### Feilsøking

| Symptom                       | Mulig årsak              | Tiltak                                      |
| ----------------------------- | ------------------------ | ------------------------------------------- |
| 401 mot backend               | Ulik API-key             | Sjekk `.env.local` og backend miljøvariabel |
| Ingen WebSocket-oppdatering   | Backend ikke oppe / CORS | Start backend, sjekk nettleserkonsoll       |
| Data forsvinner               | Ikke brukt persist       | Bruk `yarn dev:persist`                     |
| Typefeil etter schema-endring | Codegen ikke kjørt       | Kjør `yarn generate`                        |
