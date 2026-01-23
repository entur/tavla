# Firebase functions

## Introduksjon

Denne mappen inneholder oppsettet for firebase functions for tavla. Den består av en config, noe generelt oppsett og selve funksjonene.

## Deploye funksjoner

Foreløpig har vi bare oppsett for å deploye funksjoner fra terminal.

1. Kjør `firebase login` for å logge inn i firebase

2. For å deploye til enten dev eller prod, kjør `firebase use dev` eller `firebase use prd`. Dette er viktig for å ta i bruk riktig .env-fil.

3. Kjør `firebase deploy --only functions` for å deploye alle functions eller `firebase deploy --only functions:funksjonsnavn` for å deploye en spesifikk funksjon.

Funksjonene ligger under functions i firebase-ui'et. Her er det også lett å finne logger og andre detaljer om funksjonen.

## Opprette en ny funksjon

For å opprette en ny funksjon kan en opprette den i en egen fil i `src`. Deretter må man exportere den fra `index.ts` i `src`
