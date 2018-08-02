# Entur - Tavla
Tavla er en personlig avgangstavle som du selv kan konfigurere. Finn dine nærmeste holdeplasser og velg bort de rutene du ikke vil ha. Alt dette i et enkelt adminpanel.
Gå til [tavla.en-tur.no](https://tavla.en-tur.no) for å sette opp din egen tavle.

## Bidra

Finner du noe som kan forbedres eller ønsker du å lage ditt eget design? Bidra gjerne ved å sende en pull request.
Disse instruksjonene skal få deg opp og kjøre med prosjeketet på din lokale maskin, for utvikling og testing.

### Avhengigheter

Prosjektet krever at du har disse avhengighetene installert

- Node
- npm

### Installering

Fork repoet: https://github.com/entur/tavla/fork


```
git clone git@github.com:[DIN BRUKER]/tavla.git
cd tavla
npm install
```
Da er du oppe og kjører og kan starte prosjektet
```
npm start
```

### Kodekvalitet

Vi bruker `eslint` for å sikre stil og kodekvalitet. Testene kan du kjøre ved:

```
npm run lint
```
