'use client'
import { ExpandablePanel } from '@entur/expand'
import { ListItem } from '@entur/typography'
import Link from 'next/link'

function Questions() {
    return (
        <div className="w-full">
            <ExpandablePanel title="Må jeg opprette en bruker?">
                For å kunne lage en tavle må du opprette en bruker. Om du vil se
                hvordan tavlen din blir, kan du først teste den i demoløsningen
                vår{' '}
                <Link href="/demo" className="underline">
                    her
                </Link>
                .
            </ExpandablePanel>
            <ExpandablePanel title="Er Tavla gratis å bruke?">
                Ja, Tavla er helt gratis å bruke uavhengig av hvor mange tavler
                man har.
            </ExpandablePanel>
            <ExpandablePanel title="Tavlen min funker ikke på skjermen min eller er blank, hva gjør jeg?">
                Det er ikke alle skjermer hvor Tavla er støttet. Er skjermen din
                veldig gammel, så kan det hende at nettleseren ikke klarer å
                kjøre opp Tavla i det hele tatt. Da vil enten tavlen ikke se ut
                som den skal, eller så kan det hende at skjermen er blank. Du
                kan sjekke om det er mulig å oppdatere nettleseren på skjermen
                til en nyere versjon. Hvis dette ikke er mulig eller ikke
                hjelper, må du dessverre anskaffe deg en nyere skjerm.
            </ExpandablePanel>
            <ExpandablePanel title="Hvilke eldre nettlesere støttes?">
                Tavla er utviklet med tanke på at vi skal støtte eldre
                nettlesere siden mange skjermer har eldre, innebygde nettlesere.
                Vi støtter helt ned til disse versjonene og oppover:
                <ListItem>Chromium 49</ListItem>
                <ListItem>Firefox 52</ListItem>
                <ListItem>Safari 10.1</ListItem>
                <ListItem>Edge 15</ListItem>
                <ListItem>Opera 36</ListItem>
                Det kan hende vi støtter versjoner lengre ned, men Tavla skal
                hvertfall funke på overnevnte versjoner og høyere. Om Tavla
                funker eller ikke, kommer også an på hvilket operativsystem
                skjermen har i bunnen.
            </ExpandablePanel>
            <ExpandablePanel title="Kan jeg invitere andre til å administrere tavlen min?">
                Om du ønsker at andre også skal kunne redigere tavlen din må du
                opprette en mappe og plassere tavlen som du ønsker skal deles
                der. Da kan du invitere andre til å administrere alle tavlene i
                mappen.
            </ExpandablePanel>
            <ExpandablePanel title="Lagres tavlene mine?">
                Når du oppretter en tavle på brukere din, så vil de lagres slik
                at du kan endre på de senere.
            </ExpandablePanel>
            <ExpandablePanel title="Jeg har ikke fått en e-post om verifisering, hva gjør jeg?">
                Det kan hende det tar litt tid å få en e-post fra oss om
                verifisering. Dette skal normalt ikke ta mer enn 10 minutter.
                Hvis du ikke får den innen da, så prøv gjerne igjen. Hvis
                problemet vedvarer, så send oss en e-post på{' '}
                <a
                    href="mailto:tavla@entur.org"
                    target="_blank"
                    className="underline"
                >
                    tavla@entur.org
                </a>
                .
            </ExpandablePanel>
            <ExpandablePanel title="Jeg har opprettet konto med e-post og passord. Kan jeg likevel logge meg inn med Google?">
                Ja! Om du bruker samme e-post-adresse, vil du kunne logge på med
                din Google-konto og finne alle tavler og mapper du tidligere har
                opprettet.
            </ExpandablePanel>
            <ExpandablePanel title="Jeg har logget på med Google tidligere. Kan jeg likevel logge meg på med e-post og passord?">
                Ja! Hvis du tidligere kun har logget på med Google, så har du
                ikke enda satt et passord på din Tavla-konto. Bruk derfor lenken
                for glemt passord, og du vil motta en lenke på e-post for å
                sette passordet. Deretter kan du velge hvilken påloggingsmetode
                du ønsker å bruke - du vil fortsatt ha tilgang til alle dine
                tavler og mapper med begge metoder.
            </ExpandablePanel>
            <ExpandablePanel title="Hvordan kan jeg kombinere flere stoppesteder eller plattformer i samme liste?">
                Du kan enkelt kombinere flere stoppesteder eller plattformer i
                samme tavle, i stedet for å vise flere lister. Slik gjør du det:
                <br /> 1. Legg til ønskede stoppesteder eller plattformer.{' '}
                <br /> 2. Gå ned til <b>Innstillinger</b> {'>'}{' '}
                <b>Tavlevisning</b> {'>'} <b>Visningstype</b> og velg &quot;Alle
                stoppesteder i én liste&quot;. Husk å lagre og trykk på
                &quot;Publiser tavle&quot;, slik at endringene vises og
                oppdateres i tavlen.
            </ExpandablePanel>
        </div>
    )
}

export { Questions }
