# Hva gjør du med en Dependabot-PR?

Bumptypen bestemmer to ting: hvor mye arbeid du legger i den, og hvem som merger.

| Bumptype | Dette gjør du | Hvem merger |
|---|---|---|
| **patch** `x.y.Z` | CI grønn → merge | du selv |
| **minor** `x.Y.z` | changelog/release notes: treffer noe av det oss? CI grønn og ingen hindringer → merge | du selv |
| **major** `X.y.z` | breaking changes hos oss? | se «major» under |

## Slik ser du hvilken det er

Dependabot skriver den i PR-tittelen: `bump postcss from 8.5.23 to 8.5.24`. Sammenlign de tre tallene — `8.5.23 → 8.5.24` er patch, `8.5.x → 8.6.0` er minor, `8.x → 9.0.0` er major.

**PRene er gruppert.** `dependabot.yml` samler patch og minor i `patch-minor-dependencies`, så én PR kan inneholde flere pakker med ulik bumptype. Da gjelder **den høyeste typen i gruppa** for hele PR-en: er det én minor blant åtte patcher, behandler du PR-en som minor. Majors kommer i sin egen gruppe.

## patch

Etter semver skal en patch bare inneholde bugfixes — ingen nye API-er, ingen endret oppførsel. Er CI grønn, merger du den selv. Det er hele regelen.

(Unntaket er de to pakkene under «krever changelog uansett bumptype» — der leser du changelogen først, men merger fortsatt selv.)

## minor

En minor kan legge til API-er, men skal ikke fjerne eller endre eksisterende. Les derfor changelogen/release notes og finn ut om noe av det som er endret treffer oss: `added` er greit, mens `changed`, `deprecated` og `removed` er verdt å stoppe ved. `grep -rn "pakkenavn" tavla/app tavla/src` viser hvor pakken faktisk brukes.

Er CI grønn og ingenting hindrer — ingen breaking i det vi bruker — merger du den selv. Finner du noe som treffer oss, behandles det som en major (se under): enten en review hvis det er lite, eller en boardoppgave hvis det krever kodeendringer.

## major

En major betyr at pakkeforfatteren selv sier at noe er brutt. Spørsmålet er om det brutte gjelder oss. Les changelogens breaking-changes-seksjon, og `grep` etter de API-ene den nevner.

**Finner du ingen breaking changes hos oss** → er CI grønn, be om en review fra en annen utvikler, og merge når den er godkjent. En major fortjener et par øyne selv når den ikke treffer koden vår.

**Finner du breaking changes hos oss** → dette er ikke en dependency-bump lenger, det er planlagt arbeid. Opprett en oppgave i boardet så den kommer inn i prioriteringen, og la PR-en ligge. Selve arbeidet, når den prioriteres: sjekk CI, se hva som har endret seg og om det treffer vår kode, og be om review når vi må endre noe hos oss. Skriv oppgavenummeret i briefen, så neste vakt ikke triagerer den på nytt. (Teamet har en `jira-entur-tavla`-skill for å opprette ETU-saker.)

## To pakker krever changelog uansett bumptype

En patch kan være en sikkerhetsfiks i kode som håndterer input fra brukere. På disse leser du changelogen og sjekker brukssteder selv om det bare er en patch:

- **`dompurify`** — sanitering av HTML fra brukere, i opplasting og admin-UI
- **`firebase`, `firebase-admin`, `firebase-functions`** — auth, sesjon og tokens

**Dette endrer bare arbeidet, ikke hvem som merger.** En patch er en patch: du merger den selv. Det du kjøper med de ekstra minuttene er å vite *hva* du merger — på en pakke der «bare en bugfix» kan bety en saniteringsendring.

Ingen andre unntakslister. Er du usikker på en patch, les changelogen — det tar to minutter og krever ingen andres tid.

## Sikkerhetsvarsler er en annen sak

Et Dependabot-*varsel* er ikke det samme som en Dependabot-*PR*. Varsler vurderes etter utnyttbarhet i Tavla, ikke etter bumptype — se `sikkerhets-triage.md`. Og et varsel skal aldri lukkes ved å dismisse det: det er en allowlist-PR som noen reviewer.
