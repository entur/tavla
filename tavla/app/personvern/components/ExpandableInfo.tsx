'use client'
import { CopyableText } from '@entur/alert'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { ExpandablePanel } from '@entur/expand'
import { CookieIcon, ExternalIcon } from '@entur/icons'
import {
    Link as EnturLink,
    Heading3,
    ListItem,
    Paragraph,
    StrongText,
    UnorderedList,
} from '@entur/typography'
import { showUC_UI_second } from 'app/components/ConsentHandler'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { waitFor } from 'src/utils/cmpUtils'

const emailSubject = 'Forespørsel om å slette analysedata'
const emailBody = (id: string) => {
    return `Hei! %0D%0A%0D%0A Jeg ønsker at dere sletter analysedata dere har for min enhet med ID: %0D%0A%0D%0A ${id}`
}

function ExpandableInfo() {
    const [controllerId, setControllerId] = useState('UKJENT FEIL')
    const params = useSearchParams()
    const open = params?.get('indeks')

    useEffect(() => {
        async function fetchControllerId() {
            await waitFor(() => typeof window.__ucCmp !== 'undefined')
            const _id = await window.__ucCmp?.getControllerId()
            setControllerId(_id)
        }
        fetchControllerId()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center gap-1 p-4">
            <ExpandablePanel title="Behandling av personopplysninger">
                <Heading3>Behandlingsansvar</Heading3>
                <Paragraph>
                    Entur AS (heretter “Entur” eller “vi”), Postboks 1800, 0048
                    Oslo, er ansvarlig for lagring og bruk av dine
                    personopplysninger (Behandlingsansvarlig).
                </Paragraph>
                <Paragraph>
                    <EnturLink as={Link} href="mailto:personvern@entur.org">
                        Kontakt Enturs personvernombud på personvern@entur.org
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
                <UnorderedList className="pl-8">
                    <ListItem>For å holde styr på dine tavler.</ListItem>
                    <ListItem>
                        For å vite hvilke mapper du er en del av.
                    </ListItem>
                </UnorderedList>
            </ExpandablePanel>
            <ExpandablePanel
                title="Informasjonskapsler"
                defaultOpen={open === '2'}
                id="informasjonskapsler"
            >
                <Heading3>Strengt nødvendige informasjonskapsler</Heading3>
                <Paragraph>
                    Vi har vurdert det som strengt nødvendig å lagre noen
                    informasjonskapsler for at nettstedet vårt skal fungere.
                    Disse kan du ikke slå av. Les mer om disse ved her eller ved
                    å klikke på knappen under.
                </Paragraph>
                <Heading3>
                    Innsikt om bruk av nettstedet for å øke brukervennlighet
                </Heading3>
                <Paragraph>
                    For at vi skal kunne gjøre sidene våre mer brukervennlige,
                    trenger vi samtykke til å lagre og analysere informasjon om
                    hvordan du bruker nettstedet. Basert på for eksempel hva du
                    klikker på, hvilke sider hos Entur du besøker og hvor lenge
                    du er på en side, kan vi lære hvordan sidene blir brukt og
                    tilpasse innholdet vårt. For å forstå hvordan du opplever
                    nettstedet, bruker vi også informasjon om din maskintype,
                    programvareversjon, nettleser, IP-adresse og MAC-adresse.
                </Paragraph>
                <Heading3>
                    Oppdage tekniske feil som oppstår for å raskere løse feil
                </Heading3>
                <Paragraph>
                    For å se hva som gikk galt hvis en feil oppstår når du
                    bruker nettstedet, trenger vi samtykke til å lagre og
                    analysere informasjon om hva som skjedde. Det gjør det
                    lettere og raskere å finne ut av årsaken til feilen og
                    hvordan den bør håndteres. For å forstå hva som skjedde,
                    bruker vi også informasjon om din maskintype,
                    programvareversjon, nettleser, IP-adresse og MAC-adresse.
                </Paragraph>
                <Heading3>Sletting av analysedata</Heading3>
                <Paragraph>
                    Dersom du ønsker å slette analysedataene dine kan du enten
                    trykke på knappen under, eller sende en melding til{' '}
                    <EnturLink
                        as={Link}
                        href="mailto:tavla@entur.org"
                        className="gap-1"
                    >
                        tavla@entur.org <ExternalIcon />
                    </EnturLink>{' '}
                    med sporings-IDen din om at du ønsker at vi sletter dataen
                    din. Sporings-IDen kan du hente nedenfor.
                </Paragraph>

                <div className="flex flex-col gap-4">
                    <PrimaryButton onClick={() => showUC_UI_second()}>
                        Detaljert informasjon om informasjonskapslene
                        <CookieIcon aria-hidden />
                    </PrimaryButton>
                    <SecondaryButton
                        href={`mailto:tavla@entur.org?subject=${emailSubject}&body=${emailBody(controllerId)}`}
                        as="a"
                    >
                        Send forespørsel om å slette analysedata
                    </SecondaryButton>
                    <CopyableText
                        successHeading="ID kopiert"
                        aria-label="Kopier din sporings-ID"
                        textToCopy={controllerId}
                        className="flex max-w-full"
                    >
                        Kopier din sporings-ID
                    </CopyableText>
                </div>
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
                    PostHog mottar generell web- og appstatistikk. Ingenting av
                    dette kan brukes til å identifisere deg.
                    <UnorderedList className="pl-8">
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
