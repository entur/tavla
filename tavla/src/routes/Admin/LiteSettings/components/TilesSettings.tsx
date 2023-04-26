/* eslint-disable func-style */
import React from 'react'
import { clone } from 'lodash'
import { DndContext } from '@dnd-kit/core'
import { TTile } from '../types/tile'
import { StopPlaceSettings } from './StopPlaceSettings'

function TilesSettings({
    tiles,
    setTiles,
}: {
    tiles: TTile[]
    setTiles: (tiles: TTile[]) => void
}) {
    const setTile = (tileIndex: number, newTile: TTile) => {
        const newTiles = clone(tiles)
        newTiles[tileIndex] = newTile
        setTiles(newTiles)
    }

    return (
        <DndContext>
            {tiles.map((tile, index) => {
                const setIndexedTile = (newtile: TTile) => {
                    setTile(index, newtile)
                }
                switch (tile.type) {
                    case 'stop_place':
                        return (
                            <StopPlaceSettings
                                key={tile.uuid}
                                tile={tile}
                                setTile={setIndexedTile}
                            />
                        )
                    case 'quay':
                        return null
                    case 'map':
                        return null
                }
            })}
        </DndContext>
    )
}

export { TilesSettings }
