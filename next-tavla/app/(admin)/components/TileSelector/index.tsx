'use client'
import { Dropdown, MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { useStopPlaceSearch } from 'app/(admin)/hooks/useStopPlaceSearch'
import { useQuaySearch } from 'app/(admin)/hooks/useQuaySearch'
import { Button } from '@entur/button'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TOrganizationID } from 'types/settings'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { useState } from 'react'
import { Label } from '@entur/typography'

function TileSelector({
    action,
    direction,
    oid,
}: {
    action: (data: FormData) => void
    direction: 'Row' | 'Column'
    oid?: TOrganizationID
}) {
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch(oid)

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
    )

    const [state, setFormError] = useState<TFormFeedback | undefined>()
    return (
        <form
            className={`flex${direction} g-2 mb-3`}
            action={action}
            onSubmit={(event) => {
                if (!selectedStopPlace || !selectedQuay) {
                    event.preventDefault()
                    return setFormError(
                        getFormFeedbackForError(
                            !selectedStopPlace
                                ? 'dropdown/stopplace-missing'
                                : 'dropdown/quay-missing',
                        ),
                    )
                }
                setFormError(undefined)
                setSelectedQuay(null)
                setSelectedStopPlace(null)
            }}
        >
            <div>
                <Label>Velg fylke for å begrense søket</Label>
                <MultiSelect
                    label="Velg fylker"
                    items={counties}
                    selectedItems={selectedCounties}
                    onChange={setSelectedCounties}
                    prepend={<SearchIcon />}
                    maxChips={2}
                    hideSelectAll
                />
            </div>
            <div>
                <Label>Søk etter stoppested</Label>
                <SearchableDropdown
                    items={stopPlaceItems}
                    label="Stoppested"
                    clearable
                    prepend={<SearchIcon />}
                    selectedItem={selectedStopPlace}
                    onChange={setSelectedStopPlace}
                    debounceTimeout={1000}
                    {...getFormFeedbackForField('dropdown', state)}
                />
            </div>
            <div>
                <Label>Velg stoppestedets retning eller plattform</Label>
                <Dropdown
                    items={quays}
                    label="Velg plattform/retning"
                    clearable
                    prepend={<SearchIcon />}
                    selectedItem={selectedQuay}
                    onChange={setSelectedQuay}
                    {...getFormFeedbackForField('general', state)}
                    disabled={!selectedStopPlace}
                />
            </div>
            <HiddenInput id="stop_place" value={selectedStopPlace?.value} />
            <HiddenInput
                id="stop_place_name"
                value={selectedStopPlace?.label}
            />
            <HiddenInput id="quay" value={selectedQuay?.value} />
            <Button variant="primary" type="submit" className="mt-2">
                Legg til
            </Button>
        </form>
    )
}

export { TileSelector }
