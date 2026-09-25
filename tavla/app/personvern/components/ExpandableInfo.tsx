'use client'
import { CopyableText } from '@entur/alert'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { ExpandablePanel } from '@entur/expand'
import {
    BugIcon,
    ChartIcon,
    CookieIcon,
    ExternalIcon,
    FileIcon,
    PrivacyIcon,
    UserIcon,
} from '@entur/icons'
import {
    DataCell,
    HeaderCell,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from '@entur/table'
import { Tooltip } from '@entur/tooltip'
import {
    Link as EnturLink,
    Heading3,
    ListItem,
    Paragraph,
    StrongText,
    UnorderedList,
} from '@entur/typography'
import { showUC_UI_second } from 'app/_components/ConsentHandler'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { ComponentType, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { waitFor } from 'src/utils/cmpUtils'

const emailSubject = 'Forespørsel om å slette analysedata'
const emailBody = (id: string) => {
    return `Hei! %0D%0A%0D%0A Jeg ønsker at dere sletter analysedata dere har for min enhet med ID: %0D%0A%0D%0A ${id}`
}

function PanelTitle({
    icon: Icon,
    children,
}: {
    icon: ComponentType<{ 'aria-hidden'?: boolean }>
    children: ReactNode
}) {
    return (
        <span className="flex items-center gap-2">
            <Icon aria-hidden />
            {children}
        </span>
    )
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
            <ExpandablePanel
                title={<PanelTitle icon={FileIcon}>Kort oppsummert</PanelTitle>}
                defaultOpen
            >
                <Paragraph>
                    Oversikt over hva vi behandler, hvorfor og hvor lenge.
                    Detaljene finner du i seksjonene under.
                </Paragraph>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <HeaderCell>Formål</HeaderCell>
                                <HeaderCell>Behandlingsgrunnlag</HeaderCell>
                                <HeaderCell>Lagringstid</HeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <DataCell>Profil (e-postadresse)</DataCell>
                                <DataCell>Samtykke</DataCell>
                                <DataCell>Så lenge profilen er aktiv</DataCell>
                            </TableRow>
                            <TableRow>
                                <DataCell>Analyse (PostHog)</DataCell>
                                <DataCell>Samtykke</DataCell>
                                <DataCell>
                                    Til du trekker samtykke eller ber om
                                    sletting
                                </DataCell>
                            </TableRow>
                            <TableRow>
                                <DataCell>
                                    Drift og feilsøking (app- og tilgangslogger)
                                </DataCell>
                                <DataCell>
                                    Berettiget interesse (
                                    <Tooltip
                                        placement="top"
                                        content="Personvernforordningen artikkel 6 nr. 1 bokstav f"
                                    >
                                        <EnturLink
                                            href="https://lovdata.no/lov/2018-06-15-38/gdpr/artikkel_6"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            art. 6 nr. 1 bokstav f
                                        </EnturLink>
                                    </Tooltip>
                                    )
                                </DataCell>
                                <DataCell>Inntil 30 dager</DataCell>
                            </TableRow>
                            <TableRow>
                                <DataCell>
                                    Aktivitetsmåling (visningsskjermer)
                                </DataCell>
                                <DataCell>
                                    Berettiget interesse (
                                    <Tooltip
                                        placement="top"
                                        content="Personvernforordningen artikkel 6 nr. 1 bokstav f"
                                    >
                                        <EnturLink
                                            href="https://lovdata.no/lov/2018-06-15-38/gdpr/artikkel_6"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            art. 6 nr. 1 bokstav f
                                        </EnturLink>
                                    </Tooltip>
                                    )
                                </DataCell>
                                <DataCell>24 timer</DataCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </ExpandablePanel>
            <ExpandablePanel
                title={
                    <PanelTitle icon={UserIcon}>
                        Behandling av personopplysninger
                    </PanelTitle>
                }
            >
                <Heading3>Behandlingsansvar</Heading3>
                <Paragraph>
                    Entur AS (heretter «Entur» eller «vi»), Postboks 1800, 0048
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
                <Paragraph>
                    Det er nødvendig å oppgi e-postadresse for å opprette en
                    profil. Uten en profil kan du ikke opprette og administrere
                    tavler innlogget.
                </Paragraph>
                <Heading3>Hvor lenge lagrer vi opplysningene?</Heading3>
                <Paragraph>
                    Vi lagrer og behandler personopplysningene om deg så lenge
                    du har en aktiv profil. Du kan når som helst slette profilen
                    din selv, og da slettes e-postadressen din. Tekniske
                    driftslogger og tilgangslogger (se «Feilsøking og
                    driftslogging») oppbevares i inntil 30 dager, mens
                    aktivitetsdata fra visningsskjermer slettes automatisk etter
                    24 timer.
                </Paragraph>
                <Heading3>Automatiserte avgjørelser</Heading3>
                <Paragraph>
                    Vi bruker ikke personopplysningene dine til automatiserte
                    avgjørelser eller profilering med rettslig eller tilsvarende
                    vesentlig virkning for deg.
                </Paragraph>
            </ExpandablePanel>
            <ExpandablePanel
                title={
                    <PanelTitle icon={CookieIcon}>
                        Informasjonskapsler
                    </PanelTitle>
                }
                defaultOpen={open === '2'}
                id="informasjonskapsler"
            >
                <Heading3>Strengt nødvendige informasjonskapsler</Heading3>
                <Paragraph>
                    Vi har vurdert det som strengt nødvendig å lagre noen
                    informasjonskapsler for at nettstedet vårt skal fungere.
                    Disse kan du ikke slå av. Trykk på knappen «Detaljert
                    informasjon om informasjonskapslene» for å lese mer om dem.
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
                    nettstedet, utleder vi hvilken nettleser og hvilket
                    operativsystem du bruker fra User Agent-headeren, men lagrer
                    ikke selve strengen. Vi lagrer heller ikke IP-adressen din i
                    analyseverktøyet – se «Feilsøking og driftslogging» for
                    hvordan IP-adresse behandles i tilgangslogger.
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
                    programvareversjon og nettleser (User Agent). IP-adressen
                    din registreres i infrastrukturens tilgangslogger for
                    sikkerhet og drift – se «Feilsøking og driftslogging».
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
            <ExpandablePanel
                title={<PanelTitle icon={ChartIcon}>Analyseverktøy</PanelTitle>}
            >
                <Heading3>Analyseverktøy</Heading3>
                <Paragraph>
                    For å kunne lage løsninger for et så brukervennlig nettsted
                    som mulig bruker vi analyseverktøyet PostHog. Ved hjelp av
                    PostHog kan vi samle inn data og analysere hvordan{' '}
                    <EnturLink as={Link} href="/">
                        tavla.entur.no
                    </EnturLink>{' '}
                    blir brukt. PostHog behandler data i Europa, og vi lagrer
                    ikke IP-adressen din.
                </Paragraph>
                <Heading3>Hvilken informasjon lagres?</Heading3>
                <Paragraph>
                    PostHog mottar generell web- og appstatistikk. Opplysningene
                    identifiserer deg ikke direkte, men er knyttet til en
                    pseudonym sporings-ID, og enkelte opplysninger kan i teorien
                    bidra til indirekte gjenkjenning.
                </Paragraph>
                <UnorderedList className="pl-8">
                    <ListItem>
                        <StrongText>Sporings-ID: </StrongText>En pseudonym ID
                        (samme som du kan hente under «Informasjonskapsler»).
                        Denne blir ikke sporet på tvers av domener.
                    </ListItem>
                    <ListItem>
                        <StrongText>Land: </StrongText>Hvilket land du befinner
                        deg i.
                    </ListItem>
                    <ListItem>
                        <StrongText>Sidevisninger: </StrongText>Alle
                        sidevisninger du gjør.
                    </ListItem>
                    <ListItem>
                        <StrongText>Referrer: </StrongText> Siden du kommer fra
                        blir lagret dersom det er tilgjengelig.
                    </ListItem>
                    <ListItem>
                        <StrongText>Nettleser og enhet: </StrongText>Vi leser
                        User Agent-headeren for å utlede hvilken nettleser og
                        operativsystem du bruker. Selve User Agent-strengen
                        lagres ikke i PostHog.
                    </ListItem>
                    <ListItem>
                        <StrongText>Tid: </StrongText>Tid du bruker på en side.
                    </ListItem>
                </UnorderedList>
            </ExpandablePanel>
            <ExpandablePanel
                title={
                    <PanelTitle icon={BugIcon}>
                        Feilsøking og driftslogging
                    </PanelTitle>
                }
            >
                <Heading3>Teknisk logging for drift og feilsøking</Heading3>
                <Paragraph>
                    For å kunne drifte tjenesten på en sikker og stabil måte, og
                    for å finne og rette feil, logger vi tekniske hendelser på
                    våre servere. Disse loggene lagres hos Google Cloud Platform
                    (GCP). Behandlingsgrunnlaget er vår berettigede interesse i
                    sikker og stabil drift av tjenesten (
                    <EnturLink
                        href="https://lovdata.no/lov/2018-06-15-38/gdpr/artikkel_6"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        personvernforordningen artikkel 6 nr. 1 bokstav f
                    </EnturLink>
                    ).
                </Paragraph>
                <Heading3>Hvilken informasjon logges?</Heading3>
                <Paragraph>
                    Loggene inneholder teknisk informasjon om hendelser og feil
                    i tjenesten:
                </Paragraph>
                <UnorderedList className="pl-8">
                    <ListItem>
                        <StrongText>Tavle- og mappe-ID: </StrongText>
                        identifikatorer for tavlene og mappene en handling
                        gjelder.
                    </ListItem>
                    <ListItem>
                        <StrongText>Sti og statuskoder: </StrongText>hvilket
                        endepunkt som ble kalt og resultatet av kallet.
                    </ListItem>
                    <ListItem>
                        <StrongText>Feilkoder: </StrongText>hva som gikk galt
                        når en feil oppstår.
                    </ListItem>
                    <ListItem>
                        <StrongText>Nettleser (User Agent): </StrongText>
                        informasjon om nettleseren og operativsystemet som ble
                        brukt.
                    </ListItem>
                </UnorderedList>
                <Paragraph>
                    Disse applikasjonsloggene inneholder{' '}
                    <StrongText>ikke</StrongText> e-postadressen din, bruker-ID
                    eller IP-adressen din.
                </Paragraph>
                <Heading3>Tilgangslogger i infrastrukturen</Heading3>
                <Paragraph>
                    Tjenesten driftes på Enturs plattform, og trafikken går
                    gjennom en felles infrastruktur (lastbalanserer) som fører
                    tilgangslogger over forespørslene som kommer inn. Disse
                    loggene registrerer blant annet:
                </Paragraph>
                <UnorderedList className="pl-8">
                    <ListItem>
                        <StrongText>IP-adresse: </StrongText>IP-adressen
                        forespørselen kommer fra.
                    </ListItem>
                    <ListItem>
                        <StrongText>Forespørsel: </StrongText>tidspunkt, metode,
                        adressen (URL) som ble kalt, statuskode og hvilken side
                        forespørselen kom fra (referer).
                    </ListItem>
                    <ListItem>
                        <StrongText>Nettleser (User Agent): </StrongText>
                        informasjon om nettleseren og operativsystemet.
                    </ListItem>
                    <ListItem>
                        <StrongText>Tekniske kjennetegn: </StrongText>
                        tilkoblingens tekniske fingeravtrykk samt grov
                        geografisk region og nettverksoperatør.
                    </ListItem>
                </UnorderedList>
                <Paragraph>
                    Tilgangsloggene brukes til sikkerhet, feilsøking og drift av
                    tjenesten. Behandlingsgrunnlaget er vår berettigede
                    interesse i sikker og stabil drift (
                    <EnturLink
                        href="https://lovdata.no/lov/2018-06-15-38/gdpr/artikkel_6"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        personvernforordningen artikkel 6 nr. 1 bokstav f
                    </EnturLink>
                    ).
                </Paragraph>
                <Heading3>Aktivitetsmåling for visningsskjermer</Heading3>
                <Paragraph>
                    Skjermer som viser en tavle sender jevnlig teknisk
                    informasjon til oss slik at vi kan måle bruk av tjenesten.
                    Dette omfatter tavle-ID, skjermstørrelse og nettlesertype
                    (som vi kun bruker til å avgjøre om skjermen er en mobil
                    eller ikke). Denne informasjonen brukes aggregert og slettes
                    automatisk etter 24 timer.
                </Paragraph>
                <Heading3>Databehandlere</Heading3>
                <Paragraph>
                    Vi benytter databehandlere som behandler personopplysninger
                    på våre vegne. For å sikre dine rettigheter har vi inngått
                    databehandleravtaler som regulerer hvordan opplysningene kan
                    behandles:
                </Paragraph>
                <UnorderedList className="pl-8">
                    <ListItem>
                        <StrongText>Google Cloud Platform: </StrongText>lagring
                        og drift. Dataene lagres i Googles datasentre i EU
                        (europe-west1).
                    </ListItem>
                    <ListItem>
                        <StrongText>PostHog: </StrongText>analyse av bruk.
                        PostHog behandler data i Europa.
                    </ListItem>
                </UnorderedList>
                <Heading3>Overføring til land utenfor EØS</Heading3>
                <Paragraph>
                    Personopplysningene behandles i utgangspunktet innenfor
                    EU/EØS. Der en behandling likevel kan innebære overføring
                    til land utenfor EØS, baserer Entur seg på gyldige
                    overføringsgrunnlag, som EUs standardavtaleklausuler og
                    EU–US Data Privacy Framework.
                </Paragraph>
            </ExpandablePanel>
            <ExpandablePanel
                title={
                    <PanelTitle icon={PrivacyIcon}>Dine rettigheter</PanelTitle>
                }
            >
                <Heading3>Dine rettigheter</Heading3>
                <Paragraph>
                    Du har rett til innsyn i personopplysningene vi behandler om
                    deg, og du kan be om at opplysningene rettes, suppleres
                    eller slettes. Du kan også be om at behandlingen begrenses,
                    protestere mot behandling som skjer på grunnlag av vår
                    berettigede interesse, og be om å få utlevert opplysningene
                    dine i et strukturert, alminnelig anvendt og maskinlesbart
                    format. Der behandlingen bygger på samtykke kan du når som
                    helst trekke samtykket tilbake. Det påvirker ikke
                    lovligheten av behandlingen som skjedde før du trakk det
                    tilbake.
                </Paragraph>
                <Paragraph>
                    For å bruke rettighetene dine, eller hvis du har spørsmål om
                    hvordan vi behandler personopplysninger, kan du kontakte{' '}
                    <EnturLink as={Link} href="mailto:personvern@entur.org">
                        Enturs personvernombud på personvern@entur.org
                    </EnturLink>
                    . Ønsker du å slette analysedataene dine, finner du
                    fremgangsmåten under «Informasjonskapsler».
                </Paragraph>
                <Paragraph>
                    Dersom du mener at vi behandler personopplysninger i strid
                    med personvernregelverket, har du rett til å{' '}
                    <EnturLink
                        href="https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/klage-til-datatilsynet/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        klage til Datatilsynet
                    </EnturLink>
                    .
                </Paragraph>
            </ExpandablePanel>
        </div>
    )
}

export { ExpandableInfo }
