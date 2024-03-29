import { redirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import { addTile, getBoard } from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { TileCard } from './components/TileCard'
import { Button } from '@entur/button'
import Link from 'next/link'
import { MetaSettings } from './components/MetaSettings'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { revalidatePath } from 'next/cache'
import { ExternalIcon } from '@entur/icons'
import { Metadata } from 'next'
import { getOrganizationForBoard } from './components/TileCard/actions'
import { ClientBoard } from './components/ClientBoard'
import { getUser } from 'app/(admin)/utils/firebase'

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

    const userAccess = user.owner?.includes(params.id)
    const organizationAccess =
        organization?.owners?.includes(user.uid) ||
        organization?.editors?.includes(user.uid)

    if (!userAccess && !organizationAccess) return redirect('/')

    return (
        <main className="flexColumn p-4 g-2">
            <div className="flexRow justifyBetween alignCenter pb-2">
                <Heading1 className="m-0">
                    Rediger tavle {board.meta?.title}
                </Heading1>
                <Button
                    as={Link}
                    aria-label="Åpne tavle"
                    href={`/${params.id}`}
                    target="_blank"
                    variant="secondary"
                >
                    Åpne tavle
                    <ExternalIcon />
                </Button>
            </div>
            <MetaSettings bid={params.id} meta={board.meta} />
            <Heading2 className="mt-3">Stoppesteder i tavla</Heading2>
            <TileSelector
                action={async (data: FormData) => {
                    'use server'

                    const tile = formDataToTile(data, organization)
                    if (!tile.placeId) return

                    await addTile(params.id, tile)
                    revalidatePath(`/edit/${params.id}`)
                }}
                direction="Row"
            />
            {board.tiles.map((tile) => (
                <TileCard key={tile.uuid} bid={params.id} tile={tile} />
            ))}
            <Heading2 className="mt-3">Forhåndsvisning</Heading2>
            <div className={classes.preview} data-theme={board.theme ?? 'dark'}>
                <ClientBoard board={board} />
            </div>
        </main>
    )
}
