# Tavla

Med «Tavla» kan du sette opp egne, spesialtilpassede avgangstavler for all offentlig transport i Norge. Løsningen utvikles av Entur, og er helt gratis og tilgjengelig for alle. Logg inn på [tavla.entur.no](https://tavla.entur.no/) for å komme i gang! Abonner på oppdateringer til Tavla ved å klikke på “Watch” i menyen.

> **Merk:** Dette repoet er admin-/konfigurasjonsappen der man oppretter og redigerer tavler. Selve den offentlige tavle-visningen (det som vises på skjermene) rendres i et eget repo: [entur/tavla-visning](https://github.com/entur/tavla-visning).

## Hva du kan gjøre

- Lage skreddersydde tavler (velg stopp, rekkefølge, layout)
- Få sanntidsoppdateringer (Redis pub/sub)
- Se hvor mange tavler som er aktive
- Autentisering og vedvarende data via Firebase (emulator lokalt)
- Moderne og tilgjengelig grensesnitt (Entur designsystem)

## Struktur i repoet

```
/
├─ backend/            Rust (Axum) API + Redis
│  └─ helm/            Deploy-konfigurasjon for backend (Helm chart)
├─ tavla/              Next.js-frontend
│  ├─ migrations/      Python-migrasjonsskript for Firestore
│  └─ helm/            Deploy-konfigurasjon for frontend (Helm chart)
├─ redirect/           Liten Rust-tjeneste (redirect)
├─ docs/               Dokumentasjon (database-skjema, GraphQL-lenker)
└─ flake.nix           Valgfri Nix dev-miljøfil
```

## Teknologistack

| Lag | Teknologi                                  |
|-----|--------------------------------------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind |
| Backend  | Rust (Axum), Tokio, Redis pub/sub          |
| Data/Auth | Firebase (emulator i utvikling)            |
| Verktøy  | Yarn 4, GraphQL Codegen, Sentry            |

## Oversikt: slik kjører du (høytnivå)

1. Start Redis (master + replica) – se `backend/readme.md` for detaljer
2. Start backend (`./run-local.sh`, eller `cargo run` med miljøvariabler satt)
3. Start frontend (`yarn dev` eller `yarn dev:persist`)
4. Sett `BACKEND_API_KEY` i frontend (`.env.local`)
5. Test med `curl` mot backend

Detaljer per delkomponent finnes i deres respektive README.

## Miljøvariabler (samlet oversikt)

| Variabel | Bruk | Påkrevd | Standard | Beskrivelse |
|----------|------|---------|----------|-------------|
| BACKEND_API_KEY | Backend + frontend | Ja | – | Delt bearer key |
| HOST | Backend | Nei | 0.0.0.0 | Adresse backend binder på |
| PORT | Backend | Nei | 3001 | Port backend lytter på |
| REDIS_PASSWORD | Backend/Redis | Ja | – | Passord for master + replica |
| REDIS_MASTER_SERVICE_HOST | Backend | Ja | 127.0.0.1 | Host for Redis master |
| REDIS_MASTER_SERVICE_PORT | Backend | Ja | 6379 | Port for Redis master |
| REDIS_REPLICAS_SERVICE_HOST | Backend | Ja | 127.0.0.1 | Host for Redis replica |
| REDIS_REPLICAS_SERVICE_PORT | Backend | Ja | 6380 | Port for Redis replica |
| NEXT_PUBLIC_ENV | Frontend | Nei | dev | Bygg-/miljøflagg i frontend |
| SENTRY_* | Frontend/Backend | Nei | – | Valgfri observability |
| FIREBASE_* | Frontend | Ja (auth) | – | Konfig via emulator / service keys |

## Videre dokumentasjon

Mappen [`docs/`](docs/) inneholder mer utfyllende dokumentasjon:

- [`docs/database.md`](docs/database.md) – Firebase/Firestore-oppsett, hvordan koble mot dev-databasen lokalt, migrering og sikkerhetskopiering/rollback
- [`docs/EXPLORER_LINKS.md`](docs/EXPLORER_LINKS.md) – alle GraphQL-spørringene mot Journey Planner v3, klare til å kjøres i GraphQL Explorer

Se ellers `backend/readme.md` og `tavla/README.md` for komponentspesifikke detaljer.

## Bidrag

Vi ønsker:
- Feilrapporter (issues)
- Forslag til forbedringer og funksjoner
- Innspill på dokumentasjon og brukervennlighet

Pull requests med kode håndteres i dag kun av kjerneteamet for å sikre konsistens og kvalitet. Opprett et issue først dersom du ønsker å diskutere en endring.


## Lisenser og betingelser

Kode: EUPL-1.2 (se `LICENSE`)
Fonter: Egen lisens (Nationale – https://playtype.com/typefaces/nationale/)
Varemerker (logo, illustrasjoner, bilder): Kun for Entur.


## Kort kom i gang (huskeliste)

```
redis (master + replica)
cargo run (backend)
yarn dev:persist (frontend)
curl localhost:3001/active -H "Authorization: Bearer <key>"
```
---

Se mappene `backend/` og `tavla/` for mer detaljert informasjon.
