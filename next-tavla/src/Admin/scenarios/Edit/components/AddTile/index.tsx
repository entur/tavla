import { Button } from '@entur/button'
import { Dropdown, MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useStopPlaceSearch } from '../../hooks/useStopPlaceSearch'
import { useCountiesSearch } from '../../hooks/useCountiesSearch'
import { useQuaySearch } from '../../hooks/useQuaySearch'
import { useToast } from '@entur/alert'

function AddTile({
    addTile,
}: {
    addTile: (
        name: string,
        placeId: string,
        type: 'quay' | 'stop_place',
    ) => void
}) {
    const { addToast } = useToast()

    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch()

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
    )

    const handleAddTile = () => {
        if (!selectedStopPlace?.value) {
            return addToast({
                title: 'Ingen holdeplass er valgt',
                content: 'Vennligst velg en holdeplass å legge til',
                variant: 'info',
            })
        }
        const tileType =
            selectedQuay && selectedQuay?.value !== 'all'
                ? 'quay'
                : 'stop_place'
        const placeId = selectedQuay
            ? selectedQuay.value
            : selectedStopPlace.value
        let name = selectedStopPlace?.label.split(',')[0] ?? ''
        if (selectedQuay?.label) name = `${name} ${selectedQuay.label}`

        addTile(name, placeId, tileType)
        setSelectedStopPlace(null)
        setSelectedQuay(null)
    }

    return (
        <div>
            <Heading1>Holdeplasser i tavla</Heading1>
            <div className="flexRow g-2 pt-2 pb-2">
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
                    label="Søk etter holdeplass..."
                    clearable
                    prepend={<SearchIcon />}
                    selectedItem={selectedStopPlace}
                    onChange={setSelectedStopPlace}
                />
                <Dropdown
                    items={quays}
                    label="Velg plattform/retning"
                    clearable
                    selectedItem={selectedQuay}
                    onChange={setSelectedQuay}
                />
                <Button variant="primary" onClick={handleAddTile}>
                    Legg til
                </Button>
            </div>
        </div>
    )
}

export { AddTile }
