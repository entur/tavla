import { DEFAULT_BOARD_NAME } from 'app/(innlogget)/utils/constants'
import { userCanEditBoard } from 'app/(innlogget)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
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

    const [board, access] = await Promise.all([
        getBoard(bid),
        userCanEditBoard(bid),
    ])

    if (!board) return notFound()
    if (!access) return redirect('/')

    return (
        <main
            id="main-content"
            className="container flex flex-col gap-6 pb-20 pt-8"
        >
            <EditBoardBeta initialBoard={board} />
        </main>
    )
}
