import React from 'react'
import { TMapTile } from 'lite/types/tile'
import { fetchItems } from 'lite/utils'
import { Dropdown } from '@entur/dropdown'

function AddMapTile({ setTile }: { setTile: (tile: TMapTile) => void }) {
    return (
        <Dropdown
            items={fetchItems}
            debounceTimeout={1000}
            label="Finn stoppested"
            searchable
            clearable
            onChange={(e) => {
                if (e?.value) {
                    setTile({ type: 'map', placeId: e.value })
                }
            }}
        />
    )
}

export { AddMapTile }
