'use client'
import { CopyableText, useToast } from '@entur/alert'
import { PrimaryButton } from '@entur/button'
import { Heading2, Heading3 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTiles } from 'app/(admin)/components/TileSelector/utils'
import { useLocalStorage } from 'app/(admin)/hooks/useLocalStorage'
import { SettingsForm } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/SettingsForm'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { DemoPreview } from 'app/demo/components/DemoPreview'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    BoardDB,
    BoardFontSize,
    BoardTheme,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'
import { getTilesWithWalkingDistance, publishBoard } from '../actions'

const emptyBoard: BoardDB = {
    id: 'demo',
    meta: { title: 'Min tavle' },
    tiles: [],
}

function CreateBoardLocally() {
    const { board, setTiles, onSubmit } = useSaveBoardInLocalStorage()
    const [publishedBoardId, setPublishedBoardId] = useState<string | null>(
        null,
    )
    const [isPublishing, setIsPublishing] = useState(false)
    const { addToast } = useToast()

    const handleSettingsSubmit = useCallback(
        async (data: FormData) => {
            await onSubmit(data)
            setPublishedBoardId(null)
        },
        [onSubmit],
    )

    const handlePublish = async () => {
        setIsPublishing(true)
        try {
            const boardId = await publishBoard(board)
            setPublishedBoardId(boardId)
        } catch {
            addToast('Noe gikk galt. Prøv igjen.')
        } finally {
            setIsPublishing(false)
        }
    }

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
                        setPublishedBoardId(null)
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

function useSaveBoardInLocalStorage(): {
    board: BoardDB
    setTiles: (newTiles: BoardDB['tiles']) => void
    onSubmit: (data: FormData) => Promise<void>
} {
    const [board, setBoard] = useLocalStorage<BoardDB>(
        'lag-tavle-board',
        emptyBoard,
    )

    const setTiles = (newTiles: BoardDB['tiles']) => {
        setBoard((prev) => ({
            ...prev,
            tiles: newTiles,
        }))
    }

    const boardTilesRef = useRef(board.tiles)
    useEffect(() => {
        boardTilesRef.current = board.tiles
    })

    const onSubmit = useCallback(
        async (data: FormData) => {
            const title = (data.get('title') as string)?.trim()
            const viewType = data.get('viewType') as string
            const theme = data.get('theme') as BoardTheme
            const font = data.get('font') as BoardFontSize
            const transportPalette = data.get(
                'transportPalette',
            ) as TransportPalette
            const hideClock = data.get('clock') === null
            const hideLogo = data.get('logo') === null
            const footer = data.get('footer') as string

            let location: LocationDB | undefined
            const rawLocation = data.get('newLocation') as string
            if (rawLocation) {
                location = JSON.parse(rawLocation) as LocationDB
            }

            const footerHasText = footer && footer.trim() !== ''

            const updatedTiles = await getTilesWithWalkingDistance(
                boardTilesRef.current,
                location,
            )

            setBoard((prev) => ({
                ...prev,
                meta: {
                    ...prev.meta,
                    title: title || prev.meta.title,
                    fontSize: font,
                    location: location,
                },
                theme: theme ?? 'dark',
                transportPalette: transportPalette ?? 'default',
                hideClock,
                hideLogo,
                footer: footerHasText ? { footer } : undefined,
                combinedTiles:
                    viewType === 'separate'
                        ? undefined
                        : [{ ids: prev.tiles.map((tile) => tile.uuid) }],
                tiles: updatedTiles,
            }))
        },
        [setBoard],
    )

    return { board, setTiles, onSubmit }
}

export { CreateBoardLocally }
