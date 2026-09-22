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

await logToGcp(level: LogLevel, message: string, extra: LogExtra?, type?: LogType)
```

| Parameter | Type                 | Beskrivelse                                                                            |
|-----------|----------------------|----------------------------------------------------------------------------------------|
| `level` | `LogLevel`           | Alvorlighetsgrad                                                                       |
| `message` | `string`             | Loggmeldingen – format bestemmer `type` automatisk (se under)                          |
| `extra` | `LogExtra` (valgfri) | Ekstre felter og informasjon                                                           |
| `type` | `LogType` (valgfri)  | Overstyrer automatisk typedeteksjon; bruk `'tavla-visning'` for feil fra visningsappen |

### GCP loggnivåer

| Nivå | Når |
|------|-----|
| `debug` | Detaljert informasjon for feilsøking – brukes sjelden i prod |
| `info` | Normal operasjon, vellykkede kall |
| `warning` | Uventede men håndterbare tilstander (f.eks. 4xx-statuskoder, rate-limiting) |
| `error` | Feil som krever oppmerksomhet (5xx-statuskoder, unntak, timeout) |

### Automatisk typedeteksjon fra meldingsformat

`logToGcp` analyserer meldingsteksten og setter `type`-feltet i loggen automatisk. Bruk disse konvensjonene konsekvent:

#### Server Actions – `type: "server-action"`

Meldinger som starter med `action:` registreres som server actions.

```typescript
logToGcp('info', 'action:deleteBoard invoked', { bid: boardId })
logToGcp('error', 'action:createFolder failed', { folderId })
```

Resulterende JSON-payload:

```json
{
  "type": "server-action",
  "action": "deleteBoard",
  "message": "action:deleteBoard invoked",
  "bid": "<board-id>"
}
```

#### HTTP-endepunkter – `type: "http"`

Meldinger som starter med en HTTP-metode (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) etterfulgt av et mellomrom.

```typescript
logToGcp('warning', 'POST /api/upload: status=401 reason=invalid-token')
logToGcp('info', 'POST /api/upload: status=200', { folderId })
```

Resulterende JSON-payload:

```json
{
  "type": "http",
  "method": "POST",
  "status": 401,
  "message": "POST /api/upload: status=401 reason=invalid-token"
}
```

#### GraphQL-kall – `type: "graphql"`

Meldinger som starter med `GraphQL ` etterfulgt av endepunktnavnet.

```typescript
logToGcp('info', 'GraphQL journey-planner: status=200')
logToGcp('error', 'GraphQL journey-planner: status=500')
```

Resulterende JSON-payload:

```json
{
  "type": "graphql",
  "endpoint": "journey-planner",
  "status": 200,
  "message": "GraphQL journey-planner: status=200"
}
```

Loggnivå settes automatisk i GraphQL-fetcheren basert på statuskode:
- 2xx → `info`
- 4xx → `warning`
- 5xx → `error`

#### Feil fra tavla-visning – `type: "tavla-visning"`

Brukes kun via `/api/report-error`-endepunktet (se seksjon 3). Send eksplisitt `type`-parameter.

```typescript
logToGcp('error', `[tavla-visning] ${errorCode} reported from ${boardId} with message: ${message}`, extra, 'tavla-visning')
```

### `LogExtra`-felter

Ekstra strukturerte felter som sendes med loggen for enkel filtrering:

| Felt | Type | Beskrivelse |
|------|------|-------------|
| `bid` | `string` | Tavle-ID |
| `folderId` | `string` | Mappe-ID |
| `status` | `number` | HTTP-statuskode |
| `path` | `string` | URL-sti |
| `errorCode` | `string` | Applikasjonsspesifikk feilkode |
| `userAgent` | `string` | User-agent-streng fra forespørselen |

### Sikkerhet mot log injection

Alle verdier saniteres før logging: linjeskift (`\r`, `\n`, Unicode-linjeskillere) erstattes med mellomrom og kontrollkarakterer strippes. Dette forhindrer log injection-angrep.

---

## 2. Bruke logging i kode

### I en server action

```typescript
'use server'
import { logToGcp } from 'src/utils/logging'

export async function deleteBoard(bid: string) {
    logToGcp('info', 'action:deleteBoard invoked', { bid })
    // ...
    logToGcp('error', 'action:deleteBoard failed', { bid })
}
```

### I et API-endepunkt (route handler)

```typescript
import { logToGcp } from 'src/utils/logging'

export async function POST(req: NextRequest) {
    // ...
    logToGcp('warning', 'POST /api/mitt-endepunkt: status=403', { bid: boardId })
    // ...
    logToGcp('info', 'POST /api/mitt-endepunkt: status=200', { bid: boardId })
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
        errorCode: 'display_error', // eller 'unknown', 'fetch_journey_planner'
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
- **Ressurstype**: `global`

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

Disse metrikkene kan skrapes av Prometheus og visualiseres i Grafana for å overvåke sanntidsbelastning på tjenesten.

---

## 7. Lokal utvikling

I lokalt utviklingsmiljø (`NODE_ENV=development`) skrives alle GCP-logger til konsollen i stedet:

```json
{
  "severity": "INFO",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "type": "server-action",
  "action": "getFirebaseClientConfig",
  "message": "action:getFirebaseClientConfig invoked"
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
