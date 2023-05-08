import React from 'react'
import { TStopPlaceTile } from 'lite/types/tile'
import { fetchItems } from 'lite/utils'
import { Dropdown } from '@entur/dropdown'

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
