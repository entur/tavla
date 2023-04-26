import React from 'react'
import { Dropdown } from '@entur/dropdown'
import { TStopPlaceTile } from '../../types/tile'
import { fetchItems } from '../../utils'

function AddStopPlaceTile({
    setTile,
}: {
    setTile: (tile: TStopPlaceTile) => void
}) {
    return (
        <Dropdown
            items={fetchItems}
            debounceTimeout={1000}
            label="Finn stoppested"
            searchable
            clearable
            onChange={(e) => {
                if (e?.value) {
                    setTile({ type: 'stop_place', placeId: e.value })
                }
            }}
        />
    )
}

export { AddStopPlaceTile }
