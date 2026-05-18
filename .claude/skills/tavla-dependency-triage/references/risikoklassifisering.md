# Risikoklassifisering

Brukes til å plassere hver Dependabot-PR i en av tre klasser. Klassifiseringen styrer hvor mye tid som brukes på triagen og om senior eskaleres.

## 🟢 Lavt risiko — scan + merge

Disse skal være flertallet. Lett scan, kort triage-notat, merge etter CI grønt.

- Patch-bumps (`x.y.Z`) på stabile, modne pakker
- Minor-bumps (`x.Y.z`) uten breaking changes nevnt i changelog
- Dev-only dependencies som ikke kjører i prod (storybook, testbibliotek, linters)
- Pakker som kun brukes i bygget, ikke i runtime

## 🟡 Middels risiko — full triage, vakt kan merge

Krever at vakten faktisk leser changelog og sjekker brukssteder i Tavla-kode.

- Minor-bumps som introduserer nye API-er (vurder om vi bør migrere)
- Patch-bumps på sikkerhetskritiske pakker (auth, kryptering, JWT-håndtering, URL/HTML-parsing av brukerinput)
- Pakker brukt i render-pathen til avgangstavlen (`TileCard`, `TileList`, sanntidskomponenter)
- Pakker brukt av GraphQL-klienten mot Entur journey-planner

## 🔴 Høyt risiko — grundig vurdering

Krever at vakten leser changelog grundig, sjekker brukssteder, og skriver detaljert triage-notat med konkret test-plan. Hvis du står fast eller er usikker — spør en teammedlem.

- **Alle major version bumps** (semver-major)
- Sikkerhetsvarsler med severity `high` eller `critical`
- Breaking changes som krever kodemigrering i Tavla
- Endringer i Entur API-klient (`@entur/*`, journey-planner-pakker)
- Endringer i auth-relaterte pakker (login, sesjon, tokens)
- CI eller e2e som ikke kan diagnostiseres trivielt

## Klassifiseringssjekkliste

For hver PR, svar på fire spørsmål:

1. **Hva er pakken?** Prod- eller dev-dependency? Kjernepakke eller hjelpepakke?
2. **Hva slags bump?** Patch, minor, eller major?
3. **Hva sier changelog?** Bare bugfix, eller nye API-er / breaking changes?
4. **Hvor i Tavla brukes det?** `grep` etter pakkenavnet. Brukes det i render-pathen? Auth? Test-only?

Hvis du er i tvil mellom to klasser, velg den høyere. Marginal-overarbeid er billigere enn å overse en breaking change i prod.

## Pakke-kategorier spesifikke for Tavla

Disse pakkene er **alltid minimum 🟡**, uansett bumptype:

- `@entur/*` (design system-komponenter: `@entur/button`, `@entur/icons` osv.)
- Auth-pakker (`firebase`, `firebase-admin`, `firebase-functions`)
- React core (`react`, `react-dom`, `next`)
- `dompurify` — brukes til HTML-sanitering i opplasting og admin-UI; sikkerhetsrelevant uansett bumptype
- `@sentry/nextjs` — feilrapportering i prod; config-migrering kan kreves ved major bump
- `@graphql-codegen/*` — endringer kan brekke genererte TypeScript-typer; alltid les changelog
- Pakker brukt av board-rendering (`TileCard`, `TileList`, sanntidskomponenter)

Disse pakkene er som regel 🟢 hvis bumpen er patch/minor:

- Linters og formattere (`@biomejs/biome`)
- Type-definisjoner (`@types/*`)
- Build-verktøy (`postcss`, `autoprefixer`, `tailwindcss`)

Listen er ikke uttømmende — bruk skjønn, og oppdater denne fila når teamet blir enige om nye kategorier.
