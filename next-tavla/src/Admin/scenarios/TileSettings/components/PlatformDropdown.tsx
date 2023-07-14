import { Dropdown } from '@entur/dropdown'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { QuaysSearchQuery, TQuaysSearchQuery } from 'graphql/index'
import { fetchQuery } from 'graphql/utils'
import { useEffect, useState } from 'react'
import { TTile } from 'types/tile'
import { isNotNullOrUndefined } from 'utils/typeguards'

const stopPlaceOption = { value: 'stopPlace', label: 'Vis Alle' } as const

function PlatformDropdown<T extends TTile>({
    stopPlaceId,
    tile,
}: {
    stopPlaceId: string
    tile: T
}) {
    const dispatch = useSettingsDispatch()

    function setTile(newTile: TTile) {
        dispatch({ type: 'updateTile', tile: newTile })
    }

    const [data, setData] = useState<TQuaysSearchQuery>()

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
                    console.log(e.value)
                    if (e.value == 'stopPlace')
                        setTile({
                            type: 'stop_place',
                            placeId: stopPlaceId,
                            uuid: tile.uuid,
                        })
                    else
                        setTile({
                            type: 'quay',
                            stopPlaceId,
                            placeId: e.value,
                            uuid: tile.uuid,
                        })
                }
            }}
        />
    )
}

export { PlatformDropdown }
