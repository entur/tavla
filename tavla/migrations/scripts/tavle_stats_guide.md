# Tavle-statistikk (tavle_stats.py)

Denne veiledningen beskriver hvordan du kjører skriptet `tavle_stats.py`, hva som kreves på forhånd, og hvordan de ulike tallene i rapporten beregnes. Dokumentet er tilpasset både tekniske og ikke-tekniske lesere.

---

## Hva skriptet gjør

`tavle_stats.py` henter nøkkeltall om Tavla-tjenesten og skriver en dagsrapport i tekstformat. Rapporten dekker:

-   Antall tavler i databasen og hvor mange som er aktive nå.
-   Antall registrerte brukere og mapper.
-   Fordeling av fargepaletter som er brukt på tavlene (alle vs. aktive).
-   Hvor mange aktive tavler som finnes i hvert fylke, samt tavler der fylke ikke kunne bestemmes.
-   (Valgfritt) GeoJSON-fil med koordinater for tavlene som er aktive nå.

Under kjøring logger skriptet fremdriften slik at du kan følge med på hva som skjer.

---

## Forutsetninger

1. **Repo og gren**

    - Vær i prosjektmappen `tavla/` (enten i rotmappen eller under `tavla/`).

2. **Tilganger og nøkler**

    - Filen `.env.local` i prosjektroten må inneholde nøkkelen `BACKEND_API_KEY=<token>` slik at vi får kontakt med heartbeat-API-et.
    - Servicekonto-filene `ent-tavla-prd-54ef424ea2f0.json` (prod) og/eller `ent-tavla-dev-875a70280651.json` må ligge i samme mappe som `package.json` (repo-roten). Disse brukes av Firestore-klienten.

3. **Python-miljø**
    - Bruk gjerne repoets virtuelle miljø: `source tavla/python-venv/bin/activate` (macOS/Linux) eller tilsvarende for Windows.
    - `requests` og `firebase-admin` følger allerede med i dette miljøet.

---

## Hvordan kjøre skriptet

### Mest vanlige kommandoer

Fra repo-roten (`/tavla`):

```bash
python tavla/migrations/scripts/tavle_stats.py
```

Fra mappen `tavla/` (Next.js-prosjektet):

```bash
python migrations/scripts/tavle_stats.py
```

Skriptet håndterer arbeidskatalogen automatisk, så du kan starte det fra begge steder.

### Ekstra funksjon: eksport av tavle-lokasjoner

Du kan i samme kjøring generere en GeoJSON-fil med koordinater for tavlene som er aktive nå.

```bash
python tavla/migrations/scripts/tavle_stats.py --export-locations
```

Valgfritt kan du angi en egen filbane:

```bash
python tavla/migrations/scripts/tavle_stats.py --export-locations --locations-path /tmp/tavle-locations.geojson
```

### Resultater

-   Rapportfilen havner i `tavla/migrations/scripts/` og heter `tavle-tall-<DD-MM-YYYY>.txt` (for eksempel `tavle-tall-22-10-2025.txt`).
-   GeoJSON-filen (hvis generert) heter `board_locations.geojson` i samme mappe, hvis du ikke oppgir en annen sti.

---

## Hvordan tallene beregnes

| Rapportlinje                         | Datasett                                      | Metode                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Totalt antall tavler i databasen** | Firestore `boards`-samlingen                  | Skriptet teller alle dokumenter i `boards`.                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Aktive tavler (heartbeat)**        | `https://tavla-api.entur.no/heartbeat/active` | API-et returnerer én rad per tavle som nylig har sendt puls. Skriptet viser både antall linjer (inkludert duplikater) og antallet unike tavle-ID-er.                                                                                                                                                                                                                                                                                                     |
| **Antall brukere**                   | Firestore `users`                             | Bruker Firestore sitt innebygde `count()`-aggregat, og faller tilbake til å iterere alle dokumenter hvis aggregatet ikke er tilgjengelig.                                                                                                                                                                                                                                                                                                                |
| **Antall mapper**                    | Firestore `folders`                           | Samme metode som for `users`.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Paletter (alle tavler)**           | Firestore `boards`                            | Teller feltet `transportPalette` på alle tavler, og grupperer per palettenavn. Manglende verdi registreres som `(ikke-valgt)`.                                                                                                                                                                                                                                                                                                                           |
| **Paletter (aktive tavler)**         | Kombinasjon av Firestore og heartbeat-data    | Filtrer palettfordelingen til kun de tavlene som var aktive i heartbeat-responsen.                                                                                                                                                                                                                                                                                                                                                                       |
| **Aktive tavler per fylke**          | Firestore `boards`, Entur API-er              | For hver aktiv tavle henter skriptet `placeId` fra tavlens `tiles`. Hver `placeId` slås opp mot Entur sitt stoppesteds-API (stop place eller quay). Skriptet forsøker først å identifisere fylket via `topographicPlaceRef`; hvis det ikke finnes, bestemmes fylket ved å reverse-geokode koordinatene. Tavlen teller i alle fylker som oppdages (dersom tavlen dekker stopp i flere fylker). Tavler uten funn havner i listen «Tavler uten fylke-data». |

### Logger og varsler

-   Under kjøringen logger skriptet hvert hovedsteg (henter data, initierer Firestore, beregner fordelinger osv.).
-   Hvis summen av fylker ikke stemmer med antall aktive tavler, skriver skriptet en advarsel i loggen. Dette kan skje dersom én tavle dekker stopp i flere fylker.
-   Det logges også når tavler mangler fylkesdata, slik at du kan følge opp manuelt om ønskelig.

---

## Feilsøking

| Problem                              | Årsak                                          | Løsning                                                                                                                     |
| ------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `FileNotFoundError` for `.env.local` | Filen ligger ikke på riktig sted               | Sørg for at `.env.local` ligger i repo-roten og inneholder `BACKEND_API_KEY`.                                               |
| `FileNotFoundError` for servicekonto | Firebase-sertifikatet er flyttet eller mangler | Legg `ent-tavla-prd-54ef424ea2f0.json` (og dev-sertifikatet ved behov) i repo-roten. Skriptet finner dem automatisk derfra. |
| 401/403-feil fra heartbeat-API       | API-nøkkelen er feil eller utløpt              | Oppdater `BACKEND_API_KEY` i `.env.local`.                                                                                  |
| Tom GeoJSON                          | Ingen aktive tavler hadde koordinatdata        | Kontroller at tavlene har `tiles` med gyldige `placeId`-verdier.                                                            |

---

## Når bør skriptet kjøres?

-   Ved slutten av hver uke eller måned for faste statusrapporter.
-   Før møter der teamet trenger oppdaterte nøkkeltall.
-   Når du vil kontrollere effekten av større endringer i tavleinnhold eller distribusjon.

For faste «dashboard»-oppdateringer kan du automatisere kjøringen via cron eller GitHub Actions, men manuell kjøring gir god kontroll når datakilder endres.

---

## Kontakt og videre arbeid

-   Meld fra i #team-tavla hvis skriptet gir uventede resultater.
-   Forslag til forbedringer (flere nøkkeltall, andre eksportformater osv.) kan logges i Jira under «Tavle-statistikk».

Med denne veiledningen skal du komme raskt i gang, uansett om du jobber med kode til daglig eller bare trenger rapporten som beslutningsgrunnlag.
