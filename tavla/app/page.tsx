import { MapPinIcon, NewIcon, ShareIcon } from '@entur/icons'
import { Heading1, Heading3, LeadParagraph, Paragraph } from '@entur/typography'
import { CreateBoardButton } from 'app/components/CreateBoardButton'
import TavlaNorwayMap from 'assets/illustrations/Tavla-Norway.svg'
import type { Metadata } from 'next'
import Image from 'next/image'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkServer } from 'src/utils/boardLink'
import { getUserFromSessionCookie } from './(admin)/utils/server'
import { FeatureShowcase } from './components/FeatureShowcase'
import { ImageCarousel } from './components/ImageCarousel'
import { NavigateToOversiktButton } from './components/NavigateToOversiktButton'
import { PreviewCarousel } from './components/PreviewCarousel'
import { WordCarousel } from './components/WordCarousel'

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

const PREVIEW_BOARDS: PreviewBoard[] = [
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
                            {loggedIn ? (
                                <NavigateToOversiktButton />
                            ) : (
                                <CreateBoardButton />
                            )}
                        </div>
                    </div>
                    <ImageCarousel />
                </div>
            </div>

            <div className="container mx-auto flex flex-col justify-start gap-4 py-14">
                <PreviewCarousel previewBoards={previewBoardsWithLinks} />

                <div className="lg:px-12 py-16 mx-6 text-left lg:text-center lg:mx-24">
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

                <div className="bg-[#F5F6FA] rounded-3xl flex flex-row gap-8 overflow-hidden justify-center lg:justify-normal lg:mx-24">
                    <div className="w-1/2 flex flex-col my-24 lg:ml-24 text-center lg:text-left">
                        <Heading1 as="h2" margin="none">
                            Hvor brukes Tavla?
                        </Heading1>
                        <Paragraph className="my-2 mb-10 text-lg">
                            Overalt hvor folk tar kollektivt.
                        </Paragraph>

                        <ul className="flex flex-col gap-4 my-8 text-primary mx-auto lg:ml-0">
                            {[
                                'Busstopp',
                                'Kollektivknutepunkt',
                                'Kontorer',
                                'Borettslag',
                                'Hjemme',
                                'Flyplasser',
                                'Skoler og universiteter',
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-3 text-nowrap"
                                >
                                    <div className="w-2.5 h-2.5 rounded-full bg-coral shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-20 mx-auto lg:mx-0">
                            {loggedIn ? (
                                <NavigateToOversiktButton />
                            ) : (
                                <CreateBoardButton />
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 relative items-center justify-center my-24 mr-12 -ml-12 lg:-ml-48 lg:mr-24 hidden lg:flex">
                        <Image
                            className="w-full h-auto object-contain max-h-[700px]"
                            src={TavlaNorwayMap}
                            alt={
                                'Kart over Norge med pins på flere forskjellige steder, for å vise at Tavla er i bruk over hele landet.'
                            }
                        />
                    </div>
                </div>
                <FeatureShowcase />
            </div>
        </main>
    )
}

export { Landing as default }
