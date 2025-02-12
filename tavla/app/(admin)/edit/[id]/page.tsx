import { notFound, redirect } from 'next/navigation'
import { TBoardID } from 'types/settings'
import { addTile, getWalkingDistanceTile } from './actions'
import { Heading1, Heading2 } from '@entur/typography'
import { MetaSettings } from './components/MetaSettings'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { revalidatePath } from 'next/cache'
import { Metadata } from 'next'
import { getOrganizationForBoard } from './components/TileCard/actions'
import { userCanEditBoard } from 'app/(admin)/utils/firebase'
import { Open } from './components/Buttons/Open'
import { Copy } from './components/Buttons/Copy'
import { Footer } from './components/Footer'
import { RefreshButton } from './components/RefreshButton'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Preview } from './components/Preview'
import { ActionsMenu } from './components/ActionsMenu'
import { ThemeSelect } from './components/ThemeSelect'
import { TileList } from './components/TileList'
import { getBoard } from 'Board/scenarios/Board/firebase'
import { getUserFromSessionCookie } from 'app/(admin)/utils/server'
import { CompressSurvey } from './components/CompressSurvey'
import { Delete } from 'app/(admin)/boards/components/Column/Delete'

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
                        col={false}
                        oid={organization?.id}
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
                        className="pt-8"
                        aria-label="Forhåndsvisning av Tavla"
                    >
                        <Preview board={board} organization={organization} />
                    </div>
                </div>

                <div className="rounded-md md:py-8 py-2 md:px-6 px-2 flex flex-col gap-4 bg-background">
                    <Heading2>Innstillinger</Heading2>
                    <div className="grid grid-cols md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8">
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
                        <CompressSurvey />
                    </div>
                </div>
            </div>
        </div>
    )
}
