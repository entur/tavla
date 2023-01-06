import React, { useCallback } from 'react'
import { Dropdown } from '@entur/dropdown'
import {
    AutocompleteItem,
    fetchAutocomplete,
} from '../../../../../logic/geocoder/fetchAutocomplete'
import { useSettings } from '../../../../../settings/SettingsProvider'
import { useStopPlaceIds } from '../../../../../logic/use-stop-place-ids/useStopPlaceIds'
import classes from './StopPlaceSearch.module.scss'

const StopPlaceSearch: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const { stopPlaceIds } = useStopPlaceIds({
        distance: settings.distance,
        filterHidden: false,
    })

    const handleChange = useCallback(
        (item: AutocompleteItem | null) => {
            if (item) {
                const stopId = item.value

                const numberOfDuplicates = [
                    ...stopPlaceIds,
                    ...settings.newStops,
                ]
                    .map((id) => id.replace(/-\d+$/, ''))
                    .filter((id) => id === stopId).length

                const id = !numberOfDuplicates
                    ? stopId
                    : `${stopId}-${numberOfDuplicates}`

                setSettings({
                    newStops: [...settings.newStops, id],
                })
            }
        },
        [stopPlaceIds, settings.newStops, setSettings],
    )

    return (
        <div className={classes.StopPlaceSearch}>
            <Dropdown
                searchable
                openOnFocus
                debounceTimeout={500}
                label="Legg til et stoppested"
                items={fetchAutocomplete}
                onChange={handleChange}
                highlightFirstItemOnOpen
            />
        </div>
    )
}

export { StopPlaceSearch }
