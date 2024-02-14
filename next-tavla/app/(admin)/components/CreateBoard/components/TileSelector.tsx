'use client'
import { Dropdown, MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import { useQuaySearch } from 'app/(admin)/hooks/useQuaySearch'
import { Button } from '@entur/button'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TTile } from 'types/tile'
import { SyntheticEvent } from 'react'
import { nanoid } from 'nanoid'

function TileSelector({
    flexDirection = 'flexRow',
    addTile,
}: {
    flexDirection?: 'flexRow' | 'flexColumn'
    addTile: (tile: TTile) => void
}) {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch()

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
    )

    return (
        <div className={`${flexDirection} g-2`}>
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
            <Button
                variant="primary"
                className="mb-2"
                onClick={(e: SyntheticEvent) => {
                    e.preventDefault()
                    const placeId = selectedQuay?.value
                        ? selectedQuay?.value
                        : selectedStopPlace?.value
                    if (!placeId) return
                    const tile = {
                        type:
                            placeId !== selectedStopPlace?.value
                                ? 'quay'
                                : 'stop_place',
                        name: selectedStopPlace?.label,
                        uuid: nanoid(),
                        placeId,
                        columns: ['line', 'destination', 'time', 'realtime'],
                    } as TTile
                    addTile(tile)
                    setSelectedQuay(null)
                    setSelectedStopPlace(null)
                }}
            >
                Legg til
            </Button>
        </div>
    )
}

export { TileSelector }
