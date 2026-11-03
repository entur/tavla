# Monitorering og alarmer i Tavla

Tavla har alarmer i Grafana som sender varsel til Slack. Alarmene bygger på BigQuery-spørringer mot loggene som tavla-admin skriver. Hva som logges, og hvordan man spør mot loggene, står i [logging.md](logging.md).

- **Slack-kanal:** `#alerts-tavla`
- **Grafana-mappe:** `team-tavla`

Spørringer, terskler og andre detaljer står i selve alarmreglene i Grafana. Denne fila beskriver bare hvilke alarmer som finnes og hvordan man lager nye.

---

## Alarmene

| Alarm | Går når | Kilde i loggene |
|-------|---------|-----------------|
| Lav trafikk til journey-planner | Tavlene henter mye færre avganger enn normalt | `type: 'tavla-visning'`, `errorCode: 'fetch_journey_planner'`, `info` |
| Høy feilrate mot journey-planner | En stor andel av kallene til journey-planner feiler | Samme, `info` og `error`, uten skjermer som er offline |
| Feil ved henting av tavler | `/api/board` gir serverfeil | `type: 'http'`, `path: '/api/board'`, `error` |
| Feil i server actions | Flere server actions feiler i løpet av en time | `type: 'server-action'`, `error` |
| Visningsfeil i tavla-visning | Flere tavler krasjer i ErrorBoundary i løpet av en time | `type: 'tavla-visning'`, `errorCode: 'display_error'`, `error` |

Lav trafikk kan også bety at `/api/report-log` i tavla-admin er nede, ikke at journey-planner er det. Da kommer det ingen logger, selv om skjermene fungerer.

---

## Lage en ny alarm

### 1. Skriv spørringen

Spørringen skal returnere én rad med et tidspunkt og én tallverdi:

```sql
SELECT
  CURRENT_TIMESTAMP() AS time,
  COUNT(*) AS feil
FROM `ent-tavla-prd.tavla_prd_logs._Default`
WHERE log_id = 'tavla_admin'
  AND severity = 'ERROR'
  AND STRING(json_payload.type) = '<type>'
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 65 MINUTE)
  AND timestamp <  TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 5 MINUTE)
```

- **Bruk et rullerende vindu**, ikke `TIMESTAMP_TRUNC(timestamp, HOUR)`. Inneværende time er bare delvis fylt og ser alltid lav ut.
- **Hopp over de siste 5 minuttene.** Loggene bruker litt tid på å komme inn, og logger fra tavla-visning kan komme forsinket.
- **Ikke bruk `GROUP BY`.** Da gir spørringen `0` og ikke et tomt resultat når det ikke finnes rader, og du slipper «No data» når alt er i orden.
- **Pass på at du ikke teller samme feil to ganger.** Firestore-feil logges både som `firestore` og hos kalleren (se [logging.md](logging.md)).

### 2. Kalibrer terskelen

Se på verdien per time over minst én uke før du setter terskelen:

```sql
SELECT
  TIMESTAMP_TRUNC(timestamp, HOUR) AS time,
  COUNT(*) AS totalt,
  COUNTIF(severity = 'ERROR') AS feil
FROM `ent-tavla-prd.tavla_prd_logs._Default`
WHERE log_id = 'tavla_admin'
  AND severity IN ('INFO', 'ERROR')
  AND STRING(json_payload.type) = '<type>'
  AND timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY time
ORDER BY time
```

- **Varierer verdien lite gjennom døgnet**, holder det med en fast terskel godt under den laveste normale timen (for lav trafikk), eller godt over den høyeste (for feil).
- **For feilrate:** 3–5 ganger den høyeste normale timen er et godt utgangspunkt.
- **Er grunnivået nær null**, alarmer på antall feil i stedet for rate. En liten terskel, for eksempel 3–5 i timen, unngår varsel for enkeltstående feil.
- **Dominerer én action eller kode feilene**, sjekk om forventede tilfeller (manglende tilgang, ugyldig input) logges som `error`. Rett heller loggnivået enn å heve terskelen.

### 3. Sett opp regelen i Grafana

1. Lag regelen i mappa `team-tavla`, med BigQuery som datakilde.
2. **Alert condition:** `Last` på tallverdien, deretter `IS ABOVE` eller `IS BELOW`. Ikke bruk `Count`. Den teller antall rader, som alltid er 1.
3. **Evaluering:** hvert 15. minutt holder. Hver evaluering er en BigQuery-spørring, så ikke evaluer oftere enn nødvendig.
4. **Pending period:** 15 minutter for rater og trafikk, slik at alarmen ikke slår av og på. For antall feil summert over en time kan den stå på 0.
5. **No data:** *Alerting* hvis manglende data betyr at noe er galt (for eksempel trafikk). Ellers *OK*.
6. **Varsling:** send til `#alerts-tavla`. Skriv i beskrivelsen hva alarmen betyr og hvor man ser først når den går.

### 4. Oppdater tabellen over

Legg til den nye alarmen i tabellen øverst i denne fila.
