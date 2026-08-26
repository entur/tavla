---
name: tavla-dependency-triage
# Lista er kort med vilje. allowed-tools er en forhåndsgodkjenning, ikke en
# begrensning — den fjerner et godkjenningssteg, så alt som ikke trenger et
# grant skal ikke stå her. grep, git log, git show og de rene lesetøyene
# (Read/Grep/Glob) ligger i Claude Codes innebygde read-only-sett og spør
# aldri uansett; entries for dem var inerte. awk står her fordi det *ikke*
# er i det settet.
#
# gh api er snevret til de to varsel-endepunktene skillen faktisk leser.
# Bash-regler matcher hele kommandoteksten, så et etterfølgende * dekker
# også en skrivende variant av samme URL — derfor ligger den egentlige
# sperren mot skriving i ask-reglene i .claude/settings.json, som alltid
# spør ved -X/--method/-f/-F/--input. Lagdelt, ikke enten-eller.
#
# pin-oversikt.py er billig og konkluderer ingenting, så den kan kjøre fritt.
# pin-vurder.py har bevisst INGEN entry: entryen over er en eksaktmatch uten
# wildcard, så den dekker bare den argumentløse kommandoen. Per-pin-vurderingen
# faller dermed utenfor grantet og spør av seg selv — det er hele poenget, og
# ikke noe som skal «fikses» ved å legge til en wildcard.
#
# Edit dekker både Edit- og Write-verktøyet. Write(sti) ville ikke virket:
# Claude Code konsulterer aldri stiregler for Write, bare for Edit og Read.
# Grantet gjelder bare ukens brief. Skal en codescan.yml-allowlist skrives,
# er det en PR som fortjener et par øyne — den skal spørre.
allowed-tools:
  - Bash(gh pr list:*)
  - Bash(gh pr view:*)
  - Bash(gh api *dependabot/alerts*)
  - Bash(gh api *code-scanning/alerts*)
  - Bash(awk:*)
  - Bash(python3 .claude/skills/tavla-dependency-triage/scripts/pin-oversikt.py)
  - Edit(.dependency-vakt/**)
description: >
  Triage av Dependabot-PRer, sikkerhetsvarsler og CodeQL-funn for Tavla. Bruk når
  noen på Tavla-teamet er på dependency-vakt og skal vurdere åpne Dependabot-PRer,
  klassifisere risiko, vurdere CVE-utnyttbarhet, eller skrive triage-notater.
  Trigger også ved omtale av "dependency-vakt", "avhengighetsoppdatering", "sikkerhetsvarsel",
  "Dependabot", "mandagsbrief", "ukens pakker", "pakkeansvarlig". Brukes også for å skrive
  ukens dependency-brief. Skillen forklarer alltid hvorfor — målet er å bygge
  kompetanse i teamet over tid, ikke bare gjøre vurderingen.
---

# Tavla — Dependency Triage

Felles arbeidsflyt for Tavlas ukentlige dependency-vakt. Skillen dekker to situasjoner:

1. **Mandagsbrief** — hent og trier alle åpne PRer, alerts og CodeQL-funn, og skriv en ferdig formatert brief til fil.
2. **Enkelt-triage** — vurder én konkret PR eller alert, og presenter resultatet i chatten.

## Kontekst

Dependabot kjører mandager 08:00 (Europe/Amsterdam) på `/tavla` og grupperer i `patch-minor-dependencies` og `major-dependencies`. CodeQL kjører på PR-er mot `main` og som ukentlig scan mandag 03:00. Dependabot-sikkerhetsvarsel kan komme når som helst.

**30-dagersfristen.** Entur krever at sårbarheter triages og fikses innen **30 dager** fra de oppdages. Det står både i `guides/reference/security.md` i `entur/ai` og i Confluence-siden [Behandle sikkerhetsadvarsler](https://entur.atlassian.net/wiki/spaces/EOS/pages/5689376819/Behandle+sikkerhetsadvarsler). Dette er ikke en intern Tavla-regel, men en org-bred forpliktelse — og den er grunnen til at «kan vente» må være en tidsbegrenset vurdering, ikke en utsettelse på ubestemt tid. Regn derfor alltid ut alderen på et varsel, og la fristen styre prioriteringen i todo-lista.

**Repoer som dekkes:** Tavla-teamet har to GitHub-repoer som begge skal sjekkes:
- `entur/tavla` — Next.js-frontenden (admin + konfigurasjon)
- `entur/tavla-visning` — den offentlige visningsappen (public display board)

Backend (`backend/Cargo.toml`, Rust/Axum) og redirect-tjenesten er egne Cargo-prosjekter — de er *ikke* dekket her.

Vakten roterer ukentlig blant de tre utviklerne. Erfaringsnivå varierer — derfor er **forklaring av resonnement** en eksplisitt del av jobben. Det er hvordan teamet bygger kompetanse over tid.

> Hvis du er usikker på noe, spør en annen utvikler på teamet. Det er ikke en formell prosess — det er hvordan teamet jobber.

## Ukens flyt

| Når | Hva | Hvor |
|-----|-----|------|
| Man 09:00 | Kjør pin-oversikten — hva er pinnet, og hvor lenge har det stått? | `scripts/pin-oversikt.py` (se Steg 1b) |
| Ved behov | Vurder én pin — blokkerer den en fiks, trengs den fortsatt? | `scripts/pin-vurder.py <pakke>` (se Steg 1b) |
| Man 09:00 | Skriv ukens dependency-brief med full triage | `.dependency-vakt/{år}-uke-{NN}.md` — lokal, gitignorert (se Steg 1) |

---

## Steg 1 — Mandagsbrief

Når brukeren ber om "mandagsbrief", "ukens dependency-brief", "full dependency-sjekk", "ukens pakker", eller når en ny vakt starter uken:

1. Hent åpne Dependabot-PRer fra **begge repoer**:
   ```
   gh pr list --repo entur/tavla --author app/dependabot --state open --json number,title,url
   gh pr list --repo entur/tavla-visning --author app/dependabot --state open --json number,title,url
   ```
2. Hent åpne Dependabot security alerts fra **begge repoer** — bruk alltid `state=open&per_page=100` for å få alle (uten disse parameterne returnerer GitHub bare de 30 nyeste, blandet open/fixed):
   ```
   gh api "repos/entur/tavla/dependabot/alerts?state=open&per_page=100"
   gh api "repos/entur/tavla-visning/dependabot/alerts?state=open&per_page=100"
   ```
   Hvert varsel har `created_at`. Regn ut alder i dager og hvor mange dager som er igjen av de 30 — begge tallene skal med i briefen per varsel. Et varsel du ikke kan datere, kan du ikke prioritere riktig.
3. Hent siste ukes CodeQL-funn fra begge repoer:
   ```
   gh api repos/entur/tavla/code-scanning/alerts --jq '[.[] | select(.state=="open")]'
   gh api repos/entur/tavla-visning/code-scanning/alerts --jq '[.[] | select(.state=="open")]'
   ```
4. **Kjør pin-oversikten** (se Steg 1b under), og kryss den mot varsellista fra punkt 2. Står en pinnet pakke også blant varslene, kan pinnen være grunnen til at varselet ikke lukker seg — da kjører du `pin-vurder.py` på den pakken før du konkluderer om varselet.
5. For hver PR og alert: klassifiser iht. `references/risikoklassifisering.md`, grep etter brukssteder i Tavla-kode der det er relevant.
6. **Sjekk installert versjon, ikke bare fiksversjon** (se «Fallgruve» under).
7. **Skriv briefen til fil** — ikke til chatten. Se «Hvor briefen skal ligge» rett under.

### Hvor briefen skal ligge

Skriv den ferdige briefen til:

```
.dependency-vakt/{år}-uke-{ISO-uke}.md
```

for eksempel `.dependency-vakt/2026-uke-34.md`. Bruk alltid to siffer i ukenummeret (`uke-07`, ikke `uke-7`) så filene sorterer kronologisk. Opprett katalogen hvis den ikke finnes.

**Katalogen er gitignorert, og det er med vilje.** Briefen er en lokal arbeidsfil for den som har vakta den uka — den skal ikke committes og ikke pushes. Grunnen er at `entur/tavla` er et **offentlig repo**, og briefen lister åpne, ufiksede sårbarheter med versjonsnumre og en vurdering av hvor utnyttbare de er i vår kode. Det er en presis oppskrift for noen som vil finne en vei inn, og git-historikken glemmer aldri. Sjekk `.gitignore` hvis `.dependency-vakt/` mot formodning dukker opp i `git status`.

Hvorfor fil og ikke chat: briefen skal leses gjennom uka, kopieres inn i Slack, og være noe du kan åpne i editoren mens du jobber deg gjennom todo-lista. En lang chat-melding scroller bort.

**Skal en vurdering overleve uka, hører den et annet sted.** Briefen er efemer. Konklusjoner som må kunne etterprøves senere skrives der de hører hjemme: som kommentar på PR-en eller varselet, som `comment` i `codescan.yml`-allowlisten, eller i en Jira-sak. Det er også de stedene en revisor faktisk leter.

Finnes fila allerede (du kjører briefen på nytt samme uke), **overskriv den** — briefen skal reflektere dagens tilstand, ikke være et vedlegg av flere kjøringer.

**I chatten skriver du bare et kort sammendrag:** filsti, totaler (PRer / varsler / CodeQL / pinner), og de tre–fem viktigste handlingspunktene. Ikke gjenta hele briefen — poenget med fila er at den ikke trenger å stå i chatten også.

### Fallgruve: en Dependabot-PR lukker ikke nødvendigvis varselet

Sjekk alltid hvilken versjon som faktisk er **installert**, ikke bare hvilken som fikser. Varselet forteller deg `first_patched_version`, aldri hva du har. To feilmodus går igjen:

- **Flere parallelle kopier.** `postcss` fantes i fire versjoner i `tavla/yarn.lock` samtidig (8.5.23 direkte, pluss 8.4.31 under `next`, 8.5.8 under `tailwindcss`, 8.5.16 under `vite`). Dependabot bumper bare den direkte, så PRen lukket ingen av de fire postcss-varslene.
- **PRen gjelder en helt annen versjonslinje.** `nanoid`-PRen bumpet 6.0.0 → 6.0.1, mens varselet gjaldt de nestede 3.3.x-kopiene under `postcss`. Den direkte pakka var aldri sårbar.

Konkret sjekk for `entur/tavla`:

```bash
cd tavla && awk '/^"PAKKE@npm:/{f=1} f&&/^  version/{print $2; f=0}' yarn.lock | sort -u
```

Er svaret mer enn én versjon, må du finne ut hvem som drar inn de sårbare kopiene før du konkluderer — og ofte er fiksen en pin/deduplisering, ikke PRen som ligger åpen.

---

## Steg 1b — Pinner: oversikt ukentlig, vurdering ved behov

`resolutions` (tavla) og `pnpm.overrides` (tavla-visning) er teamets mekanisme for å fikse sårbarheter i transitive pakker. Mekanismen er riktig, men den har ingen utløpsdato — og det er derfor arbeidet er delt i to.

### Oversikten — fast punkt hver mandag

```bash
python3 .claude/skills/tavla-dependency-triage/scripts/pin-oversikt.py
```

Den lister hver pin i begge repoer med versjon, hvilken PR som sist satte den, og alder — sortert **eldst først**. Ingen nettverkskall, ingen npm, ingen semver. Den konkluderer med vilje ingenting.

Alder er signalet. En pin som har stått i åtte måneder har hatt lang tid på å bli overflødig, eller på å blokkere en fiks uten at noen la merke til det. Symptomet ser nemlig ikke ut som et symptom: Dependabot lager rett og slett ingen PR, fordi pinnen overstyrer den, og varselet blir bare liggende.

**Kryss oversikten mot varsellista fra Steg 1.** Står en pinnet pakke også blant de åpne varslene, er den kandidat nummer én — og det er den koblingen som gjør at `tar` ikke får stå i fem måneder igjen. Ingenting gjør denne kryssingen for deg; det er vaktens jobb, og det er meningen.

### Vurderingen — én pin om gangen

```bash
python3 .claude/skills/tavla-dependency-triage/scripts/pin-vurder.py <pakke> [tavla|visning]
```

Kjør den på pinnene oversikten gir grunn til å se på. Den svarer på tre ting for **én** pakke:

**Hvorfor står pinnen der?** Hele kjeden av verdiendringer, med dato og PR. JSON tåler ikke kommentarer, så PR-titlene *er* dokumentasjonen. Scriptet sammenligner de faktiske pin-verdiene ved hver commit, ikke diff-linjer — en commit som bare flyttet et komma teller ikke, og en pakke som står i både `dependencies` og `resolutions` (som `dompurify`) blir ikke forvekslet.

**Blokkerer pinnen en fiks?** Utfall: ✅ ingen varsler / 🟡 hevet-men-ikke-merget / 🔴 blokkerer / 🔴 varsel uten fiksversjon.

Den siste er den verste, og lett å overse: finnes det ingen `first_patched_version`, kan varselet ikke lukkes ved å bumpe i det hele tatt. Da må du bytte versjonslinje, eller allowliste med begrunnelse (`references/sikkerhets-triage.md`, Steg 5).

**Trengs pinnen fortsatt?** Scriptet regner ut hva yarn faktisk ville resolvert til *uten* pinnen — `maxSatisfying` over alle publiserte versjoner, per konsumentrange i `yarn.lock` — og sjekker om resultatet ligger utenfor alle sårbare intervall. Utfall:

- 🟢 **KAN FJERNES** — alle konsumentranges konvergerer til én trygg versjon. Pinnen gjør ingen nytte lenger; den bare hindrer Dependabot i å vedlikeholde pakken.
- 🟡 **Tjener deduplisering** — uten pinnen blir det flere kopier, alle trygge. Fjerning er mulig, men er en avveining.
- 🔒 **Trengs** — uten pinnen ville en sårbar kopi blitt liggende igjen.
- ⚠️ **Tvinger konsumenter utenfor deklarasjonen sin** — pinnen setter en pakke på en versjon den selv ikke sier den støtter. Flagges uavhengig av de tre over, og er alltid verdt å rette.

Dette siste spørsmålet kan bare besvares automatisk for `entur/tavla`. `pnpm-lock` v9 lagrer resolverte versjoner, ikke konsumentenes ranges, så for tavla-visning skriver scriptet ut den manuelle framgangsmåten i stedet.

### Begge scriptene feiler lukket

Kunne noe ikke sjekkes — `gh` uten riktig scope, npm som ikke svarer, semver som mangler, git-historikk som ikke finnes — sies det ❔ per punkt, alt usjekket listes til slutt, og exit-koden er 1. Et ufullstendig resultat skal ikke kunne leses som grønt. Ser du ❔, er jobben ikke ferdig, og den skal ikke inn i briefen som om den var det.

### Beslutningsrekkefølgen er `fjern → eksakt + audit`

Å heve en pin til en ny eksakt versjon fikser varselet, men lar mekanismen stå — den forfaller igjen ved neste CVE. Å fjerne den gir Dependabot ansvaret tilbake permanent. Alt som kommer ut 🟢 skal derfor inn i briefen og todo-lista, ikke bare det som er 🔴.

Må pinnen bli stående, skal den være en **eksakt versjon — ikke en range.** `tavla/.yarnrc.yml` setter `defaultSemverRangePrefix: ''` sammen med `npmMinimalAgeGate: 5760` og `enableScripts: false`, som er Team Sikkerhets herding mot supply chain-angrep ([#2100](https://github.com/entur/tavla/pull/2100)). En caret i `resolutions` flytter versjonsvalget tilbake til resolveringstidspunktet og undergraver nettopp det. Forfallsproblemet løses av at oversikten kjøres hver uke, ikke av en løsere versjonsspesifikasjon. Begrunnelse: `references/pin-vedlikehold.md`.

Detaljert framgangsmåte for å heve eller fjerne en pin, hvorfor eksakt versjon og ikke range, og hvordan finne historikken til en pin: `references/pin-vedlikehold.md`.

### Brief-mal (markdown)

Bruk denne strukturen. Alle seksjoner skal alltid være med, også om de er tomme.

```markdown
# 📦 Dependency-vakt — uke {ISO-uke} {år}

## 📋 Oversikt

| | entur/tavla | entur/tavla-visning | Totalt |
|---|---|---|---|
| Åpne PRer | {n} | {n} | {n} |
| Sikkerhetsvarsler | {n} ({severity}) | {n} ({severity}) | {n} |
| CodeQL-funn | {n} | {n} | {n} |
| Varsler med ≤7 dager til 30-dagersfristen | {n} | {n} | {n} |
| Pinner: antall / eldste | {n} / {alder} | {n} / {alder} | {n} |

## 📌 Pin-status

Først **hele oversikten** fra `pin-oversikt.py`, eldst først — den er kort, og den viser hva som finnes:

| Pakke | Repo | Pin | Sist satt | Alder |
|---|---|---|---|---|
| {pakke} | {repo} | {versjon} | {dato} ({PR}) | {alder} |

Deretter én underseksjon per pin du faktisk **vurderte** med `pin-vurder.py`. Vurder minst hver pin som også har et åpent varsel; står ingen av dem i varsellista, skriv «ingen pinner krysser ukens varsler» og la det være med oversikten.

### 🔴 {pakkenavn} — pinnet {pin-versjon}, fiks krever {versjon}
**Repo:** {repo}  |  **Blokkerer:** {n} varsler ({severity})  |  Satt i [{PR}]({url})

**Hvorfor pinnen står der:** {Fra `git log -L` på resolutions-blokka — hvilken PR innførte den, og hvilket problem løste den den gang}

**Hvorfor den nå er et problem:** {Nye CVE-er mot pinversjonen. Nevn hvis pinversjonslinja aldri fikk en fiks — da er varselet umulig å lukke uten å bytte versjonslinje}

**Anbefaling:** ✅ Fjern pinnen hvis vurderingen sier 🟢 — {hvilken versjon den da resolverer til}. Ellers hev til {versjon}, og si hvorfor pinnen må bli stående.

### 🟢 {pakkenavn} — pinnet {pin-versjon}, men trengs ikke lenger
**Repo:** {repo}  |  **Uten pinnen:** {versjon} ({n} konsumentranges konvergerer)

**Vurdering:** {Hvorfor pinnen ble satt, og hvorfor den ikke gjør nytte lenger}

**Anbefaling:** ✅ Fjern — gir Dependabot ansvaret tilbake, og pinnen kan ikke forfalle igjen

---

## ✅ Rutinemessige bumps

### 📦 {pakkenavn} {fra-versjon} → {til-versjon}
**Type:** Patch/Minor  |  **Risiko:** 🟢 Lav  |  [PR #{nummer}]({url})

**Hva endret seg:**
- {endringspunkt}

**Vurdering:** {Resonnement — hva ble sjekket, grep-funn, hva avgjorde risikoklassen}

**Anbefaling:** ✅ Merge

---

## ⚠️ Krever vurdering

### 📦 {pakkenavn} {fra-versjon} → {til-versjon}
**Type:** Minor/Major  |  **Risiko:** 🟡 Middels / 🔴 Høy  |  [PR #{nummer}]({url})

**Hva endret seg:**
- {endringspunkt}

**Vurdering:** {Resonnement}

**Anbefaling:** ⏸ Vent — {begrunnelse}

---

## 🔒 Sikkerhetsvarsler

Hvert varsel skal ha alder og gjenstående frist i topplinja. **Fristregel:** varsler med ≤7 dager igjen av de 30 hører i 🔴-bøtta i todo-lista uansett hvor lav reell risiko er. Er reell risiko lav og fristen nærmer seg, er svaret ikke «vent» — det er allowlist eller dismiss med begrunnelse (`references/sikkerhets-triage.md`, Steg 5). Et varsel som passerer 30 dager uten vurdering er et brudd på forpliktelsen, ikke en nedprioritering.

### 🔒 {pakkenavn} — {CVE/GHSA} ({severity})
**CVSS:** {score}  |  **Risiko:** 🔴/🟡/🟢  |  **Fix:** {versjon}  |  **Åpnet:** {dato} ({n} dager gammelt, {m} dager til fristen)  |  [Alert #{nummer}]({url})

**Sårbarhet:** {Hva er sårbarheten, hvilken funksjon, hvilken type angrep}

**Utnyttbarhet i Tavla:** {Grep-funn, bruksmønster, om og hvordan Tavla eksponerer den sårbare koden}

**Anbefaling:** ✅ Oppgrader nå / ⏸ Kan vente til {konkret dato innenfor fristen} / 🗑️ Allowlist med `reason` + `comment`, eller dismiss med begrunnelse ({Fix already started} / {False positive})

---

## 📌 Prioritert todo for uken

Generer denne seksjonen **etter** at all triage er gjort. List opp konkrete handlinger sortert etter prioritet — ikke pakker, men faktiske oppgaver vakten skal utføre. Bruk emoji for prioritet og lenk til relevante PRer/alerts.

```
🔴 Haster (gjør i dag)
- [ ] {konkret handling} — {kort begrunnelse} → [lenke]

🟡 Denne uken
- [ ] {konkret handling} — {kort begrunnelse} → [lenke]

🟢 Kan vente / neste runde
- [ ] {konkret handling} — {kort begrunnelse} → [lenke]
```

Eksempel på gode todo-punkter:
- ✅ "Dismiss CodeQL #39 som tolerable risk med kommentar om hardkodet hostname → [link]"
- ✅ "Merge Dependabot PR #123 (patch, grønt CI) → [link]"
- ✅ "Oppgrader postcss til 8.5.10+ i tavla-visning ved neste dep-runde"
- ❌ "Vurdere hono" (for vagt — si konkret hva som skal gjøres)

---

## 🧪 Test-sjekkliste for uken

- [ ] CI grønt på alle mergede PRer
- [ ] e2e kjørt manuelt etter hver major bump
- [ ] Bundle-size delta sjekket: kjør `yarn build` og se på Route (app)-tabellen — flag >5% delta
- [ ] CodeQL-funn besvart, allowlistet med `reason` + `comment`, eller dismisset med begrunnelse
- [ ] Ingen åpne varsler har passert 30 dager, og alle med ≤7 dager igjen står i 🔴-todo
- [ ] `pin-oversikt.py` kjørt og krysset mot varsellista, og hver pinnet pakke med åpent varsel er enten vurdert med `pin-vurder.py` eller står i todo-lista
- [ ] Alt som kom ut 🔴 **eller** 🟢 av en vurdering er fikset eller står i todo-lista
- [ ] `yarn install --immutable` grønt etter hver pin-endring (bekrefter at lockfilen er konsistent)
```

Legg til én seksjon per PR og én per alert. Legg til ekstra sjekklistepunkter for spesifikke handlingspunkter som dukker opp i triage (f.eks. "Dismiss stale DOMPurify-alerts").

**Rekkefølge i brief:** Oversikt → **📌 Pin-status** → Rutinemessige bumps → Krever vurdering → Sikkerhetsvarsler → **📌 Prioritert todo** → 🧪 Test-sjekkliste. Pin-seksjonen kommer først fordi en pin kan være grunnen til at et varsel lenger ned ikke lar seg lukke. Todo-seksjonen kommer alltid rett før test-sjekklisten.

---

## Steg 2 — Sikkerhetsvarsel-triage

Mange "kritiske" CVE-er er ikke utnyttbare i Tavlas faktiske kode. Det er en kjernekompetanse å vurdere reell utnyttbarhet — ikke bare lese CVSS-skåret.

Følg `references/sikkerhets-triage.md`. Kort versjon:

1. **Forstå** sårbarheten (hvilken funksjon, hvilken type angrep, hvilken input).
2. **Søk** etter brukssteder i Tavla-kode.
3. **Vurder** reell risiko i vår kontekst.
4. **Anbefal**: oppgrader nå / kan vente (med konkret dato innenfor 30-dagersfristen) / falsk positiv. Dokumentér resonnement.
5. **Lukk formelt**: skal varselet ikke fikses, må vurderingen bli sporbar — allowlist i `codescan.yml`/`dockerscan.yml`, eller dismiss med en av Enturs to godkjente begrunnelser. Se Steg 5 i referansefila.

Resultatet havner ett av to steder: som del av `## 🔒 Sikkerhetsvarsler` i mandagsbriefens fil, eller — hvis noen ber om triage av ett enkelt varsel utenom mandagsrunden — som frittstående svar i chatten. Enkelt-triage trenger ingen fil.

---

## Når en annen utvikler bør se på det

Vakten gjør førstevurdering og foreslår handling. I disse tre tilfellene skal en annen utvikler på teamet se på koden/PR-en før merge:

1. **Oppgraderingen krever kodeendringer hos oss** — ikke bare en versjonsbump.
2. **Det er en major-oppgradering** (semver-major).
3. **Du er usikker på noe** — uansett hva.

Dette er ikke en formell prosess. Tagg en annen utvikler i PR-en eller spør på Slack, og gå videre til neste i køen mens du venter. Du må ikke gjøre triagen alene — spør om bistand og sparring fra resten av teamet når som helst.

---

> Dokumentér alltid resonnementet, også for "lav reell risiko". Det er hva en sikkerhetsrevisor og fremtidige team-medlemmer leser. Og hvis noen i teamet er uenig, kan de korrigere — det er slik vi lærer.

---

## Referansefiler

Les bare det som er relevant for situasjonen:

- `references/risikoklassifisering.md` — Hvordan klassifisere risiko per pakke / endring. Les ved tvil om en PR er rutine eller krever full triage.
- `references/sikkerhets-triage.md` — Detaljert framgangsmåte for CVE-vurdering, og hvordan et varsel lukkes formelt (allowlist vs. dismiss, Enturs to godkjente dismiss-begrunnelser, når Team Sikkerhet skal inn). Les når en Dependabot security alert dukker opp.
- `references/pin-vedlikehold.md` — Hvorfor `resolutions`/`overrides`-pinner forfaller, beslutningsrekkefølgen `fjern → eksakt + audit`, hvorfor range ikke brukes i Tavla, hvordan heve en forfalt pin trygt, og hvordan finne historikken til en pin (`git log -L`, ikke `git blame`). Les når en pin-vurdering gir 🔴, eller når du skal sette en ny pin.

## Scripts

- `scripts/pin-oversikt.py` — Lister alle pinner i begge repoer med versjon, PR og alder, eldst først. Billig: bare git og to package.json-filer. Fast punkt i mandagsbriefen (Steg 1b).
- `scripts/pin-vurder.py <pakke> [tavla|visning]` — Vurderer én pin: hvorfor den står der, om den blokkerer en fiks, og om den fortsatt trengs. Krever `gh`, npm og semver. Kjøres på forespørsel, ikke automatisk.
- `scripts/_pinfelles.py` — Delt grunnlag for de to over. Ikke et selvstendig script.

## Læringsprinsipp

Forklar alltid hvorfor — ikke bare hva. Dette gjelder spesielt i "Vurdering"-seksjonen for hver PR og alert.

Eksempler på hva som er læringsrikt vs ikke:

- ❌ "Trygt å merge."
- ✅ "Trygt fordi semver-konvensjon sier patch ikke skal endre API. Changelog bekrefter kun bugfix i `parseDate`. Vi bruker `parseDate` i `src/utils/time.ts`, men kallene er identiske før og etter."

- ❌ "CVE er kritisk, oppgrader."
- ✅ "CVE 9.8 (kritisk). Sårbarheten er i `parseURL` ved kontrollert input — men `parseURL` kalles bare i serverside-kode med våre egne URL-er, aldri med brukerinput. Reell risiko: lav. Anbefaler oppgradering ved neste planlagte runde."

Disse forklaringene koster lite ekstra tid, og er det som faktisk bygger kompetanse i teamet over uker og måneder.
