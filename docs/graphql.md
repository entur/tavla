# GraphQL og typegenerering

Denne filen forklarer hvordan Tavla henter sanntidsdata fra Entur, og hvordan
GraphQL-spørringer blir til typesikre funksjoner i frontend via `graphql-codegen`.

## Innholdsfortegnelse

- [🧭 Oversikt](#-oversikt)
- [📁 Hvor ting ligger](#-hvor-ting-ligger)
- [🔄 Dataflyt: fra `.graphql` til typesikkert kall](#-dataflyt-fra-graphql-til-typesikkert-kall)
- [⚙️ Codegen-oppsettet](#️-codegen-oppsettet)
- [🧩 De tre genererte filene](#-de-tre-genererte-filene)
- [✍️ Legge til eller endre en spørring](#️-legge-til-eller-endre-en-spørring)
- [🔃 Oppdatere skjemaet (introspeksjon)](#-oppdatere-skjemaet-introspeksjon)
- [🚀 Bruke en spørring i koden](#-bruke-en-spørring-i-koden)
- [🛟 Feilsøking](#-feilsøking)

---

## 🧭 Oversikt

Tavla henter avganger, ankomster, stoppesteder og linjer fra **Entur Journey
Planner v3** (`https://api.entur.io/journey-planner/v3/graphql`). Vi skriver
spørringene i `.graphql`-filer, og lar `graphql-codegen` generere TypeScript-typer
og ferdige spørrings-objekter ut fra dem. Resultatet er at et nettverkskall som
`fetchQuery(StopPlaceQuery, { id })` er **fullt typesikkert** — både variablene du
sender inn og dataene du får tilbake.

Vi skriver aldri typene for hånd. Alt under `src/types/graphql-schema.ts`,
`src/types/operations.ts` og `src/graphql/index.ts` er generert — se
[De tre genererte filene](#-de-tre-genererte-filene).

---

## 📁 Hvor ting ligger

Alle stier er relative til `tavla/`.

| Fil / mappe | Hva det er |
| ----------- | ---------- |
| `src/graphql/queries/*.graphql` | Spørringer (`query`) |
| `src/graphql/fragments/*.graphql` | Gjenbrukbare fragmenter (`fragment`) |
| `graphql-tools/schema.json` | Hele Entur-skjemaet (introspeksjonsresultat) — kilden codegen genererer typer fra |
| `graphql-tools/introspect.js` + `introspect.graphql` | Skript for å hente ned / oppdatere `schema.json` |
| `codegen.ts` | Konfigurasjon for `graphql-codegen` |
| `graphql.config.json` | Peker editor/IDE-verktøy til skjema og dokumenter |
| `src/types/graphql-schema.ts` | **Generert** — grunntyper |
| `src/types/operations.ts` | **Generert** — operasjons-/fragmenttyper |
| `src/graphql/index.ts` | **Generert** — typede spørrings-objekter |
| `src/graphql/utils.ts` | `fetchQuery` / `fetcher` —  hjelper for å kjøre spørringer |

---

## 🔄 Dataflyt: fra `.graphql` til typesikkert kall

```
Entur-skjema ──(introspect.js)──▶ graphql-tools/schema.json
                                          │
.graphql-filer (queries + fragments)      │
        │                                 │
        └──────────────┬──────────────────┘
                       ▼
                 yarn generate
                       │
        ┌──────────────┼───────────────────────────┐
        ▼              ▼                             ▼
 graphql-schema.ts  types/operations.ts        graphql/index.ts
 (grunntyper)       (operasjonstyper)           (spørrings-objekter)
        ▲              ▲                             │
        └── import ────┘── import ───────────────────┘
                       │
                       ▼
        fetchQuery(SomeQuery, variables)  ◀── typesikkert kall i koden
```

---

## ⚙️ Codegen-oppsettet

Generering kjøres med:

```bash
yarn generate
```

Det kaller `graphql-codegen` med oppsettet i `codegen.ts`. De viktigste valgene:

- **`schema`**: `./graphql-tools/schema.json` — skjemaet typene baseres på.
- **`documents`**: `src/**/*.graphql` — spørringene og fragmentene våre.
- **`typesPrefix: 'T'`** — alle genererte typer får `T`-prefiks (`TStopPlaceQuery`).
- **`enumsAsTypes: true`** — enums blir union-typer (`'bus' | 'rail' | …`) i stedet
  for TypeScript-`enum`.
- **`documentMode: 'string'`** — spørringene genereres som strenger pakket i en
  `TypedDocumentString`-klasse (definert øverst i `src/graphql/index.ts`).
- **`scalars`** — mapper egendefinerte GraphQL-scalars (`DateTime`, `Long`,
  `Coordinates` …) til våre egne TypeScript-typer.
- **`hooks.afterAllFileWrite`**: kjører `biome format` på de genererte filene.

---

## 🧩 De tre genererte filene

Codegen skriver **tre** filer, bevisst delt slik at typene flyter i én retning:
**base ← operations ← documents**. Hver fil importerer kun fra den til venstre.

1. **`src/types/graphql-schema.ts`** — grunntyper fra skjemaet: objekttyper
   (`TQuay`, `TStopPlace`, `TLine` …), enums (`TTransportMode` …), input-typer og
   scalars. Genereres av `typescript`-pluginen.
2. **`src/types/operations.ts`** — resultat- og variabeltyper for hver spørring og
   hvert fragment (`TStopPlaceQuery`, `TLinesFragment`, `TStopPlaceQueryVariables`
   …). Genereres av `typescript-operations` og importerer grunntypene fra
   `graphql-schema`.
3. **`src/graphql/index.ts`** — de typede spørrings-objektene (`StopPlaceQuery`,
   `DepartureFragment` …) som du faktisk sender til API-en. Genereres av
   `typed-document-node` og refererer operasjonstypene fra `operations`.

> **Hvorfor tre filer og ikke én?**
> `@graphql-codegen/typescript-operations` v6 re-emitterer alle enums og
> input-typer den refererer. Lå den i samme fil som `typescript`-pluginen, ble de
> samme typene definert to ganger (`TArrivalDeparture`, `TTransportMode` m.fl.) —
> som er en `Duplicate identifier`-feil og bryter `yarn typecheck`. Ved å splitte
> filene unngår vi kollisjonen uten å endre noen avhengigheter.

**Hvor importerer jeg fra?**

| Du trenger … | Importer fra |
| ------------ | ------------ |
| En grunntype (`TQuay`, `TTransportMode`, en input-type) | `types/graphql-schema` |
| En operasjons-/fragmenttype (`TStopPlaceQuery`, `TLinesFragment`) | `types/operations` |
| Et spørrings-objekt å kjøre (`StopPlaceQuery`) | `src/graphql` |

---

## ✍️ Legge til eller endre en spørring

1. Legg til/endre en `.graphql`-fil under `src/graphql/queries/` eller
   `src/graphql/fragments/`.
2. Kjør `yarn generate`.
3. Bruk det nye spørrings-objektet via `fetchQuery` (se under). Typene følger med
   automatisk.
4. Commit de genererte filene sammen med `.graphql`-endringen — alle tre genererte
   filene hører sammen.

> **Husk:** når du legger til, fjerner eller endrer en `.graphql`-fil, skal også
> [`docs/EXPLORER_LINKS.md`](EXPLORER_LINKS.md) regenereres (se reglene i
> `CLAUDE.md`).

---

## 🔃 Oppdatere skjemaet (introspeksjon)

`graphql-tools/schema.json` er et øyeblikksbilde av Entur-skjemaet. Det må oppdateres
hvis Entur har endret APIet (nye felter, typer e.l.). Det finnes ingen
`package.json`-kommando for dette — skriptet kjøres manuelt fra `graphql-tools/`:

```bash
cd tavla/graphql-tools
node introspect.js
```

Skriptet kjører introspeksjons-spørringen i `introspect.graphql` mot
`https://api.entur.io/journey-planner/v3/graphql` og skriver svaret til
`schema.json`. Kjør deretter `yarn generate` på nytt for å oppdatere typene.

---

## 🚀 Bruke en spørring i koden

Bruk `fetchQuery` fra `src/graphql/utils`. Den er generisk over
`TypedDocumentString<Data, Variables>`, så TypeScript vet både hvilke variabler som
kreves og hva som returneres:

```ts
import { StopPlaceQuery } from 'src/graphql'
import { fetchQuery } from 'src/graphql/utils'

// data er typet som TStopPlaceQuery, og { id } sjekkes mot TStopPlaceQueryVariables
const data = await fetchQuery(StopPlaceQuery, { id: 'NSR:StopPlace:59872' })
```

`fetchQuery` (og den underliggende `fetcher`) gjør jobben for deg:

- Velger endepunkt (`journey-planner` som standard) fra `GRAPHQL_ENDPOINTS` i
  `src/assets/env` og setter `ET-Client-Name`-headeren.
- Legger automatisk på en `startTime`-variabel (med valgfri `offset` i minutter).
- Har timeout (15 s), og logger feil til GCP og Sentry.
- Kaster ved GraphQL-feil og varsler ved tomt `data`-svar.

---

## 🛟 Feilsøking

| Symptom | Mulig årsak | Tiltak |
| ------- | ----------- | ------ |
| Typefeil etter schema-/spørringsendring | Codegen ikke kjørt | Kjør `yarn generate` |
| `Duplicate identifier`-typer i `graphql-schema.ts` | Genererte filer ute av sync med `codegen.ts` (eller manuelt sammenslått til én fil) | Kjør `yarn generate` på nytt; sjekk at `codegen.ts` fortsatt har tre separate outputs |
| Mangler nytt felt fra Entur | `schema.json` er utdatert | Oppdater skjemaet via `introspect.js`, kjør `yarn generate` |
| `Cannot find module 'types/operations'` | Ny generert fil ikke committet | `git add tavla/src/types/operations.ts` |
| Spørring feiler i runtime, men typer er ok | Feil endepunkt eller manglende variabler | Sjekk `endpoint`-valget til `fetchQuery` og variablene mot `.graphql`-fila |
