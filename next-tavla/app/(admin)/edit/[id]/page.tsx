import { getUserFromSessionCookie } from 'Admin/utils/formActions'
import { permanentRedirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import { addTile, getBoard } from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { Board } from 'Board/scenarios/Board'
import { TileSelector } from './components/TileSelector'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { TileCard } from './components/TileCard'
import { Button } from '@entur/button'
import Link from 'next/link'
import { MetaSettings } from './components/MetaSettings'

export default async function EditPage({
    params,
}: {
    params: { id: TBoardID }
}) {
    const user = await getUserFromSessionCookie()
    if (!user) return permanentRedirect('/')
    const board = await getBoard(params.id)

    return (
        <div className="flexColumn p-4 g-2">
            <Heading1>Rediger tavle: {board.meta?.title}</Heading1>
            <Heading2>Forhåndsvisning</Heading2>
            <div className={classes.preview} data-theme={board.theme ?? 'dark'}>
                <Board board={board} />
            </div>
            <Heading2>Stoppesteder i tavla</Heading2>
            <TileSelector
                action={async (data: FormData) => {
                    'use server'
                    const quayId = data.get('quay') as string
                    const stopPlaceId = data.get('stop_place') as string
                    const stopPlaceName = data.get('stop_place_name') as string

                    const placeId = quayId ? quayId : stopPlaceId

                    await addTile(params.id, {
                        type: placeId !== stopPlaceId ? 'quay' : 'stop_place',
                        name: stopPlaceName,
                        uuid: nanoid(),
                        placeId,
                        columns: ['line', 'destination', 'time', 'realtime'],
                    })
                    revalidatePath(`/edit/${params.id}`)
                }}
            />
            {board.tiles.map((tile) => (
                <TileCard key={tile.uuid} bid={params.id} tile={tile} />
            ))}
            <MetaSettings bid={params.id} meta={board.meta} />
            <div className={classes.floating}>
                <Button
                    as={Link}
                    aria-label="Åpne tavla"
                    href={`/${params.id}`}
                    target="_blank"
                    variant="primary"
                >
                    Åpne tavle
                </Button>
            </div>
        </div>
    )
}