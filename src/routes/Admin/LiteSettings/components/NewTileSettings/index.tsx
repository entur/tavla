import React, { useState } from 'react'
import { TTile } from '../../types/tile'
import { AddMapTile } from './AddMapTile'
import { AddQuayTile } from './AddQuayTile'
import { AddStopPlaceTile } from './AddStopPlaceTile'

type TTileType = TTile['type']

const components: Record<
    TTileType,
    (props: { setTile: (tile: TTile) => void }) => JSX.Element
> = {
    stop_place: AddStopPlaceTile,
    quay: AddQuayTile,
    map: AddMapTile,
}

function AddTile({ addTile }: { addTile: (tile: TTile) => void }) {
    const [tileType, setTileType] = useState<TTileType>('stop_place')
    const [tile, setTile] = useState<TTile | undefined>()

    const Component = components[tileType]

    return (
        <div>
            <select
                onChange={(e) => {
                    setTile(undefined)
                    setTileType(e.target.value as TTileType)
                }}
                value={tileType}
            >
                {Object.keys(components).map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
            <Component setTile={setTile} />

            {tile && (
                <button
                    onClick={() => {
                        addTile(tile)
                    }}
                >
                    Add tile
                </button>
            )}
        </div>
    )
}

export { AddTile }
