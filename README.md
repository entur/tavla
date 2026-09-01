# Tavla

Med «Tavla» kan du sette opp egne, spesialtilpassede avgangstavler for all offentlig transport i Norge. Løsningen utvikles av Entur, og er helt gratis og tilgjengelig for alle. Logg inn på [tavla.entur.no](https://tavla.entur.no/) for å komme i gang! Abonner på oppdateringer til Tavla ved å klikke på “Watch” i menyen.

> **Merk:** Dette repoet er admin-/konfigurasjonsappen der man oppretter og redigerer tavler. Selve tavle-visningen (det som vises på skjermene) rendres i et eget repo: [entur/tavla-visning](https://github.com/entur/tavla-visning).
 

## Struktur i repoet
Dette repo består av tre tjenester: en backend i /backend, en frontend i /tavla og en liten redirect-tjeneste i /redirect. For lokal kjøring og oppsett, se i undermappene og deres egne readme-filer. 

```
/
├─ backend/            Rust (Axum) API + Redis
│  └─ helm/            Deploy-konfigurasjon for backend (Helm chart)
├─ tavla/              Next.js-frontend
│  ├─ migrations/      Python-migrasjonsskript for Firestore
│  └─ helm/            Deploy-konfigurasjon for frontend (Helm chart)
├─ redirect/           Liten Rust-tjeneste (redirect)
├─ docs/               Dokumentasjon (database, GraphQL-lenker)
└─ flake.nix           Valgfri Nix dev-miljøfil
```

## Teknologistack

| Lag | Teknologi                                  |
|-----|--------------------------------------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind |
| Backend  | Rust (Axum), Tokio, Redis pub/sub          |
| Data/Auth | Firebase (emulator i utvikling)            |
| Verktøy  | Yarn 4, GraphQL Codegen, Sentry            |


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
- [`docs/graphql.md`](docs/graphql.md) – hvordan GraphQL og typegenerering (`graphql-codegen`) henger sammen: dataflyt, de tre genererte filene, og hvordan du legger til og bruker en spørring
- [`docs/EXPLORER_LINKS.md`](docs/EXPLORER_LINKS.md) – alle GraphQL-spørringene mot Journey Planner v3, klare til å kjøres i GraphQL Explorer

Se ellers `backend/readme.md` og `tavla/README.md`.

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

