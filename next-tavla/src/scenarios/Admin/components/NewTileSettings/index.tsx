import React, { useState } from 'react'
import { TTile } from 'types/tile'
import { Dropdown } from '@entur/dropdown'
import { Button } from '@entur/button'
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

const tileNames: Record<TTileType, string> = {
    map: 'Kart',
    quay: 'Plattform',
    stop_place: 'Stoppested',
}

function AddTile({ addTile }: { addTile: (tile: TTile) => void }) {
    const [tileType, setTileType] = useState<TTileType>('stop_place')
    const [tile, setTile] = useState<TTile | undefined>()

    const Component = components[tileType]

    return (
        <div>
            <Dropdown
                label="Velg type"
                value={tileType}
                onChange={(e) => {
                    setTile(undefined)
                    if (e) setTileType(e.value as TTileType)
                }}
                items={Object.entries(tileNames).map(([value, label]) => ({
                    label,
                    value,
                }))}
            />
            <Component setTile={setTile} />

            {tile && (
                <Button
                    variant="primary"
                    width="fluid"
                    onClick={() => {
                        addTile(tile)
                    }}
                >
                    Legg til
                </Button>
            )}
        </div>
    )
}

export { AddTile }
