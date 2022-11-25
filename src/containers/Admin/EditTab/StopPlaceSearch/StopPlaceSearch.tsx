import React from 'react'
import { Dropdown } from '@entur/dropdown'
import {
    AutocompleteItem,
    fetchAutocomplete,
} from '../../../../logic/geocoder/fetchAutocomplete'
import './StopPlaceSearch.scss'

interface StopPlaceSearchProps {
    handleAddNewStop: (stopId: string) => void
}

const StopPlaceSearch: React.FC<StopPlaceSearchProps> = ({
    handleAddNewStop,
}) => {
    const onItemSelected = (item: AutocompleteItem | null): void => {
        if (item) {
            handleAddNewStop(item.value)
        }
    }

    return (
        <div className="stop-place-search">
            <Dropdown
                searchable
                openOnFocus
                debounceTimeout={500}
                label="Legg til et stoppested"
                items={fetchAutocomplete}
                onChange={onItemSelected}
                highlightFirstItemOnOpen
            />
        </div>
    )
}

export { StopPlaceSearch }
