import React, { useEffect, useState } from 'react'
import { fetchItems } from 'utils/index'
import { useQuaysSearchLazyQuery } from 'graphql-generated/journey-planner-v3'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { TQuayTile } from 'types/tile'
import { nanoid } from 'nanoid'
import { Dropdown } from '@entur/dropdown'

function AddQuayTile({ setTile }: { setTile: (tile: TQuayTile) => void }) {
    const [stopPlaceId, setStopPlaceId] = useState<string | undefined>()

    const [getQuays, { data }] = useQuaysSearchLazyQuery({
        fetchPolicy: 'cache-and-network',
    })

    const data = quaySearchQuery()

    const quays =
        data?.stopPlace?.quays?.filter(isNotNullOrUndefined).map((quay) => ({
            value: quay.id,
            label: [quay.publicCode, quay.description].join(' '),
        })) || []

    useEffect(() => {
        if (!stopPlaceId) return

        getQuays({ variables: { stopPlaceId } })
    }, [getQuays, stopPlaceId])

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
