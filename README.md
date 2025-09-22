<!--
	README for Tavla (norsk versjon). Målgruppe: utviklere og interesserte brukere.
-->

# Tavla

Tavla lar deg sette opp og vise sanntids avgangstavler for all kollektivtransport i Norge. Løsningen utvikles av Entur og er gratis å bruke: https://tavla.entur.no/

## Hva du kan gjøre

- Lage skreddersydde tavler (velg stopp, rekkefølge, layout)
- Få sanntidsoppdateringer (Redis pub/sub + WebSocket)
- Se hvor mange tavler som er aktive
- Autentisering og vedvarende data via Firebase (emulator lokalt)
- Moderne og tilgjengelig grensesnitt (Entur designsystem)

## Struktur i repoet

```
/
├─ backend/        Rust (Axum) API + Redis
├─ tavla/          Next.js-frontend
├─ redirect/       Liten Rust-tjeneste (redirect)
├─ migrations/     Skript og hjelpeverktøy
├─ helm/           Deploy-konfigurasjon (Helm charts)
└─ flake.nix       Valgfri Nix dev-miljøfil
```

## Teknologistack

| Lag | Teknologi |
|-----|-----------|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind |
| Backend  | Rust (Axum), Tokio |
| Realtid  | Redis pub/sub (én kanal per tavle) |
| Data/Auth | Firebase (emulator i utvikling) |
| Verktøy  | Yarn 3, GraphQL Codegen, Sentry (valgfritt) |

## Oversikt: slik kjører du (høytnivå)

1. Start Redis (master + replica) – se `backend/readme.md` for detaljer
2. Start backend (`cargo run`)
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

## Bidrag

Vi ønsker:
- Feilrapporter (issues)
- Forslag til forbedringer og funksjoner
- Innspill på dokumentasjon og brukervennlighet

Pull requests med kode håndteres i dag kun av kjerneteamet for å sikre konsistens og kvalitet. Opprett et issue først dersom du ønsker å diskutere en endring.

## Sikkerhet

Ikke legg sensitiv informasjon i issues. Sikkerhetshendelser håndteres via interne kanaler i Entur.

## Lisens og eiendeler

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
