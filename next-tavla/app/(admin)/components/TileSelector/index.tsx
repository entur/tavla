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
                if (!selectedStopPlace) {
                    event.preventDefault()
                    return setFormError(
                        getFormFeedbackForError('dropdown/error'),
                    )
                }
                if (!selectedQuay) {
                    event.preventDefault()
                    return setFormError(getFormFeedbackForError('quay/error'))
                }
                setFormError(undefined)
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
                {...getFormFeedbackForField('dropdown', state)}
            />
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
