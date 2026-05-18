# Eskaleringsregler

Vakten gjør førstevurdering og foreslår handling — men noen ting skal alltid ha et ekstra par øyne før merge.

## Eskaler alltid

- **Alle major version bumps** (semver-major, `X.0.0`).
- **Sikkerhetsvarsler med severity `high` eller `critical`**.
- **Endringer i auth-relaterte pakker** — `firebase`, `firebase-admin`, `firebase-functions`, sesjonshåndtering, tokens.
- **Endringer i `@entur/*`-pakker** — design system-komponenter brukt overalt i UI; breaking changes påvirker mange filer.
- **Endringer i kjernerendering** av avgangstavlen — pakker brukt av `TileCard`, `TileList`, sanntidskomponenter, eller den faktiske render-pathen.
- **`@sentry/nextjs` major bump** — krever ofte config-migrering i `sentry.*.config.ts`.
- **CI-regresjoner** som vakt ikke klarer å diagnostisere selv etter 30 min.
- **Bundle-size delta over 5%** på en enkelt PR (eller du blir overrasket av endringen).

## Bra praksis for eskalering

1. **Skriv triage-notatet først** — selv om du er usikker. Det viser hva du har vurdert og hvor du står fast. Senior trenger ikke starte fra null.
2. **Foreslå din egen anbefaling.** Det er greit å si "jeg tror dette er trygt fordi X, men vil ha et par øyne på Y". Du lærer mest når du tar et standpunkt og blir korrigert.
3. **Tagg eksplisitt** i PR-kommentaren: `@tech-lead-handle PTAL` eller tilsvarende. Eventuelt en melding på Slack med PR-lenke.
4. **Ikke vent på response før neste PR.** Gå videre til neste i køen mens du venter.

## Når i tvil — eskaler

Bedre å eskalere unødvendig én gang for mye enn å merge noe som bryter prod.

Senior-tid på dependency-spørsmål er bevisst budsjettert. Det er ikke en ulempe at vakter eskalerer mye den første gangen — det er hele poenget med rotasjonen.

## Eksempler

**Eskaler:**
- `react@18.x → 19.x` — major bump, vil kreve testing av hele renderingen
- Sikkerhetsvarsel med CVSS 8.5 i `lodash` eller `dompurify`
- `@entur/button@3.x → 4.x` — major bump i design system-komponent brukt overalt
- Minor bump i `firebase-admin` (auth-pakke uansett bumptype)
- Patch bump på `next` som mislykkes i typecheck og vakt vet ikke hvorfor
- `@sentry/nextjs@9.x → 10.x` — major bump krever config-gjennomgang

**Ikke eskaler:**
- Patch bump av `@types/node` som bare endrer typer
- Minor bump av `@biomejs/biome` uten breaking changes i linting
- Patch bump av `postcss` eller `tailwindcss` der `grep` viser ingen API-endringer

## Hva senior bidrar med

- Domenekunnskap (hvilke deler av Tavla er sensitive akkurat nå)
- Erfaringsbasert intuisjon (har vi blitt brent av denne pakken før?)
- Beslutningsstøtte når triage-resultatet er flertydig
- Læringssamtale — hva ville senior gjort annerledes?
