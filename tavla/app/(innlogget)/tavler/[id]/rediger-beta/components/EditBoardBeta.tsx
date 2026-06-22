'use client'
import { Heading1, Paragraph } from '@entur/typography'
import { formDataToTiles } from 'app/_components/TileSelector/utils'
import { Copy } from 'app/(innlogget)/tavler/[id]/rediger/components/Buttons/Copy'
import { saveSettings } from 'app/(innlogget)/tavler/[id]/rediger/components/Settings/actions'
import { BoardPreview } from 'app/lag-tavle/components/BoardPreview'
import { useCallback, useState } from 'react'
import type {
    BoardDB,
    BoardFontSize,
    BoardTheme,
    LocationDB,
    TransportPalette,
} from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'
import { addBetaTiles } from '../actions'
import { EditBoardSidebar } from './EditBoardSidebar'

/**
 * Applies a settings FormData submission to the in-memory board so the live
 * preview updates immediately. Mirrors the field mapping in `saveSettings`,
 * which persists the same change to Firestore. Walking distances are
 * recalculated server-side and synced on the next page load.
 */
function applySettingsToBoard(prev: BoardDB, data: FormData): BoardDB {
    const title = (data.get('title') as string)?.trim()
    const viewType = data.get('viewType') as string
    const theme = data.get('theme') as BoardTheme
    const font = data.get('font') as BoardFontSize
    const transportPalette = data.get('transportPalette') as TransportPalette
    const hideClock = data.get('clock') === null
    const hideLogo = data.get('logo') === null
    const footer = data.get('infoMessage') as string

    const rawLocation = data.get('newLocation') as string
    const location: LocationDB | undefined = rawLocation
        ? (JSON.parse(rawLocation) as LocationDB)
        : undefined

    const footerHasText = footer && footer.trim() !== ''

    return {
        ...prev,
        meta: {
            ...prev.meta,
            title: title || prev.meta.title,
            fontSize: font,
            location,
        },
        theme: theme ?? 'dark',
        transportPalette: transportPalette ?? 'default',
        hideClock,
        hideLogo,
        footer: footerHasText ? { footer } : undefined,
        isCombinedTiles: viewType === 'combined',
    }
}

export function EditBoardBeta({ initialBoard }: { initialBoard: BoardDB }) {
    const [board, setBoard] = useState<BoardDB>(initialBoard)

    const setTiles = useCallback((tiles: BoardDB['tiles']) => {
        setBoard((prev) => ({ ...prev, tiles }))
    }, [])

    const onAddTiles = useCallback(
        async (data: FormData) => {
            const tiles = formDataToTiles(data, board.isArrivals)
            if (tiles.length === 0) return

            const persisted = await addBetaTiles(
                board.id,
                tiles,
                board.meta.location,
            )
            setBoard((prev) => ({
                ...prev,
                tiles: [...prev.tiles, ...persisted],
            }))
        },
        [board.id, board.isArrivals, board.meta.location],
    )

    const onSettingsSubmit = useCallback(
        async (data: FormData) => {
            data.set('bid', board.id)
            setBoard((prev) => applySettingsToBoard(prev, data))
            await saveSettings(data)
        },
        [board.id],
    )

    const boardLink = getBoardLinkClient(
        board.customUrl ? board.customUrl : board.id,
    )

    return (
        <>
            <div className="flex h-full flex-col justify-between sm:flex-row sm:items-center">
                <Heading1 className="!mb-0">
                    Rediger {board.meta.title}
                </Heading1>
            </div>
            <div className="md:w-fit">
                <Paragraph margin="none">Lenke til denne tavla:</Paragraph>
                <div className="flex items-center gap-2">
                    <Paragraph
                        margin="none"
                        className="border rounded px-2 py-1 font-mono bg-tintLight"
                    >
                        {boardLink}
                    </Paragraph>
                    <Copy
                        bid={board.customUrl ? board.customUrl : board.id}
                        type="icon"
                        trackingLocation="board_page"
                    />
                </div>
            </div>

            <div
                data-transport-palette={board.transportPalette}
                className="flex flex-col gap-6 lg:flex-row lg:items-start"
            >
                <section
                    data-theme={board.theme ?? 'dark'}
                    aria-label="Forhåndsvisning av Tavla"
                    className="min-w-0 flex-1 lg:sticky lg:top-8 lg:self-start"
                >
                    <BoardPreview board={board} />
                </section>

                <aside className="w-full shrink-0 rounded-md bg-tintLight lg:w-[536px]">
                    <EditBoardSidebar
                        board={board}
                        setTiles={setTiles}
                        onAddTiles={onAddTiles}
                        onSettingsSubmit={onSettingsSubmit}
                    />
                </aside>
            </div>
        </>
    )
}
