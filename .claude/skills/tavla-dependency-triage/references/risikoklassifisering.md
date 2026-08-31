# Hva gjør du med en Dependabot-PR?

Bumptypen bestemmer to ting: hvor mye arbeid du legger i den, og hvem som merger.

| Bumptype | Dette gjør du | Hvem merger |
|---|---|---|
| **patch** `x.y.Z` | CI grønn, sjekk hvor pakken brukes, test raskt | du selv |
| **minor** `x.Y.z` | changelog, hvor pakken brukes, CI grønn, test | tagg en til i PR-en |
| **major** `X.y.z` | gir det breaking changes hos oss? | se «major» under |

## Slik ser du hvilken det er

Dependabot skriver den i PR-tittelen: `bump postcss from 8.5.23 to 8.5.24`. Sammenlign de tre tallene — `8.5.23 → 8.5.24` er patch, `8.5.x → 8.6.0` er minor, `8.x → 9.0.0` er major.

**PRene er gruppert.** `dependabot.yml` samler patch og minor i `patch-minor-dependencies`, så én PR kan inneholde flere pakker med ulik bumptype. Da gjelder **den høyeste typen i gruppa** for hele PR-en: er det én minor blant åtte patcher, behandler du PR-en som minor. Majors kommer i sin egen gruppe.

## patch

Etter semver skal en patch bare inneholde bugfixes — ingen nye API-er, ingen endret oppførsel. Det er derfor CI og en rask test holder i de fleste tilfeller.

Sjekk likevel *hvor* pakken brukes, med `grep -rn "pakkenavn" tavla/app tavla/src`. Ligger den i render-pathen til avgangstavlen, i auth, eller i GraphQL-klienten mot journey-planner, er et raskt blikk på changelogen billig forsikring — semver er en konvensjon, ikke en garanti.

## minor

En minor kan legge til API-er, men skal ikke fjerne eller endre eksisterende. Derfor er changelogen obligatorisk her, og du leter etter noe annet enn i en patch: `added` er greit, mens `changed`, `deprecated` og `removed` er verdt å stoppe ved.

Sjekk brukssteder, kjør testene, og se at CI er grønt. Deretter tagger du en annen utvikler i PR-en. Skriv i samme slengen hva du sjekket og hva du er usikker på — det er det reviewer trenger, og det er raskere for hen enn å gjøre vurderingen på nytt.

## major

En major betyr at pakkeforfatteren selv sier at noe er brutt. Spørsmålet er om det brutte gjelder oss.

Les changelogens breaking-changes-seksjon, og `grep` etter de API-ene den nevner.

**Finner du breaking changes hos oss** → dette er ikke en dependency-bump lenger, det er planlagt arbeid. Opprett en oppgave i boardet med hva som må endres, og la PR-en ligge. Skriv oppgavenummeret i briefen, så neste vakt ikke triagerer den på nytt. (Teamet har en `jira-entur-tavla`-skill for å opprette ETU-saker.)

**Finner du ingen** → gjør minor-stegene, og tagg en til i PR-en for review. En major uten breaking changes for oss er fortsatt en major, og den fortjener et par øyne.

## To pakker krever changelog uansett bumptype

En patch kan være en sikkerhetsfiks i kode som håndterer input fra brukere. På disse leser du changelogen og sjekker brukssteder selv om det bare er en patch:

- **`dompurify`** — sanitering av HTML fra brukere, i opplasting og admin-UI
- **`firebase`, `firebase-admin`, `firebase-functions`** — auth, sesjon og tokens

**Dette endrer bare arbeidet, ikke hvem som merger.** En patch er en patch: du merger den selv. Det du kjøper med de ekstra minuttene er å vite *hva* du merger — på en pakke der «bare en bugfix» kan bety en saniteringsendring.

Ingen andre unntakslister. Er du usikker på en patch, les changelogen — det tar to minutter og krever ingen andres tid.

## Sikkerhetsvarsler er en annen sak

Et Dependabot-*varsel* er ikke det samme som en Dependabot-*PR*. Varsler vurderes etter utnyttbarhet i Tavla, ikke etter bumptype — se `sikkerhets-triage.md`. Og et varsel skal aldri lukkes ved å dismisse det: det er en allowlist-PR som noen reviewer.
