# Sikkerhetstriage — vurder utnyttbarhet, ikke bare CVSS

Mange "kritiske" Dependabot-varsler er ikke utnyttbare i Tavla-konteksten. Pakken har en sårbarhet, men den sårbare kodepathen er ikke nåbar fra Tavlas kode. Det er kjernekompetansen som denne triagen bygger: å vurdere **reell risiko**, ikke bare lese CVSS-skåret.

## Steg 1 — Forstå sårbarheten

Les GitHub Security Advisory som er lenket i alertet. Svar på:

- **Hvilken funksjon / modul er sårbar?** (helt konkret: navn på funksjon, klasse, eller fil)
- **Hva slags angrep muliggjør den?** RCE, XSS, prototype pollution, ReDoS, SSRF, path traversal, prototype injection, DoS, ...
- **Hva slags input trigger sårbarheten?** Brukerinput? Spesielt formatert URL? Spesifikk JSON-struktur?
- **Hvilken versjon er fix-et?** Trenger vi major-bump eller holder patch?

Hvis advisoryen er vag, sjekk:
- Selve PR-en / commiten som fikset det (lenke i advisory)
- Issue-tråden i pakke-repoet
- Snyk-rapport hvis tilgjengelig

## Steg 2 — Søk i Tavla-kode

Konkret: bruk `grep` (eller IDE-søk) for å finne brukssteder. Søk etter:

- Navn på den sårbare funksjonen / metoden
- API-er nevnt i advisory
- Mønstre som indirekte kaller koden (f.eks. høyere-ordens API-er som internt bruker den sårbare funksjonen)

For transitive dependencies (pakker som ikke står i `package.json` direkte, men brukes av noe vi har): sjekk om vi faktisk kaller funksjonalitet som bruker den sårbare path-en. Ofte er svaret nei.

## Steg 3 — Vurder reell risiko i Tavla

| Vurdering | Eksempel |
|-----------|----------|
| **Høy reell risiko** | Sårbar funksjon kalles direkte i prod-kode, med input som kan kontrolleres av angriper |
| **Middels risiko** | Sårbar funksjon ligger i transitive dep, men nås via vår kode med delvis kontrollerbar input |
| **Lav reell risiko** | Sårbar funksjon eksisterer i installasjonen vår, men kalles aldri fra Tavla-kode |
| **Falsk positiv** | Vår versjon har allerede fix, eller pakken brukes ikke i prod |

CVSS-skår er en startverdi, ikke en konklusjon. Ofte vil reell risiko være ett hakk lavere enn CVSS antyder, av to grunner:

1. CVSS antar **verst tenkelig kontekst** — angriper har full kontroll på input
2. Pakker brukes ofte til **smale formål** i en gitt applikasjon

## Steg 4 — Anbefaling

Velg en av tre:

- **Oppgrader nå** — høy eller middels reell risiko. Lag PR snarest, og få en annen utvikler til å se på den hvis bumpen er stor eller krever kodeendringer.
- **Oppgrader når praktisk** — lav reell risiko. Bake inn i neste planlagte runde, ikke haste-PR. Sett en **konkret dato**, og la den ligge innenfor 30-dagersfristen fra varselet ble åpnet. «Når praktisk» betyr ikke «når som helst».
- **Falsk positiv / ikke relevant** — dokumentér hvorfor i triage-notatet, og lukk varselet formelt (Steg 5).

Alle tre må forholde seg til fristen: Entur krever at sårbarheter er triaget og fikset innen **30 dager** fra de oppdages. Regn ut hvor mange dager som er igjen før du velger. Har varselet ≤7 dager igjen, er «kan vente» ikke lenger et gyldig utfall — da er det enten fiks eller formelt lukket med begrunnelse.

## Steg 5 — Lukk varselet formelt

Et varsel du har vurdert, men ikke skal fikse, må lukkes slik at vurderingen blir sporbar. Entur har to mekanismer, og de brukes til forskjellige ting.

### Allowlist — den varige mekanismen

Sårbarheter som ikke kan løses på annen måte legges i en allowlist. Poenget er dobbelt: de forsvinner fra oversikten, *og* det dokumenteres at risikoen faktisk er vurdert. For CodeQL-funn ligger lista i `.entur/security/codescan.yml`:

```yaml
apiVersion: entur.io/securitytools/v1
kind: CodeScanConfig
metadata:
  id: tavla
spec:
  allowlist:
    - cwe: "cwe-080"
      comment: "Hardkodet hostname, ikke brukerkontrollert input"
      reason: "false_positive"   # false_positive | wont_fix | test
```

`reason` er ett av tre:

| Verdi | Betyr |
|-------|-------|
| `false_positive` | Funnet er feil — koden er ikke sårbar |
| `wont_fix` | Funnet er reelt, men vi aksepterer risikoen bevisst |
| `test` | Treffer testkode, ikke prod |

`comment` er der resonnementet ditt havner. Skriv det som om en revisor leser det uten annen kontekst, for det er nøyaktig hva som skjer. For sårbarheter i docker-image er fila `dockerscan.yml` og nøkkelen `cve:` i stedet for `cwe:`.

Fila plukkes opp neste gang appen bygges, og må merges til `main` for å ha effekt.

To ting å være obs på:

- **Tavla har ingen `.entur/`-katalog i dag.** Første allowlist betyr at du oppretter den, og det er en PR som fortjener et par øyne — ikke noe som skal snikes inn i en dependency-bump.
- **Plasseringen kan flytte.** Team Sikkerhet har en pågående sak (SIK-1995) om å flytte `codescan.yml`/`dockerscan.yml` fra `.entur/security/` opp til repo-rot. Sjekk hva `entur/gha-security` faktisk leter etter før du oppretter fila.

### Dismiss i GitHub — den midlertidige

Dismiss brukes når varselet skal bort nå, uten at det trengs en permanent regel. Entur krever at du oppgir én av to grunner:

- **Fix already started** — lenk til PR-en eller Jira-saken som fikser det
- **False positive** — forklar konkret hvorfor

En dismiss uten begrunnelse er verre enn et åpent varsel: oversikten ser ren ut, men vurderingen finnes ikke noe sted. Skriv samme resonnement i dismiss-kommentaren som i briefen.

### Når Team Sikkerhet skal inn

Retningslinjen sier eksplisitt at utnyttbarhetsvurderinger kan være kompliserte, og bør gjøres i samarbeid med teamet — ved behov med assistanse fra Team Sikkerhet (`#talk-sikkerhet`). Det gjelder særlig før du setter `wont_fix` på noe med høy CVSS: da erklærer du at Tavla aksepterer en reell risiko, og det er ikke en avgjørelse en vakt bør ta alene.

## Dokumentér resonnementet

Dette er kritisk og kan ikke skippes — selv for "lav reell risiko" og "falsk positiv":

- Sikkerhetsrevisorer og auditører kan be om dette
- Neste vakt kan trenge å revurdere hvis kontekst endrer seg
- En annen utvikler kan korrigere deg hvis vurderingen er feil — og det er hvordan teamet blir bedre

Skriv resonnementet i triage-notatet på PR-en, og i `## 🔒 Sikkerhetsvarsler`-seksjonen av mandagsbriefingen.

## Eksempel — full sikkerhetstriage

> **Pakke:** `dompurify@3.1.0` (sårbar) → `dompurify@3.2.0`
> **CVE-2024-XXXX, CVSS 8.8 (høy)** — XSS via spesielt konstruert HTML med nestede template-elementer som omgår sanitering.
>
> **Hvordan jeg vurderte det:**
> Sårbarheten utnyttes via `DOMPurify.sanitize(userControlledHtml)` når input inneholder spesifikke nøstede tags. I Tavla brukes `dompurify` i `app/api/upload/route.ts` til å sanitere opplastet innhold. Dette er brukerinput som går direkte inn i `sanitize()` — eksakt den sårbare kodepathen. `grep -r "DOMPurify\|dompurify" app/` viser ytterligere bruk i admin-UI for stopplace-navn (`SetStopPlaceName.tsx`) og TileSelector.
>
> **Reell risiko:** Høy. Sårbar funksjon kalles med brukerinput i prod.
>
> **Anbefaling:** Oppgrader nå. Patch-bump, CI bør være grønt etter merge.

Den korte versjonen — "høy reell risiko, oppgrader nå" — kunne stått alene. Men den lange forklaringen er det som gjør at neste vakt og andre på teamet kan etterprøve.
