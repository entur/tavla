---
name: tavla-bigquery
description: >
  Skriv, forklar og debug BigQuery-spørringer mot Tavla sitt Firestore-datasett i GCP.
  Bruk denne skillen når noen spør om statistikk, analyse, telling, aktivitetsdata,
  innholdsanalyse eller migrasjonsvalidering av Tavla-boards, mapper eller brukere i BigQuery.
  Trigger også ved spørsmål som "hvor mange boards har X", "finn boards som mangler Y",
  "boards som ikke har vært aktive", "boards med linje-ID Z", eller generelt når noen
  vil hente innsikt fra Firestore-eksportdata eller trenger SQL mot Tavla-databasen.
---

# Tavla BigQuery

Tavla eksporterer Firestore-data til BigQuery via Firebase Extension.

## Tabeller

| Tabell | Firestore-samling |
|---|---|
| `ent-tavla-prd.firestore_export.boards_raw_latest` | `boards` |
| `ent-tavla-prd.firestore_export.folders_raw_latest` | `folders` |
| `ent-tavla-prd.firestore_export.users_raw_latest` | `users` |

Hvert rad tilsvarer ett dokument i sin siste kjente tilstand:

| Kolonne | Type | Beskrivelse |
|---|---|---|
| `document_id` | STRING | Firestore dokument-ID |
| `document_name` | STRING | Full Firestore-sti |
| `timestamp` | TIMESTAMP | Tidspunkt for siste endring |
| `operation` | STRING | `INSERT` / `UPDATE` / `DELETE` |
| `data` | STRING | JSON-streng med dokumentinnhold |

> **`_raw_latest` viser alltid siste tilstand per dokument** — ingen deduplisering nødvendig.
> Legg alltid til `WHERE operation != 'DELETE'` for å utelukke slettede dokumenter.

---

## Schema: boards

Avledet fra `tavla/src/types/db-types/boards.ts` (Zod-validert).

```
$.id                           STRING   — påkrevd
$.isCombinedTiles              BOOLEAN  — påkrevd (eneste påkrevde boolske felt)
$.theme                        STRING?  — 'dark' | 'light'
$.hideLogo                     BOOLEAN?
$.hideClock                    BOOLEAN?
$.customUrl                    STRING?  — egendefinert URL-slug
$.isAnonymousBoard             BOOLEAN? — board uten innlogget eier
$.transportPalette             STRING?  — 'default'|'blue-bus'|'green-bus'|'atb'|'fram'|'reis'

$.meta.title                   STRING?
$.meta.created                 INT64?   — Unix millisekunder
$.meta.dateModified            INT64?   — Unix millisekunder
$.meta.lastActiveTimestamp     INT64?   — Unix millisekunder (sist vist i nettleser)
$.meta.fontSize                STRING?  — 'small'|'medium'|'large'
$.meta.location.name           STRING?
$.meta.location.coordinate.lat NUMBER?
$.meta.location.coordinate.lng NUMBER?

$.tiles                        JSON     — array av holdeplass-fliser, se under
```

Flise-struktur (ett element i `$.tiles`-arrayen):
```
uuid            STRING  — påkrevd
name            STRING  — påkrevd
stopPlaceId     STRING  — påkrevd (NSR-ID, f.eks. 'NSR:StopPlace:59872')
quays[]         ARRAY   — [{id: STRING, whitelistedLines: STRING[]}]
walkingDistance OBJECT? — {distance?: NUMBER, visible?: BOOLEAN}
offset          NUMBER? — forsinkelsesoffset i minutter
displayName     STRING?
columns         STRING[]? — ['aimedTime'|'arrivalTime'|'line'|'destination'|'name'|'platform'|'time']
county          STRING?
```

---

## Schema: folders

Avledet fra `tavla/src/types/db-types/folders.ts`.

```
$.id            STRING   — påkrevd
$.name          STRING?
$.owners        STRING[]? — array av bruker-UIDs
$.boards        STRING[]? — array av board-IDer
$.logo          STRING?
```

---

## Schema: users

Avledet fra `tavla/src/types/db-types/users.ts`.

```
$.uid           STRING   — påkrevd
$.owner         STRING[]? — array av board-IDer brukeren eier
```

---

## Kjerneprinsipper

- Bruk alltid `COUNT(DISTINCT document_id)` for å telle unike dokumenter
- Bruk CTE-er (`WITH ...`) for gjenbrukbare subqueries
- `JSON_VALUE` returnerer skalarverdier; `JSON_QUERY` returnerer rå JSON-objekter
- `JSON_VALUE` når ikke inn i arrays — bruk `REGEXP_CONTAINS` for å søke i `$.tiles`, `$.owners`, `$.boards`, etc.
- **Boolske felt** returneres som strengene `'true'` / `'false'`
- **Valgfrie felt** (`?`) kan være `NULL` i BigQuery — sjekk `IS NULL` vs `IS NOT NULL`
- `$.isCombinedTiles` er det eneste boolske toppnivå-feltet som er *påkrevd* — alle andre boolean-felt kan være udefinert

## Tidsstempel-sammenligninger

Tidsstempler lagres som **Unix millisekunder (INT64)**:

```sql
WITH cutoff AS (
  SELECT UNIX_MILLIS(TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)) AS ms
)
SELECT ...
WHERE CAST(JSON_VALUE(data, '$.meta.lastActiveTimestamp') AS INT64) > (SELECT ms FROM cutoff)
```

---

## Mal-spørringer

### Fordeling av verdier for ett felt

```sql
SELECT
  CASE
    WHEN JSON_VALUE(data, '$.FELTNAVN') IS NULL   THEN 'ikke definert'
    WHEN JSON_VALUE(data, '$.FELTNAVN') = 'true'  THEN 'true'
    WHEN JSON_VALUE(data, '$.FELTNAVN') = 'false' THEN 'false'
    ELSE JSON_VALUE(data, '$.FELTNAVN')
  END AS verdi,
  COUNT(DISTINCT document_id) AS antall
FROM `ent-tavla-prd.firestore_export.boards_raw_latest`
WHERE operation != 'DELETE'
GROUP BY 1
ORDER BY 2 DESC
```

### Boards som mangler et felt

```sql
SELECT COUNT(DISTINCT document_id) AS antall_uten_felt
FROM `ent-tavla-prd.firestore_export.boards_raw_latest`
WHERE operation != 'DELETE'
  AND JSON_VALUE(data, '$.FELTNAVN') IS NULL
```

### Aktive boards siste N dager

```sql
WITH cutoff AS (
  SELECT UNIX_MILLIS(TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)) AS ms
)
SELECT COUNT(DISTINCT document_id) AS antall_aktive
FROM `ent-tavla-prd.firestore_export.boards_raw_latest`
WHERE operation != 'DELETE'
  AND CAST(JSON_VALUE(data, '$.meta.lastActiveTimestamp') AS INT64) > (SELECT ms FROM cutoff)
```

### Boards med en bestemt linje-ID (søk i tiles-array)

```sql
WITH line_ids AS (
  SELECT lineId FROM UNNEST(['NSB:Line:R10', 'NSB:Line:L1']) AS lineId
)
SELECT
  line_ids.lineId,
  COUNT(DISTINCT b.document_id) AS antall_boards
FROM `ent-tavla-prd.firestore_export.boards_raw_latest` b
CROSS JOIN line_ids
WHERE b.operation != 'DELETE'
  AND REGEXP_CONTAINS(b.data, CONCAT('"', line_ids.lineId, '"'))
GROUP BY 1
ORDER BY 2 DESC
```

### Migrasjonsvalidering — boards som trenger oppdatering

```sql
SELECT
  COUNT(DISTINCT document_id) AS antall_mangler,
  ROUND(
    COUNT(DISTINCT document_id) * 100.0
    / (SELECT COUNT(DISTINCT document_id)
       FROM `ent-tavla-prd.firestore_export.boards_raw_latest`
       WHERE operation != 'DELETE'),
    1
  ) AS prosent_av_totalt
FROM `ent-tavla-prd.firestore_export.boards_raw_latest`
WHERE operation != 'DELETE'
  AND JSON_VALUE(data, '$.FELTNAVN') IS NULL
```

### Kombinert aktivitets- og feltanalyse

```sql
WITH one_year_ago AS (
  SELECT UNIX_MILLIS(TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 365 DAY)) AS ms
)
SELECT
  CASE
    WHEN JSON_VALUE(data, '$.FELTNAVN') IS NULL   THEN 'ikke definert'
    WHEN JSON_VALUE(data, '$.FELTNAVN') = 'true'  THEN 'true'
    WHEN JSON_VALUE(data, '$.FELTNAVN') = 'false' THEN 'false'
  END AS verdi,
  COUNT(DISTINCT document_id) AS antall_boards,
  COALESCE(LOGICAL_OR(
    CAST(JSON_VALUE(data, '$.meta.lastActiveTimestamp') AS INT64) > (SELECT ms FROM one_year_ago)
  ), FALSE) AS noen_aktive_siste_ar
FROM `ent-tavla-prd.firestore_export.boards_raw_latest`
WHERE operation != 'DELETE'
GROUP BY 1
ORDER BY 2 DESC
```

### Mapper med antall boards og eiere

```sql
SELECT
  document_id AS folder_id,
  JSON_VALUE(data, '$.name') AS navn,
  ARRAY_LENGTH(JSON_VALUE_ARRAY(data, '$.boards'))  AS antall_boards,
  ARRAY_LENGTH(JSON_VALUE_ARRAY(data, '$.owners')) AS antall_eiere
FROM `ent-tavla-prd.firestore_export.folders_raw_latest`
WHERE operation != 'DELETE'
ORDER BY antall_boards DESC
```

### Boards koblet til en mappe (join boards ↔ folders)

```sql
SELECT
  f.document_id AS folder_id,
  JSON_VALUE(f.data, '$.name') AS mappe_navn,
  b.document_id AS board_id,
  JSON_VALUE(b.data, '$.meta.title') AS board_tittel
FROM `ent-tavla-prd.firestore_export.folders_raw_latest` f
JOIN `ent-tavla-prd.firestore_export.boards_raw_latest` b
  ON REGEXP_CONTAINS(f.data, CONCAT('"', b.document_id, '"'))
WHERE f.operation != 'DELETE'
  AND b.operation != 'DELETE'
```
