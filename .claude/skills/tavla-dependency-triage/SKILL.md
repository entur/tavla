---
name: tavla-dependency-triage
description: >
  Triage av Dependabot-PRer, sikkerhetsvarsler og CodeQL-funn for Tavla. Bruk når
  noen på Tavla-teamet er på dependency-vakt og skal vurdere åpne Dependabot-PRer,
  klassifisere risiko, vurdere CVE-utnyttbarhet, eller skrive triage-notater.
  Trigger også ved omtale av "dependency-vakt", "avhengighetsoppdatering", "sikkerhetsvarsel",
  "Dependabot", "mandagsbrief", "ukens pakker", "er denne oppgraderingen trygg", eller når
  noen åpner en Dependabot-PR og vil ha hjelp til å vurdere den. Brukes også for å opprette
  ukens dependency-brief som ETU-sak. Skillen forklarer alltid hvorfor — målet er å bygge
  kompetanse i teamet over tid, ikke bare gjøre vurderingen.
---

# Tavla — Dependency Triage

Felles arbeidsflyt for Tavlas ukentlige dependency-vakt. Skillen dekker to situasjoner:

1. **Mandagsbrief** — opprett ETU-sak med full triage av alle PRer, alerts og CodeQL-funn.
2. **Enkelt-triage** — vurder én konkret PR eller alert, presenter resultatet i chatten.

All triage-output samles i ETU-saken. Ingen PR-kommentarer skrives.

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
| Man 09:00 | Opprett ukens dependency-brief med full triage | ETU-sak (se Steg 1) |
| Fre EOD | Lukk briefingsaken | ETU-sak til Done |

---

## Steg 1 — Mandagsbrief (ETU-sak)

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
5. Opprett ETU-sak via `jira-entur-tavla`-skillen med **ADF-format** (se malen under):
   - **Summary:** `📦 Dependency-vakt — uke {ISO-uke} {år}`
   - **Issue type:** `Task`
   - **contentFormat:** `adf` ← viktig, ikke markdown
   - **Description:** ADF-dokument basert på malen under

### Description-mal (ADF)

Send description som et ADF JSON-objekt med `contentFormat: "adf"`. Strukturen er:

```
📋 Oversikt            ← heading 3 + tabell med nøkkeltall
✅ Rutinemessige bumps ← heading 3 + én panel per PR (grønn)
⚠️ Krever vurdering   ← heading 3 + én panel per item (gul/rød)
🔒 Sikkerhetsvarsler  ← heading 3 + én panel per alert (gul/rød)
🧪 Test-sjekkliste    ← heading 3 + taskList
📝 Notater fra forrige vakt ← heading 3 + paragraph
```

#### Panel-farger etter risiko

| Risiko | panelType | Bruk |
|--------|-----------|------|
| 🟢 Lav | `success` | Rutinemessige patch/minor-bumps |
| 🟡 Middels | `note` | Minor med nye API-er, sikkerhetspakker |
| 🔴 Høy | `warning` | Major, høy/kritisk CVE, kjernebiblioteker |
| 🔵 Info | `info` | Stale alerts, kontekstuell info |

#### Struktur per PR-panel

Hvert element i "Rutinemessige bumps" og "Krever vurdering" skal være et eget panel med denne innholdsstrukturen:

```
heading 4: 📦 {pakkenavn} {fra-versjon} → {til-versjon}
paragraph: Type: {Patch/Minor/Major}  |  Risiko: {🟢/🟡/🔴}  |  [PR #{nummer}]({url}) eller [Alert #{nummer}]({url})
heading 5: Hva endret seg
bulletList: endringspunkter fra changelog
heading 5: Vurdering
paragraph: Resonnement — hva ble sjekket, grep-funn, hva avgjorde risikoklassen
heading 5: Anbefaling
paragraph: ✅ Merge / ⏸ Vent / 🗑️ Dismiss (med begrunnelse)
```

#### Fullstendig ADF-skjelett

```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "heading", "attrs": {"level": 3},
      "content": [{"type": "text", "text": "📋 Oversikt"}]
    },
    {
      "type": "table",
      "attrs": {"isNumberColumnEnabled": false, "layout": "default"},
      "content": [
        {
          "type": "tableRow",
          "content": [
            {"type": "tableHeader", "content": [{"type": "paragraph", "content": [{"type": "text", "text": ""}]}]},
            {"type": "tableHeader", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "entur/tavla"}]}]},
            {"type": "tableHeader", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "entur/tavla-visning"}]}]},
            {"type": "tableHeader", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Totalt"}]}]}
          ]
        },
        {
          "type": "tableRow",
          "content": [
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Åpne PRer", "marks": [{"type": "strong"}]}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n}"}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n}"}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n}"}]}]}
          ]
        },
        {
          "type": "tableRow",
          "content": [
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Sikkerhetsvarsler", "marks": [{"type": "strong"}]}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n} ({severity})"}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n} ({severity})"}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n}"}]}]}
          ]
        },
        {
          "type": "tableRow",
          "content": [
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "CodeQL-funn", "marks": [{"type": "strong"}]}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n}"}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n}"}]}]},
            {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{n}"}]}]}
          ]
        }
      ]
    },
    {
      "type": "heading", "attrs": {"level": 3},
      "content": [{"type": "text", "text": "✅ Rutinemessige bumps"}]
    },
    {
      "type": "panel", "attrs": {"panelType": "success"},
      "content": [
        {
          "type": "heading", "attrs": {"level": 4},
          "content": [{"type": "text", "text": "📦 {pakkenavn} {fra} → {til}"}]
        },
        {
          "type": "paragraph",
          "content": [
            {"type": "text", "text": "Type: Patch  |  Risiko: 🟢 Lav  |  "},
            {"type": "text", "text": "PR #{nummer}", "marks": [{"type": "link", "attrs": {"href": "{pr-url}"}}]}
          ]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Hva endret seg"}]
        },
        {
          "type": "bulletList",
          "content": [
            {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{endringspunkt}"}]}]}
          ]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Vurdering"}]
        },
        {
          "type": "paragraph",
          "content": [{"type": "text", "text": "{Resonnement — hva ble sjekket, grep-funn, hva avgjorde risikoklassen}"}]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Anbefaling"}]
        },
        {
          "type": "paragraph",
          "content": [{"type": "text", "text": "✅ Merge"}]
        }
      ]
    },
    {
      "type": "heading", "attrs": {"level": 3},
      "content": [{"type": "text", "text": "⚠️ Krever vurdering"}]
    },
    {
      "type": "panel", "attrs": {"panelType": "note"},
      "content": [
        {
          "type": "heading", "attrs": {"level": 4},
          "content": [{"type": "text", "text": "📦 {pakkenavn} {fra} → {til}"}]
        },
        {
          "type": "paragraph",
          "content": [
            {"type": "text", "text": "Type: Minor  |  Risiko: 🟡 Middels  |  "},
            {"type": "text", "text": "PR #{nummer}", "marks": [{"type": "link", "attrs": {"href": "{pr-url}"}}]}
          ]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Hva endret seg"}]
        },
        {
          "type": "bulletList",
          "content": [
            {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "{endringspunkt}"}]}]}
          ]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Vurdering"}]
        },
        {
          "type": "paragraph",
          "content": [{"type": "text", "text": "{Resonnement}"}]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Anbefaling"}]
        },
        {
          "type": "paragraph",
          "content": [{"type": "text", "text": "⏸ Vent — {begrunnelse}"}]
        }
      ]
    },
    {
      "type": "heading", "attrs": {"level": 3},
      "content": [{"type": "text", "text": "🔒 Sikkerhetsvarsler"}]
    },
    {
      "type": "panel", "attrs": {"panelType": "warning"},
      "content": [
        {
          "type": "heading", "attrs": {"level": 4},
          "content": [{"type": "text", "text": "🔒 {pakkenavn} — {CVE/GHSA} ({severity})"}]
        },
        {
          "type": "paragraph",
          "content": [
            {"type": "text", "text": "CVSS: {score}  |  EPSS: {%}  |  Risiko: 🔴/🟡/🟢  |  Fix: {versjon}  |  "},
            {"type": "text", "text": "Alert #{nummer}", "marks": [{"type": "link", "attrs": {"href": "{alert-url}"}}]}
          ]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Sårbarhet"}]
        },
        {
          "type": "paragraph",
          "content": [{"type": "text", "text": "{Hva er sårbarheten, hvilken funksjon, hvilken type angrep}"}]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Utnyttbarhet i Tavla"}]
        },
        {
          "type": "paragraph",
          "content": [{"type": "text", "text": "{Grep-funn, bruksmønster, om og hvordan Tavla eksponerer den sårbare koden}"}]
        },
        {
          "type": "heading", "attrs": {"level": 5},
          "content": [{"type": "text", "text": "Anbefaling"}]
        },
        {
          "type": "paragraph",
          "content": [{"type": "text", "text": "✅ Oppgrader nå / ⏸ Kan vente / 🗑️ Dismiss som falsk positiv"}]
        }
      ]
    },
    {
      "type": "heading", "attrs": {"level": 3},
      "content": [{"type": "text", "text": "🧪 Test-sjekkliste for uken"}]
    },
    {
      "type": "taskList",
      "attrs": {"localId": "checklist-1"},
      "content": [
        {
          "type": "taskItem",
          "attrs": {"localId": "t1", "state": "TODO"},
          "content": [{"type": "text", "text": "CI grønt på alle merget PRer"}]
        },
        {
          "type": "taskItem",
          "attrs": {"localId": "t2", "state": "TODO"},
          "content": [{"type": "text", "text": "e2e kjørt manuelt etter hver major bump"}]
        },
        {
          "type": "taskItem",
          "attrs": {"localId": "t3", "state": "TODO"},
          "content": [{"type": "text", "text": "Bundle-size delta sjekket: kjør yarn build og se på Route (app)-tabellen — flag >5% delta"}]
        },
        {
          "type": "taskItem",
          "attrs": {"localId": "t4", "state": "TODO"},
          "content": [{"type": "text", "text": "CodeQL-funn besvart eller dismisset med begrunnelse"}]
        }
      ]
    },
    {
      "type": "heading", "attrs": {"level": 3},
      "content": [{"type": "text", "text": "📝 Notater fra forrige vakt"}]
    },
    {
      "type": "paragraph",
      "content": [{"type": "text", "text": "Ingen ETU-sak funnet fra forrige uke."}]
    }
  ]
}
```

Legg til én panel per PR og én panel per alert. Legg til task-items i sjekklisten for spesifikke handlingspunkter som dukker opp i triage (f.eks. "Dismiss stale DOMPurify-alerts").

### Hvorfor en ETU-sak med ADF

Saken er vaktens "hjemmebase" for uken. Paneler med farger gjør det visuelt lett å scanne risiko. Triage-notatene er søkbare og gir neste vakt — og fremtidige utviklere — full kontekst. Ved ukens slutt lukkes den og blir paper trail.

---

## Steg 2 — Sikkerhetsvarsel-triage

Mange "kritiske" CVE-er er ikke utnyttbare i Tavlas faktiske kode. Det er en kjernekompetanse å vurdere reell utnyttbarhet — ikke bare lese CVSS-skåret.

Følg `references/sikkerhets-triage.md`. Kort versjon:

1. **Forstå** sårbarheten (hvilken funksjon, hvilken type angrep, hvilken input).
2. **Søk** etter brukssteder i Tavla-kode.
3. **Vurder** reell risiko i vår kontekst.
4. **Anbefal**: oppgrader nå / kan vente / falsk positiv. Dokumentér resonnement.

Resultatet dokumenteres som et panel i ETU-saken (se ADF-mal over), ikke som PR-kommentar.

> Dokumentér alltid resonnementet, også for "lav reell risiko". Det er hva en sikkerhetsrevisor og fremtidige team-medlemmer leser. Og hvis noen i teamet er uenig, kan de korrigere — det er slik vi lærer.

---

## Referansefiler

Les bare det som er relevant for situasjonen:

- `references/risikoklassifisering.md` — Hvordan klassifisere risiko per pakke / endring. Les ved tvil om en PR er rutine eller krever full triage.
- `references/sikkerhets-triage.md` — Detaljert framgangsmåte for CVE-vurdering. Les når en Dependabot security alert dukker opp.

## Læringsprinsipp

Forklar alltid hvorfor — ikke bare hva. Dette gjelder spesielt i "Vurdering"-seksjonen i hvert panel.

Eksempler på hva som er læringsrikt vs ikke:

- ❌ "Trygt å merge."
- ✅ "Trygt fordi semver-konvensjon sier patch ikke skal endre API. Changelog bekrefter kun bugfix i `parseDate`. Vi bruker `parseDate` i `src/utils/time.ts`, men kallene er identiske før og etter."

- ❌ "CVE er kritisk, oppgrader."
- ✅ "CVE 9.8 (kritisk). Sårbarheten er i `parseURL` ved kontrollert input — men `parseURL` kalles bare i serverside-kode med våre egne URL-er, aldri med brukerinput. Reell risiko: lav. Anbefaler oppgradering ved neste planlagte runde."

Disse forklaringene koster lite ekstra tid, og er det som faktisk bygger kompetanse i teamet over uker og måneder.
