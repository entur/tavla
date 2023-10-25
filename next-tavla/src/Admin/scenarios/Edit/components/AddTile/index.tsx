import { Button } from '@entur/button'
import { Dropdown, MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useStopPlaceSearch } from './hooks/useStopPlaceSearch'
import { useCountiesSearch } from './hooks/useCountiesSearch'
import { useQuaySearch } from './hooks/useQuaySearch'
import { useEditSettingsDispatch } from '../../utils/contexts'
import { useToast } from '@entur/alert'

function AddTile() {
    const dispatch = useEditSettingsDispatch()
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
            addToast({
                title: 'Ingen holdeplass er valgt',
                content: 'Vennligst velg en holdeplass å legge til',
                variant: 'info',
            })
            return
        }
        if (selectedQuay) {
            {
                dispatch({
                    type: 'addTile',
                    tile: {
                        type: 'quay',
                        placeId: selectedQuay.value,
                        name:
                            selectedStopPlace.label.split(',')[0] +
                                ' ' +
                                selectedQuay.label ?? 'Ikke navngitt',
                    },
                })
            }
        } else
            dispatch({
                type: 'addTile',
                tile: {
                    type: 'stop_place',
                    placeId: selectedStopPlace.value,
                    name:
                        selectedStopPlace.label.split(',')[0] ??
                        'Ikke navngitt',
                },
            })

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
