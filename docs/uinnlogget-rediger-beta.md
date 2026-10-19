# Uinnlogget lag-tavle → gjenbruk av rediger-beta

Plan for å gjøre om den uinnloggede `lag-tavle`-flyten til å bruke samme komponenter og
server actions som den innloggede `rediger-beta`-flyten, slik at de to får tilnærmet lik
funksjonalitet uten å duplisere UI-koden.

## Bakgrunn

De to flytene var opprinnelig bygget helt ulikt:

- **`lag-tavle`**: boardet ble holdt i `localStorage` fram til brukeren trykket «Få lenke»,
  da ble boardet opprettet i Firestore for første gang.
- **`rediger-beta`**: hvert felt har sin egen `'use server'`-action som skriver direkte til
  et eksisterende Firestore-board, gatet av `userCanEditBoard`.

Løsningen er å opprette et ekte, tomt anonymt board med én gang når noen går inn på
`lag-tavle`, og la det markeres som et **draft** helt til brukeren publiserer.

## Løsning i korte trekk

- Felt `isDraft` på `BoardDB`. Satt til `true` når boardet opprettes anonymt, satt til
  `false` ved publisering.
- `userCanEditBoard` tillater redigering når `board.isAnonymousBoard && board.isDraft`,
  uavhengig av innlogging — eksplisitt begge felt, ikke bare `isDraft` alene (forsvar i
  dybden mot at `isDraft` noen gang skulle bli satt på et eid board).
- `/api/board` gater **ikke** synlighet på `isDraft` — den avveiningen er utsatt/parkert.
  Lenken til tavla vises derfor ikke før brukeren selv velger å publisere, men dette
  håndheves kun i UI (`PublishDraftBoard`), ikke på endepunktet.
- `/lag-tavle` oppretter et tomt anonymt board (`isAnonymousBoard: true, isDraft: true`) på
  **hvert besøk** og redirecter til `/lag-tavle/[id]` — ingen cookie-gjenbruk, ingen lazy
  creation. Cleanup av forlatte drafts er bevisst parkert (se nederst).
- `app/lag-tavle/[id]/page.tsx` speiler `rediger-beta/page.tsx`, men gater på
  `userCanEditBoard` i stedet for session. Boardet vises alltid med redigeringsskallet når
  tilgang er gitt (dvs. mens `isDraft` er true); når tilgangen er borte (publisert, eller et
  board som aldri var anonymt) vises i stedet en «Tavla er klar!»-side med kopierbar lenke.
- `EditBoardBeta`, `EditBoardSidebar`, `PreviewSection` gjenbrukes helt uendret fra
  rediger-beta. 13 av de 14 feltkomponentene (alle unntatt `RefreshBoard`, som er meningsløs
  for et board som aldri har vært offentlig) gjenbrukes også uendret — de tar allerede
  `bid`/initial-verdier som vanlige props. Hver av disses actions reviderer nå begge mulige
  sider (`/tavler/[id]/rediger-beta` og `/lag-tavle/[id]`).
- `BoardLinkActions` (lenke, custom-URL, oppdater-knapp) erstattes av `PublishDraftBoard` for
  alle anonyme boards (`isAnonymousBoard`), uavhengig av `isDraft` — se tekniske funn under
  for hvorfor betingelsen er `isAnonymousBoard` og ikke `isDraft`.

### Teknisk funn: server actions oppdaterer alltid den kallende siden

Next.js oppdaterer alltid siden som kalte en server action, uavhengig av om actionen selv
kaller `revalidatePath` for akkurat den siden. En komponent som byttes ut basert på en
`isDraft`-betinget ternary i et foreldrenivå mister dermed all lokal state (f.eks. en åpen
modal) idet `isDraft` endres av selve actionen. `PublishDraftBoard` eies derfor av
`isAnonymousBoard` (som aldri endrer seg etter opprettelse), ikke `isDraft`, slik at
komponenten overlever side-oppdateringen og selv kan vise riktig tilstand.

## Oppgaver

### 1. Legg til isDraft-felt på board-modellen — ferdig (#2690)

### 2. Utvid tilgangskontroll for draft-boards — ferdig (#2691)
`userCanEditBoard` henter boardet og sjekker `isAnonymousBoard && isDraft`. `/api/board`
gir fortsatt lesetilgang til alle boards (synlighetsgating er utsatt).

### 3. Juster revalidatePath i delte rediger-beta-actions — ferdig (#2693)

### 4. Bygg ny routing for lag-tavle — ferdig (#2695, #2696)
`/lag-tavle` oppretter draft og redirecter til `/lag-tavle/[id]`, som gjenbruker
`EditBoardBeta`. Innledende hjelpetekst lagt til.

### 5. Bygg publiseringsflyt for anonyme draft-boards — ferdig (#2697)
`PublishDraftBoard` viser «Få lenke til tavla»-knapp (bekreftelsesmodal) mens boardet er
draft. Ny action `publishDraftBoard` setter `isDraft: false`. Etter publisering vises en
egen «Tavla er klar!»-side med kopierbar lenke (ikke i modal — se teknisk funn over for
hvorfor).

### 6. Fjern gammel localStorage-basert lag-tavle-kode
Fjern `useSaveBoardInLocalStorage`, `useLocalStorage`-bruk for board, og gammel
`CreateBoardLocally`-logikk.

### 7. Oppdater tester for ny lag-tavle-flyt
Playwright e2e for ny lag-tavle-flyt. Enhetstester for utvidet `userCanEditBoard`.

### 8. Bygg claiming-flow ved kontoopprettelse
Koble et anonymt board til en ny bruker når de oppretter konto fra lag-tavle-flyten, i
stedet for at boardet forblir løsrevet anonymt for alltid.

- `create(uid, bid?)` i `Login/actions.ts` utvides: hvis `bid` er gitt og
  `getBoard(bid)?.isAnonymousBoard === true` (sikkerhetssjekk — forhindrer at noen kan
  "klame" et allerede eid board), kall `addBoardIdToUser(uid, bid)` (finnes allerede,
  ubrukt) og sett `isAnonymousBoard: false, isDraft: false` på boardet.
- `Create.tsx` og `Google.tsx` leser en ny `claimBoard`-query-param (via `useSearchParams`,
  overlever hele innloggingsreisen siden verken Google- eller e-post-signup bruker
  redirect-basert auth) og sender den med til `create()`.
- Ny «Opprett bruker og ta eierskap»-knapp, lenker til `?login=create&claimBoard=<bid>`.
  Plasseres både i `PublishDraftBoard` sin bekreftelsesmodal (alternativ til «Få lenke til
  tavla») og som sekundært tilbud på «Tavla er klar»-siden.
- Ingen endring i `login()` sin redirect til `/oversikt` — det klamede boardet dukker opp
  der automatisk via `owner`-arrayen.

## Parkert (ikke i scope nå)

- **Synlighetsgating av draft-boards i `/api/board`** — vurdert og bevisst utsatt, se
  teknisk funn-seksjonen. Boardet er i praksis lesbart via sin rå ID helt fra opprettelse,
  selv om lenken ikke vises i UI før publisering.
- **Cleanup-cron** for forlatte drafts (`isDraft === true` eldre enn en grace-periode).
  Følg mønsteret fra `tavla/firebaseFunctions/src/updateLastActiveOnSchedule.ts`. Bruk
  eksisterende `meta.dateModified`-felt, ingen nytt tidsstempel-felt nødvendig.
