import { Button } from '@entur/button'
import { MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useStopPlaceSearch } from './hooks/useStopPlaceSearch'
import { useCountiesSearch } from './hooks/useCountiesSearch'

function AddTile() {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch()

    const {
        stopPlaceItems,
        selectedStopPlace,
        setSelectedStopPlace,
        handleAddTile,
    } = useStopPlaceSearch()

    return (
        <div>
            <Heading1>Holdeplasser i tavla</Heading1>

            <div className="flexRow alignCenter g-1 pb-2">
                <MultiSelect
                    label="Velg fylker"
                    items={counties}
                    selectedItems={selectedCounties}
                    onChange={setSelectedCounties}
                    className="w-30"
                    maxChips={3}
                    hideSelectAll
                />

                <SearchableDropdown
                    items={stopPlaceItems}
                    label="Søk etter holdeplass..."
                    clearable
                    prepend={<SearchIcon />}
                    selectedItem={selectedStopPlace}
                    onChange={setSelectedStopPlace}
                    className="w-30"
                />

                <Button variant="primary" onClick={handleAddTile}>
                    Legg til ny holdeplass
                </Button>
            </div>
        </div>
    )
}

export { AddTile }
