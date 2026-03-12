'use client'
import { CopyableText } from '@entur/alert'
import { PrimaryButton } from '@entur/button'
import { Heading2, Heading3 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTiles } from 'app/(admin)/components/TileSelector/utils'
import { usePublishAnonymousBoard } from 'app/(admin)/hooks/usePublishAnonymousBoard'
import { useSaveDemoBoardInLocalStorage } from 'app/(admin)/hooks/useSaveDemoBoardInLocalStorage'
import { SettingsForm } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/SettingsForm'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { DemoPreview } from 'app/demo/components/DemoPreview'
import { useCallback } from 'react'
import { getBoardLinkClient } from 'src/utils/boardLink'

function CreateBoardLocally() {
    const { board, setTiles, onSubmit } = useSaveDemoBoardInLocalStorage()

    const {
        publishedBoardId,
        isPublishing,
        handlePublish,
        resetPublishedBoard,
    } = usePublishAnonymousBoard()

    const handleSettingsSubmit = useCallback(
        async (data: FormData) => {
            await onSubmit(data)
            resetPublishedBoard()
        },
        [onSubmit],
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
                <div
                    data-theme={board.theme ?? 'dark'}
                    aria-label="Forhåndsvisning av Tavla"
                >
                    <Heading2>Forhåndsvisning</Heading2>
                    <DemoPreview board={board} />
                </div>
            </div>
            <SettingsForm board={board} onSubmit={handleSettingsSubmit} />
            <div className="flex flex-col gap-4">
                <PrimaryButton
                    onClick={handlePublish}
                    loading={isPublishing}
                    width="auto"
                >
                    Del tavlen
                </PrimaryButton>
                {publishedBoardId && (
                    <CopyableText
                        successHeading=""
                        successMessage="Lenken til tavlen ble kopiert!"
                    >
                        {getBoardLinkClient(publishedBoardId)}
                    </CopyableText>
                )}
            </div>
        </>
    )
}

export { CreateBoardLocally }
