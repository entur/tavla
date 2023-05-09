/* eslint-disable func-style */
import React from 'react'
import { clone } from 'lodash'
import {
    DndContext,
    useSensors,
    type DragEndEvent,
    useSensor,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core'
import { TTile } from 'lite/types/tile'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import {
    restrictToParentElement,
    restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import { StopPlaceSettings } from './StopPlaceSettings'

function TilesSettings({
    tiles,
    setTiles,
}: {
    tiles: TTile[]
    setTiles: (tiles: TTile[]) => void
}) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleTileSwap = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = tiles.findIndex((col) => col.uuid === active.id)
            const newIndex = tiles.findIndex((col) => col.uuid === over.id)

            setTiles(arrayMove(tiles, oldIndex, newIndex))
        }
    }

    const setTile = (tileIndex: number, newTile: TTile) => {
        const newTiles = clone(tiles)
        newTiles[tileIndex] = newTile
        setTiles(newTiles)
    }

    const removeTile = (tileToRemove: TTile) => {
        setTiles(tiles.filter((tile) => tile !== tileToRemove))
    }

    return (
        <DndContext
            onDragEnd={handleTileSwap}
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
            <SortableContext items={tiles.map(({ uuid }) => uuid)}>
                <div>
                    {tiles.map((tile, index) => {
                        const setIndexedTile = (newtile: TTile) => {
                            setTile(index, newtile)
                        }
                        const removeSelf = () => {
                            removeTile(tile)
                        }
                        switch (tile.type) {
                            case 'stop_place':
                                return (
                                    <StopPlaceSettings
                                        key={tile.uuid}
                                        tile={tile}
                                        setTile={setIndexedTile}
                                        removeSelf={removeSelf}
                                    />
                                )
                            case 'quay':
                                return null
                            case 'map':
                                return null
                        }
                    })}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export { TilesSettings }
