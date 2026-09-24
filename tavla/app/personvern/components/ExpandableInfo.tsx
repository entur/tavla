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
import { showUC_UI_second } from 'app/_components/ConsentHandler'
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
                title="Informasjonskapsler"
                defaultOpen={open === '2'}
                id="informasjonskapsler"
            >
                <Heading3>Strengt nødvendige informasjonskapsler</Heading3>
                <Paragraph>
                    Vi har vurdert det som strengt nødvendig å lagre noen
                    informasjonskapsler for at nettstedet vårt skal fungere.
                    Disse kan du ikke slå av. Les mer om disse ved å klikke på
                    knappen under.
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
            <ExpandablePanel title="Analyseverktøy">
                <Heading3>Analyseverktøy</Heading3>
                <Paragraph>
                    For å kunne lage løsninger for et så brukervennlig nettsted
                    som mulig bruker vi analyseverktøyet PostHog. Ved hjelp av
                    PostHog kan vi samle inn data og analysere hvordan{' '}
                    <EnturLink as={Link} href="/">
                        tavla.entur.no
                    </EnturLink>{' '}
                    blir brukt. PostHog behandler data i Europa, og vi har slått
                    av lagring av IP-adresse. Vi lagrer altså ikke IP-adressen
                    din i PostHog.
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
            <ExpandablePanel title="Feilsøking og driftslogging">
                <Heading3>Teknisk logging for drift og feilsøking</Heading3>
                <Paragraph>
                    For å kunne drifte tjenesten på en sikker og stabil måte, og
                    for å finne og rette feil, logger vi tekniske hendelser på
                    våre servere. Disse loggene lagres hos Google Cloud Platform
                    (GCP). Behandlingsgrunnlaget er vår berettigede interesse i
                    sikker og stabil drift av tjenesten (personvernforordningen
                    artikkel 6 nr. 1 bokstav f).
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
                    interesse i sikker og stabil drift (personvernforordningen
                    artikkel 6 nr. 1 bokstav f).
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
            <ExpandablePanel title="Dine rettigheter">
                <Heading3>Dine rettigheter</Heading3>
                <Paragraph>
                    Du har flere rettigheter knyttet til personopplysningene vi
                    behandler om deg:
                </Paragraph>
                <UnorderedList className="pl-8">
                    <ListItem>
                        <StrongText>Innsyn: </StrongText>Du har rett til å be om
                        innsyn i opplysningene vi behandler om deg.
                    </ListItem>
                    <ListItem>
                        <StrongText>Retting og sletting: </StrongText>Du kan få
                        opplysningene rettet, supplert eller slettet.
                    </ListItem>
                    <ListItem>
                        <StrongText>Begrensning: </StrongText>Du har rett til å
                        be om at behandlingen av opplysningene dine begrenses.
                    </ListItem>
                    <ListItem>
                        <StrongText>Innsigelse: </StrongText>Du har rett til å
                        protestere mot behandling som skjer på grunnlag av vår
                        berettigede interesse.
                    </ListItem>
                    <ListItem>
                        <StrongText>Dataportabilitet: </StrongText>Du har rett
                        til å motta opplysningene dine i et strukturert,
                        alminnelig anvendt og maskinlesbart format.
                    </ListItem>
                    <ListItem>
                        <StrongText>Trekke tilbake samtykke: </StrongText>Der
                        behandlingen bygger på samtykke (profil-e-post og
                        analyse), kan du når som helst trekke det tilbake. Det
                        påvirker ikke lovligheten av behandlingen som skjedde
                        før du trakk samtykket tilbake.
                    </ListItem>
                    <ListItem>
                        <StrongText>Klage: </StrongText>Du har rett til å klage
                        til Datatilsynet dersom du mener behandlingen ikke er i
                        samsvar med personvernregelverket.
                    </ListItem>
                </UnorderedList>
                <Paragraph>
                    For å bruke rettighetene dine, eller hvis du har spørsmål om
                    hvordan vi behandler personopplysninger, kan du kontakte{' '}
                    <EnturLink as={Link} href="mailto:personvern@entur.org">
                        Enturs personvernombud på personvern@entur.org
                    </EnturLink>
                    . Ønsker du å slette analysedataene dine, finner du
                    fremgangsmåten under «Informasjonskapsler».
                </Paragraph>
            </ExpandablePanel>
        </div>
    )
}

export { ExpandableInfo }
