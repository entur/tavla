import landingImage from 'assets/illustrations/Landing_illustration.svg'
import { Metadata } from 'next'
import Image from 'next/image'
import {
    Heading1,
    Heading2,
    Heading3,
    LeadParagraph,
    ListItem,
    Paragraph,
    UnorderedList,
} from '@entur/typography'
import { Preview } from './(admin)/components/Preview'
import { previewBoards } from '../src/Shared/utils/previewBoards'
import { Welcome } from './components/Welcome'
import { Button } from '@entur/button'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla',
}

function Landing() {
    return (
        <>
            <main>
                <Welcome />
                <div className="flex flex-col justify-center pb-10">
                    <div className="bg-secondary">
                        <div className="flex flex-col container py-12 gap-10 xl:flex-row">
                            <div className="flex flex-col xl:w-1/2">
                                <Heading1 margin="none">
                                    Lag en avgangstavle for
                                </Heading1>
                                <Heading1
                                    className="italic !text-highlight !font-normal"
                                    margin="bottom"
                                >
                                    kontoret
                                </Heading1>
                                <LeadParagraph className="w-full xl:w-2/3">
                                    Tavla er en gratis tjeneste som gjør det
                                    enkelt å sette opp avgangstavler for
                                    offentlig transport i hele Norge! Vis
                                    kollektivtilbudet i nærheten og hjelp folk
                                    til å planlegge sin neste kollektivreise.
                                </LeadParagraph>
                                <div className="flex md:flex-row flex-col md:items-end w-full gap-4 ">
                                    <Button
                                        variant="success"
                                        size="medium"
                                        as={Link}
                                        href="?login=create"
                                    >
                                        Opprett bruker
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="medium"
                                        as={Link}
                                        href="demo"
                                    >
                                        Test ut Tavla
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-row mx-auto items-end xl:w-1/2">
                                <Image src={landingImage} alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col mx-auto items-center justify-start py-4 container">
                        <div className="flex flex-col items-center justify-start gap-4 py-4">
                            <div
                                className="xl:w-1/2 h-[40vh] overflow-y-hidden overflow-x-hidden rounded-2xl py-10"
                                data-theme="dark"
                            >
                                <Preview boards={previewBoards} />
                            </div>

                            <div className="xl:w-1/2">
                                <Heading2>Kort om Tavla</Heading2>
                                <UnorderedList className="space-y-3">
                                    <ListItem>
                                        Du kan lage avgangstavler fra alle
                                        stoppesteder, holdeplasser,
                                        knutepunkter, fergekaier mm. i hele
                                        Norge. Dette gjelder for alle typer
                                        offentlig transport, inkludert ferger,
                                        hurtigbåter og fly.
                                    </ListItem>
                                    <ListItem>
                                        Det er helt gratis å implementere og
                                        bruke Tavla.
                                    </ListItem>
                                    <ListItem>
                                        Det er helt gratis å implementere og
                                        bruke Tavla.
                                    </ListItem>
                                </UnorderedList>
                                <Paragraph className="italic">
                                    Tavla sin kildekode er åpent tilgjengelig på
                                    GitHub. Dette gjør at du kan følge
                                    utviklingen av produktet direkte og foreslå
                                    forbedringer selv.
                                </Paragraph>

                                <Heading3>
                                    Enkelt å tilpasse og samarbeide{' '}
                                </Heading3>

                                <UnorderedList className="space-y-3">
                                    <ListItem>
                                        Tilpass tekststørrelse, fargetema, logo
                                        og hvilken informasjon som skal vises,
                                        slik at tavlen(e) passer til dine
                                        omgivelser og dine besøkendes behov.
                                    </ListItem>
                                    <ListItem>
                                        Velg om du vil vise hele
                                        kollektivtilbudet fra et stoppested,
                                        eller kun vise spesifikke linjer,
                                        stoppesteder eller fremkomstmidler.
                                    </ListItem>
                                    <ListItem>
                                        Opprett organisasjoner (mapper) for å
                                        samle tavler og gi andre tilgang til å
                                        administrere dem. Her kan du også velge
                                        standardinnstillinger som vil gjelde
                                        alle tavler i organisasjonen.
                                    </ListItem>
                                </UnorderedList>

                                <Heading2>Eksempler på bruk</Heading2>
                                <Heading3>Hoteller</Heading3>
                                <Paragraph>
                                    Plasser Tavla i resepsjonsområdet slik at
                                    gjester kan se sanntidsinformasjon om
                                    avganger fra stoppesteder i nærheten.
                                </Paragraph>
                                <Heading3>Arbeidsplasser</Heading3>
                                <Paragraph>
                                    Vis Tavla på informasjonspunkter eller
                                    skjermer ved inngangen slik at besøkende
                                    enkelt kan planlegge hjemreisen.
                                </Paragraph>
                                <Heading3>Kjøpesentre</Heading3>
                                <Paragraph>
                                    Sett opp Tavla på sentrale steder slik at
                                    kunder alltid har oppdatert informasjon om
                                    offentlig transport.
                                </Paragraph>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export { Landing as default }
