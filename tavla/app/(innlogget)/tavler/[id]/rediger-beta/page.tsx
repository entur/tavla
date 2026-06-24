import { BreadcrumbsNav } from 'app/(innlogget)/tavler/[id]/BreadcrumbsNav'
import { DEFAULT_BOARD_NAME } from 'app/(innlogget)/utils/constants'
import { userCanEditBoard } from 'app/(innlogget)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getBoard, getFolderForBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkServer } from 'utils/boardLink'
import { EditBoardBeta } from './components/EditBoardBeta'

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
        title: `Rediger ${board.meta?.title ?? DEFAULT_BOARD_NAME} (beta) | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport`,
        description: `Rediger tavla ${board.meta?.title ?? DEFAULT_BOARD_NAME}. Legg til og fjern stoppesteder, tilpass utseendet og mer.`,
    }
}

export default async function EditBetaPage(props: TProps) {
    const { id: bid } = await props.params
    const user = await getUserFromSessionCookie()
    if (!user?.uid) return redirect('/')

    const [board, folder, access] = await Promise.all([
        getBoard(bid),
        getFolderForBoard(bid),
        userCanEditBoard(bid),
    ])

    if (!board) return notFound()
    if (!access) return redirect('/')

    const boardPreviewLink = getBoardLinkServer(board.id, true)

    return (
        <main
            id="main-content"
            className="container flex flex-col gap-6 pb-20 pt-4"
        >
            {folder ? (
                <BreadcrumbsNav
                    type="boardInFolder"
                    folder={folder}
                    board={board}
                />
            ) : (
                <BreadcrumbsNav type="board" board={board} />
            )}
            <EditBoardBeta initialBoard={board} boardLink={boardPreviewLink} />
        </main>
    )
}
