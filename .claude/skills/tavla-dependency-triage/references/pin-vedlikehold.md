# Pin-vedlikehold — hindre at `resolutions` forfaller

Tavla bruker `resolutions` (yarn berry, `entur/tavla`) og `pnpm.overrides` (`entur/tavla-visning`) til å tvinge en transitiv pakke til én bestemt versjon. Det er den eneste måten å fikse en sårbarhet i en pakke vi ikke eier — Dependabot kan bare bumpe direkte avhengigheter, mens de nestede kopiene ligger igjen.

Mekanismen er riktig og god. **Problemet er at den ikke har noen utløpsdato.**

## Hvorfor pinner forfaller

En eksakt pin som `"tar": "7.5.11"` gjør to ting samtidig:

1. Den løfter oss vekk fra en sårbar versjon — det var poenget.
2. Den **låser** oss til den versjonen for alltid, også når det senere kommer nye CVE-er mot nettopp den.

Punkt 2 er lett å glemme, fordi symptomet ikke ser ut som et symptom: Dependabot lager rett og slett ingen PR. Pinnen overstyrer den, så varselet dukker opp i sikkerhetsfanen og blir bare liggende. Ingenting brekker, ingen får en påminnelse, og etter noen måneder ser det ut som «det varselet vi aldri klarte å fikse».

Dette er ikke hypotetisk. I uke 34 2026 blokkerte fire pinner ti varsler på tvers av de to repoene:

| Pin | Satt | Blokkerte |
|---|---|---|
| `tar: 7.5.11` (tavla) | mars 2026, [#2330](https://github.com/entur/tavla/pull/2330) | 6 varsler, inkl. repoets eneste **kritiske** (#497) |
| `immutable: 3.8.3` (tavla) | mars 2026, [#2330](https://github.com/entur/tavla/pull/2330) | #507, #508 |
| `immutable: 3.8.3` (visning) | — | #65, #66 |
| `shell-quote: 1.8.4` (visning) | — | #67 — pinnet til presis den versjonen varselet peker på |

`tar`-pinnen sto urørt i fem måneder mens seks varsler samlet seg bak den.

`immutable` illustrerer en verre variant: advisoryen har to fikslinjer (`< 4.3.9` → 4.3.9, og `>= 5.0.0-beta.1, < 5.1.8` → 5.1.8), og pinnen står på **3.8.3 — en versjonslinje som aldri fikk en fiks**. Så lenge pinnen står, er varselet *umulig* å lukke. I tillegg deklarerer konsumenten `@ardatan/relay-compiler@13` `immutable: ^5.1.5`, så pinnen tvinger den to majors under sitt eget krav.

## Ukens pin-audit

Kjør denne som del av mandagsbriefen, **før** du vurderer enkeltvarsler — den avgjør om et varsel i det hele tatt *kan* fikses av Dependabot:

```bash
python3 .claude/skills/tavla-dependency-triage/scripts/pin-audit.py
```

Scriptet kjører to uavhengige analyser.

**Del 1 — blokkerer pinnen en fiks?** Krysser pinnene i begge repoer mot åpne varsler:

- ✅ **Ingen åpne varsler** — pinnen er frisk på dette punktet.
- 🟡 **Pin ≥ påkrevd fiks** — allerede hevet, varslene lukkes når endringen merges.
- 🔴 **Pin < påkrevd fiks** — pinnen *blokkerer* fiksen. Handlingspunkt.

Skillet mellom 🟡 og 🔴 er viktig: GitHub holder et varsel åpent til fiksen er merget til `main`, så «det finnes åpne varsler for en pinnet pakke» er i seg selv ikke nok.

**Del 2 — trengs pinnen fortsatt?** Dette er forebyggingen. For hver pin leser scriptet konsumentenes deklarerte ranges ut av `yarn.lock`, henter alle publiserte versjoner fra npm, og regner ut hva yarn faktisk ville valgt per range uten pinnen (`maxSatisfying`). Deretter sjekkes hvert resultat mot advisoryens *sårbare intervall* — ikke bare mot høyeste fiksversjon, siden en advisory kan ha flere fikslinjer (`immutable` har `< 4.3.9` → 4.3.9 og `>= 5.0.0-beta.1, < 5.1.8` → 5.1.8, så 5.1.0 er sårbar selv om den er høyere enn 4.3.9).

- 🟢 **KAN FJERNES** — alle ranges konvergerer til én trygg versjon. Pinnen gjør ingen nytte lenger.
- 🟡 **Tjener deduplisering** — uten pinnen blir det flere kopier, alle trygge. En avveining.
- 🔒 **Trengs** — uten pinnen ville en sårbar kopi blitt liggende igjen.
- ⚠️ **Tvinger konsumenter utenfor deklarasjonen sin** — flagges uavhengig av de tre over.

Del 2 gjelder bare `entur/tavla`. `pnpm-lock` v9 lagrer resolverte versjoner, ikke konsumentenes ranges, så for tavla-visning skriver scriptet ut den manuelle framgangsmåten i stedet.

## Heve en forfalt pin

> Sjekk først om pinnen kan **fjernes** i stedet — se «Beslutningsrekkefølge» under. Heving fikser varselet, men lar mekanismen som forfalt stå.

1. **Finn den nyeste påkrevde fiksversjonen** blant alle varsler for pakken. Ikke bump til det første varselet krever — da må du gjøre det igjen neste uke. `pin-audit.py` regner ut maks for deg.
2. **Sjekk at konsumentenes ranges tilfredsstilles.** For `entur/tavla`:
   ```bash
   grep -n '^    "\?PAKKE"\?: ' tavla/yarn.lock
   ```
   Ligger alle deklarerte ranges (`^7.5.11`, `^7.5.4`, …) rundt målversjonen, er det en rein heving med lav risiko. Ligger målet **utenfor** en range, tvinger du en pakke forbi sin egen deklarasjon — da er det 🔴 og en annen utvikler bør se på det. (`sharp` i uke 34 var et slikt tilfelle: fiksen `0.35.0` tilfredsstiller ikke `next` sin `^0.34.5`.)
3. **Verifiser at pakken faktisk ble deduplisert** — at det bare finnes én kopi etterpå:
   ```bash
   cd tavla && awk '/^"PAKKE@npm:/{f=1} f&&/^  version/{print $2; f=0}' yarn.lock | sort -u
   ```
4. **Sjekk at `dependencies`-lista til pakken er uendret** i lockfile-diffen. Er den det, drar oppgraderingen ikke inn nye transitive pakker, og risikoen er tilsvarende lavere. Det er verdt å skrive i PR-beskrivelsen.
5. **Kjør `yarn install --immutable`** for å bekrefte at lockfilen er konsistent med `package.json`, i tillegg til vanlig `typecheck`/`test`/`build`.

## Beslutningsrekkefølge: trenger pakken en pin i det hele tatt?

Da `tar` ble triagert i uke 34, var førsteutkastet å heve pinnen fra 7.5.11 til 7.5.21. Det ville fikset varslene — og latt selve problemet stå. En ny eksakt pin forfaller like sikkert som den forrige.

Still spørsmålene i denne rekkefølgen:

**1. Kan pinnen fjernes helt?** Dette er det beste utfallet, og `pin-audit.py` Del 2 svarer på det automatisk. Kriteriet er at alle konsumentranges konvergerer til én trygg versjon uten pinnen. For `tar` var det tilfellet: begge konsumentene ba om carets (`^7.5.11`, `^7.5.4`), som kollapser til én entry på 7.5.22.

Fjerning er bedre enn heving fordi det gir Dependabot ansvaret tilbake — permanent. Og at Dependabot klarer det, er ikke en antakelse: [#2277](https://github.com/entur/tavla/pull/2277) bumpet `tar` 7.5.7 → 7.5.9 helt selv før pinnen fantes. Transitiv-only er ikke noe hinder.

Sammenlign `shell-quote` på tvers av repoene — samme pakke, samme rolle:

| | entur/tavla | entur/tavla-visning |
|---|---|---|
| Pinnet? | nei | ja, til `1.8.4` |
| Installert | **1.10.0** | **1.8.4** |
| Åpne varsler | **0** | **1** (høy, #67) |

Upinnet tok Dependabot den til 1.10.0 i [#2547](https://github.com/entur/tavla/pull/2547) og varselet lukket seg selv. Pinnet står den fast på presis den versjonen varselet peker på.

**2. Hvis ikke — kan en range brukes i stedet for en eksakt versjon?** Både yarn `resolutions` og pnpm `overrides` godtar ranges:

```json
"resolutions": { "tar": "^7.5.21" }
```

Med en caret kan yarn og Dependabot fortsatt heve innenfor `7.5.x`, mens dedupliseringen består. Pinnen vedlikeholder seg selv for patchnivå-CVE-er, som er de aller fleste.

**3. Ellers: eksakt versjon som bevisst gjeld.** Riktig når du må overstyre en konsument som selv pinner eksakt (slik `next` pinner `postcss` til `8.4.31`), eller når du vet at høyere versjoner brekker noe. Da er pinnen gjeld — og neste ukes audit skal fange den opp.

## Fjerning betyr ikke at versjonen flyter

En vanlig innvending mot å fjerne en pin er at vi «mister kontrollen». Det stemmer ikke: lockfilen låser den resolverte versjonen. En senere `yarn install` drifter ikke — bare `yarn up` eller en Dependabot-PR flytter den. Du bytter ikke kontroll mot kaos, du bytter *hvem* som har kontrollen, fra en pin som ingen ser på til et verktøy som lager PRer.

## Pinner som tvinger konsumenter utenfor deklarasjonen sin

`pin-audit.py` flagger dette med ⚠️ uavhengig av de andre utfallene, og det er alltid verdt å rette.

`immutable` er eksempelet: pinnet til `3.8.3`, mens konsumenten `@ardatan/relay-compiler@13` deklarerer `^5.1.5`. Pakken kjører altså to majors under det den selv sier den støtter. `minimatch` har samme problem i større skala — pinnet til `9.0.7` med konsumenter som ber om alt fra `^3.0.4` til `^10.2.2`.

Slike pinner er ikke bare utdaterte, de er *feil*: de kan gi subtile feil som ikke fanges av typecheck, fordi API-et pakken faktisk får, ikke er API-et den ble skrevet mot.

**Navngi hver pinnede pakke i PR-tittelen.** JSON tåler ikke kommentarer, så PR-historikken *er* dokumentasjonen. [#2330](https://github.com/entur/tavla/pull/2330) het «Oppgrader graphql-codegen, immutable og tar» — og det var den tittelen som gjorde det mulig å rekonstruere hvorfor `immutable` var pinnet.

## Finn historikken til en pin — ikke bruk `git blame`

`git blame` på en linje i `resolutions` er **upålitelig**, fordi enhver senere kosmetisk endring overtar linja. Et komma lagt til når en ny pin ble satt under, er nok til at blame peker på feil commit — og du konkluderer med at pinnen er udokumentert når den faktisk var beskrevet i en PR-tittel.

Bruk `git log -L` på hele blokka i stedet:

```bash
git log -L '/"resolutions": {/,/^    }/:tavla/package.json' --oneline --no-patch
```

Det gir hver commit som har rørt blokka, i rekkefølge, og du kan lese deg bakover til PR-en som faktisk innførte pinnen. Bekreft med:

```bash
git show <sha> -- tavla/package.json | grep -E '^[+-].*PAKKE'
```

Da ser du om commiten *innførte* pinnen eller bare flyttet et komma.
