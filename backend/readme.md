# Backend – lokal kjøring og arkitektur

Kort: Denne backend-tjenesten eksponerer enkle endepunkter for å trigge og distribuere oppdateringer (refresh/update) til tavler via Redis pub/sub og long-polling (/subscribe). Ingen persistens utover Redis, og minimal logikk (tynt mellomlag).

---

## Hurtigstart

For deg som bare vil kjøre lokalt raskt (for utvikling mot frontend):

1. Installer Rust (anbefaler installering og administrering gjennom rustup) og Redis (Last ned Redis her: [Redis – kom i gang](https://redis.io/docs/latest/get-started/))
2. Start to Redis-instanser (master på 6379, replica på 6380) med passord
3. Eksporter miljøvariabler (se tabell)
4. `cargo run` i `backend/`
5. Test: `curl localhost:3001/alive` og `curl localhost:3001/active -H "Authorization: Bearer super_secret_key"`
6. Endre frontend `getBackendUrl()` midlertidig til `http://127.0.0.1:3001` og sett `.env.local` med `BACKEND_API_KEY`

Detaljer under dersom noe feiler.

---

## Detaljert oppsett av Redis (master/replica lokalt)
Siden vi kjører stacken på Kubernetes i produksjon trenger vi lokalt å simulere en master/replica-struktur. (Du kan også kjøre alt i et lokalt Kubernetes-kluster som Minikube hvis du ønsker.)

Vi simulerer produksjonsmiljøets master/replica:

1. Start master-instansen. Når du kjører `redis-server` med `-` som input leses konfigurasjon fra stdin. Vi må sette passord for både master og replica.
    ```sh
    redis-server -
    ```

    


    Du skal se noe ala:
    ```sh
    ~ > redis-server -
    82635:C 20 Aug 2024 10:20:39.350 * Reading config from stdin
    ```
    Skriv inn konfigurasjonen:
    ```sh
    masterauth super_secret_redis_pw
    requirepass super_secret_redis_pw
    ```

Terminalen ser da slik ut:
```sh
~ > redis-server -
82635:C 20 Aug 2024 10:20:39.350 * Reading config from stdin
masterauth super_secret_redis_pw
requirepass super_secret_redis_pw
```
Avslutt konfigurering av første instans med `CTRL-D`.
2. Start replica i ny terminal:
    ```sh
    redis-server -
    ```

    Du skal se:
    ```sh
    ~ > redis-server -
    82635:C 20 Aug 2024 10:20:39.350 * Reading config from stdin
    ```

Skriv inn konfigurasjonen:
```sh
masterauth super_secret_redis_pw
requirepass super_secret_redis_pw
port 6380
replicaof 127.0.0.1 6379
```

Terminalen ser da slik ut:
```sh
~ > redis-server -
82635:C 20 Aug 2024 10:20:39.350 * Reading config from stdin
masterauth super_secret_redis_pw
requirepass super_secret_redis_pw
port 6380
replicaof 127.0.0.1 6379
```

Avslutt med `CTRL-D`.
3. Verifiser Redis / sett teller:
Koble til Redis i en ny terminal:

Koble til Redis i en ny terminal:

```sh
redis-cli
```

Autentiser deg:
```sh
auth super_secret_redis_pw
```

Sett `active_boards` (teller for aktive tavler) til 0:
```sh
set active_boards 0
```

Avslutt `redis-cli` med `CTRL-C`.

## Miljøvariabler

| Variabel | Påkrevd | Default | Beskrivelse |
|----------|---------|---------|-------------|
| HOST | Nei | 127.0.0.1 | Adresse server binder til |
| PORT | Nei | 3001 | HTTP-port |
| BACKEND_API_KEY | Ja | – | Bearer-token for beskyttede endepunkt |
| REDIS_PASSWORD | Ja | – | Passord for både master og replica |
| REDIS_MASTER_SERVICE_HOST | Ja | – | Host til master (127.0.0.1 lokalt) |
| REDIS_MASTER_SERVICE_PORT | Ja | 6379 | Port til master |
| REDIS_REPLICAS_SERVICE_HOST | Ja | – | Host til replica |
| REDIS_REPLICAS_SERVICE_PORT | Ja | 6380 | Port til replica |

Eksempel (kan limes rett inn):
```sh
export HOST="127.0.0.1"
export PORT="3001"
export BACKEND_API_KEY="super_secret_key"
export REDIS_PASSWORD="super_secret_redis_pw"
export REDIS_MASTER_SERVICE_HOST="127.0.0.1"
export REDIS_MASTER_SERVICE_PORT="6379"
export REDIS_REPLICAS_SERVICE_HOST="127.0.0.1"
export REDIS_REPLICAS_SERVICE_PORT="6380"
```

---

## Kjør

Kjør fra `backend`-mappen:
```sh
cargo run
```

## Verifiser

Test at serveren svarer:
```sh
curl localhost:3001/active -H "Authorization: Bearer super_secret_key"
```
Dette skal returnere `0` (siden du nettopp satte telleren til 0).

## Koble mot frontend

For at frontend skal bruke din lokale backend må backend-URL midlertidig endres. **Ikke commit denne endringen.**

Gå til `tavla/src/Shared/utils/index.ts` og endre funksjonen `getBackendUrl` til:
```ts
export function getBackendUrl() {
    return 'http://127.0.0.1:3001'
}
```

Frontend trenger også en `.env.local` i `tavla/tavla` med:
```
BACKEND_API_KEY="super_secret_key"
```

Ikke legg denne filen i git. Du skal nå kunne trykke «Oppdater tavle» lokalt.

---

## Arkitektur og flyt

Backend fungerer som et tynt lag mellom frontend og Redis pub/sub:

1. Frontend kaller REST-endepunkt (for eksempel `/refresh/:bid`).
2. Backend publiserer en melding til Redis-kanalen for den aktuelle tavlen (eller til felleskanalen `update`).
3. Frontend holder et long-poll-liknende kall mot `/subscribe/:bid` som returnerer første relevante hendelse (eller timeout etter ~55 sekunder).
4. Antall aktive tavler spores i Redis-nøkkelen `active_boards` (inkrement/dekrement via Guard-mekanisme i koden).

Kanaler i Redis:
- `update` – brukes for generelle oppdateringer som gjelder alle tavler
- `<board-id>` – spesifikk kanal for én tavle

Timeout-mønsteret gjør at klienten må fornye abonnement med jevne intervaller (unngår hengende forbindelser).

## Endepunkter (oversikt)

| Metode | Path | Auth | Beskrivelse |
|--------|------|------|-------------|
| GET | `/alive` | Nei | Health check (kobling til Redis) |
| GET | `/active` | Ja (Bearer) | Returnerer antall aktive tavler (`active_boards`) |
| GET | `/active/bids` | Ja (Bearer) | Liste over aktive tavlekanaler og teller |
| GET | `/subscribe/:bid` | (Ingen i dag) | Long-poll: venter på hendelse / timeout |
| POST | `/refresh/:bid` | Ja (Bearer) | Publiserer refresh-hendelse med payload |
| POST | `/update/:bid` | Ja (Bearer) | Publiserer update for én tavle |
| POST | `/update` | Ja (Bearer) | Publiserer update til alle |
| POST | `/reset` | Ja (Bearer) | Nullstiller `active_boards` etter å ha trigget update |

> Merk: `/subscribe/:bid` har per nå ingen autentisering – vurder om dette bør endres.

## Endepunkter (detaljert)

### GET /alive
Returnerer 200 hvis Redis er tilgjengelig (master + replica). Ellers 500.

### GET /active
Krever bearer-token. Returnerer et heltall (plain text) med antall aktive tavler.

### GET /active/bids
Krever bearer-token. Returnerer JSON:
```json
{
    "channels": ["board_123", "board_456"],
    "count": 2
}
```

### GET /subscribe/:bid
Abonnerer på tavle-ID `:bid` + felleskanalen `update`. Returnerer første hendelse eller timeout (ca. 55s):
```json
{ "type": "refresh", "payload": { /* valgfri JSON */ } }
{ "type": "update" }
{ "type": "timeout" }
```

### POST /refresh/:bid
Publiserer en refresh med egendefinert payload.
Body: vilkårlig JSON. Eksempel:
```json
{ "reason": "manual", "ts": 1737623891 }
```
Respons: 200.

### POST /update/:bid
Publiserer en generell `update` for én tavle. Ingen payload nødvendig.

### POST /update
Publiserer et `update`-signal som gjelder alle tavler.

### POST /reset
Publiserer først en `update` til alle, venter noen sekunder og setter deretter `active_boards = 0`.

## Meldingsmodeller

Publisering til Redis (internt):
- `BoardAction::Refresh { payload }`
- `BoardAction::Update`

Respons fra `/subscribe/:bid`:
- `{ "type": "refresh", "payload": { ... } }`
- `{ "type": "update" }`
- `{ "type": "timeout" }`

## Feilhåndtering og statuskoder

| Status | Situasjon | Body |
|--------|-----------|------|
| 200 | Suksess | Varierende (tekst eller JSON) |
| 401 | Feil / manglende bearer | Tom body |
| 500 | Intern feil (Redis, serialisering, osv.) | Tom body |

`AppError` konverterer alle feil til en generisk 500 uten detaljlekkasje.

## Typiske feilsituasjoner 

| Problem | Årsak | Løsning |
|---------|-------|--------|
| 401 Unauthorized | Feil token | Sjekk verdien i frontend `.env.local` vs backend eksport |
| `/subscribe` gir kun timeout | Ingen publisering skjer | Test med `POST /refresh/:bid` og se om klient får svar |
| `active_boards` blir ikke 0 | Klienter forsvinner uten opprydding | Kall `/reset` eller sett nøkkelen manuelt |
| 500 på /alive | Redis utilgjengelig | Sjekk at begge instanser kjører og passord stemmer |
| Ingen endring i UI | Feil tavle-ID brukt | Verifiser `:bid` i både subscribe og refresh-kall |

