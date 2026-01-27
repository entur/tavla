import {
    Heading1,
    Heading2,
    Heading3,
    LeadParagraph,
    ListItem,
    Paragraph,
    UnorderedList,
} from '@entur/typography'
import { Metadata } from 'next'
import { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkServer } from 'src/utils/boardLink'
import { getUserFromSessionCookie } from './(admin)/utils/server'
import { CreateUserButton } from './components/CreateUserButton'
import { DemoButton } from './components/DemoButtonLanding'
import { ImageCarousel } from './components/ImageCarousel/ImageCarousel'
import { NavigateToOversiktButton } from './components/NavigateToOversiktButton'
import { PreviewCarousel } from './components/PreviewCarousel'
import { WordCarousel } from './components/WordCarousel/WordCarousel'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla',
}

export type PreviewBoard = {
    id: string
    altText: string
    theme: BoardDB['theme']
}

export const PREVIEW_BOARDS: PreviewBoard[] = [
    {
        id: 'preview-1',
        altText:
            'Eksempel på avgangstavle for Lysaker stasjon, med avganger for tog og buss.',
        theme: 'dark',
    },
    {
        id: 'preview-2',
        altText:
            'Eksempel på avgangstavle for Horten ferjekai, med avganger for ferje.',
        theme: 'light',
    },
    {
        id: 'preview-3',
        altText: 'Eksempel på avgangstavle for Alta sentrum og Alta lufthavn.',
        theme: 'dark',
    },
]

async function Landing() {
    const loggedIn = (await getUserFromSessionCookie()) !== null

    const previewBoardsWithLinks = PREVIEW_BOARDS.map((board) => ({
        ...board,
        link: getBoardLinkServer(board.id, true),
    }))

    return (
        <main id="main-content">
            <div className="bg-secondary">
                <div className="container flex flex-col justify-center gap-10 py-12 lg:flex-row">
                    <div className="flex flex-col lg:w-3/4 xl:w-1/2">
                        <Heading1>Lag en helt gratis avgangstavle for</Heading1>
                        <WordCarousel />
                        <LeadParagraph margin="bottom">
                            Tavla er en <b>gratis</b> tjeneste som gjør det
                            enkelt å sette opp avgangstavler for offentlig
                            transport i hele Norge! Vis kollektivtilbudet i
                            nærheten og hjelp folk til å planlegge sin neste
                            kollektivreise.
                        </LeadParagraph>
                        <div className="mt-5 flex w-full flex-col gap-4 md:flex-row">
                            {!loggedIn ? (
                                <div className="flex w-full flex-col gap-4 md:flex-row">
                                    <CreateUserButton trackingLocation="landing_page" />
                                    <DemoButton />
                                </div>
                            ) : (
                                <NavigateToOversiktButton />
                            )}
                        </div>
                    </div>
                    <ImageCarousel />
                </div>
            </div>

            <div className="container mx-auto flex flex-col justify-start gap-4 overflow-hidden py-14 xl:w-[1200px]">
                <PreviewCarousel previewBoards={previewBoardsWithLinks} />

                <div className="md:px-12">
                    <Heading2>Kort om Tavla</Heading2>
                    <UnorderedList className="flex flex-col gap-1 space-y-3 pl-6">
                        <ListItem>
                            Du kan lage avgangstavler helt gratis fra alle
                            stoppesteder, holdeplasser, knutepunkter, fergekaier
                            mm. i hele Norge. Dette gjelder for alle typer
                            offentlig transport, inkludert ferger, hurtigbåter
                            og fly.
                        </ListItem>
                        <ListItem>
                            Det er helt gratis å implementere og bruke Tavla.
                        </ListItem>
                        <ListItem>
                            Tavla kan vises på ulike typer skjermer og er
                            tilpasset flere operativsystem og oppløsninger.
                        </ListItem>
                    </UnorderedList>

                    <Heading3>Enkelt å tilpasse og samarbeide</Heading3>

                    <UnorderedList className="flex flex-col gap-1 space-y-3 pl-6">
                        <ListItem>
                            Tilpass tekststørrelse, fargetema, logo og hvilken
                            informasjon som skal vises, slik at tavlen(e) passer
                            til dine omgivelser og dine besøkende sine behov.
                        </ListItem>
                        <ListItem>
                            Velg om du vil vise hele kollektivtilbudet fra et
                            stoppested, eller kun vise spesifikke linjer,
                            stoppesteder eller fremkomstmidler.
                        </ListItem>
                        <ListItem>
                            Opprett mapper for å samle tavler og gi andre
                            tilgang til å administrere dem. Her kan du også
                            laste opp en logo som vil vises på alle tavlene i
                            mappen.
                        </ListItem>
                    </UnorderedList>

                    <Heading2 className="pt-8">Eksempler på bruk</Heading2>
                    <Heading3>Hoteller</Heading3>
                    <Paragraph>
                        Plasser Tavla i resepsjonsområdet slik at gjester kan se
                        sanntidsinformasjon om avganger fra stoppesteder i
                        nærheten.
                    </Paragraph>
                    <Heading3>Arbeidsplasser</Heading3>
                    <Paragraph>
                        Vis Tavla på informasjonspunkter eller skjermer ved
                        inngangen slik at besøkende enkelt kan planlegge
                        hjemreisen.
                    </Paragraph>
                    <Heading3>Kjøpesentre</Heading3>
                    <Paragraph>
                        Sett opp Tavla på sentrale steder slik at kunder alltid
                        har oppdatert informasjon om offentlig transport.
                    </Paragraph>
                </div>
            </div>
        </main>
    )
}

export { Landing as default }
