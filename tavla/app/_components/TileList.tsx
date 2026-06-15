'use client'

import { LOCAL_STORAGE_BOARD_ID } from 'app/_hooks/useSaveBoardInLocalStorage'
import { saveUpdatedTileOrder } from 'app/(innlogget)/tavler/[id]/rediger/actions'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import type { BoardDB, BoardTileDB } from 'src/types/db-types/boards'
import { TileCard } from './TileCard/TileCard'

export function TileList({
    board,
    setTilesLocalStorageBoard,
}: {
    board: BoardDB
    setTilesLocalStorageBoard?: (tiles: BoardDB['tiles']) => void
}) {
    const [tileArray, setTileArray] = useState<BoardTileDB[]>(board.tiles)

    useEffect(() => {
        setTileArray(board.tiles)
    }, [board.tiles])

    const moveItem = (index: number, direction: string) => {
        const newIndex: number = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= board.tiles.length) {
            return
        }

        const newArray: BoardTileDB[] = [...board.tiles]

        const oldElement = newArray[newIndex]
        const currentElement = newArray[index]

        if (!oldElement || !currentElement) return

        newArray[newIndex] = currentElement
        newArray[index] = oldElement

        setTileArray(newArray)
        if (board.id === LOCAL_STORAGE_BOARD_ID && setTilesLocalStorageBoard) {
            setTilesLocalStorageBoard(newArray)
        } else {
            saveUpdatedTileOrder(board.id ?? '', newArray)
        }
    }
    const debouncedSave = debounce(moveItem, 150)
    return (
        <div className="flex flex-col gap-4">
            {tileArray.map((tile, index) => (
                <TileCard
                    key={tile.uuid}
                    board={board}
                    tile={tile}
                    moveItem={debouncedSave}
                    index={index}
                    setTilesLocalStorageBoard={setTilesLocalStorageBoard}
                />
            ))}
        </div>
    )
}
