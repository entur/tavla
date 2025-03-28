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
import { getOrganizationForBoard } from './components/TileCard/actions'
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
import { CompressSurvey } from './components/CompressSurvey'
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
    const organization = await getOrganizationForBoard(params.id)

    const access = await userCanEditBoard(params.id)
    if (!access) return redirect('/')

    return (
        <div className="bg-gray-50">
            <div className="flex flex-col gap-6 pt-16 container pb-20">
                <BreadcrumbsNav folder={organization} board={board} />
                <div className="flex flex-col md:flex-row justify-between pb-2">
                    <Heading1 margin="top">
                        Rediger {board.meta?.title}
                    </Heading1>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <Open bid={board.id} type="button" />
                        <RefreshButton board={board} />
                        <Delete board={board} type="button" />
                        <ActionsMenu board={board} oid={organization?.id} />
                    </div>
                </div>
                <div className="md:w-fit">
                    <Copy bid={board.id} type="button" />
                </div>

                <div className="bg-background rounded-md py-8 px-6 flex flex-col gap-4">
                    <Heading2>Stoppesteder</Heading2>
                    <TileSelector
                        oid={organization?.id}
                        action={async (data: FormData) => {
                            'use server'

                            const tile = await getWalkingDistanceTile(
                                formDataToTile(data, organization),
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
                        <Preview board={board} organization={organization} />
                    </div>
                </div>
                <Settings board={board} organization={organization} />
                <CompressSurvey />
            </div>
        </div>
    )
}
