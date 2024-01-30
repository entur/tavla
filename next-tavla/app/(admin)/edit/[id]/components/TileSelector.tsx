'use client'
import { Dropdown, MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import { useQuaySearch } from 'app/(admin)/hooks/useQuaySearch'

function TileSelector() {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch()

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
    )

    return (
        <>
            <MultiSelect
                label="Velg fylker"
                items={counties}
                selectedItems={selectedCounties}
                onChange={setSelectedCounties}
                prepend={<SearchIcon />}
                maxChips={2}
                hideSelectAll
            />
            <SearchableDropdown
                items={stopPlaceItems}
                label="Søk etter stoppested..."
                clearable
                prepend={<SearchIcon />}
                selectedItem={selectedStopPlace}
                onChange={setSelectedStopPlace}
              debounceTimeout={1000}
            />
            <Dropdown
                items={quays}
                label="Velg plattform/retning"
                clearable
                prepend={<SearchIcon />}
                selectedItem={selectedQuay}
                onChange={setSelectedQuay}
            />
        </>
    )
}

export { TileSelector }
