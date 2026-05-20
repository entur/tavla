import { Heading1, LeadParagraph } from '@entur/typography'
import { CreateBoardButton } from 'app/components/CreateBoardButton'
import type { Metadata } from 'next'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkServer } from 'src/utils/boardLink'
import { getUserFromSessionCookie } from './(innlogget)/utils/server'
import { FeatureShowcase } from './components/FeatureShowcase'
import { ImageCarousel } from './components/ImageCarousel'
import { NavigateToOversiktButton } from './components/NavigateToOversiktButton'
import { PreviewCarousel } from './components/PreviewCarousel'
import { Tavla123 } from './components/Tavla123'
import { TavlaUsageMap } from './components/TavlaUsageMap/TavlaUsageMap'
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

            <div className="container mx-auto my-24 flex flex-col justify-start gap-8 lg:gap-16 pt-14">
                <PreviewCarousel previewBoards={previewBoardsWithLinks} />

                <Tavla123 />

                <TavlaUsageMap loggedIn={loggedIn} />
                <FeatureShowcase />
            </div>
        </main>
    )
}

export { Landing as default }
