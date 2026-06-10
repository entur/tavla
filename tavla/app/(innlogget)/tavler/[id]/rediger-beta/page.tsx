import { Heading1, Heading2, SubParagraph } from '@entur/typography'
import { TileList } from 'app/_components/TileList'
import { TileSelector } from 'app/_components/TileSelector/TileSelector'
import { formDataToTiles } from 'app/_components/TileSelector/utils'
import { DEFAULT_BOARD_NAME } from 'app/(innlogget)/utils/constants'
import { userCanEditBoard } from 'app/(innlogget)/utils/firebase'
import { getUserFromSessionCookie } from 'app/(innlogget)/utils/server'
import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { getBoard, getFolderForBoard } from 'src/firebase'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient, getBoardLinkServer } from 'src/utils/boardLink'
import { BreadcrumbsNav } from '../BreadcrumbsNav'
import { addTiles, getWalkingDistanceTile } from '../rediger/actions'
import { AppearancePanel } from './components/AppearancePanel'
import { BoardActions } from './components/BoardActions'
import { IdentityPanel } from './components/IdentityPanel'
import { PreviewPanel } from './components/PreviewPanel'

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

export default async function EditBetaPage(props: TProps) {
    const params = await props.params
    const user = await getUserFromSessionCookie()
    if (!user?.uid) return redirect('/')

    const board = await getBoard(params.id)
    if (!board) {
        return notFound()
    }
    const folder = await getFolderForBoard(params.id)

    const access = await userCanEditBoard(params.id)
    if (!access) return redirect('/')

    async function addTilesAction(data: FormData) {
        'use server'

        const tiles = formDataToTiles(data)
        if (tiles.length === 0) return

        const tilesWithDistance = await Promise.all(
            tiles
                .filter((tile) => tile.stopPlaceId)
                .map(async (tile) => {
                    const tileWithDistance = board?.meta.location
                        ? await getWalkingDistanceTile(
                              tile,
                              board.meta.location,
                          )
                        : (() => {
                              delete tile.walkingDistance
                              return tile
                          })()
                    return tileWithDistance
                }),
        )
        await addTiles(params.id, tilesWithDistance)

        revalidatePath(`/tavler/${params.id}`, 'layout')
    }

    const boardPreviewLink = getBoardLinkServer(board.id, true)
    const boardLink = getBoardLinkClient(board.customUrl ?? board.id)

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

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                        <Heading1 margin="none">
                            Rediger {board.meta?.title ?? DEFAULT_BOARD_NAME}
                        </Heading1>
                        <span className="rounded-full border border-primary px-3 py-1 text-sm font-medium text-primary">
                            Beta
                        </span>
                    </div>
                    <BoardActions board={board} folderid={folder?.id} />
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    {/* Venstre: redigeringskontroller (scroller) */}
                    <div className="flex min-w-0 flex-col gap-6 lg:flex-1">
                        <IdentityPanel board={board} boardLink={boardLink} />

                        <section
                            data-transport-palette={board.transportPalette}
                            className="flex flex-col gap-4 rounded-md bg-tintLight px-4 py-6"
                        >
                            <div>
                                <Heading2 margin="none">Stoppesteder</Heading2>
                                <SubParagraph className="mt-0">
                                    Felter markert med * er påkrevd.
                                </SubParagraph>
                            </div>
                            <TileSelector
                                action={addTilesAction}
                                trackingLocation="board_page"
                            />
                            <TileList board={board} />
                        </section>

                        <AppearancePanel board={board} />
                    </div>

                    {/* Høyre: permanent forhåndsvisning (sticky) */}
                    <div className="lg:w-2/5 lg:shrink-0 xl:w-[44%]">
                        <div className="lg:sticky lg:top-6">
                            <PreviewPanel
                                boardLink={boardPreviewLink}
                                theme={board.theme ?? 'dark'}
                                board={board}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
