'use client'
import { ExpandablePanel } from '@entur/expand'
import { ListItem } from '@entur/typography'

function Questions() {
    return (
        <div className="w-full">
            <ExpandablePanel title="Hva er Entur Tavla?">
                Entur Tavla er en gratis avgangstavle for offentlig transport i
                hele Norge. Du kan sette opp en sanntidstavle som viser avganger
                fra valgfrie stoppesteder, og vise den på en skjerm. Tavla
                brukes av alt fra kollektivselskaper og flyplasser til kontorer,
                borettslag, skoler, kjøpesentre og hoteller.
            </ExpandablePanel>
            <ExpandablePanel title="Er Tavla gratis?">
                Ja, Tavla er helt gratis å bruke!
            </ExpandablePanel>
            <ExpandablePanel title="Må jeg opprette en bruker for å lage en avgangstavle?">
                Nei, du kan lage en tavle uten å registrere deg. Tavlen får en
                lenke du kan åpne på en hvilken som helst skjerm, men uten
                bruker kan du ikke endre tavlen i ettertid. Vil du oppdatere
                den, må du lage en ny tavle og ta i bruk den nye lenken. Med en
                bruker kan du redigere tavlen når som helst, organisere tavlene
                dine i mapper, legge til egen logo på tavlen og invitere andre
                til å administrere dem.
            </ExpandablePanel>
            <ExpandablePanel title="Viser Tavla sanntidsinformasjon?">
                Ja, Tavla viser sanntidsavganger der dette er tilgjengelig.
                Dataene hentes fra Enturs nasjonale sanntidssystem og dekker
                kollektivtrafikk i hele Norge.
            </ExpandablePanel>
            <ExpandablePanel title="Hvilke transportmidler vises i Tavla?">
                Tavla viser alle kollektivtransportmidler i Norge, inkludert
                blant annet buss, trikk, T-bane, tog, ferge og fly. Du kan
                filtrere på linjer og transportmiddel etter behov.
            </ExpandablePanel>
            <ExpandablePanel title="Kan jeg tilpasse utseendet på tavlen?">
                Ja. Du kan blant annet velge mellom mørkt og lyst tema, endre
                farger på transportmidler, legge til din egen logo og justere
                tekststørrelse.
            </ExpandablePanel>
            <ExpandablePanel title="Hvordan tar jeg avgangstavlen i bruk på en skjerm?">
                Når du har satt opp tavlen din, får du en lenke. Åpne denne
                denne lenken i nettleseren på skjermen du vil bruke og
                avgangstavlen skal være oppe. Ingen app eller installasjon er
                nødvendig.
            </ExpandablePanel>
            <ExpandablePanel title="Kan jeg vise avgangstavlen på en TV-skjerm?">
                Ja, Tavla fungerer på alle skjermer med en nettleser, inkludert
                TV-er. Åpne lenken til tavlen din i nettleseren på TV-en, og
                tavlen vises umiddelbart. Mange bruker også en mediaspiller
                eller en liten PC koblet til skjermen for å styre hva som vises.
            </ExpandablePanel>
            <ExpandablePanel title="Fungerer Tavla uten internett?">
                Nei, Tavla krever internettilkobling for å hente sanntidsdata og
                rutetider. Uten nett vil tavlen ikke kunne vise oppdatert
                avgangsinformasjon.
            </ExpandablePanel>
            <ExpandablePanel title="Hvilke eldre nettlesere støttes?">
                Tavla er utviklet med tanke på at vi skal støtte eldre
                nettlesere siden mange skjermer har eldre, innebygde nettlesere.
                De eldste nettleserversjonene vi støtter er:
                <ul className="list-disc pl-6">
                    <ListItem>Chromium 49</ListItem>
                    <ListItem>Firefox 52</ListItem>
                    <ListItem>Safari 11</ListItem>
                    <ListItem>Edge 80</ListItem>
                    <ListItem>Opera 36</ListItem>
                </ul>
                Det kan hende Tavla fungerer på enda eldre versjoner, men vi
                støtter aktivt de overnevnte versjonene, og alle nyere
                versjoner. Om Tavla fungerer eller ikke, kommer også an på
                hvilket operativsystem skjermen har i bunnen.
            </ExpandablePanel>
            <ExpandablePanel title="Kan jeg invitere andre til å administrere tavlen min?">
                Ja. Opprett en mappe og plasser tavlen der. Deretter kan du
                invitere andre brukere til å administrere alle tavlene i mappen.
            </ExpandablePanel>
            <ExpandablePanel title="Jeg har ikke fått en e-post om verifisering, hva gjør jeg?">
                Det kan hende det tar litt tid å få en e-post fra oss om
                verifisering. Dette skal normalt ikke ta mer enn 10 minutter.
                Hvis du ikke får den innen da, så prøv gjerne igjen. Hvis
                problemet vedvarer, så{' '}
                <a
                    href="mailto:tavla@entur.org"
                    target="_blank"
                    className="underline"
                    rel="noopener"
                >
                    send oss en e-post på tavla@entur.org
                </a>
                .
            </ExpandablePanel>
            <ExpandablePanel title="Jeg har opprettet konto med e-post og passord. Kan jeg likevel logge meg inn med Google?">
                Ja! Om du bruker samme e-post-adresse, vil du kunne logge på med
                din Google-konto og finne alle tavler og mapper du tidligere har
                opprettet.
            </ExpandablePanel>
            <ExpandablePanel title="Jeg har logget på med Google tidligere. Kan jeg likevel logge meg på med e-post og passord?">
                Ja. Bruk «Glemt passord» lenken for å sette et passord for
                kontoen din. Etter det kan du velge påloggingsmetode fritt. Alle
                tavlene og mappene dine er tilgjengelige uansett hvilken metode
                du bruker.
            </ExpandablePanel>
        </div>
    )
}

export { Questions }
