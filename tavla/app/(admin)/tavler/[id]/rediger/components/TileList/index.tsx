'use client'

import { saveUpdatedTileOrder } from 'app/(admin)/tavler/[id]/rediger/actions'
import { debounce } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { BoardDB, BoardId, BoardTileDB } from 'types/db-types/boards'
import { TileCard } from '../TileCard'

function TileList({
    board,
    setDemoBoard,
    bid,
}: {
    board: BoardDB
    bid?: BoardId
    setDemoBoard?: Dispatch<SetStateAction<BoardDB>>
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

        newArray[newIndex] = newArray[index] as BoardTileDB
        newArray[index] = oldElement as BoardTileDB

        setTileArray(newArray)
        if (bid === 'demo' && setDemoBoard) {
            const newBoard: BoardDB = { ...board, tiles: newArray }
            setDemoBoard(newBoard ?? board)
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
                    bid={bid ?? board.id ?? ''}
                    demoBoard={bid ? board : undefined}
                    tile={tile}
                    address={board.meta.location}
                    moveItem={debouncedSave}
                    index={index}
                    totalTiles={board.tiles.length}
                    setDemoBoard={setDemoBoard}
                    isCombined={board.combinedTiles ? true : false}
                />
            ))}
        </div>
    )
}
export { TileList }
