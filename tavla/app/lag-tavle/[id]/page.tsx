import { Heading1, LeadParagraph } from '@entur/typography'
import { EditBoardBeta } from 'app/(innlogget)/tavler/[id]/rediger-beta/components/EditBoardBeta'
import { DEFAULT_BOARD_NAME } from 'app/(innlogget)/utils/constants'
import { userCanEditBoard } from 'app/(innlogget)/utils/firebase'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkServer } from 'utils/boardLink'
import { PublishedBoardInfo } from './components/PublishedBoardInfo'

export type TProps = {
    params: Promise<{ id: BoardDB['id'] }>
}

export async function generateMetadata(props: TProps): Promise<Metadata> {
    const { id } = await props.params
    const board = await getBoard(id)
    if (!board) {
        return notFound()
    }
    return {
        title: `${board.meta?.title ?? DEFAULT_BOARD_NAME} | Lag en tavle med Entur Tavla`,
        description:
            'Bygg din egen tavle uten å logge inn. Legg til stoppesteder, tilpass utseendet og del lenken.',
    }
}

export default async function LagTavleEditorPage(props: TProps) {
    const { id: bid } = await props.params

    const [board, access] = await Promise.all([
        getBoard(bid),
        userCanEditBoard(bid),
    ])

    if (!board) return notFound()

    if (!access) {
        const boardLink = getBoardLinkServer(board.customUrl ?? board.id)
        return (
            <main id="main-content" className="container">
                <PublishedBoardInfo boardLink={boardLink} />
            </main>
        )
    }

    const boardPreviewLink = getBoardLinkServer(board.id, true)

    return (
        <main id="main-content" className="container flex flex-col gap-8 pt-4">
            <div className="mb-16">
                <Heading1 as="h1">Lag en tavle</Heading1>
                <LeadParagraph className="max-w-prose">
                    Søk opp din adresse eller ditt nærmeste stoppested og lag en
                    tavle med avganger i nærheten. Tilpass utseende og innhold
                    etter ditt behov. Når du er fornøyd med tavla kan du klikke
                    på "Få lenke til tavla" og få en lenke du kan dele med
                    andre, eller vise på en skjerm.
                </LeadParagraph>
            </div>
            <EditBoardBeta
                board={board}
                boardLink={boardPreviewLink}
                breadcrumbs={null}
            />
        </main>
    )
}
