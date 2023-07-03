import { Dropdown } from '@entur/dropdown'
import { TAnonTile } from 'Admin/types'
import { QuaysSearchQuery, TQuaysSearchQuery } from 'graphql/index'
import { fetchQuery } from 'graphql/utils'
import { useEffect, useState } from 'react'
import { TQuayTile } from 'types/tile'
import { fetchItems } from 'Admin/utils/index'
import { isNotNullOrUndefined } from 'utils/typeguards'

function AddQuayTile({
    setTile,
}: {
    setTile: (tile: TAnonTile<TQuayTile>) => void
}) {
    const [stopPlaceId, setStopPlaceId] = useState<string | undefined>()

    const [data, setData] = useState<TQuaysSearchQuery | undefined>(undefined)

    useEffect(() => {
        if (!stopPlaceId) return
        fetchQuery(QuaysSearchQuery, { stopPlaceId }).then(setData)
    }, [stopPlaceId])

    const quays =
        data?.stopPlace?.quays
            ?.filter(isNotNullOrUndefined)
            .map((quay, index) => ({
                value: quay.id,
                label:
                    'Platform ' +
                    [quay.publicCode ?? index + 1, quay.description].join(' '),
            })) || []

    return (
        <div>
            <Dropdown
                items={fetchItems}
                label="Finn stoppested"
                searchable
                clearable
                openOnFocus
                debounceTimeout={500}
                onChange={(e) => setStopPlaceId(e?.value)}
            />

            <Dropdown
                items={() => quays}
                label="Velg plattform"
                disabled={!stopPlaceId}
                onChange={(e) => {
                    if (e?.value && stopPlaceId) {
                        setTile({
                            type: 'quay',
                            placeId: e.value,
                            stopPlaceId: stopPlaceId,
                        })
                    }
                }}
            />
        </div>
    )
}

export { AddQuayTile }
