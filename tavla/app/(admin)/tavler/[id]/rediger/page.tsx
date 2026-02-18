import { Heading1, Heading2, SubParagraph } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { userCanEditBoard } from 'app/(admin)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { getBoard, getFolderForBoard } from 'src/firebase'
import { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { getBoardLinkServer } from 'src/utils/boardLink'
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
        title: `${board.meta?.title ?? DEFAULT_BOARD_NAME} | Entur Tavla - Sanntidsskjerm og avgangstavle for offentlig transport`,
        description: `Rediger tavla ${board.meta?.title ?? DEFAULT_BOARD_NAME}. Legg til og fjern stoppesteder, tilpass utseendet og mer.`,
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

        const tile = formDataToTile(data)
        if (!tile.placeId) return

        const addOrRemoveWalkingDistance = async (tile: BoardTileDB) => {
            if (board?.meta.location) {
                return await getWalkingDistanceTile(tile, board.meta.location)
            }
            delete tile.walkingDistance
            return tile
        }
        const tileWithDistance = await addOrRemoveWalkingDistance(tile)

        await addTile(params.id, tileWithDistance)
        if (board?.combinedTiles)
            await addTileToCombinedList(board, tileWithDistance.uuid)
        revalidatePath(`/tavler/${params.id}/rediger`)
    }

    const boardLink = getBoardLinkServer(board.id, true)

    return (
        <main id="main-content">
            <div className="container flex flex-col gap-6 pb-20 pt-16">
                {folder ? (
                    <BreadcrumbsNav
                        type="boardInFolder"
                        folder={folder}
                        board={board}
                    />
                ) : (
                    <BreadcrumbsNav type="board" board={board} />
                )}

                <div className="flex flex-col justify-between pb-2 md:flex-row">
                    <Heading1 margin="top">
                        Rediger {board.meta?.title}
                    </Heading1>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <ActionsMenu board={board} folderid={folder?.id} />
                    </div>
                </div>
                <div className="md:w-fit">
                    <p>Lenke til tavla:</p>
                    <Copy
                        bid={board.id}
                        type="button"
                        trackingLocation="board_page"
                    />
                </div>

                <div
                    data-transport-palette={board.transportPalette}
                    className="flex flex-col gap-4 rounded-md bg-[#f6f6f9] px-6 py-8"
                >
                    <div>
                        <Heading2>Stoppesteder</Heading2>
                        <SubParagraph className="mt-0">
                            Felter markert med * er påkrevd.
                        </SubParagraph>
                    </div>
                    <TileSelector
                        action={walkingDistanceAction}
                        trackingLocation={
                            board.id === 'demo' ? 'demo_page' : 'board_page'
                        }
                    />
                    <TileList board={board} />
                    <div
                        data-theme={board.theme ?? 'dark'}
                        aria-label="Forhåndsvisning av Tavla"
                    >
                        <Preview boardLink={boardLink} />
                    </div>
                </div>
                <Settings board={board} />
            </div>
        </main>
    )
}
