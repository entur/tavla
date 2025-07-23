'use client'

import { debounce } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { TBoard, TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { saveUpdatedTileOrder } from '../../actions'
import { TileCard } from '../TileCard'

function TileList({
    board,
    setDemoBoard,
    bid,
}: {
    board: TBoard
    bid?: TBoardID
    setDemoBoard?: Dispatch<SetStateAction<TBoard>>
}) {
    const [tileArray, setTileArray] = useState<TTile[]>(board.tiles)

    useEffect(() => {
        setTileArray(board.tiles)
    }, [board.tiles])

    const moveItem = (index: number, direction: string) => {
        const newIndex: number = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= board.tiles.length) {
            return
        }

        const newArray: TTile[] = [...board.tiles]

        const oldElement = newArray[newIndex]

        newArray[newIndex] = newArray[index] as TTile
        newArray[index] = oldElement as TTile

        setTileArray(newArray)
        if (bid === 'demo' && setDemoBoard) {
            const newBoard: TBoard = { ...board, tiles: newArray }
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
