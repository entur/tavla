import { Heading1, Heading2 } from '@entur/typography'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { userCanEditBoard } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { BoardDB } from 'types/db-types/boards'
import { BreadcrumbsNav } from '../BreadcrumbsNav'
import {
    addTile,
    addTileToCombinedList,
    getWalkingDistanceTile,
} from './actions'
import { ActionsMenu } from './components/ActionsMenu'
import { Copy } from './components/Buttons/Copy'
import { Preview } from './components/Preview'
import { Settings } from './components/Settings'
import { getFolderForBoard } from './components/TileCard/actions'
import { TileList } from './components/TileList'

export type TProps = {
    params: Promise<{ id: BoardDB['id'] }>
}

export async function generateMetadata(props: TProps): Promise<Metadata> {
    const params = await props.params
    const { id } = params
    const board = await getBoard(id)
    if (!board) {
        return notFound()
    }
    return {
        title: `${board.meta?.title ?? DEFAULT_BOARD_NAME} | Entur Tavla`,
    }
}

export default async function EditPage(props: TProps) {
    const params = await props.params
    const user = await getUserFromSessionCookie()
    if (!user || !user.uid) return redirect('/')

    const board = await getBoard(params.id)
    if (!board) {
        return notFound()
    }
    const folder = await getFolderForBoard(params.id)

    const access = await userCanEditBoard(params.id)
    if (!access) return redirect('/')

    async function walkingDistanceAction(data: FormData) {
        'use server'

        const tile = await getWalkingDistanceTile(
            formDataToTile(data),
            board?.meta?.location,
        )
        if (!tile.placeId) return
        await addTile(params.id, tile)
        if (board?.combinedTiles) await addTileToCombinedList(board, tile.uuid)
        revalidatePath(`/tavler/${params.id}/rediger`)
    }

    return (
        <div className="bg-gray-50">
            <div className="container flex flex-col gap-6 pb-20 pt-16">
                <BreadcrumbsNav folder={folder ?? undefined} board={board} />
                <div className="flex flex-col justify-between pb-2 md:flex-row">
                    <Heading1 margin="top">
                        Rediger {board.meta?.title}
                    </Heading1>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <ActionsMenu board={board} folderid={folder?.id} />
                    </div>
                </div>
                <div className="md:w-fit">
                    <Copy bid={board.id} type="button" />
                </div>

                <div
                    data-transport-palette={board.transportPalette}
                    className="flex flex-col gap-4 rounded-md bg-background px-6 py-8"
                >
                    <Heading2>Stoppesteder</Heading2>
                    <TileSelector action={walkingDistanceAction} />

                    <TileList board={board} />
                    <div
                        data-theme={board.theme ?? 'dark'}
                        className="pt-8"
                        aria-label="Forhåndsvisning av Tavla"
                    >
                        <Preview board={board} folder={folder ?? undefined} />
                    </div>
                </div>
                <Settings board={board} />
            </div>
        </div>
    )
}
