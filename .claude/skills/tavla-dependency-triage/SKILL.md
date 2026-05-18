---
name: tavla-dependency-triage
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

1. **Mandagsbrief** — hent og trier alle åpne PRer, alerts og CodeQL-funn, skriv ut en ferdig formatert brief i chatten.
2. **Enkelt-triage** — vurder én konkret PR eller alert, presenter resultatet i chatten.

## Kontekst

Dependabot kjører mandager 08:00 (Europe/Amsterdam) på `/tavla` og grupperer i `patch-minor-dependencies` og `major-dependencies`. CodeQL kjører på PR-er mot `main` og som ukentlig scan mandag 03:00. Dependabot-sikkerhetsvarsel kan komme når som helst.

**Repoer som dekkes:** Tavla-teamet har to GitHub-repoer som begge skal sjekkes:
- `entur/tavla` — Next.js-frontenden (admin + konfigurasjon)
- `entur/tavla-visning` — den offentlige visningsappen (public display board)

Backend (`backend/Cargo.toml`, Rust/Axum) og redirect-tjenesten er egne Cargo-prosjekter — de er *ikke* dekket her.

Vakten roterer ukentlig blant de tre utviklerne. Erfaringsnivå varierer — derfor er **forklaring av resonnement** en eksplisitt del av jobben. Det er hvordan teamet bygger kompetanse over tid.

> Hvis du er usikker på noe, spør en teammedlem. Det er ikke en formell prosess — det er hvordan teamet jobber. Tech lead følger med uansett.

## Ukens flyt

| Når | Hva | Hvor |
|-----|-----|------|
| Man 09:00 | Skriv ut ukens dependency-brief med full triage | Chatten (se Steg 1) |

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
3. Hent siste ukes CodeQL-funn fra begge repoer:
   ```
   gh api repos/entur/tavla/code-scanning/alerts --jq '[.[] | select(.state=="open")]'
   gh api repos/entur/tavla-visning/code-scanning/alerts --jq '[.[] | select(.state=="open")]'
   ```
4. For hver PR og alert: klassifiser iht. `references/risikoklassifisering.md`, grep etter brukssteder i Tavla-kode der det er relevant.
5. Skriv ut en ferdig formatert markdown-brief direkte i chatten (se malen under).

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

### 🔒 {pakkenavn} — {CVE/GHSA} ({severity})
**CVSS:** {score}  |  **Risiko:** 🔴/🟡/🟢  |  **Fix:** {versjon}  |  [Alert #{nummer}]({url})

**Sårbarhet:** {Hva er sårbarheten, hvilken funksjon, hvilken type angrep}

**Utnyttbarhet i Tavla:** {Grep-funn, bruksmønster, om og hvordan Tavla eksponerer den sårbare koden}

**Anbefaling:** ✅ Oppgrader nå / ⏸ Kan vente / 🗑️ Dismiss som falsk positiv

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
- [ ] CodeQL-funn besvart eller dismisset med begrunnelse
```

Legg til én seksjon per PR og én per alert. Legg til ekstra sjekklistepunkter for spesifikke handlingspunkter som dukker opp i triage (f.eks. "Dismiss stale DOMPurify-alerts").

**Rekkefølge i brief:** Oversikt → Rutinemessige bumps → Krever vurdering → Sikkerhetsvarsler → **📌 Prioritert todo** → 🧪 Test-sjekkliste. Todo-seksjonen kommer alltid rett før test-sjekklisten.

---

## Steg 2 — Sikkerhetsvarsel-triage

Mange "kritiske" CVE-er er ikke utnyttbare i Tavlas faktiske kode. Det er en kjernekompetanse å vurdere reell utnyttbarhet — ikke bare lese CVSS-skåret.

Følg `references/sikkerhets-triage.md`. Kort versjon:

1. **Forstå** sårbarheten (hvilken funksjon, hvilken type angrep, hvilken input).
2. **Søk** etter brukssteder i Tavla-kode.
3. **Vurder** reell risiko i vår kontekst.
4. **Anbefal**: oppgrader nå / kan vente / falsk positiv. Dokumentér resonnement.

Resultatet skrives ut i chatten, enten som del av mandagsbriefens sikkerhetsvarsel-seksjon eller som frittstående svar.

> Dokumentér alltid resonnementet, også for "lav reell risiko". Det er hva en sikkerhetsrevisor og fremtidige team-medlemmer leser. Og hvis noen i teamet er uenig, kan de korrigere — det er slik vi lærer.

---

## Referansefiler

Les bare det som er relevant for situasjonen:

- `references/risikoklassifisering.md` — Hvordan klassifisere risiko per pakke / endring. Les ved tvil om en PR er rutine eller krever full triage.
- `references/sikkerhets-triage.md` — Detaljert framgangsmåte for CVE-vurdering. Les når en Dependabot security alert dukker opp.

## Læringsprinsipp

Forklar alltid hvorfor — ikke bare hva. Dette gjelder spesielt i "Vurdering"-seksjonen for hver PR og alert.

Eksempler på hva som er læringsrikt vs ikke:

- ❌ "Trygt å merge."
- ✅ "Trygt fordi semver-konvensjon sier patch ikke skal endre API. Changelog bekrefter kun bugfix i `parseDate`. Vi bruker `parseDate` i `src/utils/time.ts`, men kallene er identiske før og etter."

- ❌ "CVE er kritisk, oppgrader."
- ✅ "CVE 9.8 (kritisk). Sårbarheten er i `parseURL` ved kontrollert input — men `parseURL` kalles bare i serverside-kode med våre egne URL-er, aldri med brukerinput. Reell risiko: lav. Anbefaler oppgradering ved neste planlagte runde."

Disse forklaringene koster lite ekstra tid, og er det som faktisk bygger kompetanse i teamet over uker og måneder.
