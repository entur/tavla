import { useLocalStorage } from 'app/(admin)/hooks/useLocalStorage'
import { getTilesWithWalkingDistance } from 'app/lag-tavle/actions'
import { useCallback, useEffect, useRef } from 'react'
import {
    BoardDB,
    BoardFontSize,
    BoardTheme,
    LocationDB,
    TransportPalette,
} from 'types/db-types/boards'

const emptyBoard: BoardDB = {
    id: 'demo',
    meta: { title: 'Min tavle' },
    tiles: [],
}

export function useSaveDemoBoardInLocalStorage(): {
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
                isCombinedTiles: viewType === 'combined',
                tiles: updatedTiles,
            }))
        },
        [setBoard],
    )

    return { board, setTiles, onSubmit }
}
