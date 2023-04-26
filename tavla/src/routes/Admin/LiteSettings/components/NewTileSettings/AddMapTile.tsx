import React from 'react'
import { Dropdown } from '@entur/dropdown'
import { TMapTile } from '../../types/tile'
import { fetchItems } from '../../utils'

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
