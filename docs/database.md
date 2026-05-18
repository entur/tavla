# Database

## Innholdsfortegnelse

- [🔥 Firebase til database](#-firebase-til-database)
- [🔗 Koble til dev-databasen lokalt](#-koble-til-dev-databasen-lokalt)
- [🗄️ Migrering av database](#️-migrering-av-database)
- [📂 Oppdatering og sletting av felter i database](#-oppdatering-og-sletting-av-felter-i-database)
- [❌ Hvordan forholder vi oss til data som ikke lengre brukes?](#-hvordan-forholder-vi-oss-til-data-som-ikke-lengre-brukes)
- [🛡️ Sikkerhetskopiering og rollback av database](#️-sikkerhetskopiering-og-rollback-av-database)

---

## 🔥 Firebase til database

### Hva er lagret hvor?

Vi bruker Firebase for å lagre tavler, mapper og brukere (boards, organizations og users). Kjører du lokalt, finner du Firebase sin Firestore her: http://127.0.0.1:4000/firestore/data/boards

> Tips: kjører du `yarn dev:persist` så lagres brukere, tavler og orgs du har på localhost mellom hver gang du kjører.

Hvert objekt i Firebase har en unik id, og er ellers strukturert nokså likt som deres respektive kode-objekter (`TBoard`, `TOrganization`, `TUser`). Husk at selv om Firebase ikke er en relasjonsdatabase, har vi definitivt masse relasjoner mellom disse kategoriene (f.eks.: et board kan eies av en mappe, en mappe inneholder en viss mengde brukere, en bruker kan ha en viss mengde private boards, osv.), og disse må tas høyde for når man skriver nye / endrer på Firebase-operasjoner i koden.

Selv om vi har en Redis-database, er ingenting lagret her. Den brukes utelukkende for sin pubsub-funksjonalitet. I Redis ligger det derfor aldri noen brukere, mapper eller tavler lagret.

### Åpen config for firebase

Filen `tavla/app/(innlogget)/utils/constants.ts` inneholder en del config-nøkler som kunne sett ut som at de skulle vært hemmelige, men det trenger de ikke være (se [Firebase security checklist](https://firebase.google.com/support/guides/security-checklist#api-keys-not-secret)).

Kommandoen under kan kjøres for å bruke gitleaks for å finne hemmeligheter:

```bash
docker run -v .:/repo zricethezav/gitleaks:latest detect --source=/repo -v
```

---

## 🔗 Koble til dev-databasen lokalt

For å kunne teste Next.js lokalt og simulere prod-miljøet likt, kan vi lage en production build og koble oss til dev-prosjektet i Firebase for å teste funksjonalitet og løsningen generelt. Det gjøres slik:

1. Last ned credentials JSON-filen lokalt, og legg den ved rot av prosjektmappen (i `/tavla`-folderen) — den finner du i 1Password for Tavla, under navnet `google-service-keys`.

2. Lag en `.env.local`-fil i rot med følgende env-variabler:

```env
GOOGLE_CLOUD_PROJECT="ent-tavla-dev"
GOOGLE_PROJECT_ID="ent-tavla-dev"
GOOGLE_APPLICATION_CREDENTIALS='./ent-tavla-dev-<key-id>.json'
```

3. Kjør følgende kommando i terminalen for å bygge prosjektet lokalt med dev-credentials:

```bash
yarn build-start  # yarn build && yarn start
```

### Feilsøking

- Det kan hende du må ha den absolutte pathen til hvor JSON-filen din ligger hvis den ikke ligger på rot-nivå i `/tavla`. Det kan finnes ved å skrive dette inn i terminalen:

```bash
readlink -f ent-tavla-dev-<key-id>.json
# output eksempel: /Users/emilie/ent-tavla-dev-<key-id>.json

# Legg dette inn i .env.local:
GOOGLE_APPLICATION_CREDENTIALS='/Users/emilie/ent-tavla-dev-<key-id>.json'
```

- Det kan hende du må gi tilgang til å lese filen:

```bash
chmod 644 /path/to/ent-tavla-dev-875a70280651.json
```

---

## 🗄️ Migrering av database

### Best practices for migrering (fra møtet med Kent i april 2025)

En god oversikt over begrepene: [Expand and Contract Pattern (Prisma)](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern#what-is-the-expand-and-contract-pattern)

#### Expand and contract

Expand and contract er en etablert migreringsprosess som går ut på å ekspandere databasen og koden med de nye feltene, for så å fjerne de gamle feltene og referansen til de etter at migreringsjobben er fullført. Du vil da sitte med "dobbelt" opp av informasjon. Denne metoden er spesielt viktig for å unngå nedetid i applikasjonen.

Selve metoden:

1. **Les feltene** man skal migrere — både fra og til — og se at det går bra.

2. **Utvid databasen** ved å legge til de nye feltene du vil migrere dataen til. Ikke modifiser eller påvirk felter som allerede ligger i databasen.

3. **Utvid koden i frontend** slik at den nå kan lese `undefined`- eller `null`-verdier fra de gamle databasefeltene. Legg også til referanser til de nye databasefeltene med samme nullsjekk (slik at det blir dobbelt opp).

   > **Obs!** Endre også logikken slik at de nye feltene nå brukes til oppdateringer og skrivinger til databasen.

   Eksempel: Dersom man skal endre variabelnavnet `fieldName` til `headerName` så burde man endre `fieldName` til å være nullable og legge til `headerName` som nullable, med preferanse:

   ```typescript
   function functionName(fieldName: string) {
       const name = fieldName
   }
   ```

   ⬇️

   ```typescript
   function functionName(fieldName?: string, headerName?: string) {
       const name = headerName ?? fieldName // Husk også nullsjekk
   }
   ```

4. **Migrer dataen** fra det gamle feltet til det nye feltet. Ikke slett den gamle dataen, den er fin å ha dersom noe skulle skjære seg.

   Gode tips for migreringen:
   - Skriv resultatet og potensielle feil til fil så du har en logg av hvilke operasjoner det gikk bra med og hvilke det gikk dårlig med.
   - Eksempel på format for lett scanning:
     ```
     ✅ <variabelNavn> ble overskrevet av <nyVerdi>
     ✅ <variabelNavn> ble overskrevet av <nyVerdi>
     ❌ <variabelNavn> med <gammelVerdi> ble ikke overskrevet av <nyVerdi>
     ✅ <variabelNavn> ble overskrevet av <nyVerdi>
     ```
   - Om migreringen er stor, legg inn "sleeps" i koden (på hver 100 eller 1000 operasjon) for å gi serveren en pustepause. Dette minimerer også risiko dersom man må avbryte migreringen underveis.

5. **Fjern all frontend-kode** som bruker det gamle feltet. Skriv om disse så det nye feltet er det eneste som blir brukt.

   ```typescript
   function functionName(headerName: string) {
       const name = headerName
   }
   ```

6. **Opprydding til slutt:** Fjern all data fra det gamle feltet i databasen, fjern også selve feltet. 🦸‍♀️

### Firebase Transactions

Det er viktig å kjøre selve endringen man gjør i databasen gjennom en transaksjon. Dersom en transaksjon feiler vil Firebase rulle tilbake endringen så man unngår endringer i databasen som er ufullstendige.

To vanlige valg i Firebase-migrasjoner:

- **Transaction:** Kan både lese og skrive. Brukes gjerne for migreringer som er litt mer komplekse, som at de inneholder "gjør dette dersom dette".
- **Batch:** Kan bare skrive, ikke lese. Brukes gjerne for "bulk"-migreringer hvor f.eks. alle felt skal skrives om, eller om man vil oppdatere mange dokumenter samtidig.

### Teknisk: Migrering med Python

Vi migrerer med Python. For å gjøre dette på Mac må man sette opp et virtual environment for å kunne pip-installere pakker og lignende. Vi har satt opp et bash-script man kan kjøre for å få satt opp det med alt man trenger. Sjekk ut `README.md` i `/tavla`.

I `/migrations` har man en `requirements.txt`-fil som scriptet bruker for å finne ut hvilke dependencies som må lastes ned. I `/migrations/migration`-filen ligger selve bash-scriptet. I `/migrations/scripts` legger man nye migreringer. Fra før ligger blant annet `test.py`, `001_migrate_footer.py` og `002_read_tile_column_count.py` man kan se på for inspirasjon.

---

## 📂 Oppdatering og sletting av felter i database

### Hva dokumenteres

Vi har varierende strategier på når og hvordan vi lagrer og oppdaterer felter i databasen. Denne dokumentasjonen gir en oversikt over hva som skjer med feltene når de opprettes, oppdateres eller slettes i databasen. For eksempel: når en bruker som tidligere har satt en adresse eller gåavstand fjerner denne verdien igjen — skal feltet settes til en tom verdi, eller slettes i sin helhet?

Her dokumenteres **ikke** hvordan selve oppdatering av databaseobjekter skjer i koden, men heller strategien vi har for det.

### Board med settings

_(tiles ekskludert — kun feltene som kan oppdateres)_

| Felt | Lagres som | Hva skjer under sletting? |
|------|-----------|--------------------------|
| `fontSize` | string — er i utgangspunktet satt til `"medium"` | Kan aldri slettes |
| `location` | Objekt med `coordinate` & `name` | Hele objektet slettes når adresse-feltet tømmes |
| `footer` | Objekt med `footer` (string) og `override` (boolean) | Footer-objektet slettes når footer er tom. `override` er alltid `false` etter overgangen til mapper |
| `theme` | string | Finnes ikke i utgangspunktet. Trykker man lagre finnes verdien for alltid. |
| `tiles` | Objekt | Når alle tiles slettes, forblir feltet der som en tom array. Det opprettes som en tom array i utgangspunktet når tavla lages, før noen tiles er lagt til |
| `isCombinedTiles` | boolean | Kan aldri slettes. Blir satt til `false`. |

### Tile-objekt

| Felt | Lagres som | Hva skjer under sletting? |
|------|-----------|--------------------------|
| `whitelistedLines` | Liste med strings | I starten finnes ikke `whitelistedLines`. I det du lagrer tileCard (selv uten å ha endret `whitelistedLines` i det hele tatt) opprettes den som en tom array. Går ikke an å slette, forblir en tom array. |
| `walkingDistance` | Objekt med `visible` (boolean) og `distance` (number) | Er adresse satt, så opprettes `walkingDistance` med `distance`-feltet umiddelbart i det en tile legges til. Hvis ikke, så finnes den ikke i utgangspunktet, men opprettes uten noen `distance`-verdi i det man lagrer. Om man har `walkingDistance` skrudd på og så fjerner det, settes `visible` til `false`, men objektet vil aldri fjernes. Fjerner man adresse, fjernes bare `distance`-feltet, ikke `visible`-feltet. |
| `offset` | number | Finnes ikke i utgangspunktet, opprettes når den blir satt. Opprettes ikke automatisk når man lagrer tileCard med andre innstillinger. Fjerner man verdien, så slettes feltet. |

### Organisasjon

| Felt | Lagres som | Hva skjer under sletting? |
|------|-----------|--------------------------|
| `editors` | array | Opprettes som tom liste, kan aldri slettes. Det finnes heller aldri noen editors — denne funksjonaliteten bør vi ikke ha (dette var tiltenkt for å ha bedre tilgangsstyring). **Bør slettes! Brukes ikke, og har aldri det heller.** |
| `boards` | array med strings | Tom liste i det organisasjonen opprettes, kan derfor aldri slettes |
| `counties` | liste med strings | **Bør slettes! Brukes ikke lengre.** |
| `font` | string | **Bør slettes! Brukes ikke lengre.** |
| `footer` | string | **Bør slettes! Brukes ikke lengre.** |

### Konklusjon

Vi har to strategier for sletting når bruker fjerner en setting:
- Sette feltet til en tom array, en tom string, eller en default-verdi
- Slette hele feltet / hele objektet som feltet tilhører

Vi har to strategier for når en setting settes for første gang:
- Feltet finnes allerede, fordi det ble laget og satt til en standardverdi i det tavla/tilen/organisasjonen ble opprettet. Verdien oppdateres.
- Feltet opprettes når bruker trykker lagre for første gang. Tidligere gikk settingen til en default-verdi eller null.

Vi har funksjonalitet for å skille mellom editors og owners som ikke brukes — denne bør fjernes.

---

## ❌ Hvordan forholder vi oss til data som ikke lengre brukes?

### Hva dokumenteres

Noen ganger implementerer man ting man ikke lengre har lyst på, som man fjerner eller som ikke lengre brukes. I den forbindelse kan det hende at vi har rukket å lagre ting i databasen, som igjen fører til at det potensielt kan ligge mye felter og data der som er **dødt** — som ikke lengre brukes.

Hvordan forholder vi oss til data i databasen som vi ikke lengre bruker?

### Kjente felter som bør ryddes

Per april 2025:

| Collection | Fields |
|-----------|--------|
| `organizations` | `defaults`, `columns`, `counties`, `font`, `footer` |
| `boards` | `metatags` |

### Er det vanlig å slette ting i databasen når det ikke lengre brukes?

Det korte svaret er: **ja**. Grunnen til dette er egentlig det samme som i koden; man vil ikke opparbeide seg teknisk gjeld og burde holde databasen ryddig. Så en eller annen gang må man slette ting i databasen på lik linje som man gjør med koden.

Her er det viktig å være forsiktig med å ikke endre noe annet enn hva man sletter — f.eks. `data modified`.

Husk å teste en del lokalt og i dev med sletting av felter før du prodsetter for å være sikker på at ikke uforutsette feil kommer.

---

## 🛡️ Sikkerhetskopiering og rollback av database

### Hvorfor og hvordan vi tar backup

For å sikre at vi ikke mister og har kontroll på databasen har vi mulighet til å sikkerhetskopiere gjennom Google Cloud Platform (GCP).

Backupene lagres i en GCP Bucket og kan brukes til å gjenopprette hele eller deler av databasen dersom noe går galt — enten som følge av en feil deploy, en ødelagt migrering, eller utilsiktet sletting av data.

Vi har som mål å ta automatiske og jevnlige kopier av databasen, men har mulighet til å kjøre disse manuelt for nå.

### 🧰 Manuell sikkerhetskopiering (backup)

Ved behov for en sikkerhetskopi, for eksempel før en større migrering eller endring i produksjon, kan du ta en manuell backup av Firestore-databasen.

Dette kan gjøres enten direkte via terminalen (GCP CLI) eller ved å kjøre vårt Python-script.

#### 📟 Fra terminal (manuell kommando)

Kjør følgende kommando for å eksportere databasen til GCP-bucketen for backuper:

```bash
gcloud firestore export gs://tavla-firestore-backups/manual-$(date +%Y-%m-%d)
```

Denne kommandoen:
- eksporterer **alle collections og dokumenter** (inkludert metadata)
- lagrer backupen i `gs://tavla-firestore-backups`
- legger til dagens dato i filnavnet (for enkel versjonering)

> 💡 **Tips:** Sørg for at du er logget inn i riktig GCP-prosjekt (`ent-tavla-prd` eller `ent-tavla-dev`) før du kjører kommandoen.
>
> For dev: `gcloud config set project ent-tavla-dev`
>
> For prod: `gcloud config set project ent-tavla-prd`

#### 🐍 Med script (anbefalt)

Vi har et eget script for å gjøre prosessen enklere og mer konsistent:

```bash
python3 scripts/backup_firebase.py prod
```

Dette scriptet:
- tar en full backup av **produksjonsdatabasen**
- oppretter automatisk en mappe i `gs://tavla-firestore-backups` med dagens dato
- logger resultatet til terminalen slik at du ser om backupen ble vellykket

For å ta backup av **dev-databasen**, kjør:

```bash
python3 scripts/backup_firebase.py dev
```

✅ Du kan sjekke at backupen er opprettet ved å gå til:
**GCP → Cloud Storage → Buckets → `tavla-firestore-backups`** (eller `Firebase_backup`)

### 🔄 Rollback (gjenoppretting)

Rollback brukes for å gjenopprette databasen fra en tidligere backup.

#### 📟 Fra terminal (manuell import)

Finn først ønsket backup i GCP-bucketen:

```
gs://tavla-firestore-backups/YYYY-MM-DDTHH:MM:SSZ/
```

Kjør deretter kommandoen:

```bash
gcloud firestore import gs://tavla-firestore-backups/YYYY-MM-DDTHH:MM:SSZ/
```

Dette vil overskrive eksisterende dokumenter med data fra backupen.

Om du kun ønsker å gjenopprette enkelte collections, kan du spesifisere hvilke med flagget `--collection-ids`:

```bash
gcloud firestore import gs://tavla-firestore-backups/YYYY-MM-DDTHH:MM:SSZ/ \
  --collection-ids=boards,organizations,users
```

#### 🐍 Med script (anbefalt)

Vi har også et Python-script for rollback, som finner og bruker **den nyeste lagrede backupen** automatisk.

Kjør:

```bash
python3 scripts/rollback_firestore.py dev
```

Dette vil:
- hente siste backup fra GCP-bucketen for `dev`
- importere den tilbake til Firestore
- vise logg underveis med status på rollback

For produksjon kan du tilsvarende kjøre:

```bash
python3 scripts/rollback_firestore.py prod
```

✅ Når rollback er ferdig, vil databasen være identisk med tilstanden den hadde ved tidspunktet for siste backup.

### 🧪 Test av backup og rollback

Vi tester jevnlig prosessen i **dev-prosjektet** (`ent-tavla-dev`) før eventuelle endringer kjøres i produksjon.

Dette innebærer:
- Import av en backup til dev Firestore
- Verifisering av at strukturen og datainnholdet stemmer
- Kontroll av at applikasjonen kjører som forventet med data fra backupen

Dette gjør at vi kan stole på at rollback fungerer hvis vi noen gang må bruke den i prod.

### 🧩 Best practice før endringer i databasen

- Ta **manuell backup** før større migreringer eller endringer i produksjon
- Test alltid i dev-miljøet først
- Bruk scripts fremfor manuelle kommandoer for konsistens og sporbarhet
