'use client'
import { CopyableText } from '@entur/alert'
import { PrimaryButton } from '@entur/button'
import { Heading2, Heading3 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTiles } from 'app/(admin)/components/TileSelector/utils'
import { useSaveDemoBoardInLocalStorage } from 'app/(admin)/hooks/useSaveDemoBoardInLocalStorage'
import { SettingsForm } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/SettingsForm'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { DemoPreview } from 'app/demo/components/DemoPreview'
import { publishBoard } from 'app/lag-tavle/actions'
import { useCallback, useState } from 'react'
import { getBoardLinkClient } from 'src/utils/boardLink'

type PublishBoardState =
    | { type: 'not-published' }
    | { type: 'publishing' }
    | { type: 'published'; boardId: string }
    | { type: 'error'; message: string }

function CreateBoardLocally() {
    const { board, setTiles, onSubmit } = useSaveDemoBoardInLocalStorage()

    const [publishState, setPublishState] = useState<PublishBoardState>({
        type: 'not-published',
    })

    const handlePublish = async () => {
        setPublishState({ type: 'publishing' })
        try {
            const boardId = await publishBoard(board)
            setPublishState({ type: 'published', boardId })
        } catch {
            setPublishState({
                type: 'error',
                message: 'Noe gikk galt. Prøv igjen.',
            })
        }
    }

    const resetPublishedBoard = useCallback(() => {
        setPublishState({ type: 'not-published' })
    }, [])

    const handleSettingsSubmit = useCallback(
        async (data: FormData) => {
            await onSubmit(data)
            resetPublishedBoard()
        },
        [onSubmit, resetPublishedBoard],
    )

    return (
        <>
            <div
                data-transport-palette={board.transportPalette}
                className="flex flex-col gap-4 rounded-md bg-tintLight px-6 py-8"
            >
                <Heading3 as="h2" margin="top">
                    Hvilke stoppesteder vil du vise i tavlen?
                </Heading3>
                <TileSelector
                    action={async (data: FormData) => {
                        const tiles = formDataToTiles(data)
                        setTiles([...board.tiles, ...tiles])
                        resetPublishedBoard()
                    }}
                    trackingLocation="demo_page"
                />
                <TileList
                    board={board}
                    setTilesDemoBoard={setTiles}
                    bid="demo"
                />
                <section
                    data-theme={board.theme ?? 'dark'}
                    aria-label="Forhåndsvisning av Tavla"
                >
                    <Heading2>Forhåndsvisning</Heading2>
                    <DemoPreview board={board} />
                </section>
            </div>
            <SettingsForm board={board} onSubmit={handleSettingsSubmit} />
            <div className="flex flex-col gap-4">
                {publishState.type !== 'published' && (
                    <PrimaryButton
                        onClick={handlePublish}
                        loading={publishState.type === 'publishing'}
                        width="auto"
                    >
                        Del tavlen
                    </PrimaryButton>
                )}
                {publishState.type === 'published' && (
                    <CopyableText
                        successHeading=""
                        successMessage="Lenken til tavlen ble kopiert!"
                    >
                        {getBoardLinkClient(publishState.boardId)}
                    </CopyableText>
                )}
                {publishState.type === 'error' && (
                    <div className="text-error">{publishState.message}</div>
                )}
            </div>
        </>
    )
}

export { CreateBoardLocally }
