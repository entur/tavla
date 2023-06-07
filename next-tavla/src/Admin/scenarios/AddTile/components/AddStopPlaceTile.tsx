import { Dropdown } from '@entur/dropdown'
import { TAnonTile } from 'Admin/types'
import { TStopPlaceTile } from 'types/tile'
import { fetchItems } from 'Admin/utils/index'

function AddStopPlaceTile({
    setTile,
}: {
    setTile: (tile: TAnonTile<TStopPlaceTile>) => void
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
                    setTile({
                        type: 'stop_place',
                        placeId: e.value,
                    })
                }
            }}
        />
    )
}
export { AddStopPlaceTile }
