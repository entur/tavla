import { Dropdown } from '@entur/dropdown'
import { TAnonTile } from 'Admin/types'
import { TMapTile } from 'types/tile'
import { fetchItems } from 'utils/index'

function AddMapTile({
    setTile,
}: {
    setTile: (tile: TAnonTile<TMapTile>) => void
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
                        type: 'map',
                        placeId: e.value,
                    })
                }
            }}
        />
    )
}

export { AddMapTile }
