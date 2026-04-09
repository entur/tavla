import { MapPinIcon, NewIcon, ShareIcon } from '@entur/icons'
import {
    Heading1,
    Heading2,
    Heading3,
    LeadParagraph,
    Paragraph,
} from '@entur/typography'
import { CreateBoardButton } from 'app/components/CreateBoardButton'
import type { Metadata } from 'next'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkServer } from 'src/utils/boardLink'
import { getUserFromSessionCookie } from './(admin)/utils/server'
import { ImageCarousel } from './components/ImageCarousel/ImageCarousel'
import { NavigateToOversiktButton } from './components/NavigateToOversiktButton'
import { PreviewCarousel } from './components/PreviewCarousel'
import { WordCarousel } from './components/WordCarousel/WordCarousel'

export const metadata: Metadata = {
    title: 'Forside | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport',
    description:
        'Lag en gratis avgangstavle for offentlig transport i hele Norge. Tavla er enkel å bruke, tilpasse og viser sanntidsinformasjon om avganger fra stoppesteder i nærheten.',
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
                                    <CreateBoardButton />
                                </div>
                            ) : (
                                <NavigateToOversiktButton />
                            )}
                        </div>
                    </div>
                    <ImageCarousel />
                </div>
            </div>

            <div className="container mx-auto flex flex-col justify-start gap-4 overflow-hidden py-14">
                <PreviewCarousel previewBoards={previewBoardsWithLinks} />

                <div className="lg:px-12 py-16 px-6 text-left lg:text-center">
                    <Heading1 as="h2" margin="none">
                        Tavle på 1, 2, 3
                    </Heading1>
                    <Paragraph margin="bottom">
                        Så enkelt er det å lage en tavle
                    </Paragraph>

                    <div className="mt-12 grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-32 mx-auto">
                        <div className="flex flex-col items-start text-left rounded-2xl pt-6">
                            <div className="bg-coral p-3 rounded-2xl text-white">
                                <MapPinIcon width={36} height={36} />
                            </div>
                            <Heading3>Legg til stoppesteder</Heading3>
                            <Paragraph className="text-()">
                                Skriv inn en adresse, et sted eller et
                                stoppested og legg til stoppesteder. Du kan
                                velge så mange du vil.
                            </Paragraph>
                        </div>

                        <div className="flex flex-col items-start text-left rounded-2xl pt-6">
                            <div className="bg-coral p-3 rounded-2xl text-white">
                                <NewIcon width={36} height={36} />
                            </div>
                            <Heading3>Tilpass visningen</Heading3>
                            <Paragraph>
                                Tilpass visningen etter dine behov. Velg
                                fargemodus, tekststørrelse, legg til logo og
                                filtrer på linjer.
                            </Paragraph>
                        </div>

                        <div className="flex flex-col items-start text-left rounded-2xl pt-6">
                            <div className="bg-coral p-3 rounded-2xl text-white">
                                <ShareIcon width={36} height={36} />
                            </div>
                            <Heading3>Åpne og del</Heading3>
                            <Paragraph>
                                Åpne lenken til din tavle på hvilken som helst
                                enhet med nettleser, og du er ferdig. Oppdater
                                når som helst, fra hvor som helst.
                            </Paragraph>
                        </div>
                    </div>
                </div>

                <div className="px-6 lg:px-12">
                    <Heading2>Eksempler på bruk</Heading2>
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
