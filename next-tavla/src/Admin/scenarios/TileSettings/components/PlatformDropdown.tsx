import { Dropdown } from '@entur/dropdown'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { QuaysSearchQuery, TQuaysSearchQuery } from 'graphql/index'
import { fetchQuery } from 'graphql/utils'
import { useEffect, useState } from 'react'
import { TTile } from 'types/tile'
import { isNotNullOrUndefined } from 'utils/typeguards'

const stopPlaceOption = { value: 'stopPlace', label: 'Vis Alle' } as const

function PlatformDropdown({
    stopPlaceId,
    tile,
    selectedQuayId,
}: {
    stopPlaceId: string
    tile: TTile
    selectedQuayId?: string
}) {
    const dispatch = useSettingsDispatch()
    function setTile(newTile: TTile) {
        dispatch({ type: 'updateTile', tile: newTile })
    }

    const selectedValue = selectedQuayId ?? stopPlaceOption.value

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
            value={selectedValue}
            onChange={(e) => {
                if (e?.value) {
                    if (e.value === 'stopPlace')
                        setTile({
                            type: 'stop_place',
                            placeId: stopPlaceId,
                            uuid: tile.uuid,
                            columns: tile.columns,
                        })
                    else
                        setTile({
                            type: 'quay',
                            stopPlaceId,
                            placeId: e.value,
                            uuid: tile.uuid,
                            columns: tile.columns,
                        })
                }
            }}
        />
    )
}

export { PlatformDropdown }
