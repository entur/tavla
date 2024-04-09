import { redirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import { addTile, getBoard, getWalkingDistanceTile } from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import classes from './styles.module.css'
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
        <main className="flexColumn p-4 g-7">
            <div className="flexRow justifyBetween alignCenter">
                <Heading1 margin="top">Rediger {board.meta?.title}</Heading1>
                <div className="flexRow g-2">
                    <Open bid={board.id} type="button" />
                    <Copy bid={board.id} type="button" />
                    <Delete board={board} type="button" />
                </div>
            </div>

            <MetaSettings bid={params.id} meta={board.meta} />

            <div className="flexColumn g-2">
                <Heading2>Stoppesteder i tavlen</Heading2>
                <TileSelector
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
                    direction="Row"
                />
                {board.tiles.map((tile) => (
                    <TileCard key={tile.uuid} bid={params.id} tile={tile} />
                ))}
            </div>

            <div className="flexColumn g-2">
                <Heading2>Forhåndsvisning</Heading2>
                <div
                    className={classes.preview}
                    data-theme={board.theme ?? 'dark'}
                >
                    <ClientBoard board={board} />
                </div>
            </div>
        </main>
    )
}
