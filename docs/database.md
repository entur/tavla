# Database

## Innholdsfortegnelse

- [🔥 Firebase til database](#-firebase-til-database)
- [🔗 Koble til dev-databasen lokalt](#-koble-til-dev-databasen-lokalt)
- [🗄️ Migrering av database](#️-migrering-av-database)
- [🛡️ Sikkerhetskopiering og rollback av database](#️-sikkerhetskopiering-og-rollback-av-database)

---

## 🔥 Firebase til database

### Hva er lagret hvor?

Vi bruker Firebase for å lagre tavler, mapper og brukere (boards, folders og users). Kjører du lokalt, finner du Firebase sin Firestore her: http://127.0.0.1:4000/firestore/data/boards

> Tips: kjører du `yarn dev:persist` så lagres brukere, tavler og mapper du har på localhost mellom hver gang du kjører.

Hvert objekt i Firebase har en unik id, og er ellers strukturert nokså likt som deres respektive kode-objekter (`TBoard`, `FolderDB`, `TUser`). Husk at selv om Firebase ikke er en relasjonsdatabase, har vi definitivt masse relasjoner mellom disse kategoriene (f.eks.: et board kan eies av en mappe, en mappe inneholder en viss mengde brukere, en bruker kan ha en viss mengde private boards, osv.), og disse må tas høyde for når man skriver nye / endrer på Firebase-operasjoner i koden.

Redis brukes primært for pubsub-funksjonalitet, men vi lagrer også midlertidig state her (bl.a. aktive tavler). Se egen dokumentasjonsfil for Redis.

### Åpen config for firebase

Firebase-config leses fra Firestore. Selv om enkelte config-nøkler kan se ut som hemmeligheter, trenger de ikke være det (se [Firebase security checklist](https://firebase.google.com/support/guides/security-checklist#api-keys-not-secret)).



## 🔗 Koble til dev-databasen lokalt

For å kunne teste Next.js lokalt og simulere prod-miljøet likt, kan vi lage en production build og koble oss til dev-prosjektet i Firebase for å teste funksjonalitet og løsningen generelt. Det gjøres slik:

1. Last ned credentials JSON-filen lokalt og legg den i `/tavla`-folderen — den finner du i 1Password for Tavla under navnet `google-service-keys`. Filen heter typisk `ent-tavla-dev-<key-id>.json` og er automatisk gitignorert via mønsteret `ent-tavla-*.json` i rot-`.gitignore`.

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

## 🗄️ Migrering av database

### Best practices for migrering

> Disse retningslinjene ble etablert i et møte med Kent i april 2025.

En god oversikt over begrepene: [Expand and Contract Pattern (Prisma)](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern#what-is-the-expand-and-contract-pattern)

#### Expand and contract

Expand and contract er en etablert migreringsprosess som går ut på å ekspandere databasen og koden med de nye feltene, for så å fjerne de gamle feltene og referansen til dem etter at migreringsjobben er fullført. Du vil da sitte med "dobbelt" opp av informasjon. Denne metoden er spesielt viktig for å unngå nedetid i applikasjonen.

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
   - Om migreringen er stor, legg inn "sleeps" i koden (på hver 100 eller 1000 operasjoner) for å gi serveren en pustepause. Dette minimerer også risiko dersom man må avbryte migreringen underveis.

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

Selvbetjent-teamet (app-teamet) migrerer med TypeScript, men vi i Tavla migrerer med Python. For å gjøre dette på Mac må man sette opp et virtual environment for å kunne pip-installere pakker og lignende. Vi har satt opp et bash-script man kan kjøre for å få satt opp det med alt man trenger. Sjekk ut `README.md` i `/tavla`.

I `/tavla/migrations` har man en `requirements.txt`-fil som scriptet bruker for å finne ut hvilke dependencies som må lastes ned. I `/tavla/migrations/migration`-filen ligger selve bash-scriptet. I `/tavla/migrations/scripts` legger man nye migreringer. Fra før ligger blant annet `test.py`, `001_migrate_footer.py` og `002_read_tile_column_count.py` man kan se på for inspirasjon.

> Alle migrerings-scripts kjøres fra `/tavla/migrations`-mappen. Se også `README.md` i repo-roten for oppsett av virtual environment.

---

## 🛡️ Sikkerhetskopiering og rollback av database

### Hvorfor og hvordan vi tar backup

For å sikre at vi ikke mister data og beholder kontroll over databasen, har vi mulighet til å sikkerhetskopiere gjennom Google Cloud Platform (GCP).

Backupene lagres i GCP-bucketen `tavla-firestore-backups-dev`/`tavla-firestore-backups-prd`  og kan brukes til å gjenopprette hele eller deler av databasen dersom noe går galt — enten som følge av en feil deploy, en ødelagt migrering, eller utilsiktet sletting av data.

Vi har automatisk scheduled backup satt opp i Firestore: **ukentlig backup hver mandag, med 40 dagers retention**. I tillegg kan manuelle backups tas ved behov, f.eks. før større migreringer.

### 🧰 Manuell sikkerhetskopiering (backup)

Ved behov for en sikkerhetskopi, for eksempel før en større migrering eller endring i produksjon, kan du ta en manuell backup av Firestore-databasen.

Dette kan gjøres enten direkte via terminalen (GCP CLI) eller ved å kjøre vårt Python-script.



#### 🐍 Med script (anbefalt)

Vi har et eget script for å gjøre prosessen enklere og mer konsistent. Kjør fra `tavla/migrations`-mappen:

```bash
source ../../python-venv/bin/activate
python3 scripts/backup_firebase.py prod
```

Dette scriptet:
- tar en full backup av **produksjonsdatabasen**
- oppretter automatisk en mappe i `gs://tavla-firestore-backups-prd` med dagens dato
- logger resultatet til terminalen slik at du ser om backupen ble vellykket

For å ta backup av **dev-databasen**, kjør:

```bash
source ../../python-venv/bin/activate
python3 scripts/backup_firebase.py dev
```

✅ Du kan sjekke at backupen er opprettet ved å gå til bucketen som scriptet logger i terminalen.
For **prod** er dette:
**GCP → Cloud Storage → Buckets → `tavla-firestore-backups-prd`**

#### 📟 Fra terminal (manuell kommando)

Kjør følgende kommando for å eksportere databasen til GCP-bucketen for backuper:

For **prod**:
```bash
gcloud firestore export gs://tavla-firestore-backups-prd/manual-$(date +%Y-%m-%d) --project=ent-tavla-prd
```

For **dev**:
```bash
gcloud firestore export gs://tavla-firestore-backups-dev/manual-$(date +%Y-%m-%d) --project=ent-tavla-dev
```

Denne kommandoen:
- eksporterer **alle collections og dokumenter** (inkludert metadata)
- legger til dagens dato i filnavnet for enkel versjonering

> ⚠️ **Merk:** Manuell backup med `manual-`-prefiks kan **ikke** brukes direkte av `rollback_firestore.py`, siden scriptet bare søker etter paths som inneholder `firestore-`. En manuell backup må derfor importeres manuelt via terminalen (se [Fra terminal](#-fra-terminal-manuell-import-1)).

### 🔄 Rollback (gjenoppretting)

Rollback brukes for å gjenopprette databasen fra en tidligere backup.

#### 🐍 Med script (anbefalt)

Vi har også et Python-script for rollback, som finner og bruker **den nyeste lagrede backupen** automatisk. Kjør fra `tavla/migrations`-mappen:

```bash
source ../../python-venv/bin/activate
python3 scripts/rollback_firestore.py dev
```

Dette vil:
- hente siste backup fra GCP-bucketen for `dev`
- importere den tilbake til Firestore
- vise logg underveis med status på rollback

For produksjon kan du tilsvarende kjøre:

```bash
source ../../python-venv/bin/activate
python3 scripts/rollback_firestore.py prod
```


#### 📟 Fra terminal (manuell import)

Finn først ønsket backup i GCP-bucketen:

```
gs://tavla-firestore-backups-prd/YYYY-MM-DDTHH:MM:SSZ/
```

Kjør deretter kommandoen:

```bash
gcloud firestore import gs://tavla-firestore-backups-prd/<backup-mappe>/ --project=ent-tavla-prd
```

> **Merk:** Dette overskriver eksisterende dokumenter med data fra backupen, men sletter **ikke** dokumenter som ble opprettet etter at backupen ble tatt.

Om du kun ønsker å gjenopprette enkelte collections, kan du spesifisere hvilke med flagget `--collection-ids`:

```bash
gcloud firestore import gs://tavla-firestore-backups-prd/<backup-mappe>/ \
  --collection-ids=boards,folders,users \
  --project=ent-tavla-prd
```


✅ Når rollback er ferdig, vil dokumentene fra backupen være gjenopprettet. Merk at dokumenter opprettet *etter* backup ikke slettes — Firestore-import overskriver eksisterende dokumenter, men er ikke en fullstendig tilbakestilling.

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
