import { notFound, redirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import {
    addTile,
    addTileToCombinedList,
    getWalkingDistanceTile,
} from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { revalidatePath } from 'next/cache'
import { Metadata } from 'next'
import { getFolderForBoard } from './components/TileCard/actions'
import { userCanEditBoard } from 'app/(admin)/utils/firebase'
import { Open } from './components/Buttons/Open'
import { Copy } from './components/Buttons/Copy'
import { RefreshButton } from './components/RefreshButton'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Preview } from './components/Preview'
import { ActionsMenu } from './components/ActionsMenu'
import { TileList } from './components/TileList'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Delete } from 'app/(admin)/oversikt/components/Column/Delete'
import { Settings } from './components/Settings'
import { BreadcrumbsNav } from '../BreadcrumbsNav'

export type TProps = {
    params: Promise<{ id: TBoardID }>
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

    return (
        <div className="bg-gray-50">
            <div className="container flex flex-col gap-6 pb-20 pt-16">
                <BreadcrumbsNav folder={folder} board={board} />
                <div className="flex flex-col justify-between pb-2 md:flex-row">
                    <Heading1 margin="top">
                        Rediger {board.meta?.title}
                    </Heading1>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <Open bid={board.id} type="button" />
                        <RefreshButton board={board} />
                        <Delete board={board} type="button" />
                        <ActionsMenu board={board} oid={folder?.id} />
                    </div>
                </div>
                <div className="md:w-fit">
                    <Copy bid={board.id} type="button" />
                </div>

                <div className="flex flex-col gap-4 rounded-md bg-background px-6 py-8">
                    <Heading2>Stoppesteder</Heading2>
                    <TileSelector
                        action={async (data: FormData) => {
                            'use server'

                            const tile = await getWalkingDistanceTile(
                                formDataToTile(data),
                                board.meta?.location,
                            )
                            if (!tile.placeId) return
                            await addTile(params.id, tile)
                            if (board.combinedTiles)
                                await addTileToCombinedList(board, tile.uuid)
                            revalidatePath(`/tavler/${params.id}/rediger`)
                        }}
                    />

                    <TileList board={board} />
                    <div
                        data-theme={board.theme ?? 'dark'}
                        className="pt-8"
                        aria-label="Forhåndsvisning av Tavla"
                    >
                        <Preview board={board} folder={folder} />
                    </div>
                </div>
                <Settings board={board} folder={folder} />
            </div>
        </div>
    )
}
