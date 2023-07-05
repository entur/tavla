import { Dropdown } from '@entur/dropdown'
import { TAnonTiles } from 'Admin/types'
import { QuaysSearchQuery, TQuaysSearchQuery } from 'graphql/index'
import { fetchQuery } from 'graphql/utils'
import { useEffect, useState } from 'react'
import { isNotNullOrUndefined } from 'utils/typeguards'

const stopPlaceOption = { value: 'stopPlace', label: 'Vis Alle' } as const

function PlatformDropdown({
    setTile,
    stopPlaceId,
}: {
    setTile: (tile: TAnonTiles) => void
    stopPlaceId: string
}) {
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

    const dropDownOptions = quays.length
        ? [{ ...stopPlaceOption }, ...quays]
        : []

    return (
        <Dropdown
            items={() => dropDownOptions}
            label="Velg plattform"
            disabled={!stopPlaceId}
            onChange={(e) => {
                if (e?.value) {
                    if (e.value == 'stopPlace')
                        setTile({
                            type: 'stop_place',
                            placeId: stopPlaceId,
                        })
                    else
                        setTile({
                            type: 'quay',
                            stopPlaceId,
                            placeId: e.value,
                        })
                }
            }}
        />
    )
}

export { PlatformDropdown }
