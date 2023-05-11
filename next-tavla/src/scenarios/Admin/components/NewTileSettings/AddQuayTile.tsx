import React, { useEffect, useState } from 'react'
import { fetchItems } from 'utils/index'
// import { isNotNullOrUndefined } from 'utils/typeguards'
import { TQuayTile } from 'types/tile'
import { nanoid } from 'nanoid'
import { Dropdown } from '@entur/dropdown'
import { quaySearchQuery } from 'graphql/queries/quaySearch'
import { TGetQuaysSearch } from 'types/graphql'
import { isNotNullOrUndefined } from 'utils/typeguards'

function AddQuayTile({ setTile }: { setTile: (tile: TQuayTile) => void }) {
    const [stopPlaceId, setStopPlaceId] = useState<string | undefined>()

    const [data, setData] = useState<TGetQuaysSearch | undefined>(undefined)

    useEffect(() => {
        if (!stopPlaceId) return
        quaySearchQuery({ stopPlaceId: stopPlaceId }).then(setData)
    }, [stopPlaceId])

    const quays =
        data?.stopPlace?.quays?.filter(isNotNullOrUndefined).map((quay) => ({
            value: quay.id,
            label: [quay.publicCode, quay.description].join(' '),
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

            {stopPlaceId && (
                <Dropdown
                    items={() => quays}
                    label="Velg plattform"
                    onChange={(e) => {
                        if (e?.value) {
                            setTile({
                                type: 'quay',
                                placeId: e.value,
                                uuid: nanoid(),
                            })
                        }
                    }}
                />
            )}
        </div>
    )
}

export { AddQuayTile }
