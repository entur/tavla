'use client'

import { TBoard, TBoardID } from 'types/settings'
import { TileCard } from 'app/(admin)/edit/[id]/components/TileCard/index'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { TTile } from 'types/tile'
import { saveTiles } from '../../actions'
import { debounce } from 'lodash'

function TileList({
    board,
    setDemoBoard,
    bid,
}: {
    board: TBoard
    bid?: TBoardID
    setDemoBoard?: Dispatch<SetStateAction<TBoard>>
}) {
    const [array, setArray] = useState<TTile[]>(board.tiles)

    useEffect(() => {
        setArray(board.tiles)
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

        setArray(newArray)
        if (bid === 'demo' && setDemoBoard) {
            const newBoard: TBoard = { ...board, tiles: newArray }
            setDemoBoard(newBoard ?? board)
        } else {
            saveTiles(board.id ?? '', newArray)
        }
    }
    const debouncedSave = debounce(moveItem, 150)
    return (
        <div className="flex flex-col gap-4">
            {array.map((tile, index) => (
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
                />
            ))}
        </div>
    )
}
export { TileList }
