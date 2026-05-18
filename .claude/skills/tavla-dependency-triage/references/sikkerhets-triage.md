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

- **Oppgrader nå** — høy eller middels reell risiko. Lag PR snarest, eskaler hvis bumpen er stor.
- **Oppgrader når praktisk** — lav reell risiko. Bake inn i neste planlagte runde, ikke haste-PR.
- **Falsk positiv / ikke relevant** — dokumentér hvorfor i triage-notatet, og dismiss alertet med begrunnelse i GitHub.

## Dokumentér resonnementet

Dette er kritisk og kan ikke skippes — selv for "lav reell risiko" og "falsk positiv":

- Sikkerhetsrevisorer og auditører kan be om dette
- Neste vakt kan trenge å revurdere hvis kontekst endrer seg
- Senior reviewer kan korrigere deg hvis vurderingen er feil — og det er hvordan teamet blir bedre

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

Den korte versjonen — "høy reell risiko, oppgrader nå" — kunne stått alene. Men den lange forklaringen er det som gjør at neste vakt og senior kan etterprøve.
