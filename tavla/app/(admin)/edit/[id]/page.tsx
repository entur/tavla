import { redirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import { addTile, getBoard, getWalkingDistanceTile } from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import { MetaSettings } from './components/MetaSettings'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { revalidatePath } from 'next/cache'
import { Metadata } from 'next'
import { getOrganizationForBoard } from './components/TileCard/actions'
import { getUser, hasBoardEditorAccess } from 'app/(admin)/utils/firebase'
import { Open } from './components/Buttons/Open'
import { Copy } from './components/Buttons/Copy'
import { Footer } from './components/Footer'
import { RefreshButton } from './components/RefreshButton'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Preview } from './components/Preview'
import { ActionsMenu } from './components/ActionsMenu'
import { ThemeSelect } from './components/ThemeSelect'
import { TileList } from './components/TileList'

export type TProps = {
    params: { id: TBoardID }
}

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { id } = params
    const board = await getBoard(id)
    return {
        title: `${board.meta?.title ?? DEFAULT_BOARD_NAME} | Entur Tavla`,
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
        <div className="bg-gray-50">
            <div className="flex flex-col gap-6 pt-16 container pb-20">
                <div className="flex flex-col md:flex-row justify-between pb-2">
                    <Heading1 margin="top">
                        Rediger {board.meta?.title}
                    </Heading1>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <Open bid={board.id} type="button" />
                        <Copy bid={board.id} type="button" />
                        <RefreshButton board={board} />
                        <ActionsMenu board={board} oid={organization?.id} />
                    </div>
                </div>

                <div className="bg-background rounded-md py-8 px-6 flex flex-col gap-4">
                    <Heading2>Stoppesteder</Heading2>
                    <TileSelector
                        col={false}
                        oid={organization?.id}
                        lineIcons={false}
                        action={async (data: FormData) => {
                            'use server'

                            const tile = await getWalkingDistanceTile(
                                formDataToTile(data, organization),
                                board.meta?.location,
                            )
                            if (!tile.placeId) return
                            await addTile(params.id, tile)
                            revalidatePath(`/edit/${params.id}`)
                        }}
                    />

                    <TileList board={board} />
                    <div
                        data-theme={board.theme ?? 'dark'}
                        className="pt-8 text-2xl"
                    >
                        <Preview board={board} organization={organization} />
                    </div>
                </div>

                <div className="rounded-md py-8 px-6 flex flex-col gap-4 bg-background">
                    <Heading2>Innstillinger</Heading2>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8">
                        <MetaSettings
                            bid={params.id}
                            meta={board.meta}
                            organization={organization}
                        />
                        <Footer
                            bid={params.id}
                            footer={board.footer}
                            organizationBoard={organization !== undefined}
                        />
                        <ThemeSelect board={board} />
                    </div>
                </div>
            </div>
        </div>
    )
}
