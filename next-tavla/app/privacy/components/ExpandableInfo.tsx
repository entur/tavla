'use client'
import { ExpandablePanel } from '@entur/expand'
import {
    Heading3,
    ListItem,
    Paragraph,
    StrongText,
    UnorderedList,
} from '@entur/typography'
import Link from 'next/link'
import { Link as EnturLink } from '@entur/typography'
import { ExternalIcon } from '@entur/icons'

function ExpandableInfo() {
    return (
        <div className="flexColumn justifyCenter alignCenter g-1 p-2">
            <ExpandablePanel title="Behandling av personopplysninger">
                <Heading3>Behandlingsansvar</Heading3>
                <Paragraph>
                    Entur AS (heretter “Entur” eller “vi”), Postboks 1800, 0048
                    Oslo, er ansvarlig for lagring og bruk av dine
                    personopplysninger (Behandlingsansvarlig).
                </Paragraph>
                <Paragraph>
                    Enturs personvernombud kan kontaktes på e-post{' '}
                    <EnturLink as={Link} href="mailto:personvern@entur.org">
                        personvern@entur.org <ExternalIcon />
                    </EnturLink>
                    . Opplysningene blir behandlet i samsvar med kravene i
                    gjeldende personvernlovgivning.
                </Paragraph>
                <Paragraph>
                    Vi ønsker å sikre en rettferdig og gjennomsiktig behandling
                    av dine personopplysninger. Nedenfor finner du informasjon
                    blant annet om hvilke personopplysninger vi behandler, hva
                    de brukes til og hvilke rettigheter du har.
                </Paragraph>
                <Heading3>
                    Grunnlaget for, formålet med og hva slags personopplysninger
                    vi behandler
                </Heading3>
                <Paragraph>
                    Vi behandler de personopplysninger du fyller inn når du
                    oppretter en profil. Disse opplysningene lagres i en egen
                    kundedatabase.
                </Paragraph>
                <Heading3>Opprettelse og forvaltning av din profil:</Heading3>
                <Paragraph>
                    Med grunnlag i ditt samtykke, lagrer vi e-postadressen du
                    avgir ved opprettelse av profil. E-postadressen blir
                    behandlet for følgende formål:
                </Paragraph>
                <UnorderedList className="pl-4">
                    <ListItem>For å holde styr på dine tavler.</ListItem>
                    <ListItem>
                        For å vite hvilke organisasjoner du er en del av.
                    </ListItem>
                </UnorderedList>
            </ExpandablePanel>
            <ExpandablePanel title="Informasjonskapsler">
                <Heading3>Nødvendige cookies</Heading3>
                <StrongText>session</StrongText>
                <UnorderedList className="pl-4">
                    <ListItem>
                        Formål: Nødvendig for å vite om du er logget inn.
                    </ListItem>
                    <ListItem>
                        Autentisering: Vi bruker Firebase Authentication ved
                        autentisering, og lagring av brukernavn og passord ved
                        innlogging. Les mer om{' '}
                        <EnturLink
                            as={Link}
                            href="https://firebase.google.com/docs/auth"
                        >
                            Firebase Auth
                            <ExternalIcon className="ml-1" />
                        </EnturLink>{' '}
                        og{' '}
                        <EnturLink
                            as={Link}
                            href="https://firebase.google.com/support/privacy"
                        >
                            Firebase Privacy Policy
                            <ExternalIcon className="ml-1" />
                        </EnturLink>
                        .
                    </ListItem>
                </UnorderedList>
            </ExpandablePanel>
            <ExpandablePanel title="Analyseverktøy">
                <Heading3>Analyseverktøy</Heading3>
                <Paragraph>
                    For å kunne lage løsninger for et så brukervennlig nettsted
                    som mulig bruker vi analyseverktøyet PostHog. Ved hjelp av
                    PostHog kan vi samle inn data og analysere hvordan{' '}
                    <EnturLink as={Link} href="/">
                        tavla.entur.no
                    </EnturLink>{' '}
                    blir brukt. PostHog behandler data i Europa. Vi lagrer ikke
                    IP-adressen din.
                </Paragraph>
                <Heading3>Hvilken informasjon lagres?</Heading3>
                <Paragraph>
                    Posthog mottar generell web- og appstatistikk. Ingenting av
                    dette kan brukes til å identifisere deg.
                    <UnorderedList className="pl-4">
                        <ListItem>
                            <StrongText>Unik ID: </StrongText>En tilfeldig
                            generert ID. Denne blir ikke sporet på tvers av
                            domener.
                        </ListItem>
                        <ListItem>
                            <StrongText>Land: </StrongText>Hvilket land du
                            befinner deg i.
                        </ListItem>
                        <ListItem>
                            <StrongText>Sidevisninger: </StrongText>Alle
                            sidevisninger du gjør.
                        </ListItem>
                        <ListItem>
                            <StrongText>Referrer: </StrongText> Siden du kommer
                            fra blir lagret dersom det er tilgjengelig.
                        </ListItem>
                        <ListItem>
                            <StrongText>User Agent: </StrongText>Vi leser User
                            Agent-headeren for å hente ut informasjon om hvilken
                            nettleser og operativsystem du bruker.
                        </ListItem>
                        <ListItem>
                            <StrongText>Tid: </StrongText>Tid du bruker på en
                            side.
                        </ListItem>
                    </UnorderedList>
                </Paragraph>
            </ExpandablePanel>
        </div>
    )
}

export { ExpandableInfo }
