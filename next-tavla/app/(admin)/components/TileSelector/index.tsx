'use client'
import { Dropdown, MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import { useQuaySearch } from 'app/(admin)/hooks/useQuaySearch'
import { Button } from '@entur/button'
import { HiddenInput } from 'components/Form/HiddenInput'

function TileSelector({
    action,
    direction,
}: {
    action: (data: FormData) => void
    direction: 'Row' | 'Column'
}) {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch()

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
    )

    return (
        <form
            className={`flex${direction} g-2 mb-3`}
            action={action}
            onSubmit={() => {
                setSelectedQuay(null)
                setSelectedStopPlace(null)
            }}
        >
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
            <HiddenInput id="stop_place" value={selectedStopPlace?.value} />
            <HiddenInput
                id="stop_place_name"
                value={selectedStopPlace?.label}
            />
            <HiddenInput id="quay" value={selectedQuay?.value} />
            <Button variant="primary" type="submit">
                Legg til
            </Button>
        </form>
    )
}

export { TileSelector }
