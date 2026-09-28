# Logging i Tavla

Tavla bruker to separate loggingsystemer som dekker ulike behov:

1. **Strukturert logging til Google Cloud (GCP) Logging** – server-side hendelser, API-kall og feil
2. **Sentry** – Feillogging

I tillegg eksponerer Rust-backenden Prometheus-metrikker som kan hentes inn i Grafana.

---

## 1. Strukturert logging til GCP (`logToGcp`)

### Oversikt

All server-side logging skjer via `logToGcp`-funksjonen i `tavla/src/utils/logging.ts`. Funksjonen sender strukturerte JSON-loggoppføringer til GCP Cloud Logging under loggen `tavla_admin` i prosjektet som er konfigurert i `GOOGLE_PROJECT_ID`.

I lokalt utviklingsmiljø (`NODE_ENV=development`) skrives loggene til konsollen i stedet for å sendes til GCP.

### Definisjon

```typescript
import { logToGcp } from 'src/utils/logging'

await logToGcp(level: LogLevel, message: string, fields?: LogFields)
```

| Parameter | Type                  | Beskrivelse                                                        |
|-----------|-----------------------|---------------------------------------------------------------------|
| `level` | `LogLevel`              | Alvorlighetsgrad                                                     |
| `message` | `string`              | Fast, variabel-fri loggmelding – samme tekst hver gang samme hendelse inntreffer |
| `fields` | `LogFields` (valgfri) | Alle strukturerte felter for hendelsen, inkludert `type`             |

### GCP loggnivåer

| Nivå | Når |
|------|-----|
| `debug` | Detaljert informasjon for feilsøking – brukes sjelden i prod |
| `info` | Normal operasjon, vellykkede kall |
| `warning` | Uventede men håndterbare tilstander (f.eks. 4xx-statuskoder, rate-limiting) |
| `error` | Feil som krever oppmerksomhet (5xx-statuskoder, unntak, timeout) |

### Regelen: variabler i `fields`, aldri i `message`

`message` skal alltid være en fast streng – ingen interpolerte verdier (id-er, statuskoder, feiltekst, URL-er osv.). All variasjon hører hjemme i `fields`. Dette gjør at `jsonPayload.message` selv blir en lav-kardinalitets-verdi du kan gruppere/aggregere på (nyttig f.eks. i GCP Error Reporting), mens de faktiske verdiene blir filtrerbare egne felt i stedet for fritekst.

```typescript
// Ikke slik – variabler i meldingsteksten:
logToGcp('warning', `POST /api/upload: status=403 folderid=${folderid}`)

// Slik – fast melding, variabler som felt:
logToGcp('warning', 'upload rejected: unauthorized', {
    type: 'http',
    method: 'POST',
    path: '/api/upload',
    status: 403,
    folderId: folderid,
})
```

`type` settes alltid eksplisitt av kalleren – det utledes ikke lenger fra meldingsteksten.

**Unntak fra regelen:** verdier fra en liten, lukket, kodebestemt mengde (som ikke vokser med brukerdata) kan trygt inkluderes i meldingen for gruppering – f.eks. action-navn eller en enum som `errorCode`. Det er forskjellig fra en id, feiltekst eller annen fritekst, som alltid skal være et eget felt.

#### Server actions – `type: 'server-action'`

Meldingen inkluderer action-navnet slik at man kan gruppere/skumme per action i Log Explorer, i tillegg til at det ligger i `action`-feltet for presis filtrering.

```typescript
logToGcp('info', 'action invoked: deleteBoard', { type: 'server-action', action: 'deleteBoard', bid: boardId })
logToGcp('error', 'action failed: createFolder', { type: 'server-action', action: 'createFolder', folderId })
```

#### HTTP-endepunkter – `type: 'http'`

```typescript
logToGcp('warning', 'upload rejected: invalid token', {
    type: 'http',
    method: 'POST',
    path: '/api/upload',
    status: 401,
})
```

#### GraphQL-kall – `type: 'graphql'`

```typescript
logToGcp('info', 'graphql request completed', {
    type: 'graphql',
    endpoint: 'journey-planner',
    status: 200,
})
```

Loggnivå settes automatisk i GraphQL-fetcheren basert på statuskode:
- 2xx → `info`
- 4xx → `warning`
- 5xx → `error`

#### Firestore-tilgang – `type: 'firestore'`

Brukes i `src/firebase.ts` for feil/valideringsfeil i selve Firestore-tilgangen, uavhengig av om kalleren er en server action, et API-endepunkt eller en Server Component. Feilen oppstår i data-laget, ikke hos kalleren, så den klassifiseres deretter i stedet for å gjette seg til kallerens type.

```typescript
logToGcp('error', 'fetching board from firebase failed', {
    type: 'firestore',
    bid,
    errorName: error instanceof Error ? error.name : undefined,
    errorMessage: error instanceof Error ? error.message : String(error),
})
```

#### Feil fra tavla-visning – `type: 'tavla-visning'`

Brukes kun via `/api/report-error`-endepunktet (se seksjon 3).

```typescript
logToGcp('error', 'error reported from tavla-visning', {
    type: 'tavla-visning',
    bid: boardId,
    errorCode,
})
```

### `LogFields`-felter

| Felt | Type | Beskrivelse |
|------|------|-------------|
| `type` | `LogType` | `'server-action'` \| `'http'` \| `'graphql'` \| `'firestore'` \| `'tavla-visning'` |
| `action` | `string` | Navn på server action |
| `method` | `string` | HTTP-metode |
| `endpoint` | `string` | GraphQL-endepunktnavn |
| `status` | `number` | HTTP-statuskode |
| `bid` | `string` | Tavle-ID |
| `folderId` | `string` | Mappe-ID |
| `path` | `string` | URL-sti |
| `errorCode` | `string` | Applikasjonsspesifikk feilkode |
| `errorName` | `string` | `error.name` – bruk alltid dette i stedet for å sende hele feilobjektet |
| `errorMessage` | `string` | `error.message` |
| `userAgent` | `string` | User-agent-streng fra forespørselen |
| `context` | `Record<string, string \| number \| boolean>` | Ekstra felt for felter som ikke passer i de faste feltene over |

### Sikkerhet mot log injection

Alle verdier saniteres før logging: linjeskift (`\r`, `\n`, Unicode-linjeskillere) erstattes med mellomrom og kontrollkarakterer strippes. Dette forhindrer log injection-angrep.

---

## 2. Bruke logging i kode

### I en server action

```typescript
'use server'
import { logToGcp } from 'src/utils/logging'

export async function deleteBoard(bid: string) {
    logToGcp('info', 'action invoked: deleteBoard', { type: 'server-action', action: 'deleteBoard', bid })
    // ...
    logToGcp('error', 'action failed: deleteBoard', { type: 'server-action', action: 'deleteBoard', bid })
}
```

### I et API-endepunkt (route handler)

```typescript
import { logToGcp } from 'src/utils/logging'

export async function POST(req: NextRequest) {
    // ...
    logToGcp('warning', 'request rejected: forbidden', {
        type: 'http',
        method: 'POST',
        path: '/api/mitt-endepunkt',
        status: 403,
        bid: boardId,
    })
    // ...
    logToGcp('info', 'request succeeded', {
        type: 'http',
        method: 'POST',
        path: '/api/mitt-endepunkt',
        status: 200,
        bid: boardId,
    })
}
```

### Loggføring av alle statuskoder for et endepunkt

Se `tavla/app/api/upload/route.ts` for et godt eksempel: hvert mulige utfall (401, 400, 403, 413, 415, 429, 500, 200) logges med riktig nivå og årsak i meldingen.

---

## 3. Feilrapportering fra tavla-visning

Siden tavla-visning er en separat applikasjon uten tilgang til Firebase Auth eller GCP-credentials, rapporterer den feil via et åpent HTTP-endepunkt.

### Endepunkt

```
POST https://tavla.entur.no/api/report-error
```

### Bruk fra tavla-visning

```typescript
fetch('https://tavla.entur.no/api/report-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        boardId: '<20-tegns alfanumerisk ID>',
        errorCode: 'display_error', // eller 'unknown', 'fetch_journey_planner', 'fetch_board'
        message: '<feilmelding>',
    }),
}).catch(() => {}) // fire-and-forget
```

### Sikkerhetstiltak

Endepunktet er åpent, men beskyttet med flere lag:

| Tiltak | Detalj |
|--------|--------|
| **Zod-validering** | `boardId` må matche `^[A-Za-z0-9]{20}$`, `errorCode` er fast enum, `message` er en streng |
| **Content-Length** | Avviser forespørsler over 500 bytes |
| **Rate-limiting per IP** | Maks 100 forespørsler/minutt per IP-adresse |
| **Rate-limiting per tavle** | Maks 5 forespørsler/minutt per `boardId` |
| **CORS** | Kun `vis-tavla.entur.no` og `vis-tavla.dev.entur.no` (pluss localhost i dev) |

Rate-limitene lever i minnet på hvert pod og er ikke delte på tvers av instanser – de er per-instans LRU-begrensere.

---

## 4. GCP Cloud Logging

### Hvor logges det

Logger havner i GCP Cloud Logging under:
- **Prosjekt**: `ent-tavla-prd` (prod) / `ent-tavla-dev` (dev)
- **Lognavn**: `tavla_admin`
- **Ressurstype**: auto-detektert av `@google-cloud/logging` (`cloud_run_revision` i prod, med `service_name`/`revision_name`/`location` som egne felt)

### Filtrering i GCP Log Viewer

Åpne [GCP Cloud Logging](https://console.cloud.google.com/logs) og bruk disse filtrene:

```
# Alle server actions
jsonPayload.type="server-action"

# En bestemt server action
jsonPayload.type="server-action" AND jsonPayload.action="deleteBoard"

# HTTP-feil (4xx og 5xx)
jsonPayload.type="http" AND jsonPayload.status>=400

# Alle 404-feil
jsonPayload.type="http" AND jsonPayload.status=404

# GraphQL-kall
jsonPayload.type="graphql"

# GraphQL-feil
jsonPayload.type="graphql" AND jsonPayload.status>=500

# Alt relatert til én spesifikk tavle
jsonPayload.bid="<board-id>"

# Firestore-feil
jsonPayload.type="firestore" AND severity="ERROR"

# Feil fra tavla-visning
jsonPayload.type="tavla-visning"

# Kombinasjoner
jsonPayload.type="server-action" AND severity="ERROR"
```

### Konfigurering (miljøvariabler)

| Variabel | Beskrivelse |
|----------|-------------|
| `GOOGLE_PROJECT_ID` | GCP-prosjekt-ID. Hvis denne mangler, deaktiveres GCP-logging stille |

---

## 5. Sentry (klientside feilsporing)

Sentry fanger opp ubehandlede unntak og feil på klientsiden i tavla-admin.

### Samtykke

Sentry er **deaktivert som standard** på klientsiden. Det aktiveres kun hvis brukeren gir samtykke via Usercentrics-dialogen (cookie consent). Logikken ligger i `tavla/app/_components/ConsentHandler.tsx`.

### Hva Sentry fanger

- Ubehandlede unntak i React-komponenter (via error boundaries i `app/error.tsx` og `app/global-error.tsx`)
- GraphQL-feil og timeout fra Entur API
- Feil i server actions der `Sentry.captureException()` er kalt eksplisitt

### Server-side Sentry

Server-side Sentry (`sentry.server.config.ts`) er alltid aktivert i produksjon (uavhengig av samtykke) med lav sampling rate (`tracesSampleRate: 0.001`).

### Konfigurasjon

| Variabel | Beskrivelse |
|----------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN_URL` | Sentry DSN. Må settes i `.env.local` |

---

## 6. Prometheus-metrikker og Grafana

Rust-backenden eksponerer metrikker for Prometheus:

```
GET http://<backend-host>:3001/metrics
```

Tilgjengelig metrikk:

| Metrikk | Type | Beskrivelse |
|---------|------|-------------|
| `tavla_active_sessions_current` | Gauge | Antall tavler som aktivt lytter på oppdateringer |
| `tavla_active_direct_sessions_current` | Gauge | Antall aktive direktelink-tavler (NSR-id i URL, ingen tavle-dokument) |
| `tavla_sessions_current` | Gauge (labels: `is_mobile`, `is_direct_link`, `county`) | Tilnærmet samme telling som de to over, splittet på enhet, direktelink og fylke - kan avvike litt siden denne kun teller heartbeats som lar seg parse. `county` er ett av de 15 norske fylkene, `Annet` (verdi utenfor Norge, f.eks. svenske fylker nær grensen) eller `N/A` (heartbeaten inneholdt ikke et county-felt - forventet for direktelenke-tavler inntil de også får en fylke-kilde). Erstatter etter hvert de to eldre metrikkene når dashboards/alerts er migrert. |

Disse metrikkene kan skrapes av Prometheus og visualiseres i Grafana for å overvåke sanntidsbelastning på tjenesten.

---

## 7. Lokal utvikling

I lokalt utviklingsmiljø (`NODE_ENV=development`) skrives alle GCP-logger til konsollen i stedet:

```json
{
  "severity": "INFO",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "action invoked: getFirebaseClientConfig",
  "type": "server-action",
  "action": "getFirebaseClientConfig"
}
```

Sentry er deaktivert i development.

---

## 8. Oversikt: Hva logges hvor

| Hendelse | System | Nivå |
|----------|--------|------|
| Server action kalt | GCP (`type: server-action`) | `info` |
| Server action feilet | GCP + Sentry | `error` |
| HTTP-forespørsel 2xx | GCP (`type: http`) | `info` |
| HTTP-forespørsel 4xx | GCP (`type: http`) | `warning` |
| HTTP-forespørsel 5xx | GCP (`type: http`) | `error` |
| GraphQL-kall 2xx | GCP (`type: graphql`) | `info` |
| GraphQL-kall 4xx | GCP (`type: graphql`) | `warning` |
| GraphQL-kall 5xx | GCP + Sentry | `error` |
| GraphQL timeout | GCP + Sentry | `error` |
| Feil fra tavla-visning | GCP (`type: tavla-visning`) | `error` |
| Klientside unntak (med samtykke) | Sentry | – |
| Aktive tavle-sesjoner | Prometheus/Grafana | – |
