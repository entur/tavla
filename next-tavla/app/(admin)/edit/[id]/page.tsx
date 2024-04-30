import { redirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import { addTile, getBoard, getWalkingDistanceTile } from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import { TileCard } from './components/TileCard'
import { MetaSettings } from './components/MetaSettings'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { revalidatePath } from 'next/cache'
import { Metadata } from 'next'
import { getOrganizationForBoard } from './components/TileCard/actions'
import { ClientBoard } from './components/ClientBoard'
import { getUser, hasBoardEditorAccess } from 'app/(admin)/utils/firebase'
import { Delete } from 'app/(admin)/boards/components/Column/Delete'
import { Open } from './components/Buttons/Open'
import { Copy } from './components/Buttons/Copy'

type TProps = {
    params: { id: TBoardID }
}

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { id } = params
    const board = await getBoard(id)
    return {
        title: `${board.meta?.title} | Entur Tavla`,
    }
}

export default async function EditPage({ params }: TProps) {
    const user = await getUser()
    if (!user || !user.uid) return redirect('/')

    const board = await getBoard(params.id)
    const organization = await getOrganizationForBoard(params.id)

    const access = await hasBoardEditorAccess(params.id)
    if (!access) return redirect('/')

    return (
        <div className="flex flex-col gap-14">
            <div className="flex flex-col md:flex-row justify-between">
                <Heading1 margin="top">Rediger {board.meta?.title}</Heading1>
                <div className="flex flex-col md:flex-row gap-4">
                    <Open bid={board.id} type="button" />
                    <Copy bid={board.id} type="button" />
                    <Delete board={board} type="button" />
                </div>
            </div>

            <MetaSettings bid={params.id} meta={board.meta} />

            <div className="flex flex-col gap-4">
                <Heading2>Stoppesteder i tavlen</Heading2>
                <TileSelector
                    col={false}
                    action={async (data: FormData) => {
                        'use server'

                        const tile = await getWalkingDistanceTile(
                            formDataToTile(data, organization),
                            board.meta.location,
                        )
                        if (!tile.placeId) return
                        await addTile(params.id, tile)
                        revalidatePath(`/edit/${params.id}`)
                    }}
                />
                {board.tiles.map((tile) => (
                    <TileCard key={tile.uuid} bid={params.id} tile={tile} />
                ))}
            </div>

            <div className="flex flex-col gap-4">
                <Heading2>Forhåndsvisning</Heading2>
                <div
                    className="rounded p-4 bg-base-primary h-[40em]"
                    data-theme={board.theme ?? 'dark'}
                >
                    <ClientBoard board={board} />
                </div>
            </div>
        </div>
    )
}
