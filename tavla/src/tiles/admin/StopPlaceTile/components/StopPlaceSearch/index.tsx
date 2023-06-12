import React, { useCallback } from 'react'
import {
    AutocompleteItem,
    fetchAutocomplete,
} from 'utils/geocoder/fetchAutocomplete'
import { useSettings } from 'settings/SettingsProvider'
import { Dropdown } from '@entur/dropdown'
import classes from './StopPlaceSearch.module.scss'

function StopPlaceSearch() {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(
        (item: AutocompleteItem | null) => {
            if (item && !settings.newStops.includes(item.value)) {
                const stopId = item.value

                setSettings({
                    newStops: [...settings.newStops, stopId],
                })
            }
        },
        [settings.newStops, setSettings],
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
